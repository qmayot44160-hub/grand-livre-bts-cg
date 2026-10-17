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
function makeToken(uid, sv) { const p = b64(JSON.stringify({ uid, sv: sv || 0, exp: Math.floor(Date.now() / 1000) + MAX_AGE })); return p + "." + sign(p); }
function readToken(t) {
  if (!t || t.indexOf(".") < 0) return null;
  const [p, s] = t.split(".");
  const good = sign(p);
  if (s.length !== good.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(good))) return null;
  try { const o = JSON.parse(Buffer.from(p, "base64url").toString()); return o.exp > Date.now() / 1000 ? { uid: o.uid, sv: o.sv || 0 } : null; } catch (e) { return null; }
}
function cookies(req) { const o = {}; (req.headers.cookie || "").split(";").forEach(c => { const i = c.indexOf("="); if (i > 0) o[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim()); }); return o; }
function setSession(res, uid, sv) {
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(makeToken(uid, sv))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${PROD ? "; Secure" : ""}`);
}
function clearSession(res) { res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${PROD ? "; Secure" : ""}`); }
/* Une session n'est valable que si le compte n'est pas suspendu et que son numéro de session (sv) n'a pas changé :
   « Déconnecter partout » ou un nouveau mot de passe incrémentent sv et invalident tous les anciens cookies. */
async function currentUser(req) {
  const t = readToken(cookies(req)[COOKIE]); if (!t) return null;
  const u = await store.userById(t.uid);
  if (!u || u.blocked || (u.sv || 0) !== t.sv) return null;
  return u;
}
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
/* Administration : réservée aux comptes listés dans ADMIN_USERS (noms séparés par des virgules).
   Pour tous les autres (visiteurs, élèves), /admin et /api/admin/* répondent « page introuvable ». */
const ADMIN_USERS = (process.env.ADMIN_USERS || "").split(",").map(x => nameKey(x)).filter(Boolean);
async function isAdminUser(req) {
  if (!ADMIN_USERS.length) return true; // pas encore configuré : seule la clé ADMIN_KEY protège
  const u = await currentUser(req).catch(() => null);
  return !!(u && ADMIN_USERS.includes(u.name_key || nameKey(u.name)));
}
function notFound(res) { res.status(404).type("html").send('<!doctype html><meta charset="utf-8"><title>Introuvable</title><p style="font-family:system-ui;padding:32px">Page introuvable. <a href="/">Retour au Grand Livre</a></p>'); }
app.get("/admin", async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Robots-Tag", "noindex");
    const u = await currentUser(req).catch(() => null);
    /* Pas connecté (ex. appli installée qui a sa propre mémoire de connexion) : formulaire de connexion propre à GL Admin. */
    if (ADMIN_USERS.length && !u) return res.type("html").send(ADMIN_HTML.split("__ADMIN_NAME__").join("").replace('data-mode="key"', 'data-mode="login"'));
    if (!(await isAdminUser(req))) return notFound(res);
    res.type("html").send(ADMIN_HTML.split("__ADMIN_NAME__").join(esc((u || {}).name || "")));
  } catch (e) { next(e); }
});
app.use("/api/admin", (req, res, next) => { isAdminUser(req).then(ok => ok ? next() : res.status(404).json({ error: "Introuvable." })).catch(next); });
app.use((req, res, next) => /^\/(app|login|admin)\.html$/.test(req.path) ? res.status(404).end() : next());
/* Les pages HTML ne passent jamais par les fichiers statiques (sinon /admin.html ou /app.html contourneraient la connexion). */
app.use((req, res, next) => (/\.html?$/i.test(req.path) ? notFound(res) : next()));
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
    if (u.blocked) return res.status(403).json({ error: "Ce compte est suspendu. Contacte la personne qui t'a partagé le Grand Livre." });
    setSession(res, u.id, u.sv || 0);
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
    setSession(res, req.user.id, await store.bumpSv(req.user.id)); // déconnecte les autres appareils
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

/* ---------- Classement de la semaine (élèves volontaires uniquement) ---------- */
let CLASS = { at: 0, wk: -1, rows: [] };
function weekStats(d, wk) {
  const d0 = wk * 7 - 3, d1 = d0 + 6;
  let acq = 0;
  Object.values(d.qd || {}).forEach(o => { if (!o || !Array.isArray(o.ok) || o.ok.length < 2) return; const a = o.ok.find(v => v - o.ok[0] >= 3); if (a != null && a >= d0 && a <= d1) acq++; });
  const days = Object.entries(d.h || {}).filter(([k, v]) => +k >= d0 && +k <= d1 && v > 0).length;
  const dw = d.dw && d.dw.w === wk ? d.dw : null;
  return { acq, days, dsc: dw ? Math.max(0, Math.min(10, +dw.sc || 0)) : null, dt: dw ? Math.max(0, +dw.t || 0) : null };
}
app.get("/api/class", auth, async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const wk = Math.floor((parisNow().dayNum + 3) / 7);
    if (Date.now() - CLASS.at > 20000 || CLASS.wk !== wk) {
      const all = await store.allProgress();
      CLASS = { at: Date.now(), wk, rows: all.map(r => { const d = r.data || {}; return Object.assign({ id: r.id, p: String((d.cl && d.cl.p) || "Anonyme").replace(/[<>\u0000-\u001f]/g, "").slice(0, 24) }, weekStats(d, wk)); }) };
    }
    const fr = new Set((await store.friendsOf(req.user.id)).filter(f => f.status === "ok").map(f => f.a === req.user.id ? f.b : f.a));
    res.json({ wk, rows: CLASS.rows.map(r => ({ p: r.p, acq: r.acq, days: r.days, dsc: r.dsc, dt: r.dt, me: r.id === req.user.id, f: fr.has(r.id) })) });
  } catch (e) { next(e); }
});
app.put("/api/progress", (req, res, next) => { CLASS.at = 0; next(); });

