const test = require("node:test");
const assert = require("node:assert/strict");
const { startServer, client } = require("./helpers");

let srv;
test.before(async () => { srv = await startServer(); });
test.after(() => srv && srv.stop());

test("pages publiques et fichiers protégés", async () => {
  const c = client(srv.base);
  assert.equal((await c.get("/healthz")).json.ok, true);
  const home = await c.get("/");
  assert.equal(home.status, 200);
  assert.match(home.text, /<html/i);
  assert.equal((await c.get("/mentions-legales")).status, 200);
  assert.equal((await c.get("/confidentialite")).status, 200);
  // Les pages HTML ne doivent jamais être servies telles quelles (contournement de la connexion)
  for (const p of ["/app.html", "/admin.html", "/login.html", "/APP.HTML", "/x.htm"]) assert.equal((await c.get(p)).status, 404, p);
});

test("inscription : validation des champs", async () => {
  const c = client(srv.base);
  assert.equal((await c.signup("A")).status, 400);
  assert.equal((await c.signup("x".repeat(41))).status, 400);
  assert.equal((await c.signup("Valide", "12345")).status, 400);
  assert.equal(c.cookie, "");
});

test("inscription, nom unique sans tenir compte des accents ni de la casse", async () => {
  const c = client(srv.base);
  const r = await c.signup("  Élodie   Martin ");
  assert.equal(r.status, 200);
  assert.equal(r.json.name, "Élodie Martin");
  assert.ok(c.cookie.startsWith("gl_s="));
  assert.equal((await c.get("/api/me")).json.name, "Élodie Martin");
  assert.equal((await client(srv.base).signup("elodie martin")).status, 409);
});

test("connexion, session et déconnexion", async () => {
  const anon = client(srv.base);
  assert.equal((await anon.get("/api/me")).status, 401);
  await client(srv.base).signup("Karim");
  const c = client(srv.base);
  assert.equal((await c.login("Karim", "mauvais")).status, 401);
  assert.equal((await c.login("Nobody")).status, 401);
  assert.equal((await c.login("KARIM")).status, 200);
  assert.equal((await c.get("/api/me")).status, 200);
  await c.post("/api/logout");
  assert.equal(c.cookie, "");
  assert.equal((await c.get("/api/me")).status, 401);
});

test("un cookie falsifié est refusé", async () => {
  const c = client(srv.base);
  await c.signup("Falsif");
  const [p, s] = decodeURIComponent(c.cookie.slice(5)).split(".");
  const o = JSON.parse(Buffer.from(p, "base64url").toString()); o.uid = "autre";
  const forged = client(srv.base);
  forged.cookie = "gl_s=" + Buffer.from(JSON.stringify(o)).toString("base64url") + "." + s;
  assert.equal((await forged.get("/api/me")).status, 401);
  forged.cookie = "gl_s=n.importe.quoi";
  assert.equal((await forged.get("/api/me")).status, 401);
});

test("changer de mot de passe déconnecte les autres appareils", async () => {
  const a = client(srv.base), b = client(srv.base);
  await a.signup("Nina", "ancien123");
  await b.login("Nina", "ancien123");
  assert.equal((await a.post("/api/password", { old: "faux", password: "nouveau123" })).status, 403);
  assert.equal((await a.post("/api/password", { old: "ancien123", password: "court" })).status, 400);
  assert.equal((await a.post("/api/password", { old: "ancien123", password: "nouveau123" })).status, 200);
  assert.equal((await a.get("/api/me")).status, 200, "l'appareil qui a changé le mot de passe reste connecté");
  assert.equal((await b.get("/api/me")).status, 401, "l'autre appareil est déconnecté");
  assert.equal((await client(srv.base).login("Nina", "ancien123")).status, 401);
  assert.equal((await client(srv.base).login("Nina", "nouveau123")).status, 200);
});

test("export et suppression du compte", async () => {
  const c = client(srv.base);
  await c.signup("Sacha");
  await c.put("/api/progress", { xp: 12 });
  const ex = await c.get("/api/account/export");
  assert.equal(ex.json.compte.nom, "Sacha");
  assert.equal(ex.json.progression.xp, 12);
  assert.equal((await c.post("/api/account/delete", { password: "faux" })).status, 403);
  assert.equal((await c.post("/api/account/delete", { password: "secret123" })).status, 200);
  assert.equal((await c.get("/api/me")).status, 401);
  assert.equal((await client(srv.base).login("Sacha")).status, 401);
  assert.equal((await client(srv.base).signup("Sacha")).status, 200, "le nom redevient libre");
});
