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
const VERIFY = (process.env.GOOGLE_SITE_VERIFICATION || "").replace(/[^A-Za-z0-9_\-]/g, "");
const VERIFY_TAG = VERIFY ? `<meta name="google-site-verification" content="${VERIFY}">` : "";
const MAX_AGE = 180 * 24 * 3600; // 180 jours
const CONTACT = (process.env.CONTACT_EMAIL || "").trim();

const store = makeStore();
const PUB = path.join(__dirname, "public");
const APP_HTML = fs.readFileSync(path.join(PUB, "app.html"), "utf8");
const LOGIN_HTML = fs.readFileSync(path.join(PUB, "login.html"), "utf8");
const ADMIN_HTML = fs.readFileSync(path.join(PUB, "admin.html"), "utf8");
const zlib = require("zlib");
const APP_VER = crypto.createHash("sha1").update(APP_HTML).digest("hex").slice(0, 12);
/* Page de l'appli par élève : construite une fois, compressée une fois, puis resservie (ou 304 si rien n'a changé). */
const appCache = new Map();
function appFor(u) {
  const me = u.guest ? { id: "guest", name: "", ai: false, guest: true } : { id: u.id, name: u.name, ai: !!AI_KEY }, key = JSON.stringify(me);
  let c = appCache.get(u.id);
  if (c && c.key === key) { appCache.delete(u.id); appCache.set(u.id, c); return c; }
  const build = () => Buffer.from(APP_HTML
    .replace("__GL_ME__", JSON.stringify(me).replace(/</g, "\\u003c"))
    .split("grand-livre-btscg-v1").join("grand-livre-btscg-v1-" + u.id)
    .split('"gl-recent"').join('"gl-recent-' + u.id + '"'), "utf8");
  c = { key, build, etag: '"' + APP_VER + "-" + crypto.createHash("sha1").update(key).digest("hex").slice(0, 10) + '"' };
  appCache.set(u.id, c);
  if (appCache.size > 60) appCache.delete(appCache.keys().next().value);
  return c;
}
function sendApp(req, res, c) {
  res.setHeader("Cache-Control", "private, no-cache");
  res.setHeader("ETag", c.etag);
  res.setHeader("Vary", "Accept-Encoding, Cookie");
  if (req.headers["if-none-match"] === c.etag) return res.status(304).end();
  const ae = String(req.headers["accept-encoding"] || "");
  res.type("html");
  if (/\bbr\b/.test(ae)) { c.br = c.br || zlib.brotliCompressSync(c.build(), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 9 } }); res.setHeader("Content-Encoding", "br"); return res.end(c.br); }
  if (/\bgzip\b/.test(ae)) { c.gz = c.gz || zlib.gzipSync(c.build(), { level: 7 }); res.setHeader("Content-Encoding", "gzip"); return res.end(c.gz); }
  res.end(c.build());
}

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
app.use((req, res, next) => { res.setHeader("X-Content-Type-Options", "nosniff"); res.setHeader("Referrer-Policy", "same-origin"); if (PROD) res.setHeader("Strict-Transport-Security", "max-age=15552000"); next(); });

/* ---------- Pages ---------- */
app.get("/", async (req, res, next) => {
  try {
    const u = await currentUser(req);
    if (!u) res.setHeader("Cache-Control", "no-store");
    if (!u) return res.type("html").send(LOGIN_HTML.replace("__SIGNUP_CODE__", REGISTRATION === "code" ? "1" : "0").replace("<!--VERIFY-->", VERIFY_TAG));
    sendApp(req, res, appFor(u));
  } catch (e) { next(e); }
});
app.get("/essai", async (req, res, next) => {
  try { if (await currentUser(req)) return res.redirect("/"); sendApp(req, res, appFor({ id: "guest", guest: true })); } catch (e) { next(e); }
});
const LEGAL = require("./src/legal");
app.get("/mentions-legales", (req, res) => { res.setHeader("Cache-Control", "public, max-age=3600"); res.type("html").send(LEGAL.mentions({ contact: CONTACT })); });
app.get("/confidentialite", (req, res) => { res.setHeader("Cache-Control", "public, max-age=3600"); res.type("html").send(LEGAL.privacy({ contact: CONTACT, ai: !!AI_KEY })); });
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
    if (!(await bcrypt.compare(oldp, req.user.pass))) return res.status(403).json({ error: "Ancien mot de passe incorrect." });
    if (newp.length < 6 || newp.length > 100) return res.status(400).json({ error: "Le nouveau mot de passe doit faire au moins 6 caractères." });
    await store.setPass(req.user.id, await bcrypt.hash(newp, 10));
    res.json({ ok: true });
  } catch (e) { next(e); }
});

