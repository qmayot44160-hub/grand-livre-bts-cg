// Grand Livre BTS CG : serveur web (Railway).
// Comptes élèves (nom + mot de passe), progression sauvegardée par élève,
// correction des annales par Claude (facultative, si ANTHROPIC_API_KEY est défini).
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const makeStore = require("./src/store");

const PORT = process.env.PORT || 3000;
const PROD = process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT;
const SECRET = process.env.SESSION_SECRET || (PROD ? null : "dev-secret-a-changer");
if (!SECRET) { console.error("SESSION_SECRET manquant : ajoute cette variable dans Railway."); process.exit(1); }
const ADMIN_KEY = process.env.ADMIN_KEY || "";
const AI_KEY = process.env.ANTHROPIC_API_KEY || "";
const AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const AI_DAILY = parseInt(process.env.AI_DAILY_LIMIT || "10", 10);
const REGISTRATION = (process.env.REGISTRATION || "open").toLowerCase(); // "open" ou "code"
const SIGNUP_CODE = process.env.SIGNUP_CODE || "";
const COOKIE = "gl_s";
const MAX_AGE = 180 * 24 * 3600; // 180 jours

const store = makeStore();
const PUB = path.join(__dirname, "public");
const APP_HTML = fs.readFileSync(path.join(PUB, "app.html"), "utf8");
const LOGIN_HTML = fs.readFileSync(path.join(PUB, "login.html"), "utf8");
const ADMIN_HTML = fs.readFileSync(path.join(PUB, "admin.html"), "utf8");

/* ---------- Sessions signées (cookie httpOnly) ---------- */
const b64 = s => Buffer.from(s).toString("base64url");
const sign = s => crypto.createHmac("sha256", SECRET).update(s).digest("base64url");
function makeToken(uid) { const p = b64(JSON.stringify({ uid, exp: Math.floor(Date.now() / 1000) + MAX_AGE })); return p + "." + sign(p); }
function readToken(t) {
  if (!t || t.indexOf(".") < 0) return null;
  const [p, s] = t.split(".");
  const good = sign(p);
  if (s.length !== good.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(good))) return null;
  try { const o = JSON.parse(Buffer.from(p, "base64url").toString()); return o.exp > Date.now() / 1000 ? o.uid : null; } catch (e) { return null; }
}
function cookies(req) { const o = {}; (req.headers.cookie || "").split(";").forEach(c => { const i = c.indexOf("="); if (i > 0) o[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim()); }); return o; }
function setSession(res, uid) {
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(makeToken(uid))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${PROD ? "; Secure" : ""}`);
}
function clearSession(res) { res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${PROD ? "; Secure" : ""}`); }
async function currentUser(req) { const uid = readToken(cookies(req)[COOKIE]); return uid ? store.userById(uid) : null; }
function auth(req, res, next) {
  currentUser(req).then(u => { if (!u) return res.status(401).json({ error: "Connecte-toi d'abord." }); req.user = u; next(); }).catch(next);
}

/* ---------- Limitation des tentatives ---------- */
const attempts = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(), a = (attempts.get(key) || []).filter(t => now - t < windowMs);
  a.push(now); attempts.set(key, a);
  return a.length > max;
}
setInterval(() => { const now = Date.now(); for (const [k, a] of attempts) if (!a.some(t => now - t < 3600e3)) attempts.delete(k); }, 600e3).unref();

