/* GL Admin à sa propre adresse : ce petit relais transmet tout au serveur du Grand Livre.
   Une adresse séparée = une appli installable à part sur ordinateur (Chrome refuse deux applis
   installées quand l'une est « dans » l'autre, comme / et /admin sur le même site). */
const http = require("http"), https = require("https");
const TARGET = new URL(process.env.TARGET || "http://localhost:3999");
const SECRET = process.env.PROXY_SECRET || "";
const PORT = process.env.PORT || 8080;
const lib = TARGET.protocol === "https:" ? https : http;
const agent = new lib.Agent({ keepAlive: true, maxSockets: 32 });
/* Seules les adresses utiles à GL Admin passent ; le reste renvoie vers le Grand Livre normal. */
const ALLOW = /^\/(admin(\/.*)?|api\/.*|admin-(192|512)\.png|admin\.webmanifest|sw\.js|favicon\.ico)$/;
const HOP = ["connection", "keep-alive", "proxy-connection", "transfer-encoding", "upgrade", "te", "trailer", "host"];

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/") { res.writeHead(302, { Location: "/admin" + url.search }); return res.end(); }
  if (url.pathname === "/health") { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end("ok"); }
  if (!ALLOW.test(url.pathname)) { res.writeHead(302, { Location: TARGET.origin + req.url }); return res.end(); }
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) if (!HOP.includes(k)) headers[k] = v;
  headers.host = TARGET.host;
  headers["x-gl-via"] = SECRET || "admin";
  headers["x-gl-host"] = req.headers.host || "";
  const up = lib.request({ protocol: TARGET.protocol, hostname: TARGET.hostname, port: TARGET.port || undefined, method: req.method, path: req.url, headers, agent }, r => {
    const out = {};
    for (const [k, v] of Object.entries(r.headers)) if (!HOP.includes(k)) out[k] = v;
    if (out.location && out.location.startsWith(TARGET.origin)) out.location = out.location.slice(TARGET.origin.length) || "/";
    res.writeHead(r.statusCode || 502, out); r.pipe(res);
  });
  up.setTimeout(60000, () => up.destroy(new Error("timeout")));
  up.on("error", e => { if (!res.headersSent) { res.writeHead(502, { "Content-Type": "text/html; charset=utf-8" }); res.end("<!doctype html><meta charset=utf-8><p style='font-family:system-ui;padding:32px'>Le Grand Livre ne répond pas pour l'instant. Réessaie dans un moment.</p>"); } else res.destroy(); console.error("relais :", e.message); });
  req.pipe(up);
}).listen(PORT, () => console.log("GL Admin (relais) sur le port", PORT, "→", TARGET.origin));
