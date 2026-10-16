// Stockage : PostgreSQL si DATABASE_URL est défini (Railway), sinon un fichier JSON local (tests).
const fs = require("fs");
const path = require("path");

function makePg(url) {
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: url,
    ssl: /sslmode=disable|localhost|127\.0\.0\.1|\.railway\.internal/.test(url) ? false : { rejectUnauthorized: false },
  });
  const q = (text, params) => pool.query(text, params);
  return {
    kind: "postgres",
    async init() {
      await q(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, name_key TEXT UNIQUE NOT NULL,
        pass TEXT NOT NULL, created BIGINT NOT NULL)`);
      await q(`CREATE TABLE IF NOT EXISTS progress (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        data JSONB NOT NULL, updated BIGINT NOT NULL)`);
      await q(`CREATE TABLE IF NOT EXISTS ai_usage (
        user_id TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (user_id, day))`);
      await q(`CREATE TABLE IF NOT EXISTS reports (
        id BIGSERIAL PRIMARY KEY, user_name TEXT, kind TEXT, item TEXT, label TEXT, choice TEXT, comment TEXT, created BIGINT NOT NULL, done BOOLEAN NOT NULL DEFAULT FALSE)`);
      await q(`CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)`);
      await q(`CREATE TABLE IF NOT EXISTS push_subs (
        endpoint TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sub JSONB NOT NULL, hour INTEGER NOT NULL DEFAULT 18, last_day TEXT, created BIGINT NOT NULL)`);
    },
    async addReport(r) { await q("INSERT INTO reports(user_name,kind,item,label,choice,comment,created) VALUES($1,$2,$3,$4,$5,$6,$7)", [r.user_name, r.kind, r.item, r.label, r.choice, r.comment, Date.now()]); },
    async listReports() { const r = await q("SELECT * FROM reports ORDER BY done ASC, created DESC LIMIT 300"); return r.rows; },
    async doneReport(id, done) { await q("UPDATE reports SET done=$2 WHERE id=$1", [id, !!done]); },
    async getSetting(k) { const r = await q("SELECT v FROM settings WHERE k=$1", [k]); return r.rows[0] ? r.rows[0].v : null; },
    async setSetting(k, v) { await q("INSERT INTO settings(k,v) VALUES($1,$2) ON CONFLICT (k) DO UPDATE SET v=EXCLUDED.v", [k, v]); },
    async deleteUser(id) { await q("DELETE FROM ai_usage WHERE user_id=$1", [id]); await q("DELETE FROM push_subs WHERE user_id=$1", [id]); await q("DELETE FROM progress WHERE user_id=$1", [id]); await q("DELETE FROM users WHERE id=$1", [id]); },
    async addSub(uid, sub, hour) { await q(`INSERT INTO push_subs(endpoint,user_id,sub,hour,created) VALUES($1,$2,$3,$4,$5)
      ON CONFLICT (endpoint) DO UPDATE SET user_id=EXCLUDED.user_id, sub=EXCLUDED.sub, hour=EXCLUDED.hour`, [sub.endpoint, uid, sub, hour, Date.now()]); },
    async delSub(endpoint) { await q("DELETE FROM push_subs WHERE endpoint=$1", [endpoint]); },
    async subsFull(uid) { const r = await q("SELECT endpoint, sub FROM push_subs WHERE user_id=$1", [uid]); return r.rows; },
    async subsOf(uid) { const r = await q("SELECT endpoint, hour FROM push_subs WHERE user_id=$1", [uid]); return r.rows; },
    async dueSubs(hour, day) { const r = await q("SELECT endpoint, user_id, sub FROM push_subs WHERE hour=$1 AND (last_day IS NULL OR last_day<>$2)", [hour, day]); return r.rows; },
    async markSub(endpoint, day) { await q("UPDATE push_subs SET last_day=$2 WHERE endpoint=$1", [endpoint, day]); },
    async userByKey(key) { const r = await q("SELECT * FROM users WHERE name_key=$1", [key]); return r.rows[0] || null; },
    async userById(id) { const r = await q("SELECT * FROM users WHERE id=$1", [id]); return r.rows[0] || null; },
    async createUser(u) { await q("INSERT INTO users(id,name,name_key,pass,created) VALUES($1,$2,$3,$4,$5)", [u.id, u.name, u.name_key, u.pass, u.created]); },
    async setPass(id, pass) { await q("UPDATE users SET pass=$2 WHERE id=$1", [id, pass]); },
    async countUsers() { const r = await q("SELECT COUNT(*)::int AS n FROM users"); return r.rows[0].n; },
    async listUsers() { const r = await q("SELECT u.name, u.created, p.updated FROM users u LEFT JOIN progress p ON p.user_id=u.id ORDER BY u.name_key"); return r.rows; },
    async allProgress() { const r = await q("SELECT u.id, p.data FROM users u JOIN progress p ON p.user_id=u.id WHERE p.data->'cl'->>'on' = 'true'"); return r.rows; },
    async getProgress(uid) { const r = await q("SELECT data FROM progress WHERE user_id=$1", [uid]); return r.rows[0] ? r.rows[0].data : null; },
    async setProgress(uid, data) {
      await q(`INSERT INTO progress(user_id,data,updated) VALUES($1,$2,$3)
               ON CONFLICT (user_id) DO UPDATE SET data=EXCLUDED.data, updated=EXCLUDED.updated`, [uid, data, Date.now()]);
    },
    async bumpAi(uid, day) {
      const r = await q(`INSERT INTO ai_usage(user_id,day,n) VALUES($1,$2,1)
                         ON CONFLICT (user_id,day) DO UPDATE SET n=ai_usage.n+1 RETURNING n`, [uid, day]);
      return r.rows[0].n;
    },
  };
}

function makeFile(dir) {
  const file = path.join(dir, "db.json");
  let d = { users: {}, progress: {}, ai: {}, settings: {}, subs: {}, reports: [] };
  const save = () => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file + ".tmp", JSON.stringify(d)); fs.renameSync(file + ".tmp", file); };
  return {
    kind: "fichier " + file,
    async init() { try { d = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { save(); } d.settings = d.settings || {}; d.subs = d.subs || {}; d.reports = d.reports || []; },
    async addReport(r) { d.reports.unshift(Object.assign({ id: Date.now() + Math.random(), created: Date.now(), done: false }, r)); d.reports = d.reports.slice(0, 1000); save(); },
    async listReports() { return d.reports.slice().sort((a, b) => a.done - b.done || b.created - a.created).slice(0, 300); },
    async doneReport(id, done) { const x = d.reports.find(r => String(r.id) === String(id)); if (x) { x.done = !!done; save(); } },
    async getSetting(k) { return d.settings[k] == null ? null : d.settings[k]; },
    async setSetting(k, v) { d.settings[k] = v; save(); },
    async deleteUser(id) { delete d.users[id]; delete d.progress[id]; Object.keys(d.ai).forEach(k => { if (k.startsWith(id + "|")) delete d.ai[k]; }); Object.keys(d.subs).forEach(k => { if (d.subs[k].user_id === id) delete d.subs[k]; }); save(); },
    async addSub(uid, sub, hour) { d.subs[sub.endpoint] = { endpoint: sub.endpoint, user_id: uid, sub, hour, last_day: null, created: Date.now() }; save(); },
    async delSub(endpoint) { delete d.subs[endpoint]; save(); },
    async subsFull(uid) { return Object.values(d.subs).filter(x => x.user_id === uid); },
    async subsOf(uid) { return Object.values(d.subs).filter(x => x.user_id === uid).map(x => ({ endpoint: x.endpoint, hour: x.hour })); },
    async dueSubs(hour, day) { return Object.values(d.subs).filter(x => x.hour === hour && x.last_day !== day); },
    async markSub(endpoint, day) { if (d.subs[endpoint]) { d.subs[endpoint].last_day = day; save(); } },
    async userByKey(key) { return Object.values(d.users).find(u => u.name_key === key) || null; },
    async userById(id) { return d.users[id] || null; },
    async createUser(u) { if (Object.values(d.users).some(x => x.name_key === u.name_key)) { const e = new Error("dup"); e.code = "23505"; throw e; } d.users[u.id] = u; save(); },
    async setPass(id, pass) { d.users[id].pass = pass; save(); },
    async countUsers() { return Object.keys(d.users).length; },
    async listUsers() { return Object.values(d.users).map(u => ({ name: u.name, created: u.created, updated: d.progress[u.id] ? d.progress[u.id].updated : null })).sort((a, b) => a.name.localeCompare(b.name)); },
    async allProgress() { return Object.keys(d.progress).filter(id => d.users[id] && d.progress[id].data && d.progress[id].data.cl && d.progress[id].data.cl.on).map(id => ({ id, data: d.progress[id].data })); },
    async getProgress(uid) { return d.progress[uid] ? d.progress[uid].data : null; },
    async setProgress(uid, data) { d.progress[uid] = { data, updated: Date.now() }; save(); },
    async bumpAi(uid, day) { const k = uid + "|" + day; d.ai[k] = (d.ai[k] || 0) + 1; save(); return d.ai[k]; },
  };
}

module.exports = function makeStore() {
  return process.env.DATABASE_URL ? makePg(process.env.DATABASE_URL) : makeFile(process.env.DATA_DIR || path.join(__dirname, "..", "data"));
};
