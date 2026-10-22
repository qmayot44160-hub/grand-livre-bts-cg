const test = require("node:test");
const assert = require("node:assert/strict");
const { startServer, client } = require("./helpers");

let srv;
test.before(async () => { srv = await startServer(); });
test.after(() => srv && srv.stop());

test("la progression exige une connexion", async () => {
  const c = client(srv.base);
  assert.equal((await c.get("/api/progress?v=2")).status, 401);
  assert.equal((await c.put("/api/progress", { xp: 1 })).status, 401);
});

test("enregistrer puis relire sa progression", async () => {
  const c = client(srv.base);
  await c.signup("Lea");
  assert.equal((await c.get("/api/progress?v=2")).json.data, null);
  assert.equal((await c.put("/api/progress", [1, 2])).status, 400);
  assert.equal((await c.put("/api/progress", { xp: 40, q: { a: 1 } })).status, 200);
  assert.deepEqual((await c.get("/api/progress?v=2")).json.data, { xp: 40, q: { a: 1 } });
  // Les anciennes versions de l'appli (sans ?v=2) reçoivent la copie marquée comme ancienne
  assert.equal((await c.get("/api/progress")).json.data.u, 1);
});

test("une progression nettement plus pauvre ne remplace pas celle du compte sans confirmation", async () => {
  const c = client(srv.base);
  await c.signup("Hugo");
  await c.put("/api/progress", { xp: 500 });
  const r = await c.put("/api/progress", { xp: 10 });
  assert.equal(r.status, 409);
  assert.equal(r.json.code, "conflict");
  assert.equal((await c.get("/api/progress?v=2")).json.data.xp, 500);
  assert.equal((await c.put("/api/progress", { xp: 400 })).status, 200, "une petite baisse reste acceptée");

  // Avec _f (import volontaire), on remplace et l'ancienne version reste récupérable
  assert.equal((await c.put("/api/progress", { xp: 10, _f: 1 })).status, 200);
  const cur = (await c.get("/api/progress?v=2")).json.data;
  assert.equal(cur.xp, 10);
  assert.equal(cur._f, undefined);
  const v = (await c.get("/api/progress/versions")).json.versions;
  assert.equal(v[0].id, "pp");
  assert.equal(v[0].xp, 400);

  const rs = await c.post("/api/progress/restore", { id: "pp" });
  assert.equal(rs.status, 200);
  assert.equal((await c.get("/api/progress?v=2")).json.data.xp, 400);
  assert.equal((await c.post("/api/progress/restore", { id: "b0" })).status, 404);
});

test("chaque élève ne voit que sa propre progression", async () => {
  const a = client(srv.base), b = client(srv.base);
  await a.signup("Ines"); await b.signup("Yanis");
  await a.put("/api/progress", { xp: 77 });
  assert.equal((await b.get("/api/progress?v=2")).json.data, null);
});

test("la correction par Claude est refusée quand elle n'est pas activée", async () => {
  const c = client(srv.base);
  await c.signup("Tom");
  const r = await c.post("/api/sample", { input: "bonjour" });
  assert.equal(r.status, 403);
  assert.equal(r.json.code, "not_granted");
});
