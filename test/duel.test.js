const test = require("node:test");
const assert = require("node:assert/strict");
const { startServer, client } = require("./helpers");

let srv, a, b, c;
const IDS = ["tvq1", "tvq2", "tvq3", "imq4", "imq5"];
test.before(async () => {
  srv = await startServer();
  a = client(srv.base); b = client(srv.base); c = client(srv.base);
  await a.signup("Alice"); await b.signup("Bruno"); await c.signup("Chloe");
});
test.after(() => srv && srv.stop());

test("un duel doit avoir entre 5 et 20 questions valides", async () => {
  assert.equal((await a.post("/api/duel", { ids: IDS.slice(0, 4) })).status, 400);
  assert.equal((await a.post("/api/duel", { ids: ["<x>", "a", "b", "c", "d"] })).status, 400);
});

test("duel complet : création, code, réponses, résultat", async () => {
  const d = (await a.post("/api/duel", { ids: IDS, cats: ["tv", "im"] })).json.duel;
  assert.equal(d.status, "wait");
  assert.equal(d.n, 5);

  assert.equal((await b.get("/api/duel/" + d.id)).status, 404, "pas encore dans le duel");
  assert.equal((await b.post("/api/duel/join", { code: "ZZZZZ" })).status, 404);
  const j = (await b.post("/api/duel/join", { code: d.id.toLowerCase() })).json.duel;
  assert.equal(j.status, "play");
  assert.equal(j.me, "b");
  assert.equal((await c.post("/api/duel/join", { code: d.id })).status, 403, "réservé aux deux joueurs");

  for (let i = 0; i < 5; i++) {
    await a.post(`/api/duel/${d.id}/ans`, { i, ok: true, t: 1000 });
    await b.post(`/api/duel/${d.id}/ans`, { i, ok: i < 2, t: 2000 });
  }
  // Une réponse en double (même index) est ignorée
  const fin = (await a.post(`/api/duel/${d.id}/ans`, { i: 0, ok: false })).json.duel;
  assert.equal(fin.status, "done");
  assert.equal(fin.you.ans.length, 5);
  assert.ok(fin.you.score > fin.opp.score);
  assert.equal(fin.opp.ok, 2);
});

test("refuser un duel", async () => {
  const d = (await a.post("/api/duel", { ids: IDS })).json.duel;
  await b.post("/api/duel/join", { code: d.id });
  assert.equal((await b.post(`/api/duel/${d.id}/decline`)).status, 200);
  assert.equal((await a.get("/api/duel/" + d.id)).json.duel.status, "declined");
  assert.equal((await c.post("/api/duel/join", { code: d.id })).status, 404);
});

test("amis : demande par code puis acceptation", async () => {
  const fb = (await b.get("/api/friends")).json;
  assert.match(fb.code, /^[A-Z0-9]{3}-[A-Z0-9]{3}$/);
  assert.equal((await b.post("/api/friends/add", { code: fb.code })).status, 400, "pas son propre code");
  assert.equal((await a.post("/api/friends/add", { code: "12" })).status, 400);
  assert.ok((await a.post("/api/friends/add", { code: fb.code })).json.pending);
  const inc = (await b.get("/api/friends")).json.incoming;
  assert.equal(inc.length, 1);
  assert.equal((await b.post("/api/friends/respond", { k: inc[0].k, accept: true })).status, 200);
  assert.equal((await a.get("/api/friends")).json.friends.length, 1);
  assert.equal((await b.get("/api/friends")).json.friends.length, 1);
});
