// Démarre un vrai serveur (stockage fichier dans un dossier temporaire) pour chaque fichier de test.
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const net = require("net");

const freePort = () => new Promise((ok, ko) => { const s = net.createServer(); s.unref(); s.on("error", ko); s.listen(0, () => { const p = s.address().port; s.close(() => ok(p)); }); });

async function startServer(env = {}) {
  const port = await freePort(), dir = fs.mkdtempSync(path.join(os.tmpdir(), "gl-test-"));
  const child = spawn(process.execPath, [path.join(__dirname, "..", "server.js")], {
    env: Object.assign({}, process.env, { PORT: String(port), DATA_DIR: dir, DATABASE_URL: "", NODE_ENV: "test", RAILWAY_ENVIRONMENT: "", ANTHROPIC_API_KEY: "", ADMIN_USERS: "", ADMIN_KEY: "", CRON_KEY: "", REGISTRATION: "open" }, env),
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = ""; child.stdout.on("data", d => { log += d; }); child.stderr.on("data", d => { log += d; });
  const base = "http://127.0.0.1:" + port;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode != null) throw new Error("Le serveur s'est arrêté :\n" + log);
    try { if ((await fetch(base + "/healthz")).ok) break; } catch (e) {}
    await new Promise(r => setTimeout(r, 100));
    if (i === 99) throw new Error("Le serveur ne répond pas :\n" + log);
  }
  return {
    base, dir, log: () => log,
    async stop() { child.kill(); await new Promise(r => child.exitCode != null ? r() : child.once("exit", r)); fs.rmSync(dir, { recursive: true, force: true }); },
  };
}

/* Petit client qui garde son cookie de session, comme un navigateur. */
function client(base) {
  const c = { cookie: "" };
  c.req = async (method, url, body, headers = {}) => {
    const h = Object.assign({}, headers); if (c.cookie) h.cookie = c.cookie; if (body !== undefined) h["content-type"] = "application/json";
    const r = await fetch(base + url, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body), redirect: "manual" });
    const sc = r.headers.get("set-cookie"); if (sc) { const v = sc.split(";")[0]; c.cookie = /=$/.test(v) ? "" : v; }
    const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch (e) {}
    return { status: r.status, json, text, headers: r.headers };
  };
  c.get = (u, h) => c.req("GET", u, undefined, h);
  c.post = (u, b, h) => c.req("POST", u, b === undefined ? {} : b, h);
  c.put = (u, b, h) => c.req("PUT", u, b, h);
  c.signup = (name, password = "secret123") => c.post("/api/signup", { name, password });
  c.login = (name, password = "secret123") => c.post("/api/login", { name, password });
  return c;
}

module.exports = { startServer, client };