const nameKey = n => n.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
const cleanName = n => String(n || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((req, res, next) => { res.setHeader("X-Content-Type-Options", "nosniff"); res.setHeader("Referrer-Policy", "same-origin"); next(); });

/* ---------- Pages ---------- */
app.get("/", async (req, res, next) => {
  try {
    const u = await currentUser(req);
    res.setHeader("Cache-Control", "no-store");
    if (!u) return res.type("html").send(LOGIN_HTML.replace("__SIGNUP_CODE__", REGISTRATION === "code" ? "1" : "0"));
    const me = { id: u.id, name: u.name, ai: !!AI_KEY };
    const html = APP_HTML
      .replace("__GL_ME__", JSON.stringify(me).replace(/</g, "\\u003c"))
      .split("grand-livre-btscg-v1").join("grand-livre-btscg-v1-" + u.id)
      .split('"gl-recent"').join('"gl-recent-' + u.id + '"');
    res.type("html").send(html);
  } catch (e) { next(e); }
});
app.get("/admin", (req, res) => { res.setHeader("Cache-Control", "no-store"); res.type("html").send(ADMIN_HTML); });
app.use((req, res, next) => /^\/(app|login|admin)\.html$/.test(req.path) ? res.status(404).end() : next());
app.use(express.static(PUB, { index: false, extensions: [], setHeaders: (res, p) => { if (/sw\.js$/.test(p)) res.setHeader("Cache-Control", "no-cache"); } }));

/* ---------- Comptes ---------- */
app.use("/api", express.json({ limit: "40mb" }));

app.post("/api/signup", async (req, res, next) => {
  try {
    if (limited("su:" + req.ip, 10, 3600e3)) return res.status(429).json({ error: "Trop de comptes créés depuis cet appareil. Réessaie dans une heure." });
    if (REGISTRATION === "code" && String(req.body.code || "") !== SIGNUP_CODE) return res.status(403).json({ error: "Code d'inscription incorrect. Demande-le à la personne qui t'a partagé le Grand Livre." });
    const name = cleanName(req.body.name), pass = String(req.body.password || "");
    if (name.length < 2 || name.length > 40) return res.status(400).json({ error: "Ton nom doit faire entre 2 et 40 caractères." });
    if (pass.length < 6 || pass.length > 100) return res.status(400).json({ error: "Ton mot de passe doit faire au moins 6 caractères." });
    if (await store.userByKey(nameKey(name))) return res.status(409).json({ error: "Ce nom est déjà pris. Ajoute l'initiale de ton nom de famille, par exemple." });
    const u = { id: "u" + crypto.randomBytes(9).toString("base64url"), name, name_key: nameKey(name), pass: await bcrypt.hash(pass, 10), created: Date.now() };
    try { await store.createUser(u); } catch (e) { if (e.code === "23505") return res.status(409).json({ error: "Ce nom est déjà pris." }); throw e; }
    setSession(res, u.id);
    res.json({ ok: true, name: u.name });
  } catch (e) { next(e); }
});

app.post("/api/login", async (req, res, next) => {
  try {
    const name = cleanName(req.body.name), pass = String(req.body.password || "");
    if (limited("li:" + req.ip, 20, 900e3) || limited("ln:" + nameKey(name), 10, 900e3)) return res.status(429).json({ error: "Trop d'essais. Attends un quart d'heure avant de réessayer." });
    const u = name ? await store.userByKey(nameKey(name)) : null;
    if (!u || !(await bcrypt.compare(pass, u.pass))) return res.status(401).json({ error: "Nom ou mot de passe incorrect." });
    setSession(res, u.id);
    res.json({ ok: true, name: u.name });
  } catch (e) { next(e); }
});

app.post("/api/logout", (req, res) => { clearSession(res); res.json({ ok: true }); });
app.get("/api/me", auth, (req, res) => res.json({ id: req.user.id, name: req.user.name, ai: !!AI_KEY }));

app.post("/api/password", auth, async (req, res, next) => {
  try {
    const oldp = String(req.body.old || ""), newp = String(req.body.password || "");
    if (!(await bcrypt.compare(oldp, req.user.pass))) return res.status(401).json({ error: "Ancien mot de passe incorrect." });
    if (newp.length < 6 || newp.length > 100) return res.status(400).json({ error: "Le nouveau mot de passe doit faire au moins 6 caractères." });
    await store.setPass(req.user.id, await bcrypt.hash(newp, 10));
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ---------- Progression ---------- */
app.get("/api/progress", auth, async (req, res, next) => {
  try { res.setHeader("Cache-Control", "no-store"); res.json({ data: await store.getProgress(req.user.id) }); } catch (e) { next(e); }
});
app.put("/api/progress", auth, async (req, res, next) => {
  try {
    const d = req.body;
    if (!d || typeof d !== "object" || Array.isArray(d)) return res.status(400).json({ error: "Format invalide." });
    if (JSON.stringify(d).length > 2_000_000) return res.status(413).json({ error: "Progression trop volumineuse." });
    await store.setProgress(req.user.id, d);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ---------- Correction par Claude (facultative) ---------- */
app.post("/api/sample", auth, async (req, res, next) => {
  try {
    if (!AI_KEY) return res.status(403).json({ code: "not_granted", error: "Correction non activée sur ce site." });
    const day = new Date().toISOString().slice(0, 10);
    const n = await store.bumpAi(req.user.id, day);
    if (n > AI_DAILY) return res.status(429).json({ code: "rate_limited", error: `Limite de ${AI_DAILY} corrections par jour atteinte. Réessaie demain.` });
    const input = req.body.input, images = Array.isArray(req.body.images) ? req.body.images.slice(0, 6) : [];
    const msgs = typeof input === "string" ? [{ role: "user", content: input }] : (Array.isArray(input) ? input : []);
    if (!msgs.length || msgs[msgs.length - 1].role !== "user") return res.status(400).json({ code: "invalid_input" });
    const last = msgs[msgs.length - 1];
    const content = images.filter(im => im && /^image\/(jpeg|png|webp|gif)$/.test(im.type) && typeof im.data === "string")
      .map(im => ({ type: "image", source: { type: "base64", media_type: im.type, data: im.data } }));
    content.push({ type: "text", text: String(last.content) });
    const messages = msgs.slice(0, -1).map(m => ({ role: m.role, content: String(m.content) })).concat([{ role: "user", content }]);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": AI_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: AI_MODEL, max_tokens: 6000, messages,
        system: req.body.json ? "Réponds uniquement par un objet JSON valide, sans texte avant ni après et sans bloc de code." : undefined,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { console.error("Anthropic", r.status, j && j.error); return res.status(502).json({ code: r.status === 429 ? "rate_limited" : "unavailable", error: "Le service de correction ne répond pas. Réessaie plus tard." }); }
    const text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
    res.json({ text, truncated: j.stop_reason === "max_tokens" });
  } catch (e) { next(e); }
});

/* ---------- Administration (réinitialiser un mot de passe) ---------- */
function adminOk(req) { return ADMIN_KEY && String(req.headers["x-admin-key"] || "") === ADMIN_KEY; }
app.post("/api/admin/users", async (req, res, next) => {
  try {
    if (limited("ad:" + req.ip, 20, 900e3)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    res.json({ users: await store.listUsers() });
  } catch (e) { next(e); }
});
app.post("/api/admin/reset", async (req, res, next) => {
  try {
    if (limited("ad:" + req.ip, 20, 900e3)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    const u = await store.userByKey(nameKey(cleanName(req.body.name)));
    if (!u) return res.status(404).json({ error: "Aucun élève à ce nom." });
    const p = String(req.body.password || "");
    if (p.length < 6) return res.status(400).json({ error: "Mot de passe trop court (6 caractères minimum)." });
    await store.setPass(u.id, await bcrypt.hash(p, 10));
    res.json({ ok: true, name: u.name });
  } catch (e) { next(e); }
});

app.get("/healthz", (req, res) => res.json({ ok: true }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: "Erreur du serveur. Réessaie dans un instant." }); });

store.init().then(() => {
  app.listen(PORT, () => console.log(`Grand Livre en ligne sur le port ${PORT} (stockage : ${store.kind}, correction Claude : ${AI_KEY ? "activée" : "désactivée"})`));
}).catch(e => { console.error("Impossible d'initialiser le stockage", e); process.exit(1); });
