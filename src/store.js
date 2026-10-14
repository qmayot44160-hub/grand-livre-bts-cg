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
    },
    async userByKey(key) { const r = await q("SELECT * FROM users WHERE name_key=$1", [key]); return r.rows[0] || null; },
    async userById(id) { const r = await q("SELECT * FROM users WHERE id=$1", [id]); return r.rows[0] || null; },
    async createUser(u) { await q("INSERT INTO users(id,name,name_key,pass,created) VALUES($1,$2,$3,$4,$5)", [u.id, u.name, u.name_key, u.pass, u.created]); },
    async setPass(id, pass) { await q("UPDATE users SET pass=$2 WHERE id=$1", [id, pass]); },
    async countUsers() { const r = await q("SELECT COUNT(*)::int AS n FROM users"); return r.rows[0].n; },
    async listUsers() { const r = await q("SELECT u.name, u.created, p.updated FROM users u LEFT JOIN progress p ON p.user_id=u.id ORDER BY u.name_key"); return r.rows; },
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
  let d = { users: {}, progress: {}, ai: {} };
  const save = () => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(file + ".tmp", JSON.stringify(d)); fs.renameSync(file + ".tmp", file); };
  return {
    kind: "fichier " + file,
    async init() { try { d = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { save(); } },
    async userByKey(key) { return Object.values(d.users).find(u => u.name_key === key) || null; },
    async userById(id) { return d.users[id] || null; },
    async createUser(u) { if (Object.values(d.users).some(x => x.name_key === u.name_key)) { const e = new Error("dup"); e.code = "23505"; throw e; } d.users[u.id] = u; save(); },
    async setPass(id, pass) { d.users[id].pass = pass; save(); },
    async countUsers() { return Object.keys(d.users).length; },
    async listUsers() { return Object.values(d.users).map(u => ({ name: u.name, created: u.created, updated: d.progress[u.id] ? d.progress[u.id].updated : null })).sort((a, b) => a.name.localeCompare(b.name)); },
    async getProgress(uid) { return d.progress[uid] ? d.progress[uid].data : null; },
    async setProgress(uid, data) { d.progress[uid] = { data, updated: Date.now() }; save(); },
    async bumpAi(uid, day) { const k = uid + "|" + day; d.ai[k] = (d.ai[k] || 0) + 1; save(); return d.ai[k]; },
  };
}

module.exports = function makeStore() {
  return process.env.DATABASE_URL ? makePg(process.env.DATABASE_URL) : makeFile(process.env.DATA_DIR || path.join(__dirname, "..", "data"));
};