/* ---------- Signalements d'erreurs dans le contenu ---------- */
app.post("/api/report", auth, async (req, res, next) => {
  try {
    if (limited("rp:" + req.user.id, 40, 24 * 3600e3)) return res.status(429).json({ error: "Tu as déjà envoyé beaucoup de signalements aujourd'hui. Merci !" });
    const b = req.body || {}, cut = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
    if (!/^[qclfo]$/.test(String(b.t))) return res.status(400).json({ error: "Signalement invalide." });
    await store.addReport({ user_name: req.user.name, kind: b.t, item: cut(b.id, 80), label: cut(b.l, 200), choice: cut(b.ch, 80), comment: cut(b.cm, 600) });
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

/* ---------- Duels entre élèves ----------
   Le créateur choisit les questions (identifiants) ; le serveur garde l'état, calcule les scores et sert de relais.
   Un duel s'identifie par un code de 5 caractères à donner à son adversaire. */
const DUEL_ABC = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const duelScore = p => p.ans.reduce((s, ok, i) => s + (ok ? 100 + Math.max(0, 50 - Math.floor((p.t[i] || 0) / 1000) * 3) : 0), 0);
async function duelName(u) {
  try { const d = await store.getProgress(u.id); const ps = d && d.cl && d.cl.p; if (ps) return String(ps).replace(/[<>\u0000-\u001f]/g, "").slice(0, 24); } catch (e) {}
  return String(u.name || "?").split(" ")[0].slice(0, 24);
}
function duelView(x, uid) {
  const me = x.a.id === uid ? "a" : "b", you = x[me], op = x[me === "a" ? "b" : "a"], fin = x.status === "done";
  const pub = p => p ? { name: p.name, joined: !!p.joined, n: p.ans.length, ok: p.ans.filter(Boolean).length, score: duelScore(p), done: !!p.done, ans: fin ? p.ans : undefined, t: fin ? p.t : undefined } : null;
  return { id: x.id, cats: x.cats, n: x.ids.length, ids: x.ids, seed: x.seed, mode: x.mode, status: x.status, startAt: x.startAt || 0, created: x.created, now: Date.now(), me,
    you: you ? { name: you.name, ans: you.ans, t: you.t, done: !!you.done, score: duelScore(you), started: !!you.started } : null, opp: pub(op) };
}
async function duelFor(req, res) {
  const x = await store.duelGet(String(req.params.id || "").toUpperCase());
  if (!x || !(x.a.id === req.user.id || (x.b && x.b.id === req.user.id))) { res.status(404).json({ error: "Duel introuvable." }); return null; }
  return x;
}
async function duelNotify(uid, title, body, url) {
  try { await vapid(); for (const s of await store.subsFull(uid)) { try { await webpush.sendNotification(s.sub, JSON.stringify({ title, body, tag: "gl-duel", url }), { TTL: 3 * 3600 }); } catch (e) { if (e && (e.statusCode === 404 || e.statusCode === 410)) await store.delSub(s.endpoint); } } } catch (e) {}
}
app.post("/api/duel", auth, async (req, res, next) => {
  try {
    if (limited("du:" + req.user.id, 40, 3600e3)) return res.status(429).json({ error: "Beaucoup de duels d'un coup : réessaie dans un moment." });
    const b = req.body || {}, ids = Array.isArray(b.ids) ? b.ids.map(String).filter(i => /^[a-z][a-z0-9]{0,2}q\d{1,4}$/.test(i)) : [];
    if (ids.length < 5 || ids.length > 20) return res.status(400).json({ error: "Duel invalide." });
    const cats = (Array.isArray(b.cats) ? b.cats : []).map(String).filter(c => /^[a-z0-9]{2,3}$/.test(c)).slice(0, 12);
    let id = ""; for (let k = 0; k < 8; k++) { id = Array.from(crypto.randomBytes(5), v => DUEL_ABC[v % DUEL_ABC.length]).join(""); if (!(await store.duelGet(id))) break; }
    const x = { id, created: Date.now(), cats, ids, seed: crypto.randomBytes(4).readUInt32BE(0), mode: "live", status: "wait", startAt: 0,
      a: { id: req.user.id, name: await duelName(req.user), ans: [], t: [], joined: true }, b: null };
    /* Un seul duel en attente à la fois : les anciens duels jamais commencés sont annulés. */
    const mine = await store.duelsOf(req.user.id);
    if (b.opp) {
      const oid = await resolveMate(req.user.id, String(b.opp));
      const u = oid ? await store.userById(oid) : null; if (!u || u.blocked) return res.status(404).json({ error: "Camarade introuvable." });
      const fresh = d => d.status !== "done" && d.status !== "declined" && Date.now() - d.created < 20 * 60e3;
      /* Les deux élèves se défient en même temps : on rejoint le duel de l'autre au lieu d'en créer un second. */
      const his = mine.find(d => fresh(d) && d.a.id === oid && d.b && d.b.id === req.user.id && !d.b.joined && !d.b.started && !d.b.ans.length);
      if (his) {
        his.b.joined = true;
        if (his.status === "wait" && !his.a.started) { his.status = "play"; his.mode = "live"; his.startAt = Date.now() + 5000; } else his.status = "play";
        await store.duelPut(his); return res.json({ duel: duelView(his, req.user.id), merged: true });
      }
      const own = mine.find(d => fresh(d) && d.a.id === req.user.id && d.b && d.b.id === oid && d.status === "wait" && !d.a.started);
      if (own) return res.json({ duel: duelView(own, req.user.id), existing: true });
    }
    for (const d of mine) if (d.a.id === req.user.id && d.status === "wait" && !d.a.started && !(d.b && d.b.joined)) { d.status = "declined"; await store.duelPut(d); }
    if (b.opp) {
      const oid = await resolveMate(req.user.id, String(b.opp)), u = await store.userById(oid);
      x.b = { id: u.id, name: await duelName(u), ans: [], t: [], joined: false };
      duelNotify(u.id, "⚔️ " + x.a.name + " te défie !", ids.length + " questions en duel. Ouvre le Grand Livre pour relever le défi.", "/?duel=" + id);
    }
    await store.duelPut(x);
    res.json({ duel: duelView(x, req.user.id) });
  } catch (e) { next(e); }
});
app.post("/api/duel/join", auth, async (req, res, next) => {
  try {
    if (limited("dj:" + req.user.id, 30, 600e3)) return res.status(429).json({ error: "Trop d'essais : attends quelques minutes." });
    const x = await store.duelGet(String((req.body || {}).code || "").trim().toUpperCase());
    if (!x || x.status === "done" || x.status === "declined" || Date.now() - x.created > 7 * 864e5) return res.status(404).json({ error: "Aucun duel en cours avec ce code." });
    if (x.a.id === req.user.id) return res.json({ duel: duelView(x, req.user.id) });
    if (x.b && x.b.id !== req.user.id) return res.status(403).json({ error: "Ce duel est réservé à un autre élève." });
    if (!x.b) x.b = { id: req.user.id, name: await duelName(req.user), ans: [], t: [] };
    if (!x.b.joined) {
      x.b.joined = true;
      if (x.status === "wait" && !x.a.started) { x.status = "play"; x.mode = "live"; x.startAt = Date.now() + 5000; }
      else { x.status = "play"; }
    }
    await store.duelPut(x);
    res.json({ duel: duelView(x, req.user.id) });
  } catch (e) { next(e); }
});
app.get("/api/duel/:id", auth, async (req, res, next) => {
  try { const x = await duelFor(req, res); if (!x) return; res.setHeader("Cache-Control", "no-store"); res.json({ duel: duelView(x, req.user.id) }); } catch (e) { next(e); }
});
app.post("/api/duel/:id/start", auth, async (req, res, next) => {
  try {
    const x = await duelFor(req, res); if (!x) return;
    const me = x.a.id === req.user.id ? x.a : x.b;
    if (!me.started) { me.started = true; if (x.status === "wait") { x.status = "play"; x.mode = "async"; } }
    await store.duelPut(x); res.json({ duel: duelView(x, req.user.id) });
  } catch (e) { next(e); }
});
app.post("/api/duel/:id/ans", auth, async (req, res, next) => {
  try {
    const x = await duelFor(req, res); if (!x) return;
    const me = x.a.id === req.user.id ? x.a : x.b, b = req.body || {}, i = Number(b.i);
    if (x.status === "done" || x.status === "declined") return res.json({ duel: duelView(x, req.user.id) });
    if (i !== me.ans.length || i >= x.ids.length) return res.json({ duel: duelView(x, req.user.id) });
    me.started = true; me.ans.push(!!b.ok); me.t.push(Math.max(300, Math.min(30000, Math.round(Number(b.t) || 30000))));
    if (me.ans.length >= x.ids.length) { me.done = true; me.at = Date.now(); }
    const other = me === x.a ? x.b : x.a;
    if (me.done && other && other.done) {
      x.status = "done";
      const sa = duelScore(me), sb = duelScore(other);
      if (x.mode === "async") duelNotify(other.id, "⚔️ Duel terminé contre " + me.name, sa > sb ? me.name + " l'emporte " + sa + " à " + sb + "." : sa < sb ? "Tu gagnes " + sb + " à " + sa + " !" : "Égalité " + sa + " partout.", "/?duel=" + x.id);
    } else if (me.done && x.mode === "async" && other && !other.ans.length && me === x.a) {
      duelNotify(other.id, "⚔️ " + me.name + " a fait son duel", "À toi de jouer : " + duelScore(me) + " points à battre !", "/?duel=" + x.id);
    }
    await store.duelPut(x);
    res.json({ duel: duelView(x, req.user.id) });
  } catch (e) { next(e); }
});
app.post("/api/duel/:id/rematch", auth, async (req, res, next) => {
  try {
    if (limited("du:" + req.user.id, 40, 3600e3)) return res.status(429).json({ error: "Beaucoup de duels d'un coup : réessaie dans un moment." });
    const old = await duelFor(req, res); if (!old) return;
    const ids = Array.isArray((req.body || {}).ids) ? req.body.ids.map(String).filter(i => /^[a-z][a-z0-9]{0,2}q\d{1,4}$/.test(i)) : [];
    if (ids.length < 5 || ids.length > 20) return res.status(400).json({ error: "Duel invalide." });
    const otherId = old.a.id === req.user.id ? (old.b && old.b.id) : old.a.id;
    const u = otherId ? await store.userById(otherId) : null; if (!u || u.blocked) return res.status(404).json({ error: "Adversaire introuvable." });
    let id = ""; for (let k = 0; k < 8; k++) { id = Array.from(crypto.randomBytes(5), v => DUEL_ABC[v % DUEL_ABC.length]).join(""); if (!(await store.duelGet(id))) break; }
    const x = { id, created: Date.now(), cats: old.cats, ids, seed: crypto.randomBytes(4).readUInt32BE(0), mode: "live", status: "wait", startAt: 0,
      a: { id: req.user.id, name: await duelName(req.user), ans: [], t: [], joined: true }, b: { id: u.id, name: await duelName(u), ans: [], t: [], joined: false } };
    duelNotify(u.id, "⚔️ " + x.a.name + " veut sa revanche !", ids.length + " questions en duel. Ouvre le Grand Livre pour jouer.", "/?duel=" + id);
    await store.duelPut(x); res.json({ duel: duelView(x, req.user.id) });
  } catch (e) { next(e); }
});
app.post("/api/duel/:id/decline", auth, async (req, res, next) => {
  try { const x = await duelFor(req, res); if (!x) return; if (x.status !== "done") x.status = "declined"; await store.duelPut(x); res.json({ ok: true }); } catch (e) { next(e); }
});
/* Boîte de réception légère, interrogée toutes les quelques secondes par l'appli : défis et demandes d'amis en attente. */
app.get("/api/inbox", auth, async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const me = req.user.id, duels = [];
    for (const d of await store.duelsOf(me)) {
      if (d.status === "done" || d.status === "declined" || Date.now() - d.created > 7 * 864e5) continue;
      if (d.b && d.b.id === me && !d.b.joined && !d.b.started && !d.b.ans.length) duels.push({ id: d.id, from: d.a.name, n: d.ids.length, at: d.created, live: d.status === "wait" && !d.a.started, score: d.a.done ? duelScore(d.a) : null });
    }
    const friends = [], accepted = [], results = [];
    for (const f of await store.friendsOf(me)) {
      if (f.status === "pending" && f.b === me) { const u = await store.userById(f.a); if (u && !u.blocked) friends.push({ k: fk(u.id), name: await duelName(u), at: f.created }); }
      if (f.status === "ok" && f.a === me) { const u = await store.userById(f.b); if (u && !u.blocked) accepted.push({ k: fk(u.id), name: await duelName(u) }); }
    }
    for (const d of await store.duelsOf(me)) {
      if (d.status !== "done" || Date.now() - d.created > 2 * 864e5) continue;
      const mine = d.a.id === me ? d.a : d.b, other = d.a.id === me ? d.b : d.a; if (!mine || !other) continue;
      results.push({ id: d.id, opp: other.name, me: duelScore(mine), them: duelScore(other), lastMine: (mine.at || 0) >= (other.at || 0) });
    }
    res.json({ duels, friends, accepted, results, v: APP_VER });
  } catch (e) { next(e); }
});
app.get("/api/duels", auth, async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const list = (await store.duelsOf(req.user.id)).filter(x => Date.now() - x.created < 30 * 864e5).map(x => duelView(x, req.user.id));
    const rows = (await store.allProgress()).filter(r => r.id !== req.user.id);
    const mates = rows.map(r => ({ k: fk(r.id), p: String((r.data && r.data.cl && r.data.cl.p) || "").replace(/[<>\u0000-\u001f]/g, "").slice(0, 24) })).filter(m => m.p);
    for (const f of await friendIds(req.user.id)) { const k = fk(f); const m = mates.find(x => x.k === k); if (m) m.f = true; else { const u = await store.userById(f); if (u && !u.blocked) mates.unshift({ k, p: await duelName(u), f: true }); } }
    mates.sort((a, b) => (b.f ? 1 : 0) - (a.f ? 1 : 0));
    res.json({ duels: list, mates });
  } catch (e) { next(e); }
});
setInterval(() => store.duelPurge(Date.now() - 30 * 864e5).catch(() => {}), 6 * 3600e3).unref();

