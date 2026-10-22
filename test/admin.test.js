const test = require("node:test");
const assert = require("node:assert/strict");
const { startServer, client } = require("./helpers");

const KEY = "cle-admin-test", CRON = "cle-cron-test";
let srv, prof, eleve;
test.before(async () => {
  srv = await startServer({ ADMIN_USERS: "Madame Prof", ADMIN_KEY: KEY, CRON_KEY: CRON });
  prof = client(srv.base); eleve = client(srv.base);
  await prof.signup("Madame Prof"); await eleve.signup("Eleve Un");
});
test.after(() => srv && srv.stop());
const H = { "x-admin-key": KEY };

test("GL Admin est invisible pour les élèves et les visiteurs", async () => {
  assert.equal((await eleve.get("/admin?ici")).status, 404);
  assert.equal((await eleve.post("/api/admin/users", {}, H)).status, 404, "même avec la bonne clé");
  assert.equal((await client(srv.base).post("/api/admin/users", {}, H)).status, 404);
  assert.equal((await prof.get("/admin?ici")).status, 200);
});

test("la clé d'administration est exigée", async () => {
  assert.equal((await prof.post("/api/admin/users", {})).status, 403);
  assert.equal((await prof.post("/api/admin/users", {}, { "x-admin-key": "faux" })).status, 403);
  const r = await prof.post("/api/admin/users", {}, H);
  assert.equal(r.status, 200);
  assert.deepEqual(r.json.users.map(u => u.name).sort(), ["Eleve Un", "Madame Prof"]);
});

test("suspendre un élève coupe sa session et bloque la connexion", async () => {
  const list = (await prof.post("/api/admin/students", {}, H)).json.eleves;
  const id = list.find(e => (e.name || e.nom) === "Eleve Un").id;
  assert.ok(id);
  const self = list.find(e => (e.name || e.nom) === "Madame Prof").id;
  assert.equal((await prof.post("/api/admin/student-action", { id: self, action: "block" }, H)).status, 400, "pas sur son propre compte");

  assert.equal((await prof.post("/api/admin/student-action", { id, action: "block" }, H)).status, 200);
  assert.equal((await eleve.get("/api/me")).status, 401);
  assert.equal((await client(srv.base).login("Eleve Un")).status, 403);
  assert.equal((await prof.post("/api/admin/student-action", { id, action: "unblock" }, H)).status, 200);
  assert.equal((await eleve.login("Eleve Un")).status, 200);

  assert.equal((await prof.post("/api/admin/reset", { name: "eleve un", password: "remis123" }, H)).status, 200);
  assert.equal((await eleve.get("/api/me")).status, 401, "réinitialiser le mot de passe déconnecte l'élève");
  assert.equal((await eleve.login("Eleve Un", "remis123")).status, 200);
});

test("tâche planifiée : clé requise, sauvegarde du jour une seule fois", async () => {
  const c = client(srv.base);
  assert.equal((await c.post("/api/cron/tick")).status, 403);
  const r1 = await c.post("/api/cron/tick", {}, { "x-cron-key": CRON });
  assert.equal(r1.status, 200);
  assert.equal(r1.json.backup, "faite");
  assert.equal((await c.post("/api/cron/tick", {}, { "x-cron-key": CRON })).json.backup, "déjà faite aujourd'hui");
  const b = await prof.post("/api/admin/backups", {}, H);
  assert.equal(b.status, 200);
});
