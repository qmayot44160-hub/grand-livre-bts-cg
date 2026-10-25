// Génère public/qmap.json : identifiant de question → [matière, énoncé, chapitre].
// Sert aux statistiques de l'admin (questions les plus ratées). Lancé par build_public.py si Playwright est installé.
const path = require("path"), fs = require("fs");
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { console.log("qmap : Playwright absent, ignoré"); process.exit(0); }
(async () => {
  const src = path.resolve(process.argv[2]), out = path.resolve(process.argv[3]);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("file://" + src); await p.waitForTimeout(1200);
  const m = await p.evaluate(() => Object.fromEntries(QS.filter(x => !/^or-m/.test(String(x.ch || ""))).map(x => [x.id, [CAT[x.c] ? CAT[x.c].code + " " + CAT[x.c].name : x.c, x.q, (() => { try { return x.ch ? chLabel(x.ch) : ""; } catch (e) { return ""; } })(), x.o && x.o[0] || ""]])));
  /* Chapitres (hors parties personnelles) et exercices d'annales, pour les statistiques pédagogiques de l'admin */
  const meta = await p.evaluate(() => ({ ch: Object.fromEntries(CATS.filter(c => c.id !== "me").flatMap(c => (CHBY[c.id] || []).filter(x => !/^or-m/.test(x.id)).map(x => [x.id, [c.code, x.title]]))), ann: Object.fromEntries((typeof ANNEX !== "undefined" ? ANNEX : []).map(x => [x.id, [x.a.ep, x.a.year, x.a.cas, x.t, x.pts || 0]])) }));
  /* Chiffres réels affichés sur la page d'accueil (comptés dans le contenu, jamais écrits à la main) */
  const figs = await p.evaluate(() => { let l = 0; try { Object.keys(COURS).forEach(k => { try { l += nLessons(k); } catch (e) {} }); } catch (e) {} return { lecons: l, questions: QS.length, cartes: FS.length, annales: ANN.length }; });
  await b.close();
  fs.writeFileSync(out, JSON.stringify(m));
  fs.writeFileSync(path.join(path.dirname(out), "meta.json"), JSON.stringify(meta));
  fs.writeFileSync(path.join(path.dirname(out), "figures.json"), JSON.stringify(figs));
  console.log("qmap :", Object.keys(m).length, "questions");
})().catch(e => { console.error("qmap :", e.message); process.exit(0); });