/* ---------- Amis ---------- */
const fk = id => sign("duel:" + id).slice(0, 16);
function fcode(id) { const b = crypto.createHmac("sha256", SECRET).update("fc:" + id).digest(); const c = Array.from(b.slice(0, 6), v => DUEL_ABC[v % DUEL_ABC.length]).join(""); return c.slice(0, 3) + "-" + c.slice(3); }
async function friendIds(uid) { return (await store.friendsOf(uid)).filter(f => f.status === "ok").map(f => f.a === uid ? f.b : f.a); }
async function resolveMate(uid, k) {
  for (const id of await friendIds(uid)) if (fk(id) === k) return id;
  for (const r of await store.allProgress()) if (r.id !== uid && fk(r.id) === k) return r.id;
  return null;
}
async function userByK(k) { for (const u of await store.usersAll()) if (fk(u.id) === k) return u; return null; }
function friendStats(d, dn) {
  d = d || {}; const wk = Math.floor((dn + 3) / 7), w = weekStats(d, wk), st = d.st || {}, xp = d.xp || 0, lv = LV.filter(l => xp >= l[0]).pop();
  const cat = {}; let acq = 0;
  Object.entries(d.q || {}).forEach(([id, a]) => { if (!Array.isArray(a)) return; const c = id.replace(/q\d+$/, ""), o = cat[c] || (cat[c] = { n: 0, ok: 0 }); o.n += a[0] || 0; o.ok += a[1] || 0; if (qSt(d, id) >= 2) acq++; });
  const mats = Object.entries(cat).filter(([, o]) => o.n >= 8).map(([c, o]) => ({ c, r: Math.round(o.ok / o.n * 100), n: o.n })).sort((a, b) => b.r - a.r);
  const days = Object.keys(d.h || {}).map(Number), last = days.length ? Math.max(...days) : null;
  return { semAcq: w.acq, semJours: w.days, defi: w.dsc, serie: st.d >= dn - 1 ? st.n || 0 : 0, xp, niveau: lv[1], acquises: acq, forts: mats.slice(0, 3), faibles: mats.length > 3 ? mats.slice(-2).reverse() : [], dernier: last == null ? null : dn - last,
    activite: Array.from({ length: 7 }, (_, i) => (d.h || {})[dn - 6 + i] || 0) };
}
app.get("/api/friends", auth, async (req, res, next) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const me = req.user.id, dn = parisNow().dayNum, rows = await store.friendsOf(me), out = { code: fcode(me), name: await duelName(req.user), friends: [], incoming: [], outgoing: [] };
    out.mine = friendStats(await store.getProgress(me), dn);
    for (const f of rows) {
      const oid = f.a === me ? f.b : f.a, u = await store.userById(oid); if (!u || u.blocked) continue;
      const base = { k: fk(oid), name: await duelName(u), since: f.created };
      if (f.status === "ok") out.friends.push(Object.assign(base, friendStats(await store.getProgress(oid), dn)));
      else if (f.b === me) out.incoming.push(base); else out.outgoing.push(base);
    }
    out.friends.sort((a, b) => b.semAcq - a.semAcq || b.xp - a.xp);
    res.json(out);
  } catch (e) { next(e); }
});
app.post("/api/friends/add", auth, async (req, res, next) => {
  try {
    if (limited("fa:" + req.user.id, 30, 3600e3)) return res.status(429).json({ error: "Trop de demandes : réessaie plus tard." });
    const code = String((req.body || {}).code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (code.length !== 6) return res.status(400).json({ error: "Un code ami ressemble à ABC-123." });
    let target = null; for (const u of await store.usersAll()) if (fcode(u.id).replace("-", "") === code) { target = u; break; }
    if (!target || target.blocked) return res.status(404).json({ error: "Aucun élève avec ce code." });
    if (target.id === req.user.id) return res.status(400).json({ error: "C'est ton propre code !" });
    const rows = await store.friendsOf(req.user.id), ex = rows.find(f => (f.a === target.id || f.b === target.id));
    if (ex && ex.status === "ok") return res.json({ ok: true, already: true });
    if (ex && ex.a === target.id) { await store.friendSet(ex.a, ex.b, "ok"); duelNotify(target.id, "🤝 Nouvel ami", (await duelName(req.user)) + " a accepté ta demande d'ami.", "/?amis=1"); return res.json({ ok: true, accepted: true }); }
    if (!ex) { await store.friendSet(req.user.id, target.id, "pending"); duelNotify(target.id, "🤝 Demande d'ami", (await duelName(req.user)) + " veut t'ajouter en ami sur le Grand Livre.", "/?amis=1"); }
    res.json({ ok: true, pending: true, name: await duelName(target) });
  } catch (e) { next(e); }
});
app.post("/api/friends/respond", auth, async (req, res, next) => {
  try {
    const u = await userByK(String((req.body || {}).k || "")); if (!u) return res.status(404).json({ error: "Demande introuvable." });
    const ex = (await store.friendsOf(req.user.id)).find(f => f.a === u.id && f.b === req.user.id && f.status === "pending");
    if (!ex) return res.status(404).json({ error: "Demande introuvable." });
    if (req.body.accept) { await store.friendSet(u.id, req.user.id, "ok"); duelNotify(u.id, "🤝 Nouvel ami", (await duelName(req.user)) + " a accepté ta demande d'ami.", "/?amis=1"); }
    else await store.friendDel(u.id, req.user.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
app.post("/api/friends/remove", auth, async (req, res, next) => {
  try { const u = await userByK(String((req.body || {}).k || "")); if (u) await store.friendDel(u.id, req.user.id); res.json({ ok: true }); } catch (e) { next(e); }
});

/* ---------- Réviser ensemble : salles de quiz en direct (en mémoire, effacées après 3 h) ---------- */
const ROOMS = new Map(), ROOM_T = 30000;
setInterval(() => { const now = Date.now(); for (const [k, r] of ROOMS) if (now - r.touched > 3 * 3600e3) ROOMS.delete(k); }, 600e3).unref();
function roomPresent(r) { const now = Date.now(); return [...r.members.entries()].filter(([, m]) => now - m.seen < 15000).map(([id]) => id); }
function roomTick(r) {
  if (r.phase === "q") { const a = r.ans[r.idx] || {}, pres = roomPresent(r); if (Date.now() - r.qStart > ROOM_T || (pres.length && pres.every(id => a[id]))) { r.phase = "reveal"; r.revealAt = Date.now(); } }
}
function roomView(r, uid) {
  roomTick(r);
  const a = r.ans[r.idx] || {}, pres = new Set(roomPresent(r)), showAns = r.phase === "reveal" || r.phase === "end";
  const members = [...r.members.entries()].map(([id, m]) => ({ k: fk(id), name: m.name, me: id === uid, host: id === r.host, here: pres.has(id),
    answered: !!a[id], pos: showAns && a[id] ? a[id].pos : undefined, ok: showAns && a[id] ? a[id].ok : undefined,
    score: r.ans.reduce((s, x) => s + (x && x[id] && x[id].ok ? 1 : 0), 0) }));
  return { id: r.id, host: r.host === uid, phase: r.phase, idx: r.idx, n: r.ids.length, ids: r.ids, seed: r.seed, cats: r.cats, left: r.phase === "q" ? Math.max(0, ROOM_T - (Date.now() - r.qStart)) : 0, T: ROOM_T, members,
    mine: a[uid] ? a[uid] : null, hist: r.phase === "end" ? r.ans.map(x => Object.fromEntries(Object.entries(x || {}).map(([id, v]) => [fk(id), v.ok]))) : undefined };
}
function roomFor(req, res) {
  const r = ROOMS.get(String(req.params.id || "").toUpperCase());
  if (!r || !r.members.has(req.user.id)) { res.status(404).json({ error: "Cette salle n'existe plus." }); return null; }
  r.members.get(req.user.id).seen = Date.now(); r.touched = Date.now(); return r;
}
app.post("/api/room", auth, async (req, res, next) => {
  try {
    if (limited("ro:" + req.user.id, 20, 3600e3)) return res.status(429).json({ error: "Trop de salles d'un coup." });
    let id = ""; do { id = Array.from(crypto.randomBytes(5), v => DUEL_ABC[v % DUEL_ABC.length]).join(""); } while (ROOMS.has(id) || (await store.duelGet(id)));
    const r = { id, host: req.user.id, created: Date.now(), touched: Date.now(), phase: "lobby", idx: -1, ids: [], cats: [], seed: crypto.randomBytes(4).readUInt32BE(0), ans: [], members: new Map() };
    r.members.set(req.user.id, { name: await duelName(req.user), seen: Date.now() });
    ROOMS.set(id, r); res.json({ room: roomView(r, req.user.id) });
  } catch (e) { next(e); }
});
app.post("/api/room/join", auth, async (req, res, next) => {
  try {
    const r = ROOMS.get(String((req.body || {}).code || "").trim().toUpperCase());
    if (!r) return res.status(404).json({ error: "Aucune salle ouverte avec ce code." });
    if (!r.members.has(req.user.id)) { if (r.members.size >= 8) return res.status(403).json({ error: "La salle est pleine (8 élèves)." }); r.members.set(req.user.id, { name: await duelName(req.user), seen: Date.now() }); }
    r.members.get(req.user.id).seen = Date.now(); r.touched = Date.now();
    res.json({ room: roomView(r, req.user.id) });
  } catch (e) { next(e); }
});
app.get("/api/room/:id", auth, (req, res) => { const r = roomFor(req, res); if (!r) return; res.setHeader("Cache-Control", "no-store"); res.json({ room: roomView(r, req.user.id) }); });
app.post("/api/room/:id/start", auth, (req, res) => {
  const r = roomFor(req, res); if (!r) return;
  if (r.host !== req.user.id) { if (roomPresent(r).includes(r.host)) return res.status(403).json({ error: "Seul l'organisateur lance le quiz." }); r.host = req.user.id; }
  const ids = Array.isArray((req.body || {}).ids) ? req.body.ids.map(String).filter(i => /^[a-z][a-z0-9]{0,2}q\d{1,4}$/.test(i)).slice(0, 30) : [];
  if (ids.length < 3) return res.status(400).json({ error: "Choisis au moins 3 questions." });
  r.ids = ids; r.cats = (req.body.cats || []).map(String).slice(0, 12); r.seed = crypto.randomBytes(4).readUInt32BE(0); r.ans = []; r.idx = 0; r.phase = "q"; r.qStart = Date.now();
  res.json({ room: roomView(r, req.user.id) });
});
app.post("/api/room/:id/ans", auth, (req, res) => {
  const r = roomFor(req, res); if (!r) return; roomTick(r);
  const b = req.body || {};
  if (r.phase === "q" && Number(b.i) === r.idx) { const a = r.ans[r.idx] || (r.ans[r.idx] = {}); if (!a[req.user.id]) a[req.user.id] = { pos: Number(b.pos), ok: !!b.ok, t: Date.now() - r.qStart }; }
  res.json({ room: roomView(r, req.user.id) });
});
app.post("/api/room/:id/next", auth, (req, res) => {
  const r = roomFor(req, res); if (!r) return; roomTick(r);
  if (r.host !== req.user.id) { if (roomPresent(r).includes(r.host)) return res.status(403).json({ error: "Seul l'organisateur passe à la suite." }); r.host = req.user.id; }
  if (r.phase === "q") { r.phase = "reveal"; r.revealAt = Date.now(); }
  else if (r.phase === "reveal") { if (r.idx + 1 >= r.ids.length) r.phase = "end"; else { r.idx++; r.phase = "q"; r.qStart = Date.now(); } }
  else if (r.phase === "end") { r.phase = "lobby"; r.idx = -1; r.ans = []; }
  res.json({ room: roomView(r, req.user.id) });
});
app.post("/api/room/:id/leave", auth, (req, res) => {
  const r = ROOMS.get(String(req.params.id || "").toUpperCase());
  if (r) { r.members.delete(req.user.id); if (!r.members.size) ROOMS.delete(r.id); else if (r.host === req.user.id) r.host = r.members.keys().next().value; }
  res.json({ ok: true });
});

/* ---------- Sauvegardes de la base (7 derniers jours) ---------- */
async function makeDump() { return zlib.gzipSync(Buffer.from(JSON.stringify(Object.assign({ app: "grand-livre-bts-cg", at: new Date().toISOString() }, await store.dumpAll())), "utf8"), { level: 9 }).toString("base64"); }
async function dailyBackup(force) {
  const t = parisNow();
  if (!force && (await store.hasBackup(t.day))) return false;
  await store.saveBackup(t.day, await makeDump());
  console.log("Sauvegarde du", t.day, "enregistrée");
  return true;
}
function sendBackup(res, day, b64) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="grand-livre-sauvegarde-${day}.json"`);
  res.setHeader("Cache-Control", "no-store");
  res.end(zlib.gunzipSync(Buffer.from(b64, "base64")));
}

/* ---------- Tâche planifiée (service « cron » sur Railway) ---------- */
const CRON_KEY = process.env.CRON_KEY || "";
app.post("/api/cron/tick", async (req, res, next) => {
  try {
    if (!CRON_KEY || String(req.headers["x-cron-key"] || "") !== CRON_KEY) return res.status(403).json({ error: "Clé de tâche planifiée incorrecte (variable CRON_KEY)." });
    await pushTick(); const saved = await dailyBackup(false);
    res.json({ ok: true, backup: saved ? "faite" : "déjà faite aujourd'hui", at: new Date().toISOString() });
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
/* Seuls les essais de clé ratés comptent : 10 erreurs en 15 minutes bloquent l'adresse IP. */
function adBlocked(req) { const a = (attempts.get("adf:" + req.ip) || []).filter(t => Date.now() - t < 900e3); return a.length >= 10; }
function adFail(req) { limited("adf:" + req.ip, 1e9, 900e3); }
function adminOk(req) { const ok = !!ADMIN_KEY && String(req.headers["x-admin-key"] || "") === ADMIN_KEY; if (!ok) adFail(req); return ok; }
app.post("/api/admin/users", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    res.json({ users: await store.listUsers() });
  } catch (e) { next(e); }
});
app.post("/api/admin/errors", (req, res) => {
  if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
  if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
  res.json({ errors: ERRS });
});
app.post("/api/admin/reports", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    if (req.body.id != null) await store.doneReport(req.body.id, req.body.done);
    res.json({ reports: await store.listReports() });
  } catch (e) { next(e); }
});
app.post("/api/admin/backups", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    if (req.body.make) await dailyBackup(true);
    res.json({ backups: await store.listBackups(), cron: !!CRON_KEY });
  } catch (e) { next(e); }
});
app.post("/api/admin/backup-file", express.urlencoded({ extended: false }), async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).end();
    const key = String(req.body.key || ""); if (!ADMIN_KEY || key !== ADMIN_KEY) { adFail(req); return res.status(403).type("text").send("Clé d'administration incorrecte."); }
    if (req.body.id) { const b = await store.getBackup(req.body.id); if (!b) return res.status(404).type("text").send("Sauvegarde introuvable."); return sendBackup(res, b.day, b.blob); }
    sendBackup(res, parisNow().day + "-maintenant", await makeDump());
  } catch (e) { next(e); }
});
/* Statistiques de la classe (aucune donnée nominative sur les réponses) */
let QMAP = {}; try { QMAP = JSON.parse(fs.readFileSync(path.join(__dirname, "src", "qmap.json"), "utf8")); } catch (e) {}
app.post("/api/admin/stats", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    const t = parisNow(), rows = await store.fullProgress();
    const act = n => rows.filter(r => r.data && Object.keys(r.data.h || {}).some(k => +k > t.dayNum - n)).length;
    const cat = {}, miss = {}, days = {};
    rows.forEach(r => {
      const d = r.data || {};
      Object.entries(d.q || {}).forEach(([id, a]) => {
        const c = id.replace(/q\d+$/, ""), o = cat[c] || (cat[c] = { n: 0, ok: 0, users: 0 }); o.n += a[0] || 0; o.ok += a[1] || 0;
        const m = (a[0] || 0) - (a[1] || 0); if (m > 0) { const x = miss[id] || (miss[id] = { m: 0, u: 0, n: 0 }); x.m += m; x.u++; } if (miss[id]) miss[id].n += a[0] || 0;
      });
      Object.keys(d.q || {}).map(id => id.replace(/q\d+$/, "")).filter((c, i, l) => l.indexOf(c) === i).forEach(c => cat[c].users++);
      Object.entries(d.h || {}).forEach(([k, v]) => { if (+k > t.dayNum - 28) days[k] = (days[k] || 0) + 1; });
    });
    const top = Object.entries(miss).filter(([, x]) => x.u >= 2 || rows.length < 5).sort((a, b) => b[1].u - a[1].u || b[1].m - a[1].m).slice(0, 25)
      .map(([id, x]) => ({ id, q: QMAP[id] ? QMAP[id][1] : "", ch: QMAP[id] ? QMAP[id][2] : "", c: QMAP[id] ? QMAP[id][0] : id.replace(/q\d+$/, ""), eleves: x.u, erreurs: x.m, reussite: x.n ? Math.round((1 - x.m / x.n) * 100) : 0 }));
    res.json({
      eleves: rows.length, actifs: { jour: act(1), semaine: act(7), mois: act(30) },
      classement: rows.filter(r => r.data && r.data.cl && r.data.cl.on).length, rappels: null,
      matieres: Object.entries(cat).map(([c, o]) => ({ c, reponses: o.n, reussite: o.n ? Math.round(o.ok / o.n * 100) : 0, eleves: o.users })).sort((a, b) => b.reponses - a.reponses),
      jours: Array.from({ length: 28 }, (_, i) => t.dayNum - 27 + i).map(dn => ({ dn, n: days[dn] || 0 })),
      ratees: top,
      signalements: (await store.listReports()).filter(r => !r.done).length,
      serveur: { depuis: Date.now() - Math.round(process.uptime() * 1000), region: process.env.RAILWAY_REPLICA_REGION || "", version: (process.env.RAILWAY_GIT_COMMIT_SHA || "").slice(0, 7), stockage: /postgres/.test(store.kind || "") ? "PostgreSQL" : "Fichier" }
    });
  } catch (e) { next(e); }
});
/* Fiche de chaque élève : résumé calculé à partir de sa progression */
const LV = [[0, "Stagiaire"], [300, "Assistant comptable"], [1000, "Comptable"], [2500, "Collaborateur"], [5000, "Chef de mission"], [9000, "Expert-comptable"]];
const CATN = { p1: "P1", p2: "P2", p3: "P3", p4: "P4", p5: "P5", p6: "P6", p7: "P7", ma: "Maths", ce: "CEJM", cg: "Culture G.", an: "Anglais", me: "Méthodes" };
function qSt(d, id) { const o = (d.qd || {})[id]; if (!o || !Array.isArray(o.ok) || !o.ok.length) return 1; const a = o.ok[0], b = o.ok[o.ok.length - 1]; return o.ok.length >= 3 && b - a >= 7 ? 3 : o.ok.length >= 2 && b - a >= 3 ? 2 : 1; }
function studentSummary(r, dn, full) {
  const d = r.data || {}, q = d.q || {}, h = d.h || {}, st = d.st || {}, xp = d.xp || 0;
  let rep = 0, ok = 0, acq = 0, wrong = 0; const cat = {}, ch = {};
  for (const [id, a] of Object.entries(q)) {
    if (!Array.isArray(a)) continue; rep += a[0] || 0; ok += a[1] || 0; if (qSt(d, id) >= 2) acq++; if (a[2] === 0) wrong++;
    if (full) { const c = id.replace(/q\d+$/, ""), o = cat[c] || (cat[c] = { n: 0, ok: 0, acq: 0 }); o.n += a[0] || 0; o.ok += a[1] || 0; if (qSt(d, id) >= 2) o.acq++;
      const m = QMAP[id]; if (m && m[2]) { const k = m[2], x = ch[k] || (ch[k] = { n: 0, ok: 0, c: CATN[c] || c }); x.n += a[0] || 0; x.ok += a[1] || 0; } }
  }
  const days = Object.keys(h).map(Number), lv = LV.filter(l => xp >= l[0]).pop();
  const s = { id: r.id, name: r.name, created: r.created, updated: r.updated, blocked: !!r.blocked, rappels: (r.subs || 0) > 0,
    xp, niveau: lv[1], serie: st.d >= dn - 1 ? st.n || 0 : 0, jours7: days.filter(k => k > dn - 7).length, jours30: days.filter(k => k > dn - 30).length,
    reponses: rep, reussite: rep ? Math.round(ok / rep * 100) : null, acquises: acq, aRevoir: wrong, classement: !!(d.cl && d.cl.on) };
  s.activite = Array.from({ length: 28 }, (_, i) => h[dn - 27 + i] || 0);
  if (!full) return s;
  s.fiches = Object.keys(d.fr || {}).length; s.lecons = Object.keys(d.l || {}).length;
  s.cartes = Object.values(d.c || {}).filter(x => Array.isArray(x) && x[0] >= 3).length;
  s.matieres = Object.entries(cat).map(([c, o]) => ({ c: CATN[c] || c, reponses: o.n, reussite: o.n ? Math.round(o.ok / o.n * 100) : 0, acquises: o.acq })).sort((a, b) => b.reponses - a.reponses);
  s.fragiles = Object.entries(ch).filter(([, x]) => x.n >= 4).map(([t, x]) => ({ t, c: x.c, reponses: x.n, reussite: Math.round(x.ok / x.n * 100) })).sort((a, b) => a.reussite - b.reussite).slice(0, 6);
  s.controles = (d.packs || []).map(p => ({ c: CATN[p.cat] || p.cat, nom: p.name || p.kw || "", date: p.date || "", dernier: p.hist && p.hist.length ? p.hist[p.hist.length - 1].pc : null }));
  return s;
}
app.post("/api/admin/students", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    const dn = parisNow().dayNum, rows = await store.fullProgress();
    if (req.body.id) { const r = rows.find(x => x.id === req.body.id); if (!r) return res.status(404).json({ error: "Élève introuvable." }); return res.json({ eleve: studentSummary(r, dn, true) }); }
    res.json({ eleves: rows.map(r => studentSummary(r, dn, false)).sort((a, b) => (b.updated || 0) - (a.updated || 0)) });
  } catch (e) { next(e); }
});
app.post("/api/admin/student-action", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    const u = await store.userById(String(req.body.id || "")); if (!u) return res.status(404).json({ error: "Élève introuvable." });
    const me = await currentUser(req).catch(() => null), self = me && me.id === u.id, act = req.body.action;
    if (self && (act === "block" || act === "delete")) return res.status(400).json({ error: "Tu ne peux pas faire ça sur ton propre compte." });
    if (act === "logout") await store.bumpSv(u.id);
    else if (act === "block") await store.setBlocked(u.id, true);
    else if (act === "unblock") await store.setBlocked(u.id, false);
    else if (act === "password") { const p = String(req.body.password || ""); if (p.length < 6) return res.status(400).json({ error: "Mot de passe trop court (6 caractères minimum)." }); await store.setPass(u.id, await bcrypt.hash(p, 10)); await store.bumpSv(u.id); }
    else if (act === "delete") { if (cleanName(req.body.confirm) !== u.name) return res.status(400).json({ error: "Recopie exactement le nom de l'élève pour confirmer." }); await store.deleteUser(u.id); }
    else return res.status(400).json({ error: "Action inconnue." });
    CLASS.at = 0; console.log("Admin :", act, u.name);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
app.post("/api/admin/reset", async (req, res, next) => {
  try {
    if (adBlocked(req)) return res.status(429).json({ error: "Trop d'essais." });
    if (!adminOk(req)) return res.status(403).json({ error: "Clé d'administration incorrecte (ou ADMIN_KEY non définie)." });
    const u = await store.userByKey(nameKey(cleanName(req.body.name)));
    if (!u) return res.status(404).json({ error: "Aucun élève à ce nom." });
    const p = String(req.body.password || "");
    if (p.length < 6) return res.status(400).json({ error: "Mot de passe trop court (6 caractères minimum)." });
    await store.setPass(u.id, await bcrypt.hash(p, 10)); await store.bumpSv(u.id);
    res.json({ ok: true, name: u.name });
  } catch (e) { next(e); }
});

app.get("/healthz", (req, res) => res.json({ ok: true }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: "Erreur du serveur. Réessaie dans un instant." }); });

store.init().then(() => {
  setInterval(pushTick, 5 * 60e3).unref(); setTimeout(pushTick, 20e3).unref();
  setInterval(() => dailyBackup(false).catch(e => console.error("Sauvegarde", e)), 60 * 60e3).unref(); setTimeout(() => dailyBackup(false).catch(e => console.error("Sauvegarde", e)), 60e3).unref();
  app.listen(PORT, () => console.log(`Grand Livre en ligne sur le port ${PORT} (stockage : ${store.kind}, correction Claude : ${AI_KEY ? "activée" : "désactivée"})`));
}).catch(e => { console.error("Impossible d'initialiser le stockage", e); process.exit(1); });
