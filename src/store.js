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
      await q(`ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked BOOLEAN NOT NULL DEFAULT FALSE`);
      await q(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sv INTEGER NOT NULL DEFAULT 0`);
      await q(`CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)`);
      await q(`CREATE TABLE IF NOT EXISTS friends (a TEXT NOT NULL, b TEXT NOT NULL, status TEXT NOT NULL, created BIGINT NOT NULL, PRIMARY KEY (a, b))`);
      await q(`CREATE TABLE IF NOT EXISTS duels (id TEXT PRIMARY KEY, a TEXT NOT NULL, b TEXT, data JSONB NOT NULL, updated BIGINT NOT NULL)`);
      await q(`CREATE INDEX IF NOT EXISTS duels_a ON duels(a)`); await q(`CREATE INDEX IF NOT EXISTS duels_b ON duels(b)`);
      await q(`CREATE TABLE IF NOT EXISTS backups (id BIGSERIAL PRIMARY KEY, day TEXT NOT NULL, created BIGINT NOT NULL, size INTEGER NOT NULL, blob TEXT NOT NULL)`);
      await q(`CREATE TABLE IF NOT EXISTS push_subs (
        endpoint TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sub JSONB NOT NULL, hour INTEGER NOT NULL DEFAULT 18, last_day TEXT, created BIGINT NOT NULL)`);
    },
    async addReport(r) { await q("INSERT INTO reports(user_name,kind,item,label,choice,comment,created) VALUES($1,$2,$3,$4,$5,$6,$7)", [r.user_name, r.kind, r.item, r.label, r.choice, r.comment, Date.now()]); },
    async listReports() { const r = await q("SELECT * FROM reports ORDER BY done ASC, created DESC LIMIT 300"); return r.rows; },
    async doneReport(id, done) { await q("UPDATE reports SET done=$2 WHERE id=$1", [id, !!done]); },
    async dumpAll() {
      const u = await q("SELECT id, name, name_key, pass, created FROM users ORDER BY created");
      const p = await q("SELECT user_id, data, updated FROM progress");
      return { users: u.rows, progress: p.rows };
    },
    async fullProgress() { const r = await q("SELECT u.id, u.name, u.created, u.blocked, p.data, p.updated, (SELECT COUNT(*)::int FROM push_subs s WHERE s.user_id=u.id) AS subs FROM users u LEFT JOIN progress p ON p.user_id=u.id"); return r.rows; },
    async setBlocked(id, b) { await q("UPDATE users SET blocked=$2, sv=sv+1 WHERE id=$1", [id, !!b]); },
    async bumpSv(id) { const r = await q("UPDATE users SET sv=sv+1 WHERE id=$1 RETURNING sv", [id]); return r.rows[0] ? r.rows[0].sv : 0; },
    async saveBackup(day, blob) { await q("INSERT INTO backups(day, created, size, blob) VALUES($1,$2,$3,$4)", [day, Date.now(), blob.length, blob]); await q("DELETE FROM backups WHERE id NOT IN (SELECT id FROM backups ORDER BY created DESC LIMIT 7)"); },
    async listBackups() { const r = await q("SELECT id, day, created, size FROM backups ORDER BY created DESC"); return r.rows; },
    async getBackup(id) { const r = await q("SELECT day, blob FROM backups WHERE id=$1", [id]); return r.rows[0] || null; },
    async hasBackup(day) { const r = await q("SELECT 1 FROM backups WHERE day=$1 LIMIT 1", [day]); return !!r.rows.length; },
    async friendsOf(uid) { const r = await q("SELECT a, b, status, created FROM friends WHERE a=$1 OR b=$1", [uid]); return r.rows; },
    async friendSet(a, b, status) { await q("INSERT INTO friends(a,b,status,created) VALUES($1,$2,$3,$4) ON CONFLICT (a,b) DO UPDATE SET status=EXCLUDED.status", [a, b, status, Date.now()]); },
    async friendDel(a, b) { await q("DELETE FROM friends WHERE (a=$1 AND b=$2) OR (a=$2 AND b=$1)", [a, b]); },
    async usersAll() { const r = await q("SELECT id, name, blocked FROM users"); return r.rows; },
    async duelGet(id) { const r = await q("SELECT data FROM duels WHERE id=$1", [id]); return r.rows[0] ? r.rows[0].data : null; },
    async duelPut(x) { await q("INSERT INTO duels(id,a,b,data,updated) VALUES($1,$2,$3,$4,$5) ON CONFLICT (id) DO UPDATE SET b=EXCLUDED.b, data=EXCLUDED.data, updated=EXCLUDED.updated", [x.id, x.a.id, x.b ? x.b.id : null, x, Date.now()]); },
    async duelsOf(uid) { const r = await q("SELECT data FROM duels WHERE a=$1 OR b=$1 ORDER BY updated DESC LIMIT 30", [uid]); return r.rows.map(x => x.data); },
    async duelsSince(t) { const r = await q("SELECT data FROM duels WHERE updated >= $1", [t]); return r.rows.map(x => x.data); },
    async duelPurge(before) { await q("DELETE FROM duels WHERE updated < $1", [before]); },
    async getSetting(k) { const r = await q("SELECT v FROM settings WHERE k=$1", [k]); return r.rows[0] ? r.rows[0].v : null; },
    async setSetting(k, v) { await q("INSERT INTO settings(k,v) VALUES($1,$2) ON CONFLICT (k) DO UPDATE SET v=EXCLUDED.v", [k, v]); },
    async deleteUser(id) { await q("DELETE FROM friends WHERE a=$1 OR b=$1", [id]); await q("DELETE FROM duels WHERE a=$1 OR b=$1", [id]); await q("DELETE FROM ai_usage WHERE user_id=$1", [id]); await q("DELETE FROM push_subs WHERE user_id=$1", [id]); await q("DELETE FROM progress WHERE user_id=$1", [id]); await q("DELETE FROM users WHERE id=$1", [id]); },
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
  let d = { users: {}, progress: {}, ai: {}, settings: {}, subs: {}, reports: [], backups: [], duels: {}, friends: [] };
  const save = () => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file + ".tmp", JSON.stringify(d)); fs.renameSync(file + ".tmp", file); };
  return {
    kind: "fichier " + file,
    async init() { try { d = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { save(); } d.settings = d.settings || {}; d.subs = d.subs || {}; d.reports = d.reports || []; d.backups = d.backups || []; d.duels = d.duels || {}; d.friends = d.friends || []; },
    async dumpAll() { return { users: Object.values(d.users), progress: Object.entries(d.progress).map(([user_id, x]) => ({ user_id, data: x.data, updated: x.updated })) }; },
    async setBlocked(id, b) { const u = d.users[id]; if (u) { u.blocked = !!b; u.sv = (u.sv || 0) + 1; save(); } },
    async bumpSv(id) { const u = d.users[id]; if (!u) return 0; u.sv = (u.sv || 0) + 1; save(); return u.sv; },
    async fullProgress() { return Object.values(d.users).map(u => ({ id: u.id, name: u.name, created: u.created, blocked: !!u.blocked, subs: Object.values(d.subs).filter(x => x.user_id === u.id).length, data: d.progress[u.id] ? d.progress[u.id].data : null, updated: d.progress[u.id] ? d.progress[u.id].updated : null })); },
    async saveBackup(day, blob) { d.backups.unshift({ id: Date.now(), day, created: Date.now(), size: blob.length, blob }); d.backups = d.backups.slice(0, 7); save(); },
    async listBackups() { return d.backups.map(({ id, day, created, size }) => ({ id, day, created, size })); },
    async getBackup(id) { return d.backups.find(b => String(b.id) === String(id)) || null; },
    async hasBackup(day) { return d.backups.some(b => b.day === day); },
    async addReport(r) { d.reports.unshift(Object.assign({ id: Date.now() + Math.random(), created: Date.now(), done: false }, r)); d.reports = d.reports.slice(0, 1000); save(); },
    async listReports() { return d.reports.slice().sort((a, b) => a.done - b.done || b.created - a.created).slice(0, 300); },
    async doneReport(id, done) { const x = d.reports.find(r => String(r.id) === String(id)); if (x) { x.done = !!done; save(); } },
    async friendsOf(uid) { return d.friends.filter(f => f.a === uid || f.b === uid).map(f => Object.assign({}, f)); },
    async friendSet(a, b, status) { const f = d.friends.find(x => x.a === a && x.b === b); if (f) f.status = status; else d.friends.push({ a, b, status, created: Date.now() }); save(); },
    async friendDel(a, b) { d.friends = d.friends.filter(x => !((x.a === a && x.b === b) || (x.a === b && x.b === a))); save(); },
    async usersAll() { return Object.values(d.users).map(u => ({ id: u.id, name: u.name, blocked: !!u.blocked })); },
    async duelGet(id) { return d.duels[id] ? JSON.parse(JSON.stringify(d.duels[id])) : null; },
    async duelPut(x) { d.duels[x.id] = JSON.parse(JSON.stringify(x)); d.duels[x.id]._u = Date.now(); save(); },
    async duelsOf(uid) { return Object.values(d.duels).filter(x => x.a.id === uid || (x.b && x.b.id === uid)).sort((a, b) => b._u - a._u).slice(0, 30).map(x => JSON.parse(JSON.stringify(x))); },
    async duelsSince(t) { return Object.values(d.duels).filter(x => (x._u || 0) >= t); },
    async duelPurge(before) { Object.keys(d.duels).forEach(k => { if (d.duels[k]._u < before) delete d.duels[k]; }); save(); },
    async getSetting(k) { return d.settings[k] == null ? null : d.settings[k]; },
    async setSetting(k, v) { d.settings[k] = v; save(); },
    async deleteUser(id) { d.friends = (d.friends || []).filter(f => f.a !== id && f.b !== id); Object.keys(d.duels || {}).forEach(k => { const x = d.duels[k]; if (x.a.id === id || (x.b && x.b.id === id)) delete d.duels[k]; }); delete d.users[id]; delete d.progress[id]; Object.keys(d.ai).forEach(k => { if (k.startsWith(id + "|")) delete d.ai[k]; }); Object.keys(d.subs).forEach(k => { if (d.subs[k].user_id === id) delete d.subs[k]; }); save(); },
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
