// Génère public/qmap.json : identifiant de question → [matière, énoncé, chapitre].
// Sert aux statistiques de l'admin (questions les plus ratées). Lancé par build_public.py si Playwright est installé.
const path = require("path"), fs = require("fs");
let chromium; try { ({ chromium } = require("playwright")); } catch (e) { console.log("qmap : Playwright absent, ignoré"); process.exit(0); }
(async () => {
  const src = path.resolve(process.argv[2]), out = path.resolve(process.argv[3]);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("file://" + src); await p.waitForTimeout(1200);
  const m = await p.evaluate(() => Object.fromEntries(QS.map(x => [x.id, [CAT[x.c] ? CAT[x.c].code + " " + CAT[x.c].name : x.c, x.q, (() => { try { return x.ch ? chLabel(x.ch) : ""; } catch (e) { return ""; } })()]])));
  await b.close();
  fs.writeFileSync(out, JSON.stringify(m));
  console.log("qmap :", Object.keys(m).length, "questions");
})().catch(e => { console.error("qmap :", e.message); process.exit(0); });