app.get("/api/account/export", auth, async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", 'attachment; filename="grand-livre-mes-donnees.json"');
    res.json({ compte: { nom: req.user.name, cree_le: new Date(Number(req.user.created)).toISOString() }, rappels: await store.subsOf(req.user.id), progression: await store.getProgress(req.user.id) });
  } catch (e) { next(e); }
});
app.post("/api/account/delete", auth, async (req, res, next) => {
  try {
    if (limited("del:" + req.user.id, 5, 900e3)) return res.status(429).json({ error: "Trop d'essais. Attends un quart d'heure." });
    if (!(await bcrypt.compare(String(req.body.password || ""), req.user.pass))) return res.status(403).json({ error: "Mot de passe incorrect." });
    await store.deleteUser(req.user.id);
    clearSession(res);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

/* ---------- Remontée des erreurs de l'appli (sans donnée personnelle) ---------- */
const ERRS = [];
app.post("/api/err", express.json({ limit: "8kb" }), (req, res) => {
  if (limited("er:" + req.ip, 30, 3600e3)) return res.status(204).end();
  const b = req.body || {}, cut = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").slice(0, n);
  const e = { at: Date.now(), m: cut(b.m, 300), s: cut(b.s, 900), v: cut(b.v, 40), p: cut(b.p, 60), ua: cut(req.headers["user-agent"], 160) };
  const same = ERRS.find(x => x.m === e.m && x.s === e.s);
  if (same) { same.n++; same.at = e.at; } else { e.n = 1; ERRS.unshift(e); if (ERRS.length > 200) ERRS.pop(); console.error("[appli]", e.m, "|", e.p, "|", e.s.split("\n")[0]); }
  res.status(204).end();
});

/* ---------- Rappels quotidiens (notifications) ---------- */
const webpush = require("web-push");
let VAPID = null;
async function vapid() {
  if (VAPID) return VAPID;
  let v = await store.getSetting("vapid");
  if (!v) { const k = webpush.generateVAPIDKeys(); v = JSON.stringify(k); await store.setSetting("vapid", v); }
  VAPID = JSON.parse(v);
  webpush.setVapidDetails("mailto:" + (CONTACT || "contact@grand-livre.invalid"), VAPID.publicKey, VAPID.privateKey);
  return VAPID;
}
function parisNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).map(x => [x.type, x.value]));
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
  return { hour: +p.hour % 24, dayNum: Math.floor(wall / 86400000), day: p.year + "-" + p.month + "-" + p.day };
}
const QGAP = [0, 3, 7, 15, 30];
function dueOf(d, dayNum) {
  if (!d || typeof d !== "object") return { cards: 0, qs: 0, streak: 0 };
  const cards = Object.values(d.c || {}).filter(r => Array.isArray(r) && r[1] <= dayNum).length;
  const qs = Object.values(d.qd || {}).filter(o => o && Array.isArray(o.ok) && o.ok.length && dayNum >= o.ok[o.ok.length - 1] + QGAP[Math.min(4, o.ok.length)]).length;
  const st = d.st || {}, streak = st.d === dayNum - 1 ? (st.n || 0) : 0;
  return { cards, qs, streak, today: (d.dy && d.dy.d === dayNum) ? (d.dy.l || 0) + (d.dy.c || 0) + (d.dy.e || 0) : 0 };
}
function reminderText(x) {
  const parts = [];
  if (x.cards) parts.push(x.cards + " carte" + (x.cards > 1 ? "s" : ""));
  if (x.qs) parts.push(x.qs + " question" + (x.qs > 1 ? "s" : "") + " à revérifier");
  const min = Math.max(3, Math.round(x.cards / 3 + x.qs / 2));
  let body = parts.length ? parts.join(" et ") + " t'attendent, environ " + min + " minutes." : "";
  if (x.streak >= 2) body = (body ? body + " " : "") + "Garde ta série de " + x.streak + " jours !";
  return body;
}
app.get("/api/push/key", auth, async (req, res, next) => { try { res.json({ key: (await vapid()).publicKey, subs: await store.subsOf(req.user.id) }); } catch (e) { next(e); } });
app.post("/api/push/sub", auth, async (req, res, next) => {
  try {
    const sub = req.body.sub, hour = Math.max(6, Math.min(22, parseInt(req.body.hour, 10) || 18));
    if (!sub || typeof sub.endpoint !== "string" || !/^https:\/\//.test(sub.endpoint) || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) return res.status(400).json({ error: "Abonnement invalide." });
    await store.addSub(req.user.id, { endpoint: sub.endpoint, keys: { p256dh: String(sub.keys.p256dh), auth: String(sub.keys.auth) } }, hour);
    res.json({ ok: true, hour });
  } catch (e) { next(e); }
});
app.post("/api/push/unsub", auth, async (req, res, next) => { try { await store.delSub(String(req.body.endpoint || "")); res.json({ ok: true }); } catch (e) { next(e); } });
app.post("/api/push/test", auth, async (req, res, next) => {
  try {
    if (limited("pt:" + req.user.id, 5, 3600e3)) return res.status(429).json({ error: "Attends un peu avant un nouvel essai." });
    await vapid(); let n = 0;
    for (const s of await store.subsFull(req.user.id)) {
      try { await webpush.sendNotification(s.sub, JSON.stringify({ title: "Grand Livre", body: "Les rappels marchent. À demain pour ta séance !", tag: "gl-test", url: "/" }), { TTL: 600 }); n++; }
      catch (e) { if (e && (e.statusCode === 404 || e.statusCode === 410)) await store.delSub(s.endpoint); }
    }
    if (!n) return res.status(400).json({ error: "Aucun rappel actif : réactive-les sur cet appareil." });
    res.json({ ok: true, sent: n });
  } catch (e) { next(e); }
});
async function pushTick() {
  try {
    const t = parisNow(); await vapid();
    const list = await store.dueSubs(t.hour, t.day);
    for (const s of list) {
      try {
        const x = dueOf(await store.getProgress(s.user_id), t.dayNum);
        await store.markSub(s.endpoint, t.day);
        if (x.today > 0) continue;
        const body = reminderText(x); if (!body) continue;
        await webpush.sendNotification(s.sub, JSON.stringify({ title: "Ta séance du jour", body, tag: "gl-daily", url: "/" }), { TTL: 6 * 3600 });
      } catch (e) { if (e && (e.statusCode === 404 || e.statusCode === 410)) await store.delSub(s.endpoint); else console.error("push", e && e.statusCode, e && e.body); }
    }
  } catch (e) { console.error("pushTick", e); }
}

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
app.post("/api/admin/errors", (req, res) => {
  if (limited("ad:" + req.ip, 20, 900e3)) return res.status(429).json({ error: "Trop d'essais." });
  if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
  res.json({ errors: ERRS });
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
  setInterval(pushTick, 5 * 60e3).unref(); setTimeout(pushTick, 20e3).unref();
  app.listen(PORT, () => console.log(`Grand Livre en ligne sur le port ${PORT} (stockage : ${store.kind}, correction Claude : ${AI_KEY ? "activée" : "désactivée"})`));
}).catch(e => { console.error("Impossible d'initialiser le stockage", e); process.exit(1); });
