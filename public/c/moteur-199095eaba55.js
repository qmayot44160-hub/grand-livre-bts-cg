
/* ---------- Préparation des données ---------- */
const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));

const QS = [], FS = [];
(() => {
  const n = {};
  Q.forEach(([c, q, o, e, ch, t]) => { n[c + "q"] = (n[c + "q"] || 0) + 1; QS.push(t ? { id: c + "q" + n[c + "q"], c, q, o, e, ch, t } : { id: c + "q" + n[c + "q"], c, q, o, e, ch }); });
  F.forEach(([c, f, b, m, ch]) => { n[c + "k"] = (n[c + "k"] || 0) + 1; FS.push({ id: c + "k" + n[c + "k"], c, f, b, m: m || "", ch }); });
})();

/* Audit du contenu (octobre 2026) : doublons masqués sans changer les identifiants, explications enrichies */
(() => {
  const HQ = new Set(["p1q53", "p2q38", "p2q70", "p3q24", "p3q28", "p4q37", "p5q18", "p5q56", "p6q23", "p6q34", "p6q37", "p7q21", "p7q49", "p7q39", "maq42", "maq51", "ceq247", "ceq316", "cgq41", "cgq68", "ceq348", "ceq107", "ceq128", "ceq150", "ceq167", "ceq200", "ceq227", "ceq262", "p1q80"]), HF = new Set(["p1k30", "p1k32", "p1k35", "p2k26", "p2k44", "p2k46", "p2k47", "p3k21", "p3k22", "p6k18", "p6k19", "p6k20", "mak25", "mak64", "ank25", "ank30", "ank19", "cek201", "cek222", "cek220"]), EX = {"maq14": "|r| proche de 1 : les points sont presque alignés, l'ajustement affine est fiable. Attention : une corrélation ne prouve pas un lien de cause à effet.", "maq53": "r est proche de −1 : les points sont presque alignés sur une droite qui descend (y diminue quand x augmente). Le signe donne le sens, la valeur absolue la force.", "p5q53": "|r| proche de 1 = forte corrélation linéaire : la droite des moindres carrés peut servir à prévoir. Corrélation ne veut pas dire causalité.", "ceq306": "Free + premium : la version gratuite attire beaucoup d'utilisateurs (effet de réseau), une partie paie ensuite pour les fonctions avancées. Ex. : Spotify, Canva.", "ceq307": "Consumer to consumer : deux particuliers échangent via une plateforme qui prend une commission (ex. : Vinted, Leboncoin).", "ceq328": "20 ans à compter du dépôt (INPI pour la France), non renouvelable, à condition de payer les annuités. Ensuite l'invention tombe dans le domaine public.", "ceq329": "10 ans à compter du dépôt (INPI), renouvelable indéfiniment par périodes de 10 ans. Sans usage sérieux pendant 5 ans, la marque peut être déchue.", "ceq351": "Flexibilité interne (on garde les mêmes salariés) et qualitative (on change leurs tâches) : c'est la polyvalence. La flexibilité externe joue sur les effectifs (CDD, intérim).", "ceq352": "Modèle danois : licenciements plus faciles pour l'entreprise, mais indemnisation élevée et accompagnement actif du chômeur vers un nouvel emploi.", "ceq353": "Doeringer et Piore (1971) : marché primaire (CDI, salaires élevés, carrière) et marché secondaire (contrats courts, bas salaires, peu de formation), avec peu de passage de l'un à l'autre.", "ceq373": "Loi Travail de 2016 : le droit à la déconnexion fait partie de la négociation sur l'égalité professionnelle et la qualité de vie au travail, obligatoire là où il y a un délégué syndical (50 salariés et plus). À défaut d'accord, une charte.", "ceq375": "Présomption simple de non-salariat (art. L8221-6 C. trav.) : elle tombe si l'on prouve un lien de subordination (ordres, contrôle, sanctions), comme dans les arrêts Take Eat Easy et Uber.", "ceq376": "Gestion des emplois et des parcours professionnels (ex-GPEC) : comparer les compétences actuelles aux besoins futurs pour former, recruter ou faire évoluer. Négociation obligatoire dès 300 salariés.", "ceq379": "Depuis la réforme de 2025 (en vigueur au 1er octobre 2026), l'entretien de parcours professionnel a lieu dans la 1re année, puis tous les 4 ans, avec un état des lieux tous les 8 ans. Il porte sur l'évolution et la formation, pas sur la performance.", "ceq382": "Vroom (1964) : motivation = Expectation (mon effort mènera à la performance) × Instrumentalité (la performance sera récompensée) × Valence (la récompense a de la valeur pour moi). Si un terme vaut zéro, la motivation tombe.", "ceq387": "OETH : toute entreprise d'au moins 20 salariés doit employer 6 % de travailleurs handicapés, sinon verser une contribution à l'Agefiph (ou conclure un accord).", "ceq391": "Les forces et faiblesses sont internes (ressources, compétences) ; les opportunités et menaces viennent de l'environnement externe.", "ceq397": "Mintzberg : la stratégie réalisée mêle la stratégie délibérée (planifiée) et une stratégie émergente, née des actions et adaptations au fil de l'eau.", "ceq400": "Intégration horizontale : racheter une entreprise du même métier, au même stade de la filière. Gain : part de marché et économies d'échelle. L'intégration verticale vise l'amont ou l'aval.", "ceq403": "Produire moins cher que les concurrents grâce au volume : économies d'échelle et effet d'expérience. Risque : une guerre des prix ou une innovation qui rend l'avantage inutile.", "ceq407": "Kim et Mauborgne (2005) : au lieu d'affronter les concurrents (océan rouge), on crée une offre nouvelle qui rend la concurrence sans objet (ex. : le Cirque du Soleil).", "ceq413": "Coentreprise : filiale commune détenue par plusieurs partenaires qui partagent coûts, risques et savoir-faire. C'est une forme de croissance conjointe.", "ceq418": "Le donneur d'ordre garde la maîtrise du cahier des charges ; le sous-traitant exécute (loi de 1975). Avantage : flexibilité et coûts ; risque : dépendance et perte de savoir-faire.", "p6q38": "FRNG négatif : les ressources stables ne couvrent même pas les immobilisations, une partie est financée par des dettes à court terme. Situation risquée : il faut renforcer les capitaux propres ou emprunter à long terme.", "p6q33": "FRNG = ressources stables − emplois stables (bilan fonctionnel). Un FRNG positif sert à financer le BFR ; s'il ne suffit pas, la trésorerie nette devient négative.", "p5q55": "Budget de production : ventes prévues + stock final souhaité − stock initial. On produit ce qu'on vend, en ajustant selon l'évolution voulue du stock.", "cgq61": "Mimèsis (Aristote, Poétique) : l'art imite le réel, et cette imitation est naturelle et source de connaissance. Platon, lui, y voit une copie trompeuse.", "cgq93": "Molière, Le Tartuffe (1664-1669) : Tartuffe se fait passer pour un homme pieux afin de manipuler Orgon. La pièce oppose l'apparence et la vérité.", "meq45": "L'E8 est un entretien sur ton dossier : prépare plutôt des exemples précis et tes documents. Un support n'est utile que si le jury l'accepte.", "meq19": "E7 et E8 ont chacune un coefficient de 5 : c'est autant qu'une grosse épreuve écrite. L'E5 écrite reste la plus lourde (coefficient 9)."};
  QS.forEach(x => { if (EX[x.id]) x.e = EX[x.id]; });
  ["p3q22", "p3q8", "p3q12", "p3q29", "p3q18", "p3q36", "p3q16", "p3q37", "p3q78"].forEach(id => HQ.add(id));
  const CHF = {"p3q1": "p3c1", "p3q2": "p3c1", "p3q3": "p3c1", "p3q4": "p3c1", "p3q5": "p3c1", "p3q6": "p3c1", "p3q7": "p3c1", "p3q9": "p3c3", "p3q10": "p3c3", "p3q11": "p3c2", "p3q13": "p3c3", "p3q14": "p3c3", "p3q15": "p3c2", "p3q17": "p3c4", "p3q19": "p3c5", "p3q20": "p3c1", "p3q21": "p3c3", "p3q23": "p3c1", "p3q25": "p3c1", "p3q26": "p3c1", "p3q27": "p3c1"}; QS.forEach(x => { if (!x.ch && CHF[x.id]) x.ch = CHF[x.id]; });
  ["p2q5", "p2q83", "p2q54", "p2q10", "p2q71", "p2q15", "p2q67", "p2q19", "p2q42", "p2q22", "p2q62", "p2q29", "p2q3", "p2q66", "p4q40", "p4q51", "p4q56", "p4q59", "p4q7", "p4q63", "p4q9", "p4q44", "p4q11", "p4q34", "p4q36", "p4q67", "p6q22", "p6q24", "p6q4", "p6q33", "p6q8", "p6q9", "p6q10", "p6q11", "p6q14", "p6q69", "p6q17", "p6q21"].forEach(id => HQ.add(id));
  const CHF2 = {"p6q1": "p6c1", "p2q1": "p2c1", "p2q2": "p2c1", "p2q4": "p2c1", "p2q6": "p2c5", "p2q7": "p2c4", "p2q8": "p2c4", "p2q9": "p2c3", "p2q11": "p2c3", "p2q12": "p2c5", "p2q13": "p2c5", "p2q14": "p2c5", "p2q16": "p2c4", "p2q17": "p2c6", "p2q18": "p2c6", "p2q20": "p2c6", "p2q21": "p2c1", "p2q23": "p2c3", "p2q24": "p2c4", "p2q25": "p2c2", "p2q26": "p2c5", "p2q27": "p2c4", "p2q28": "p2c3", "p4q1": "p4c3", "p4q2": "p4c3", "p4q3": "p4c2", "p4q4": "p4c3", "p4q5": "p4c4", "p4q6": "p4c4", "p4q8": "p4c5", "p4q10": "p4c2", "p4q12": "p4c1", "p4q13": "p4c1", "p4q14": "p4c1", "p4q15": "p4c5", "p4q16": "p4c5", "p4q17": "p4c3", "p4q18": "p4c3", "p4q19": "p4c2", "p4q20": "p4c1", "p4q21": "p4c2", "p4q22": "p4c3", "p4q23": "p4c3", "p4q24": "p4c3", "p4q25": "p4c3", "p4q26": "p4c1", "p4q27": "p4c1", "p4q28": "p4c1", "p6q2": "p6c1", "p6q3": "p6c1", "p6q5": "p6c2", "p6q6": "p6c2", "p6q7": "p6c2", "p6q12": "p6c4", "p6q13": "p6c5", "p6q15": "p6c3", "p6q16": "p6c2", "p6q18": "p6c3", "p6q19": "p6c3", "p6q20": "p6c3"}; QS.forEach(x => { if (!x.ch && CHF2[x.id]) x.ch = CHF2[x.id]; });
  ["p1q8", "p1q26", "p1q28", "p1q59", "p1q7", "p1q9", "p1q100", "p1q82", "p1q14", "p1q15", "p1q16", "p1q17", "p1q21", "p5q1", "p5q3", "p5q4", "p5q6", "p5q16", "p5q17", "p5q60", "p7q1", "p7q20", "p7q4", "p7q6", "p7q10", "p7q11", "p7q12", "p7q14", "p7q17", "p7q22", "p7q23"].forEach(id => HQ.add(id));
  const CHF3 = {"p1q1": "p1c2", "p1q2": "p1c2", "p1q3": "p1c2", "p1q4": "p1c4", "p1q5": "p1c3", "p1q6": "p1c4", "p1q10": "p1c5", "p1q11": "p1c5", "p1q12": "p1c4", "p1q13": "p1c5", "p1q18": "p1c2", "p1q19": "p1c2", "p1q20": "p1c6", "p1q22": "p1c1", "p1q23": "p1c2", "p1q24": "p1c5", "p1q25": "p1c3", "p1q27": "p1c2", "p1q29": "p1c2", "p1q30": "p1c5", "p1q31": "p1c6", "p1q32": "p1c3", "p5q2": "p5c2", "p5q5": "p5c3", "p5q7": "p5c1", "p5q8": "p5c1", "p5q9": "p5c1", "p5q10": "p5c4", "p5q11": "p5c4", "p5q12": "p5c2", "p5q13": "p5c5", "p5q14": "p5c5", "p5q15": "p5c3", "p5q19": "p5c5", "p5q20": "p5c4", "p7q2": "p7c2", "p7q3": "p7c2", "p7q5": "p7c2", "p7q7": "p7c4", "p7q8": "p7c4", "p7q9": "p7c4", "p7q13": "p7c4", "p7q15": "p7c2", "p7q16": "p7c2", "p7q18": "p7c2", "p7q19": "p7c2"};
  QS.forEach(x => { if (!x.ch && CHF3[x.id]) x.ch = CHF3[x.id]; });
  for (let i = QS.length - 1; i >= 0; i--) if (HQ.has(QS[i].id)) QS.splice(i, 1);
  for (let i = FS.length - 1; i >= 0; i--) if (HF.has(FS[i].id)) FS.splice(i, 1);
})();
const isGuest = () => !!window.GL_GUEST;
const lockedCat = c => isGuest() && !!c && !GUEST_CATS.includes(c);
if (isGuest()) { for (let i = QS.length - 1; i >= 0; i--) if (lockedCat(QS[i].c)) QS.splice(i, 1); for (let i = FS.length - 1; i >= 0; i--) if (lockedCat(FS[i].c)) FS.splice(i, 1); }
const QBY = {}, FBY = {};
CATS.forEach(c => { QBY[c.id] = QS.filter(x => x.c === c.id); FBY[c.id] = FS.filter(x => x.c === c.id); });

const LEVELS = [[0, "Stagiaire"], [300, "Assistant comptable"], [1000, "Comptable"], [2500, "Collaborateur"], [5000, "Chef de mission"], [9000, "Expert-comptable"]];
const INTERVALS = [0, 1, 3, 7, 15, 30];

/* ---------- Utilitaires ---------- */
const $ = s => document.querySelector(s);
const h = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dayNum = () => Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

/* ---------- Progression (base de données privée, sinon cet appareil) ---------- */
const LS_KEY = "grand-livre-btscg-v1";
const blank = () => ({ v: 1, xp: 0, st: { d: 0, n: 0 }, q: {}, c: {}, l: {}, u: 0 });
let S = blank();
let ref = null, writing = false, dirty = false, saveTimer = null, tries = 0, syncMode = "local", forceSave = false, syncUid = "";
function keepCopy(x) { try { localStorage.setItem("gl-sync-prev", JSON.stringify({ at: Date.now(), d: x })); } catch (e) {} }
/* Laquelle garder entre la progression de cet appareil et celle du compte ? Jamais une version nettement plus pauvre que l'autre. */
function pickServer(loc, srv, uid) {
  const lx = +(loc && loc.xp) || 0, sx = +(srv && srv.xp) || 0;
  let useSrv = loc.uid !== uid ? !(lx > sx * 1.5 + 50) : (srv.u || 0) > (loc.u || 0);
  if (useSrv && lx > sx * 1.3 + 30) useSrv = false;
  if (!useSrv && sx > lx * 1.3 + 30) useSrv = true;
  return useSrv;
}
/* Fusion de deux progressions : on garde le meilleur de chacune, rien ne se perd */
function mergeS(a, b) {
  const A = migL(JSON.parse(JSON.stringify(a || {}))), B = migL(JSON.parse(JSON.stringify(b || {}))), newer = (A.u || 0) >= (B.u || 0) ? A : B, older = newer === A ? B : A;
  const M = JSON.parse(JSON.stringify(newer)), o = JSON.parse(JSON.stringify(older));
  Object.keys(o).forEach(k => { if (!(k in M)) M[k] = o[k]; });
  ["xpv", "sndv"].forEach(k => { const v = Math.max(+A[k] || 0, +B[k] || 0); if (v) M[k] = v; });
  const each = (k, pick) => { const x = M[k] || {}, y = o[k] || {}; Object.keys(y).forEach(id => { x[id] = id in x ? pick(x[id], y[id]) : y[id]; }); if (Object.keys(x).length) M[k] = x; };
  const byN = (p, q) => (Array.isArray(p) && Array.isArray(q) ? ((q[0] || 0) > (p[0] || 0) ? q : p) : p);
  each("q", byN); each("x", byN); each("cx", byN);
  each("c", (p, q) => (q[0] || 0) > (p[0] || 0) || ((q[0] || 0) === (p[0] || 0) && (q[1] || 0) > (p[1] || 0)) ? q : p);
  each("qd", (p, q) => ({ w: Math.max(p.w || 0, q.w || 0), ok: [...new Set([].concat(p.ok || [], q.ok || []))].sort((m, n) => m - n).slice(-6) }));
  each("h", (p, q) => Math.max(+p || 0, +q || 0));
  each("dwr", (p, q) => ((q && q.n) || 0) > ((p && p.n) || 0) ? q : p);
  each("bb", (p, q) => ((q && q.d) || 0) > ((p && p.d) || 0) ? q : p);
  each("rc", (p, q) => ((q && q[1]) || 0) > ((p && p[1]) || 0) ? q : p);
  ["l", "fr", "frx", "ew", "dlog", "rx"].forEach(k => each(k, p => p));
  each("an", (p, q) => Object.assign({}, q, p, { d: p.d || q.d, t: (p.t || "").length >= (q.t || "").length ? p.t : q.t }));
  each("gc", (p, q) => Object.keys(q.ok || {}).length > Object.keys(p.ok || {}).length ? q : p);
  each("sch", (p, q) => ({ t: Math.max(p.t || 0, q.t || 0), c: Math.max(p.c || 0, q.c || 0), d: Math.max(p.d || 0, q.d || 0) }));
  M.xp = Math.max(+A.xp || 0, +B.xp || 0);
  { const la = A.lmig || {}, lb = B.lmig || {}; M.lmig = {}; new Set([...Object.keys(la), ...Object.keys(lb)]).forEach(c => { M.lmig[c] = Math.max(+la[c] || 1, +lb[c] || 1); }); }
  const sa = A.st || {}, sb = B.st || {}; M.st = (sa.d || 0) > (sb.d || 0) ? sa : (sb.d || 0) > (sa.d || 0) ? sb : { d: sa.d || 0, n: Math.max(sa.n || 0, sb.n || 0) };
  if (A.df || B.df) M.df = Object.assign({}, older.df, newer.df, { best: Math.max((A.df || {}).best || 0, (B.df || {}).best || 0) });
  if (A.dus || B.dus) { const da = A.dus || {}, db = B.dus || {}; M.dus = (da.w || 0) + (da.l || 0) + (da.d || 0) >= (db.w || 0) + (db.l || 0) + (db.d || 0) ? da : db; }
  ["rp", "sit", "packs"].forEach(k => { if (!(M[k] || []).length && (o[k] || []).length) M[k] = o[k]; });
  ["av", "cl", "bts", "pl", "last", "tour"].forEach(k => { if (M[k] == null && o[k] != null) M[k] = o[k]; });
  M.v = 1; M.u = Math.max(A.u || 0, B.u || 0);
  return M;
}
async function adoptServer(why) {
  try { const snap = await ref.get(); if (!snap.exists) return; const d = snap.data(); if (!d || d.v !== 1) return;
    keepCopy(S); S = mergeS(S, d); normS(); S.uid = syncUid; saveLocal(); render(); dirty = true; setTimeout(flush, 500); if (why) toast(why); } catch (e) {}
}

function loadLocal() { try { const r = localStorage.getItem(LS_KEY); if (r) { const o = JSON.parse(r); if (o && o.v === 1) return o; } } catch (e) {} return null; }
function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} }
function touch() {
  S.u = Date.now(); saveLocal();
  if (ref) { dirty = true; clearTimeout(saveTimer); saveTimer = setTimeout(flush, 1800); }
  renderTop();
}
async function flush() {
  if (!ref || writing || !dirty) return;
  writing = true; dirty = false;
  try { const o = JSON.parse(JSON.stringify(S)); if (forceSave) o._f = 1; await ref.set(o); forceSave = false; tries = 0; syncMode = "sync"; }
  catch (e) {
    const code = e && e.code;
    if (code === "conflict") { writing = false; await adoptServer("Ta progression a été récupérée depuis ton compte."); return; }
    if (!code || code === "unavailable" || code === "resource_exhausted" || code === "rate_limited" || !navigator.onLine) { dirty = true; tries++; }
    else { ref = null; syncMode = "local"; }
  }
  writing = false; renderTop();
  if (dirty && ref && navigator.onLine) saveTimer = setTimeout(flush, Math.min(60000, 2500 * Math.pow(2, Math.min(tries, 5))) + Math.random() * 2000);
}
window.addEventListener("online", () => { renderTop(); if (!ref) initSync(); else if (dirty) { tries = 0; flush(); } });
window.addEventListener("offline", () => renderTop());
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && ref && dirty) { clearTimeout(saveTimer); flush(); } });
async function initSync() {
  try {
    if (!window.claude || typeof window.claude.use !== "function") return;
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!db || !user) return;
    const uid = await user.id();
    if (!uid) return;
    const r = db.doc("data/users/" + uid + "/progress");
    const snap = await r.get();
    ref = r; syncMode = "sync"; syncUid = String(uid);
    if (snap.exists) {
      const d = snap.data();
      if (d && d.v === 1) {
        const fresh = !(S.xp > 0) && !Object.keys(S.q || {}).length && !Object.keys(S.l || {}).length;
        if (fresh || JSON.stringify(d) === JSON.stringify(Object.assign({}, S, { uid: d.uid }))) { S = JSON.parse(JSON.stringify(d)); normS(); }
        else { keepCopy(S); S = mergeS(S, d); normS(); dirty = true; } // les deux ont de la progression : on fusionne et on renvoie le tout
        S.uid = syncUid; saveLocal(); render(); if (dirty) flush();
      } else { S.uid = syncUid; saveLocal(); dirty = true; flush(); }
    } else { S.uid = syncUid; saveLocal(); if (S.u) { dirty = true; flush(); } }
    renderTop();
  } catch (e) { ref = null; syncMode = "local"; renderTop(); }
}

/* ---------- Calculs de progression ---------- */
function levelOf(xp) {
  let i = 0; for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k][0]) i = k;
  const next = LEVELS[i + 1];
  return { name: LEVELS[i][1], floor: LEVELS[i][0], next: next ? next[0] : null, nextName: next ? next[1] : null };
}
function bumpStreak() {
  const d = dayNum();
  S.h = S.h || {}; S.h[d] = (S.h[d] || 0) + 1;
  for (const k in S.h) if (+k < d - 400) delete S.h[k];
  if (S.st.d === d) return;
  S.st.n = S.st.d === d - 1 ? S.st.n + 1 : 1; S.st.d = d;
}
function streakNow() { const d = dayNum(); return (S.st.d === d || S.st.d === d - 1) ? S.st.n : 0; }
/* État d'une question : 0 à découvrir, 1 en cours, 2 acquise (juste 2 jours différents, 3 jours d'écart), 3 maîtrisée (3 fois, sur 7 jours ou plus) */
function qState(id) {
  if (!S.q[id]) return 0; const o = (S.qd || {})[id]; if (!o || !o.ok.length) return 1;
  const a = o.ok[0], b = o.ok[o.ok.length - 1];
  return o.ok.length >= 3 && b - a >= 7 ? 3 : o.ok.length >= 2 && b - a >= 3 ? 2 : 1;
}
function cState(id) { const r = S.c[id]; return !r ? 0 : r[0] >= 5 ? 3 : r[0] >= 3 ? 2 : 1; }
const QGAP = [0, 3, 7, 15, 30];
function qDue(id) { const o = (S.qd || {})[id]; if (!o || !o.ok.length) return false; return dayNum() >= o.ok[o.ok.length - 1] + QGAP[Math.min(4, o.ok.length)]; }
function dueQs() { return QS.filter(x => qDue(x.id)); }
/* Contrôles de chapitre : réussi à 80 % deux jours différents, à 3 jours d'écart au moins */
function ctlOf(k) { return ((S.ctl || {})[k]) || []; }
function chapStatus(k) {
  const L = ctlOf(k), pass = [...new Set(L.filter(x => x.pc >= 80).map(x => x.d))].sort((a, b) => a - b), d = dayNum();
  const ok = pass.length >= 2 && pass[pass.length - 1] - pass[0] >= 3, today = L.some(x => x.d === d);
  return { ok, pass, today, tried: L.length, next: pass.length ? pass[0] + 3 : null, best: L.reduce((m, x) => Math.max(m, x.pc), 0) };
}
function ctlChaps(cat) { return (CHBY[cat] || []).filter(c => (QCH[c.id] || []).length >= 4); }
function validCount(cat) { const l = cat ? ctlChaps(cat) : CATS.flatMap(c => ctlChaps(c.id)); return { v: l.filter(c => chapStatus(c.id).ok).length, n: l.length }; }
function dayLabel(dn) { const t = new Date(Date.now() + (dn - dayNum()) * 86400000); return t.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); }
/* ---------- Questions « que faire, et pourquoi » pour les contrôles et les quiz de fiche ---------- */
const deM = m => (/^[aeiouéâ]/i.test(m) ? "d'" : "de ") + m;
const hk36 = t => { let x = 5381; t = String(t); for (let i = 0; i < t.length; i++) x = (x * 33 + t.charCodeAt(i)) >>> 0; return x.toString(36); };
const lc1 = t => t ? t[0].toLowerCase() + t.slice(1) : t;
const FONC_WHY = { "Emplois stables": "Actif immobilisé en valeur brute : ressources durables utilisées plus d'un an.", "Ressources stables": "Capitaux propres, amortissements, dépréciations, provisions et dettes financières : financements durables.", "Actif circulant d'exploitation": "Stocks et créances clients : liés au cycle d'exploitation.", "Actif circulant hors exploitation": "Créances étrangères au cycle d'exploitation (cession d'immobilisation, par exemple).", "Passif circulant d'exploitation": "Dettes fournisseurs, fiscales et sociales nées de l'exploitation.", "Passif circulant hors exploitation": "Dettes étrangères à l'exploitation (fournisseurs d'immobilisations, par exemple).", "Trésorerie active": "Disponibilités et valeurs mobilières de placement.", "Trésorerie passive": "Concours bancaires courants et soldes créditeurs de banque." };
function dwQ(id, c, q, k, why, decs, whyBy, e, amb) {
  const fmtO = (d, w) => `${d} · ${w}`, good = fmtO(k, why), used = new Set([good]), o = [good];
  const add = (d, w) => { const t = fmtO(d, w); if (w && !used.has(t)) { used.add(t); o.push(t); return true; } return false; };
  const okW = w => w !== why && !(amb || []).includes(w);
  shuffle((whyBy[k] || []).filter(okW)).some(w => add(k, w));
  const others = shuffle(decs.filter(d => d !== k));
  for (let r = 0; o.length < 4 && r < 6; r++) { const d = others[r % others.length]; shuffle((whyBy[d] || []).filter(okW)).some(w => add(d, w)); }
  if (o.length < 4 && whyBy._) shuffle(whyBy._).forEach(w => { if (o.length < 4) add(pk(decs), w); });
  if (o.length !== 4) return null;
  const allW = [...new Set([].concat(...Object.values(whyBy)))], wrong = shuffle(allW.filter(okW)).slice(0, 3);
  const two = wrong.length === 3 ? { d: decs.slice(), k, w: [why].concat(wrong) } : null;
  return { id, c, q: two ? q.replace(/,? et pourquoi \?$/, " ?").replace(/ : quelle correction faire \?$/, " : quelle correction faire ?") : q, o, e, two };
}
/* Banques de situations « décision + raison » (contenu aligné sur les fiches) */
const DW_TVA = { decs: ["Déductible", "Non déductible", "Déductible en partie"],
  why: { ok: "Dépense engagée pour des opérations taxées, avec une facture conforme", imm: "Bien d'investissement utilisé pour l'activité taxée", vt: "Véhicule de tourisme : la TVA sur le véhicule et ses frais est exclue", log: "Logement des dirigeants et du personnel : TVA exclue", cad: "Cadeau au-delà de 73 € TTC par bénéficiaire et par an", fac: "Pas de facture conforme : aucun droit à déduction", carb: "Carburant d'un véhicule de tourisme : TVA récupérable à 80 %", cadok: "Cadeau d'au plus 73 € TTC par bénéficiaire et par an", vu: "Véhicule utilitaire : il ouvre droit à déduction" },
  amb: { ok: ["imm", "cadok", "vu"], imm: ["ok", "vu"], vu: ["imm", "ok"], cadok: ["ok"], vt: ["carb"], carb: ["vt"] },
  items: [
    ["Déductible", "ok", "Achat de marchandises destinées à la revente, avec une facture conforme", "Les marchandises servent à réaliser des ventes taxées : TVA déductible."],
    ["Déductible", "imm", "Achat d'un ordinateur pour le service comptable", "Immobilisation utilisée pour l'activité : TVA déductible (compte 44562)."],
    ["Déductible", "vu", "Achat d'une camionnette de livraison", "Les véhicules utilitaires ouvrent droit à déduction, contrairement aux véhicules de tourisme."],
    ["Non déductible", "vt", "Achat d'une voiture de tourisme pour un commercial", "La TVA sur les véhicules de tourisme et leurs frais n'est pas déductible."],
    ["Non déductible", "vt", "Entretien et réparation de la voiture de tourisme du gérant", "Les services liés à un bien exclu (véhicule de tourisme) sont exclus eux aussi."],
    ["Déductible en partie", "carb", "Gazole pour la voiture de tourisme d'un commercial", "Exception pour le carburant des véhicules de tourisme : TVA déductible à 80 %."],
    ["Non déductible", "log", "Loyer d'un appartement mis gratuitement à disposition du directeur", "Le logement des dirigeants et du personnel est exclu du droit à déduction."],
    ["Non déductible", "cad", "Coffret de vins de 150 € TTC offert à un client", "Au-delà de 73 € TTC par bénéficiaire et par an, la TVA sur les cadeaux n'est pas déductible."],
    ["Déductible", "cadok", "Agenda personnalisé de 25 € TTC offert à chaque client", "Cadeau de faible valeur (au plus 73 € TTC par bénéficiaire et par an) : TVA déductible."],
    ["Non déductible", "fac", "Achat de fournitures réglé sur un simple ticket de caisse, sans facture", "Sans facture conforme portant la TVA, pas de déduction possible."]
  ] };
const DW_IMMO = { decs: ["Immobilisation", "Charge"],
  why: { dur: "Bien utilisé durablement, sur plus d'un exercice", acc: "Frais nécessaires pour mettre le bien en état de fonctionner : inclus dans le coût", inc: "Élément incorporel utilisé durablement (immobilisation incorporelle)", pro: "Dépense qui prolonge la durée d'utilisation du bien", tol: "Bien de faible valeur (moins de 500 € HT) : tolérance pour le passer en charge", ent: "Entretien courant : il maintient le bien en état sans augmenter sa durée", srv: "Service consommé pendant l'exercice", form: "Frais de formation : exclus du coût d'acquisition" },
  amb: { dur: ["pro"], pro: ["dur"], srv: ["ent"], ent: ["srv"] },
  items: [
    ["Immobilisation", "dur", "Achat d'une machine de production utilisée 8 ans", "Bien identifiable, contrôlé et utilisé plus d'un exercice : compte 2154."],
    ["Immobilisation", "acc", "Frais de transport et d'installation de cette machine", "Frais accessoires indispensables à la mise en service : ils s'ajoutent au coût d'acquisition."],
    ["Immobilisation", "inc", "Achat d'une licence de logiciel de paie utilisée plusieurs années", "Logiciel acquis et utilisé durablement : immobilisation incorporelle (compte 205)."],
    ["Immobilisation", "pro", "Remplacement du moteur d'un camion, qui prolonge sa durée d'utilisation de 3 ans", "La dépense prolonge la durée d'utilisation : elle s'immobilise, ce n'est pas de l'entretien."],
    ["Charge", "tol", "Achat d'une agrafeuse électrique à 120 € HT", "Petit matériel de moins de 500 € HT : tolérance pour le passer directement en charge."],
    ["Charge", "ent", "Vidange et changement des pneus du camion", "Entretien courant : charge de l'exercice (compte 615)."],
    ["Charge", "srv", "Abonnement mensuel à un logiciel en ligne", "Service consommé chaque mois : charge (compte 6xx), pas un bien que l'entreprise contrôle."],
    ["Charge", "form", "Formation du personnel à l'utilisation de la nouvelle machine", "Les frais de formation sont exclus du coût d'acquisition : charge de l'exercice."]
  ] };
const DW_CV = { decs: ["Charge variable", "Charge fixe"],
  why: { v: "Elle suit les quantités produites ou vendues", f: "Elle ne dépend pas du volume d'activité à court terme", vx: "Elle dépend du temps écoulé, pas de l'activité", fx: "Elle augmente avec chaque produit vendu" },
  amb: {},
  items: [
    ["Charge variable", "v", "Matières premières consommées par la production", "Plus on produit, plus on consomme de matières : charge variable."],
    ["Charge variable", "v", "Commissions des commerciaux, calculées en % du chiffre d'affaires", "Elles évoluent avec les ventes : charge variable."],
    ["Charge variable", "v", "Emballages des produits vendus", "Un emballage par produit vendu : charge variable."],
    ["Charge variable", "v", "Transport des marchandises livrées aux clients", "Il suit le volume livré : charge variable."],
    ["Charge fixe", "f", "Loyer de l'entrepôt", "Le loyer est le même quel que soit le volume vendu : charge fixe."],
    ["Charge fixe", "f", "Dotation aux amortissements linéaires des machines", "Montant identique chaque année, indépendant de la production : charge fixe."],
    ["Charge fixe", "f", "Salaire mensuel fixe de la comptable", "Il ne varie pas avec l'activité : charge fixe (charge de structure)."],
    ["Charge fixe", "f", "Prime d'assurance annuelle des locaux", "Montant fixé au contrat, indépendant des ventes : charge fixe."]
  ] };
const DW_CDD = { decs: ["CDD possible", "CDD interdit"],
  why: { rem: "Remplacement d'un salarié absent : motif autorisé", acc: "Accroissement temporaire d'activité : motif autorisé", sai: "Emploi saisonnier : motif autorisé", perm: "Emploi durable lié à l'activité normale et permanente : il faut un CDI", gr: "Remplacer un salarié gréviste est interdit", dang: "Certains travaux particulièrement dangereux sont interdits en CDD" },
  amb: {}, items: [
    ["CDD possible", "rem", "Embaucher une comptable pendant le congé maternité de la titulaire du poste", "Le remplacement d'un salarié absent est un motif de recours au CDD."],
    ["CDD possible", "acc", "Renforcer l'équipe pendant 3 mois pour honorer une grosse commande exceptionnelle", "Accroissement temporaire d'activité : motif autorisé, avec un écrit précisant ce motif."],
    ["CDD possible", "sai", "Recruter des cueilleurs pour les vendanges", "Emploi saisonnier : travaux qui reviennent chaque année à la même période."],
    ["CDD interdit", "perm", "Pourvoir le poste d'assistant comptable, nécessaire toute l'année, avec des CDD successifs", "Un CDD ne peut pas pourvoir durablement un emploi lié à l'activité normale et permanente : risque de requalification en CDI."],
    ["CDD interdit", "gr", "Embaucher pour remplacer des salariés en grève", "Le Code du travail interdit le CDD pour remplacer un salarié gréviste."],
    ["CDD interdit", "dang", "Embaucher pour des travaux exposant à certains agents chimiques très dangereux figurant sur une liste réglementaire", "Ces travaux particulièrement dangereux sont interdits aux salariés en CDD."]
  ] };
const DW_FAUTE = { decs: ["Faute simple", "Faute grave", "Faute lourde"],
  why: { s: "Elle justifie le licenciement, mais le salarié peut rester pendant le préavis", g: "Elle rend impossible le maintien du salarié dans l'entreprise, même pendant le préavis", l: "Elle est commise avec l'intention de nuire à l'employeur" },
  extra: ["Elle doit avoir été commise au moins trois fois", "Elle dépend de l'ancienneté du salarié"],
  amb: {}, items: [
    ["Faute simple", "s", "Retards répétés de quelques minutes malgré un avertissement", "Comportement fautif qui justifie un licenciement, sans empêcher l'exécution du préavis."],
    ["Faute simple", "s", "Refus ponctuel d'effectuer une tâche relevant de ses fonctions", "Insubordination isolée : cause réelle et sérieuse, préavis et indemnité de licenciement maintenus."],
    ["Faute grave", "g", "Coups portés à un collègue sur le lieu de travail", "Violences au travail : le salarié ne peut pas rester, même le temps du préavis. Pas d'indemnité de licenciement ni de préavis."],
    ["Faute grave", "g", "Conduite d'un chariot élévateur en état d'ivresse", "Danger pour soi et pour les autres : maintien impossible dans l'entreprise."],
    ["Faute lourde", "l", "Transmettre volontairement le fichier clients à un concurrent pour nuire à son employeur", "L'intention de nuire à l'employeur caractérise la faute lourde."],
    ["Faute lourde", "l", "Saboter volontairement une machine pour bloquer la production et nuire à l'entreprise", "Acte délibéré destiné à nuire : faute lourde."]
  ] };
const DW_MODIF = { decs: ["Modification du contrat", "Changement des conditions de travail"],
  why: { m: "Elle touche un élément essentiel du contrat : l'accord du salarié est obligatoire", c: "Elle relève du pouvoir de direction : l'employeur peut l'imposer" },
  extra: ["Toute décision de l'employeur exige l'accord écrit du salarié", "Seul le CSE peut l'autoriser"],
  amb: {}, items: [
    ["Modification du contrat", "m", "Baisse du salaire de base de 5 %", "La rémunération est un élément essentiel : sans l'accord du salarié, l'employeur ne peut pas la baisser."],
    ["Modification du contrat", "m", "Mutation définitive de Toulon à Lyon, sans clause de mobilité", "Lieu de travail hors du secteur géographique : élément essentiel, accord obligatoire. Le refus n'est pas une faute."],
    ["Modification du contrat", "m", "Passage d'un temps plein à un temps partiel", "La durée du travail est un élément essentiel du contrat."],
    ["Modification du contrat", "m", "Nouvelles fonctions relevant d'une qualification inférieure", "La qualification est un élément essentiel du contrat."],
    ["Changement des conditions de travail", "c", "Horaires décalés d'une heure dans la journée (8 h - 16 h au lieu de 9 h - 17 h)", "Changer les horaires dans la journée relève du pouvoir de direction : le refus peut être une faute."],
    ["Changement des conditions de travail", "c", "Déménagement du bureau dans une commune voisine, dans le même secteur géographique", "Lieu dans le même secteur : simple changement des conditions de travail."],
    ["Changement des conditions de travail", "c", "Nouvelle tâche correspondant à la qualification du salarié", "Tâches de même qualification : pouvoir de direction de l'employeur."]
  ] };
const DW_VICE = { decs: ["Contrat valable", "Contrat annulable"],
  why: { err: "Erreur sur une qualité essentielle de la prestation", dol: "Dol : manœuvres, mensonge ou silence volontaire pour obtenir l'accord", vio: "Violence : contrainte physique ou morale, y compris l'abus de dépendance", inc: "Incapacité : une partie n'a pas la capacité de contracter", val: "Erreur sur la valeur : ce n'est pas une cause de nullité", mot: "Erreur sur un simple motif personnel, non intégré au contrat : pas une cause de nullité" },
  amb: { err: ["dol"], dol: ["err"], val: ["mot"], mot: ["val"] }, items: [
    ["Contrat annulable", "err", "Achat d'un tableau présenté comme un original alors que c'est une copie", "Erreur sur une qualité essentielle (l'authenticité) : vice du consentement, nullité relative."],
    ["Contrat annulable", "dol", "Le vendeur cache volontairement que la voiture a été gravement accidentée, information déterminante pour l'acheteur", "Réticence dolosive : silence volontaire sur une information déterminante."],
    ["Contrat annulable", "vio", "Signature obtenue sous la menace de révéler des faits de la vie privée", "Contrainte morale : violence, vice du consentement."],
    ["Contrat annulable", "vio", "Un fournisseur unique impose un prix excessif en profitant de la dépendance de son client", "Abus de l'état de dépendance pour obtenir un avantage excessif : assimilé à la violence."],
    ["Contrat annulable", "inc", "Achat d'une moto par un mineur non émancipé, sans ses parents", "Le mineur non émancipé n'a pas la capacité de conclure seul un tel contrat."],
    ["Contrat valable", "val", "Achat d'un ordinateur payé 15 % plus cher que chez un concurrent", "L'erreur sur la valeur, sans erreur sur les qualités essentielles, n'entraîne pas la nullité."],
    ["Contrat valable", "mot", "Achat d'un appartement pour se rapprocher d'un emploi finalement refusé, sans que ce motif figure au contrat", "Un motif personnel non intégré au contrat n'est pas une cause de nullité."]
  ] };
const DW_RESP = { decs: ["Responsabilité contractuelle", "Responsabilité extracontractuelle"],
  why: { c: "Inexécution ou mauvaise exécution d'un contrat entre l'auteur et la victime", fp: "Fait personnel : une faute cause un dommage à un tiers, hors contrat", fc: "Fait des choses : dommage causé par une chose dont on a la garde", fa: "Fait d'autrui : l'employeur répond des dommages causés par son salarié" },
  extra: ["Il faut d'abord une condamnation pénale"],
  amb: {}, items: [
    ["Responsabilité contractuelle", "c", "Le fournisseur livre une marchandise non conforme à la commande", "Les parties sont liées par un contrat de vente mal exécuté : responsabilité contractuelle."],
    ["Responsabilité contractuelle", "c", "Le prestataire informatique ne répare pas le serveur dans le délai prévu au contrat", "Retard dans l'exécution d'une obligation contractuelle."],
    ["Responsabilité contractuelle", "c", "L'expert-comptable commet une erreur dans la déclaration fiscale de son client", "Mauvaise exécution de la lettre de mission : responsabilité contractuelle."],
    ["Responsabilité extracontractuelle", "fp", "Un concurrent dénigre publiquement les produits de l'entreprise", "Aucun contrat entre eux : faute personnelle (concurrence déloyale), dommage, lien de causalité."],
    ["Responsabilité extracontractuelle", "fc", "L'enseigne mal fixée d'un magasin tombe sur un passant", "Le magasin est gardien de l'enseigne : responsabilité du fait des choses."],
    ["Responsabilité extracontractuelle", "fa", "Le salarié d'une entreprise de travaux brise la vitrine du commerce voisin du chantier", "L'employeur (commettant) répond du dommage causé par son préposé dans ses fonctions."]
  ] };
const DW_RGPD = { decs: ["Donnée personnelle", "Pas une donnée personnelle"],
  why: { id: "Elle permet d'identifier une personne physique, directement ou indirectement", no: "Elle ne permet d'identifier aucune personne physique" },
  extra: ["Elle est publique, donc le RGPD ne s'applique pas", "Seules les données sensibles (santé, religion…) sont personnelles"],
  amb: {}, items: [
    ["Donnée personnelle", "id", "Nom et prénom d'un client", "Identification directe d'une personne physique."],
    ["Donnée personnelle", "id", "Adresse e-mail professionnelle prenom.nom@entreprise.fr", "Même professionnelle, elle identifie une personne : donnée personnelle."],
    ["Donnée personnelle", "id", "Numéro de client dans le logiciel de facturation", "Il permet de retrouver la personne indirectement : donnée personnelle."],
    ["Donnée personnelle", "id", "Adresse IP d'un visiteur du site", "Identification indirecte : donnée personnelle."],
    ["Donnée personnelle", "id", "Photo d'un salarié publiée sur l'intranet", "L'image identifie directement la personne."],
    ["Pas une donnée personnelle", "no", "Nombre total de clients par région, sans aucun nom", "Statistique agrégée : aucune personne physique n'est identifiable."],
    ["Pas une donnée personnelle", "no", "Chiffre d'affaires d'une société de 200 salariés", "Information sur une personne morale : le RGPD protège les personnes physiques."]
  ] };
const NAT_RE = /Classe \d · (actif|passif|charge|produit|capitaux propres)/i, NAT = { actif: "Actif (bilan)", passif: "Passif (bilan)", "capitaux propres": "Passif (bilan)", charge: "Charge (compte de résultat)", produit: "Produit (compte de résultat)" };
function dwBank(B, pre, c, qf, n) {
  const whyBy = {}; B.items.forEach(x => { (whyBy[x[0]] = whyBy[x[0]] || []); if (!whyBy[x[0]].includes(B.why[x[1]])) whyBy[x[0]].push(B.why[x[1]]); });
  if (B.extra) whyBy._ = B.extra.slice();
  Object.keys(B.why).forEach(k => { if (!B.items.some(x => x[1] === k)) { const d = /x$/.test(k) ? (k === "vx" ? "Charge variable" : "Charge fixe") : null; if (d) whyBy[d].push(B.why[k]); } });
  return shuffle(B.items).map((x, i) => dwQ(pre + "-" + hk36(x[2]), c, qf(x[2]), x[0], B.why[x[1]], B.decs, whyBy, x[3], (B.amb[x[1]] || []).map(w => B.why[w]))).filter(Boolean).slice(0, n);
}
function natQs(ch, n) {
  return shuffle(REFS.filter(r => r[2] === ch && NAT_RE.test(r[3]))).slice(0, n).map((r, i) => { const nat = NAT[r[3].match(NAT_RE)[1].toLowerCase()], all = [...new Set(Object.values(NAT))];
    return { id: "gx-na-" + hk36(r[0]), c: r[1], q: `Le compte ${r[0]} est un compte :`, o: [nat].concat(all.filter(a => a !== nat)), e: `${r[0]} : ${r[3]}. ${r[4]}` }; });
}
const CTLX = {
  p1c3: n => dwBank(DW_TVA, "gx-tv", "p1", t => `« ${t} » : la TVA est-elle déductible, et pourquoi ?`, n),
  p2c1: n => dwBank(DW_IMMO, "gx-im", "p2", t => `« ${t} » : charge ou immobilisation, et pourquoi ?`, n),
  p4c1: n => shuffle(dwBank(DW_CDD, "gx-cd", "p4", t => `« ${t} » : CDD possible ou interdit ?`, n).concat(dwBank(DW_FAUTE, "gx-fa", "p4", t => `« ${t} » : quel type de faute ?`, n))).slice(0, n),
  t5c2: n => dwBank(DW_MODIF, "gx-mo", "ce", t => `« ${t} » : modification du contrat ou changement des conditions de travail ?`, n),
  t1c3: n => dwBank(DW_VICE, "gx-vi", "ce", t => `« ${t} » : le contrat est-il valable ?`, n),
  t3c3: n => dwBank(DW_RESP, "gx-re", "ce", t => `« ${t} » : quel type de responsabilité ?`, n),
  t4c3: n => dwBank(DW_RGPD, "gx-dp", "ce", t => `« ${t} » : est-ce une donnée personnelle ?`, n),
  p7c4: n => dwBank(DW_RGPD, "gx-dq", "p7", t => `« ${t} » : est-ce une donnée personnelle ?`, n),
  p5c3: n => dwBank(DW_CV, "gx-cv", "p5", t => `« ${t} » : charge variable ou charge fixe, et pourquoi ?`, n),
  p3c2(n) {
    const R = "Réintégrer", D = "Déduire", Z = "Aucune correction", P = RD_P(R, D, Z), by = {};
    P.forEach(x => { (by[x[0]] = by[x[0]] || new Set()).add(RD_W[x[1]]); }); const whyBy = {}; Object.keys(by).forEach(d => whyBy[d] = [...by[d]]);
    return shuffle(P).map((x, i) => dwQ("gx-rd-" + hk36(x[2]), "p3", `Tableau 2058-A. « ${x[2]} » : quelle correction faire, et pourquoi ?`, x[0], RD_W[x[1]], [R, D, Z], whyBy, x[3], (RD_AMB[x[1]] || []).map(w => RD_W[w]))).filter(Boolean).slice(0, n);
  },
  p3c1(n) { const a = CTLX.p3c1ex(n), b = dwBank(DW_TVA, "gx-tw", "p3", t => `« ${t} » : la TVA est-elle déductible, et pourquoi ?`, n); return shuffle(a.slice(0, Math.ceil(n / 2)).concat(b.slice(0, n))).slice(0, n); },
  p3c1ex(n) {
    const g = GENS.find(z => z.id === "p3exig"); if (!g) return []; const ops = []; let M0 = null;
    for (let t = 0; t < 40 && ops.length < 7; t++) { const m = g.make(); if (M0 == null) M0 = m._M; if (m._M !== M0) continue; (m._ops || []).forEach(o => { if (!ops.some(p => p.why === o.why)) ops.push(Object.assign({ M: m._M }, o)); }); }
    const whyBy = { Oui: [...new Set(ops.filter(o => o.k === "Oui").map(o => o.why))], Non: [...new Set(ops.filter(o => o.k === "Non").map(o => o.why))] };
    return shuffle(ops).map((o, i) => dwQ("gx-ex-" + hk36(o.why.replace(/\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\b/g, "M")), "p3", `Régime réel normal. La TVA de cette opération va-t-elle sur la déclaration ${deM(o.M)} ? ${o.t}`, o.k, o.why, ["Oui", "Non"], whyBy, o.why + " Règle : biens à la livraison, services à l'encaissement (acomptes compris), sauf option pour les débits.")).filter(Boolean).slice(0, n);
  },
  p6c2(n) {
    const g = GENS.find(z => z.id === "p6fonc"); if (!g) return []; const it = (g.make()._it || []).filter(x => x[2] !== 0 || true), cats = Object.keys(FONC_WHY);
    return shuffle(it).slice(0, n).map((x, i) => ({ id: "gx-bf-" + hk36(x[0]), c: "p6", q: `Bilan fonctionnel : dans quelle masse classer « ${x[0]} » ?`, o: [x[1]].concat(shuffle(cats.filter(c => c !== x[1])).slice(0, 3)), e: FONC_WHY[x[1]] || "" }));
  }
};
function ctlExtra(ch, n) { try { const a = CTLX[ch] ? CTLX[ch](n) : [], b = natQs(ch, n); return shuffle(a.concat(a.length ? b.slice(0, 1) : b)).slice(0, n); } catch (e) { return []; } }
function startCtl(k) {
  const pool = QCH[k] || []; if (pool.length < 4 || chapStatus(k).today) return;
  const ex = ctlExtra(k, 3), items = shuffle(shuffle(pool).slice(0, 10 - ex.length).concat(ex)); startRun(items, "exam"); if (!R) return;
  R.ctrl = k; R.end = Date.now() + items.length * 75 * 1000; render();
}
function mastery(cat) {
  const qs = cat ? QBY[cat] : QS, fs = cat ? FBY[cat] : FS;
  let m = 0;
  qs.forEach(x => { if (qState(x.id) >= 2) m++; });
  fs.forEach(x => { if (cState(x.id) >= 2) m++; });
  return { m, t: qs.length + fs.length };
}
function dueCards(cats, useChap) {
  const d = dayNum();
  const pool = FS.filter(x => (!cats || cats.includes(x.c)) && (!useChap || chapOk(x)));
  const reviews = pool.filter(x => S.c[x.id] && S.c[x.id][1] <= d);
  const fresh = pool.filter(x => !S.c[x.id]);
  return { reviews, fresh };
}
/* Réponses « décider et justifier » : gardées pour le suivi du prof (situation, décision ratée, raison ratée, piège choisi) */
function dwRecord(item, ok, pickTxt) {
  S.dwr = S.dwr || {}; const o = S.dwr[item.id] || (S.dwr[item.id] = { n: 0, ok: 0, de: 0, we: 0, p: {} });
  o.t = String(item.q).slice(0, 220); o.c = item.c; o.g = item.two ? `${item.two.k} · ${item.two.w[0]}` : String(item.o[0]);
  o.n++; if (ok) o.ok++; else { if (item.two) { if (!item._dOk) o.de++; if (!item._wOk) o.we++; } if (pickTxt && pickTxt !== o.g) { o.p[pickTxt] = (o.p[pickTxt] || 0) + 1; const ks = Object.keys(o.p); if (ks.length > 6) delete o.p[ks.sort((a, b) => o.p[a] - o.p[b])[0]]; } }
  o.d = dayNum();
}
function recordQ(item, ok, pickTxt) {
  if (String(item.id)[0] === "g") { if (ok) S.xp += 6; bumpStreak(); if (/^gx-/.test(item.id)) dwRecord(item, ok, pickTxt); return; }
  const r = S.q[item.id] || [0, 0, 0];
  wlog("q", item.c); if (S.ew && S.ew[item.id]) wlog("err", "all");
  S.q[item.id] = [r[0] + 1, r[1] + (ok ? 1 : 0), ok ? 1 : 0];
  const before = qState(item.id); let fresh = false;
  { const d = dayNum(); S.qd = S.qd || {}; const o = S.qd[item.id] || (S.qd[item.id] = { w: 0, ok: [] });
    if (ok) { if (o.w !== d && !o.ok.includes(d)) { fresh = true; o.ok.push(d); if (o.ok.length > 6) o.ok.shift(); } }
    else { o.w = d; o.ok = []; } }
  if (!ok) { S.ew = S.ew || {}; S.ew[item.id] = { t: pickTxt || "", d: dayNum() }; }
  else { S.xp += fresh ? 5 : 1; const after = qState(item.id), live = view === "run" && R && R.mode === "quiz";
    if (after >= 2 && after > before) { S.xp += after === 3 ? 30 : 20; if (live) setTimeout(() => fxStamp(after === 3 ? "Maîtrisée" : "Acquise", "Question validée"), 120); }
    else if (live && r[0] > r[1] && r[2] === 0) setTimeout(() => fxStamp("Lettré", "Erreur corrigée"), 120); }
  bumpStreak();
}
function recordC(item, knew) {
  const r = S.c[item.id] || [0, 0];
  const box = knew === "hard" ? Math.max(1, r[0]) : knew ? Math.min(5, r[0] + 1) : 0;
  S.c[item.id] = [box, dayNum() + (knew === "hard" ? 1 : INTERVALS[box])];
  S.xp += knew === "hard" ? 1 : knew ? 4 : 0; dayLog().c++; wlog("c", "all"); if (dayLog().c >= 10) plCardDay(); bumpStreak();
}

/* ---------- Vues ---------- */
let view = "home";
let R = null;        // session de quiz ou d'examen
let C = null;        // session de cartes
let examTick = null;
let quizSel = [];    // matières choisies pour le quiz
let quizLen = 10;
let cardSel = [];
const PREF_DEF = { theme: "light", fs: "m", motion: "on", vib: "on", snd: "on", gt: "on", qlen: 10, clen: 30, name: "" };
/* Effets : sons, tampon, XP, niveau, visite guidée */
const fxOn = () => !document.documentElement.classList.contains("no-motion") && !(typeof RM !== "undefined" && RM);
let lastPt = { x: 0, y: 0, t: 0 };
document.addEventListener("pointerdown", e => { lastPt = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
document.addEventListener("keydown", () => { lastPt = { x: innerWidth / 2, y: innerHeight / 2, t: Date.now() }; }, true);
let AC = null;
/* Petits sons d'interface, synthétisés à la volée (aucun fichier audio).
   Timbre doux type carillon / marimba : sinusoïde + harmoniques faibles, filtre passe-bas, attaque lente et légère réverbération. */
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12); // numéro MIDI → Hz
// [note MIDI, départ (s), durée (s), volume, glissement en demi-tons]
const TONES = {
  ok: [[76, 0, .45, .07], [83, .09, .6, .07]],
  ko: [[64, 0, .35, .05], [60, .12, .5, .05]],
  stamp: [[48, 0, .35, .09], [43, .06, .5, .07]],
  lvl: [[72, 0, .5, .06], [76, .11, .5, .06], [79, .22, .5, .06], [84, .33, .9, .07]],
  xp: [[88, 0, .25, .035], [95, .06, .35, .03]],
  tick: [[91, 0, .08, .028]],
  pop: [[72, 0, .3, .075, 7]],
  unpop: [[79, 0, .28, .06, -7]],
  nav: [[84, 0, .24, .04], [88, .05, .32, .035]],
  open: [[67, 0, .42, .055, 5]],
  notif: [[79, 0, .6, .06], [86, .13, .9, .05]],
  soft: [[81, 0, .32, .045]],
  warn: [[81, 0, .35, .04], [81, .18, .4, .035]],
  go: [[79, 0, .4, .06], [91, .1, .7, .06]]
};
function audioOut() { // sortie commune : compresseur doux + petite réverbération
  if (audioOut.n) return audioOut.n;
  const comp = AC.createDynamicsCompressor(); comp.threshold.value = -24; comp.ratio.value = 3; comp.connect(AC.destination);
  const dry = AC.createGain(); dry.gain.value = .85; dry.connect(comp);
  const len = Math.floor(AC.sampleRate * 1.1), ir = AC.createBuffer(2, len, AC.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  const rev = AC.createConvolver(); rev.buffer = ir; const wet = AC.createGain(); wet.gain.value = .22; rev.connect(wet); wet.connect(comp);
  const lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3800; lp.Q.value = .3; lp.connect(dry); lp.connect(rev);
  return audioOut.n = lp;
}
function chime(out, f, t, d, vol, glide) {
  [[1, 1], [2, .28], [3, .07], [4.2, .03]].forEach(([m, a]) => { // harmoniques légèrement inharmoniques : timbre de petite cloche
    const o = AC.createOscillator(), g = AC.createGain(); o.type = "sine"; o.frequency.setValueAtTime(f * m, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(f * m * Math.pow(2, glide / 12), t + Math.min(.12, d * .5));
    const dd = d / Math.sqrt(m); // les aigus s'éteignent plus vite
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol * a, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dd);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dd + .05); });
}
function tone(kind) {
  if ((S.pref || PREF_DEF).snd !== "on") return;
  const now = performance.now();
  if (kind !== "tick") tone.n = (tone.n || 0) + 1;
  else if (now - (tone.lt || 0) < 60) return;
  tone.lt = now;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume();
    const out = audioOut(), t = AC.currentTime + .01;
    if (kind === "flip") { // feuille qui glisse : souffle filtré, sans claquement
      const len = Math.floor(AC.sampleRate * .16), buf = AC.createBuffer(1, len, AC.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain();
      f.type = "bandpass"; f.Q.value = .7; f.frequency.setValueAtTime(700, t); f.frequency.exponentialRampToValueAtTime(1900, t + .14);
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.08, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .16);
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(out); src.start(t); return;
    }
    (TONES[kind] || []).forEach(([n, st, d, vol, gl]) => chime(out, NOTE(n), t + st, d, vol, gl));
  } catch (e) {}
}
function secTick(ms, key) { // tic-tac discret sur les 5 dernières secondes d'un chrono
  const sec = Math.ceil(ms / 1000); if (ms <= 0 || sec > 5 || secTick[key] === sec) return; secTick[key] = sec; tone("tick"); }
function fxStamp(txt, sub) {
  buzz([12, 50, 30]); tone("stamp");
  { toast(txt + (sub ? " : " + sub : "")); return; }
  document.querySelectorAll(".fx-stamp").forEach(x => x.remove());
  const el = document.createElement("div"); el.className = "fx-stamp"; el.setAttribute("role", "status");
  el.innerHTML = `<span><b>${h(txt)}</b>${sub ? `<small>${h(sub)}</small>` : ""}</span>`;
  document.body.appendChild(el); setTimeout(() => el.remove(), 1600);
}
function confettiBurst(n) { return; /* retiré : DESIGN.md */ }
function confettiBurstOld(n) {
  if (!fxOn()) return;
  const box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
  const cols = ["#ffd66b", "#2c43c6", "#1d8a4e", "#e0a31f", "#c23a46", "#5b6cff"];
  for (let i = 0; i < n; i++) { const c = document.createElement("i"); c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % cols.length]; c.style.animationDelay = Math.random() * .5 + "s"; c.style.animationDuration = 1.8 + Math.random() * 1.4 + "s"; c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px"); c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg"); box.appendChild(c); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 3800);
}
function xpFx(gain, from) {
  const el = document.getElementById("xpTop"); if (!el) return;
  tone("xp");
  if (!fxOn()) return;
  const r = el.getBoundingClientRect(), vis = r.bottom > 0 && r.width > 0;
  const f = document.createElement("div"); f.className = "fx-xp"; f.textContent = "+" + gain + " XP"; f.setAttribute("aria-hidden", "true");
  const x0 = lastPt.x || innerWidth / 2, y0 = lastPt.y || innerHeight / 2;
  const x1 = vis ? r.left + r.width / 2 : x0, y1 = vis ? r.top + r.height / 2 : Math.max(10, y0 - 120);
  f.style.left = x0 + "px"; f.style.top = y0 + "px"; document.body.appendChild(f);
  requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transform = `translate(${x1 - x0}px, ${y1 - y0}px) scale(.7)`; f.style.opacity = vis ? ".2" : "0"; }));
  setTimeout(() => f.remove(), 950);
  const t0 = performance.now(), to = from + gain;
  const step = now => { const k = Math.min(1, (now - t0) / 700); el.textContent = Math.round(from + gain * (1 - Math.pow(1 - k, 3))) + " XP"; if (k < 1) requestAnimationFrame(step); else { el.textContent = to + " XP"; el.parentNode.classList.remove("bump"); void el.offsetWidth; el.parentNode.classList.add("bump"); } };
  requestAnimationFrame(step);
}
function levelUpFx(L) {
  document.querySelectorAll(".fx-lvl").forEach(x => x.remove());
  tone("lvl"); buzz([30, 60, 30, 60, 90]);
  const idx = LEVELS.findIndex(l => l[1] === L.name), name = (S.pref && S.pref.name) || window.GL_NAME || "";
  const el = document.createElement("div"); el.className = "fx-lvl" + (fxOn() ? "" : " still");
  el.innerHTML = `<div class="fx-lvl-box" role="dialog" aria-modal="true" aria-labelledby="lvlT">
    <div class="fx-lvl-card"><div class="fx-lvl-in">
      <div class="fx-lvl-f"><span>Niveau</span><b>${idx + 1}</b><small>sur ${LEVELS.length}</small></div>
      <div class="fx-lvl-b"><span class="eyebrow">Cabinet Grand Livre</span><h2 id="lvlT">${h(L.name)}</h2>${name ? `<p>${h(name)}</p>` : ""}<small>BTS Comptabilité et gestion</small></div>
    </div></div>
    <p class="fx-lvl-msg"><b>Nouveau titre !</b> ${L.next ? `Prochain : ${h(L.nextName.toLowerCase())} à ${L.next} XP.` : "C'est le niveau maximum : bravo."}</p>
    <button class="btn primary" data-act="lvlClose">Continuer</button></div>`;
  el.addEventListener("click", e => { if (e.target === el) el.remove(); });
  document.body.appendChild(el); confettiBurst(90);
  const b = el.querySelector(".btn"); if (b) setTimeout(() => b.focus(), 50);
}
/* Visite guidée */
const TOUR = [
  [".plan", "Ta séance du jour", "Trois étapes, environ 20 minutes. Le bouton « Commencer la séance » les enchaîne pour toi."],
  ['[data-nav="ex"]', "S'entraîner", "Quiz, exercices chiffrés, cas guidés, annales et rédactions, rangés par onglet. Ton cahier des erreurs est là aussi."],
  ['[data-nav="amis"]', "Amis", "Ajoute tes camarades avec leur code ami, compare vos semaines, défie-les en duel ou révisez ensemble en direct."],
  ['[data-nav="bts"]', "Mon BTS", "Le compte à rebours, le poids de chaque épreuve et ton équilibre de révision."],
  [".who", "Ton niveau", "Tu gagnes des XP en répondant juste. Une question réussie deux jours différents devient acquise : tampon !"]
];
let tourI = -1;
const visEl = sel => [...document.querySelectorAll(sel)].find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden"; });
function tourShow() {
  document.querySelectorAll(".tour").forEach(x => x.remove());
  if (tourI < 0 || tourI >= TOUR.length) return;
  const [sel, t, txt] = TOUR[tourI], tg = visEl(sel);
  if (!tg) { tourI++; return tourShow(); }
  const r0 = tg.getBoundingClientRect();
  if (r0.top < 60 || r0.bottom > innerHeight - 90) { tg.scrollIntoView({ block: "center" }); }
  const r = tg.getBoundingClientRect(), pad = 6;
  const el = document.createElement("div"); el.className = "tour";
  const big = r.height > innerHeight * .45;
  el.innerHTML = `<div class="tour-hole" style="left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + 2 * pad}px;height:${Math.min(r.height, innerHeight * .45) + 2 * pad}px"></div>
    <div class="tour-tip" role="dialog" aria-labelledby="tourT"><span class="eyebrow">${tourI + 1} sur ${TOUR.length}</span><b id="tourT">${h(t)}</b><p>${h(txt)}</p>
    <div class="row"><button class="btn small" data-act="tourEnd">Passer</button><button class="btn small primary" data-act="tourNext">${tourI === TOUR.length - 1 ? "C'est parti" : "Suivant"}</button></div></div>`;
  document.body.appendChild(el);
  const tip = el.querySelector(".tour-tip"), tw = Math.min(320, innerWidth - 32), below = r.top + Math.min(r.height, innerHeight * .45) + 16;
  tip.style.width = tw + "px";
  tip.style.left = Math.max(16, Math.min(innerWidth - tw - 16, r.left + r.width / 2 - tw / 2)) + "px";
  const th = tip.offsetHeight;
  tip.style.top = (below + th < innerHeight - 8 && !big ? below : Math.max(12, r.top - th - 16)) + "px";
  const nb = tip.querySelector(".primary"); if (nb) nb.focus({ preventScroll: true });
}
function tourStart() { if (tourI >= 0) return; tourI = 0; tourShow(); }
function tourEnd() { tourI = -1; document.querySelectorAll(".tour").forEach(x => x.remove()); S.tour = 1; touch(); }
window.addEventListener("resize", () => { if (tourI >= 0) tourShow(); });
function buzz(p) { try { if ((S.pref || PREF_DEF).vib !== "off" && navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
function P() { S.pref = Object.assign({}, PREF_DEF, S.pref || {}); return S.pref; }
function applyPrefs() {
  const p = S.pref || PREF_DEF, r = document.documentElement;
  if (p.theme === "light" || p.theme === "dark") r.setAttribute("data-theme", p.theme); else r.removeAttribute("data-theme");
  try { localStorage.setItem("gl-theme", p.theme || "light"); } catch (e) {}
  r.setAttribute("data-fs", p.fs || "m"); r.classList.toggle("no-motion", p.motion === "off");
}
let prefSeenQ = null;
let chapSel = [];   // chapitres choisis (quiz et flashcards) ; vide pour une matière = toute la matière
let cibleCat = "p1";
const chKey = x => (x.ch && CHID[x.ch] ? x.ch : x.c + ":g");
const chCat = k => (CHID[k] ? CHID[k].cat : k.split(":")[0]);
function chapOk(x) { return !chapSel.some(k => chCat(k) === x.c) || chapSel.includes(chKey(x)); }
function chapCount(cat) { return chapSel.filter(k => chCat(k) === cat).length; }
function chapPicker(cats, mode) {
  if (!cats.length) return `<p class="muted small">Choisis d'abord une ou plusieurs matières : tu pourras ensuite cocher leurs chapitres.</p>`;
  return cats.map(cat => {
    const c = CAT[cat], items = mode === "q" ? QS : mode === "f" ? FS : QS.concat(FS);
    const cnt = k => mode ? items.filter(x => x.c === cat && chKey(x) === k).length : null;
    const nq = k => QS.filter(x => x.c === cat && chKey(x) === k).length, nf = k => FS.filter(x => x.c === cat && chKey(x) === k).length;
    const keys = (CHBY[cat] || []).map(x => x.id).concat(cat + ":g").filter(k => nq(k) + nf(k));
    const lab = k => CHID[k] ? CHID[k].title : "Questions transversales (plusieurs chapitres)";
    const meta = k => mode === "q" ? `${nq(k)} q.` : mode === "f" ? `${nf(k)} cartes` : [nq(k) ? nq(k) + " q." : "", nf(k) ? nf(k) + " cartes" : ""].filter(Boolean).join(" · ");
    const none = !chapCount(cat);
    return `<div class="chap-box" style="${hueStyle(cat)}">${cats.length > 1 ? `<div class="chap-cat"><span class="tabcode">${h(c.code)}</span>${h(c.name)}</div>` : ""}
      <div class="chap-list"><button class="chap${none ? " on" : ""}" data-act="chapAll" data-cat="${cat}" aria-pressed="${none}"><span class="chap-t">Tous les chapitres</span></button>${keys.map(k => { const on = chapSel.includes(k); return `<button class="chap${on ? " on" : ""}" data-act="chapToggle" data-k="${h(k)}" aria-pressed="${on}"><span class="chap-t">${h(lab(k))}</span><span class="chap-n">${meta(k)}</span></button>`; }).join("")}</div></div>`;
  }).join("");
}

/* ---------- Navigation et accueil (version 5) ---------- */
const SVG = p => `<svg class="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICON = {
  friends: SVG('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.5 3 5.2"/>'),
  duel: SVG('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4M7 17l-3 3M3 19l2 2"/>'),
  speak: SVG('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"/>'),
  stop: SVG('<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>'),
  cal: SVG('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M12 13v4M10 15h4"/>'),
  home: SVG('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>'),
  book: SVG('<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z"/><path d="M12 6.5v13"/>'),
  cards: SVG('<rect x="3" y="7" width="15" height="12" rx="2"/><path d="M7 4h12a2 2 0 0 1 2 2v9"/><path d="M6.5 11h8M6.5 14.5h5"/>'),
  pen: SVG('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z"/><path d="M14.5 6.5l3 3"/>'),
  back: SVG('<path d="M15 5l-7 7 7 7"/>'),
  check: SVG('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  clock: SVG('<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V10M9.5 3h5M12 3v3.5"/>'),
  talk: SVG('<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9.5h8M8 12.5h5"/>'),
  list: SVG('<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>'),
  search: SVG('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/>'),
  target: SVG('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>'),
  calc: SVG('<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15v3M8.5 18h.01M12 18h.01"/>'),
  schema: SVG('<rect x="8" y="3" width="8" height="5" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/><rect x="14" y="16" width="7" height="5" rx="1.5"/><path d="M12 8v4M6.5 16v-4h11v4"/>'),
  steps: SVG('<path d="M4 19h4.5v-4.5H13V10h4.5V5.5H20"/>'),
  archive: SVG('<rect x="3.5" y="4" width="17" height="4.5" rx="1"/><path d="M5 8.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5M10 12.5h4"/>'),
  errbook: SVG('<path d="M6.5 3.5H18a1 1 0 0 1 1 1V20H7.5a2 2 0 0 1-2-2V4.5a1 1 0 0 1 1-1Z"/><path d="M10 8.5l4.5 4.5M14.5 8.5 10 13"/>'),
  read: SVG('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>')
};
const HUE = { p1: [220, 64], p2: [170, 62], p3: [265, 50], p4: [335, 58], p5: [28, 78], p6: [132, 46], p7: [228, 20], ma: [5, 62], ce: [194, 70], cg: [300, 38], an: [42, 78], me: [214, 24] };
const LD = { p2: 10, p6: 7, ce: 7, an: 8, p5: 3 };
const hueStyle = cat => { const x = HUE[cat] || [228, 40]; return `--ld:${LD[cat] || 0}%;--h:${x[0]};--s:${x[1]}%`; };
let matCat = "p1", matSeg = "lecons", LS = null, ficheQuery = "", matFicheQuery = "", coursQuery = "";

function normS() { S.q = S.q || {}; S.c = S.c || {}; S.l = S.l || {}; S.x = S.x || {}; S.st = S.st || { d: 0, n: 0 };  migL(S); }
/* Leçons insérées ou réordonnées : les leçons lues suivent leur nouveau numéro (LES_MIG, par cours et par version) */
function migL(o) { if (!o || typeof LES_MIG === "undefined") return o; o.l = o.l || {}; o.lmig = o.lmig || {}; Object.keys(LES_MIG).forEach(cid => { let cur = +o.lmig[cid] || 1; LES_MIG[cid].forEach(st => { if (st.v <= cur) return; const nl = {}; Object.keys(o.l).forEach(key => { const i = key.lastIndexOf(":"), c = key.slice(0, i), k = key.slice(i + 1); nl[c === cid && st.m[k] ? c + ":" + st.m[k] : key] = o.l[key]; }); o.l = nl; if (o.last && o.last.c === cid && st.m[o.last.k]) o.last.k = st.m[o.last.k]; cur = st.v; }); o.lmig[cid] = cur; }); return o; }
function dayLog() { const d = dayNum(); if (!S.dy || S.dy.d !== d) S.dy = { d, l: 0, c: 0, e: 0 }; return S.dy; }

function go(v, opts) {
  view = v;
  if (examTick && !(R && R.mode === "exam" && v === "run")) { clearInterval(examTick); examTick = null; }
  if (exTick && v !== "exrun") { clearInterval(exTick); exTick = null; }
  if (defiTick && v !== "defi") { clearInterval(defiTick); defiTick = null; }
  if (v !== "oral") clearInterval(orTick);
  if (v !== "duel") duelStop();
  if (v !== "room") roomStop();
  if (opts && opts.reset) { R = null; C = null; }
  closeSheet(); peekClose(true); ttsStop();
  if (tourI >= 0) { tourI = -1; document.querySelectorAll(".tour").forEach(x => x.remove()); }
  render();
  window.scrollTo({ top: 0 });
}
function navOf(v) {
  if (v === "profil") return "";
  if (v === "home") return "home";
  if (v === "amis" || v === "classe" || v === "duel" || v === "room") return "amis";
  if (v === "cours" || v === "lesson") return "cours";
  if (v === "fiches" || v === "fiche") return "fiches";
  if (v === "bts") return "bts";
  if (v === "annex") return "ex";
  if (v === "mat") return matSeg === "fiche" ? "fiches" : matSeg === "train" ? "ex" : "cours";
  return "ex";
}
function renderTop() {
  { const prev = renderTop.xp; renderTop.xp = S.xp; const recent = Date.now() - lastPt.t < 5000;
    if (prev != null && S.xp > prev && S.xp - prev <= 300 && recent) {
      const a = levelOf(prev), b = levelOf(S.xp); xpFx(S.xp - prev, prev);
      if (b.floor > a.floor) setTimeout(() => levelUpFx(b), 450);
    } }
  { const t = document.querySelector(".top"); if (t) document.documentElement.style.setProperty("--top-h", getComputedStyle(t).position === "sticky" ? t.offsetHeight + "px" : "0px");
    requestAnimationFrame(() => { const n = document.querySelector(".ex-tabs"), c = n && n.querySelector('[aria-current="page"]'); if (n && c && n.scrollWidth > n.clientWidth) n.scrollLeft = c.offsetLeft - 16; }); }
  const L = levelOf(S.xp);
  $("#lvlName").textContent = L.name;
  { const g = document.querySelector(".gl-out"), w = document.getElementById("whoAv"), a = avMine();
    if (g) { g.setAttribute("aria-current", view === "profil" ? "page" : "false"); if (g.dataset.av !== a) { g.dataset.av = a; g.classList.toggle("has-av", !!a); g.innerHTML = a ? avSvg(a) : g.dataset.ic || g.innerHTML; } }
    const wa = g ? "" : a; if (w && w.dataset.av !== wa) { w.dataset.av = wa; w.innerHTML = wa ? avSvg(wa) : ""; w.hidden = !wa; } }
  if (!document.querySelector(".fx-xp")) $("#xpTop").textContent = S.xp + " XP";
  const cur = navOf(view);
  document.querySelectorAll(".nav-btn").forEach(b => b.setAttribute("aria-current", b.dataset.nav === cur ? "page" : "false"));
  const s = document.getElementById("syncNote");
  if (s) s.textContent = !navigator.onLine ? "Hors connexion : ta progression est gardée sur cet appareil et sera envoyée au retour du réseau." : syncMode === "sync" ? (dirty ? "Enregistrement sur ton compte…" : "Ta progression est enregistrée sur ton compte.") : "Ta progression est enregistrée sur cet appareil.";
  document.documentElement.classList.toggle("is-offline", !navigator.onLine);
}
function migrateSnd() { if (S.sndv) return; S.sndv = 1; if (S.pref && S.pref.snd === "off") S.pref.snd = "on"; }
function migrateXp() {
  if (S.xpv >= 2) return; S.xpv = 2;
  let est = 0;
  Object.entries(S.q || {}).forEach(([id, r]) => { est += 5 * (r[1] || 0); const st = qState(id); if (st >= 2) est += 20; if (st >= 3) est += 30; });
  Object.values(S.c || {}).forEach(r => est += 4 * (r[0] || 0));
  est += 8 * Object.keys(S.l || {}).length + 4 * Object.keys(S.fr || {}).length;
  est += 15 * Object.keys(S.x || {}).length + 10 * Object.values(S.an || {}).filter(x => x && (x.d || x.r)).length + 2 * ((S.df || {}).best || 0);
  est = Math.round(est * 1.15 + 50);
  if (S.xp > est) { S.xp = est; touch(); }
}
function render() {
  applyPrefs();
  migrateXp(); migrateSnd();
  if (S.pref && S.pref.qlen !== prefSeenQ) { prefSeenQ = S.pref.qlen; quizLen = prefSeenQ; }
  if (Array.isArray(S.chap) && S.chap.join("|") !== chapSel.join("|")) chapSel = S.chap.slice();
  const v = $("#view");
  const fn = { amis: vAmis, room: vRoom, duel: vDuel, pack: vPack, rx: vRx, rxread: vRxRead, recite: vRecite, rchome: vReciteHome, memo: vMemo, classe: () => { AMT = "classement"; return vAmis(); }, oral: vOral, erreurs: vErreurs, home: vHome, quiz: vQuizSetup, run: vRun, result: vResult, cards: vCardsSetup, cible: vCible, profil: vProfil, card: vCard, cardsEnd: vCardsEnd, exam: vExamSetup, fiches: vFiches, cours: vCoursList, mat: vMat, lesson: vLesson, ex: vExHome, exrun: vExRun, exres: vExRes, redac: vRedac, schema: vSchema, calc: vCalc, fiche: vFiche, gcase: vCase, defi: vDefi, bts: vBts, annex: vAnnEx }[view] || vHome;
  v.innerHTML = fn();
  if (inPack() && /^(run|result|cards|card|cardsEnd|exrun|exres|calc|schema|gcase|oral|redac)$/.test(view) && !(view === "result" && R && R.pack != null)) v.insertAdjacentHTML("afterbegin", `<div class="pk-ban" style="${hueStyle(S.packs[FROMPACK].cat)}"><span>Contrôle : <b>${h(packName(S.packs[FROMPACK]))}</b></span><button class="btn small primary" data-act="pkResume">Suite du contrôle</button></div>`);
  v.dataset.view = view;
  renderTop();
  bindView();
  if (view === "home" && !S.tour && tourI < 0) setTimeout(() => { if (view === "home" && !S.tour && tourI < 0 && !document.querySelector(".gl-auth, .fx-lvl")) tourStart(); }, 900);
  bindFusion();
  bindAnn();
  fx3d();
  gtClose(); requestAnimationFrame(() => glossify(v));
}

/* Intercalaires de matière */
const GROUPS = [["pro", "Bloc professionnel", "P1 à P7 : écrit E5 et oraux E6, E7, E8. 23 coefficients sur 39."], ["gen", "Matières générales", "Culture générale, anglais, maths et CEJM. 16 coefficients sur 39."], ["met", "Méthodes", "Ce que les correcteurs attendent, épreuve par épreuve, et la préparation des oraux."]];
function divider(c, meta, ratio, act, seg) {
  return `<button class="divider" style="${hueStyle(c.id)}" data-act="${act}" data-cat="${c.id}"${seg ? ` data-seg="${seg}"` : ""}>
    <span class="tabcode">${h(c.code)}</span>
    <span class="dv-name">${h(c.name)}</span>
    <span class="dv-desc">${h(c.desc)}</span>
    <span class="dv-meta">${meta}</span>
    ${ratio == null ? "" : `<span class="meter"><i style="width:${ratio}%"></i></span>`}
  </button>`;
}
function groupsOf(fn) {
  return GROUPS.map(([g, title, sub]) => `<div class="stack">
      <div class="sec-head"><h3 class="grp-title">${h(title)}</h3><p>${h(sub)}</p></div>
      <div class="dividers">${CATS.filter(c => c.grp === g).map(fn).join("")}</div>
    </div>`).join("");
}
const dividerCours = c => { const ls = lessonStats(c.id); return divider(c, `${ls.r} leçon${ls.r > 1 ? "s" : ""} lue${ls.r > 1 ? "s" : ""} sur ${ls.n}`, pct(ls.r, ls.n), "mat", "lecons"); };
const dividerFiche = c => { const chs = CHBY[c.id] || [], r = chs.filter(x => ficheRead(x.id)).length; return divider(c, `${chs.length} fiches, ${r} lue${r > 1 ? "s" : ""}`, pct(r, chs.length), "mat", "fiche"); };

/* Accueil */
function greet() { const hr = new Date().getHours(); return hr >= 5 && hr < 18 ? "Bonjour" : "Bonsoir"; }
function todayLabel() { try { return new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }); } catch (e) { return ""; } }
function suggestEx(cat) {
  const pool = GENS.filter(x => x.cat === cat), sx = S.x || {};
  if (!pool.length) return null;
  return pool.slice().sort((a, b) => ((sx[a.id] || [0])[0] - (sx[b.id] || [0])[0]) || (pool.indexOf(a) - pool.indexOf(b)))[0];
}
function todayCount(cats) { const d = dueCards(cats); return Math.min(30, d.reviews.length + Math.min(15, d.fresh.length)); }
function exCount() { return Object.keys(S.x || {}).length + Object.values(S.an || {}).filter(x => x && (x.d || x.r || (x.g && x.g.length))).length + Object.values(S.gc || {}).filter(x => x && x.step > 0).length; }
let FROMPACK = null; // contrôle d'où l'activité a été lancée
const inPack = () => FROMPACK != null && S.packs && S.packs[FROMPACK];
function nextBtn(primary) {
  if (inPack()) return `<button class="btn${primary ? " primary" : ""}" data-act="pkResume">Suite du contrôle</button>`;
  return planLeft() ? `<button class="btn${primary ? " primary" : ""}" data-act="planNext">Étape suivante de la séance</button>` : "";
}
function planLeft() { const dy = dayLog(); return dy.l === 0 || (!(dy.x || 0) && !(dy.w || 0)) || (dy.c < 10 && (todayCount() > 0 || dueQs().length > 0)); }
function weekAcq() {
  const d0 = dayNum() - 6; let n = 0, soon = 0;
  QS.forEach(x => { const o = (S.qd || {})[x.id]; if (!o || !o.ok.length) return; const st = qState(x.id);
    if (st >= 2) { const a = o.ok.find(v => v - o.ok[0] >= 3); if (a != null && a >= d0) n++; } else soon++; });
  return { n, soon };
}
function vHome() {
  const dy = dayLog(), nl = nextLesson(), todayN = todayCount();
  const lcat = nl ? CMETA(nl.cid).cat : "p1", g = suggestAnn(lcat);
  const nlT = nl ? lessonLabel(SPLIT(nl.cid)[nl.k].title, nl.k) : null;
  const dqN = dueQs().length, wk0 = weakChaps(1)[0];
  const steps = [
    { done: dy.l > 0, title: "Lire une leçon",
      text: nl ? `${h(CAT[lcat].name)}, ${h(nlT.lab.toLowerCase())} : ${inl(nlT.t)}` : "Tu as lu toutes les leçons. Relis celles qui te posent problème.",
      btn: nl ? `<button class="btn primary" data-act="lesson" data-cid="${nl.cid}" data-k="${nl.k}">${S.last ? "Continuer" : "Commencer"}</button>` : `<button class="btn" data-nav="cours">Voir les cours</button>` },
    { done: dy.c >= 10 || (!todayN && !dqN), title: "Revoir tes cartes et tes acquis",
      text: todayN ? `${todayN} cartes t'attendent, environ ${Math.max(3, Math.round(todayN / 3))} minutes. Dix suffisent pour valider l'étape.${dqN ? ` Puis ${dqN} question${dqN > 1 ? "s" : ""} à revérifier.` : ""}` : dqN ? `${dqN} question${dqN > 1 ? "s" : ""} à revérifier pour qu'elles deviennent acquises.` : "Rien à revoir aujourd'hui.",
      btn: todayN ? `<button class="btn" data-act="today">Réviser</button>` : `<button class="btn" data-act="dueQuiz" ${dqN ? "" : "disabled"}>Revérifier</button>` },
    wk0 ? { done: (dy.w || 0) > 0 || (dy.x || 0) > 0, title: "Retravailler un point faible",
      text: `${h(chLabel(wk0.k))} : ${Math.round(wk0.ok / wk0.n * 100)} % de réussite. Un quiz qui commence par tes erreurs.`,
      btn: `<button class="btn" data-act="wkTrain" data-k="${h(wk0.k)}">Lancer</button>` } :
    { done: (dy.x || 0) > 0, title: "Faire un exercice",
      text: g ? `Annale ${h(g.a.ep)} ${g.a.year}, ${h(g.a.cas)} : ${h(g.t.charAt(0).toLowerCase() + g.t.slice(1))}${g.pts ? ` (${g.pts} points)` : ""}.` : `Un quiz de 10 questions en ${h(CAT[lcat].name.toLowerCase())}, corrigé au fur et à mesure.`,
      btn: g ? `<button class="btn" data-act="annOpen" data-id="${g.id}">Ouvrir</button>` : `<button class="btn" data-act="quickQuiz" data-cat="${lcat}">Lancer</button>` }
  ];
  { const pt = plToday(); // le plan de la semaine remplace les étapes 1 et 3 quand il reste des tâches
    const mk = x => ({ done: x.done, plan: true, title: x.t.t, text: `${h(CAT[x.t.c] ? CAT[x.t.c].name : "Toutes matières")} · ${Math.min(x.t.n, plDone(x.t))} sur ${x.t.n} cette semaine, environ ${Math.round(x.t.m)} min.`, btn: `<button class="btn${x.done ? "" : " primary"}" ${x.t.act}>${x.done ? "Encore" : "Y aller"}</button>` });
    if (pt[0]) steps[0] = mk(pt[0]); if (pt[1]) steps[2] = mk(pt[1]); }
  const nDone = steps.filter(s => s.done).length;
  const L = levelOf(S.xp), prog = L.next ? pct(S.xp - L.floor, L.next - L.floor) : 100;
  const tl = totalLessons(), all = mastery();
  const okQ = Object.values(S.q).filter(r => r[2] === 1).length;
  const known = Object.values(S.c).filter(r => r[0] >= 3).length;
  const st = streakNow();
  return `
  <section class="hero3d">
    <div class="hero-text">
      <p class="date">${h(todayLabel())}</p>
      <h1>${greet()}, on avance ?</h1>
      <button class="countdown" data-nav="bts"><b>${flap(daysLeft())}</b><span>avant les premiers écrits du BTS</span></button>
      <div class="hello-side">
        <span class="pill">Série : <b>${st} jour${st > 1 ? "s" : ""}</b></span>
        <span class="pill">Leçons lues : <b>${tl.r} sur ${tl.n}</b></span>
        <span class="pill">Fiches lues : <b>${Object.keys(S.fr || {}).length} sur ${CHAP.length}</b></span>
      </div>
    </div>
    <div class="shelf" id="shelf3d"><p class="shelf-label" id="shelfLabel">${shelfHint()}</p></div>
  </section>
  <section class="plan" aria-labelledby="planTitle">
    <div class="plan-head"><h2 id="planTitle">Ta séance du jour</h2><span>${nDone} étape${nDone > 1 ? "s" : ""} sur 3 · tirée de <button class="linkbtn" data-act="plSee">ton plan de la semaine</button></span></div>
    <ol class="steps">${steps.map((s, i) => `<li class="step${s.done ? " done" : ""}"><span class="num">${s.done ? ICON.check : i + 1}</span><div><b>${s.title}</b><p>${s.text}</p></div>${s.btn}</li>`).join("")}</ol>
    ${nDone === 3 ? `<p class="plan-done">Séance terminée. Tout ce que tu fais en plus aujourd'hui, c'est de l'avance.</p>` : `<button class="btn primary plan-go" data-act="planGo">${nDone ? "Continuer la séance" : "Commencer la séance"}</button>`}
  </section>
  ${rxHomeCard()}
  ${bbHomeCard()}
  ${memoHomeCard()}
  ${persoCoursCards()}
  ${(() => { const up = (S.packs || []).map((p, i) => ({ p, i, d: daysTo(p.date) })).filter(x => x.d != null && x.d >= 0 && x.d <= 14).sort((a, b) => a.d - b.d)[0]; if (!up) return ""; const r = packReady(up.p); return `<button class="wk-cta" data-act="pkOpen" data-i="${up.i}" style="${hueStyle(up.p.cat)}"><span class="wk-ic">${ICON.target}</span><span><b>${up.d === 0 ? "Contrôle aujourd'hui" : up.d === 1 ? "Contrôle demain" : `Contrôle dans ${up.d} jours`} : ${h(packName(up.p))}</b><small>${r} % prêt${(up.p.hist || []).length ? ` · contrôle blanc : ${up.p.hist[up.p.hist.length - 1].pc} %` : " · fais un contrôle blanc pour te tester"}</small></span><span class="wk-go">Réviser ›</span></button>`; })()}
  ${duelHomeCard()}
  ${amisHomeCard()}
  ${classeCard()}
  <section class="stack">
    <div class="sec-head"><h2>Tes matières</h2><p>Chaque matière a ses leçons, ses fiches et ses exercices.</p></div>
    ${groupsOf(dividerCours)}
  </section>
  <section class="stack">
    <h2>Raccourcis</h2>
    <div class="shortcuts">
      <button class="shortcut" data-act="defi"><span class="ic">${ICON.clock}</span><span><b>Défi 60 secondes</b><span>Un maximum de bonnes réponses en une minute, sans calculs.</span></span></button>
      <button class="shortcut" data-nav="fiches"><span class="ic">${ICON.cards}</span><span><b>Toutes les fiches</b><span>${CHAP.length} fiches-chapitres et le mémo express, avec une recherche.</span></span></button>
      <button class="shortcut" data-nav="ex"><span class="ic">${ICON.pen}</span><span><b>Annales officielles</b><span>${ANN.length} sujets de 2021 à 2026, avec leurs corrigés.</span></span></button>
      <button class="shortcut" data-act="lesson" data-cid="or" data-k="1"><span class="ic">${ICON.talk}</span><span><b>Préparer les oraux</b><span>E6, E7 et E8 : quoi préparer, et quand.</span></span></button>
    </div>
  </section>
  <section class="progress-box">
    <div class="stack">
      <span class="eyebrow">Ton niveau</span>
      <span class="lvl-big">${h(L.name)}</span>
      <div class="bar gold"><i style="width:${prog}%"></i></div>
      <p class="muted">${L.next ? `${S.xp} XP. Encore ${L.next - S.xp} XP pour devenir ${h(L.nextName.toLowerCase())}.` : `${S.xp} XP. Niveau maximum atteint.`}</p>
      ${weekAcq().soon ? `<p class="muted small">${weekAcq().soon} question${weekAcq().soon > 1 ? "s" : ""} en bonne voie : réussis-les encore dans quelques jours pour qu'elles deviennent acquises.</p>` : ""}
      <button class="btn small" data-nav="profil">Mon profil et réglages</button>
    </div>
    <div class="stack">
      <div class="figs">
        <div class="fig"><b>${tl.r}<small class="muted">/${tl.n}</small></b><span>leçons lues</span></div>
        <div class="fig"><b>${known}</b><span>cartes bien sues</span></div>
        <div class="fig"><b>+${weekAcq().n}</b><span>questions acquises cette semaine</span></div>
        <div class="fig"><b>${exCount()}</b><span>exercices pratiqués</span></div>
      </div>
      <div class="row fb-row"><button class="btn small" data-act="feedback">Une idée ou un souci ? Donne ton avis</button></div>
      <div class="notes"><span class="sync" id="syncNote"></span><span>Chiffres et règles à jour au 13 octobre 2026. À revérifier en avril 2027, avant les épreuves.</span></div>
    </div>
  </section>`;
}


/* Quiz : choix */
function catChips(sel, act) {
  return CATS.map(c => `<button class="chip" data-act="${act}" data-cat="${c.id}" aria-pressed="${sel.includes(c.id)}"><span class="mono">${h(c.code)}</span>${h(c.name)}</button>`).join("");
}
function vQuizSetup() {
  const pool = QS.filter(x => (!quizSel.length || quizSel.includes(x.c)) && chapOk(x));
  const wrong = QS.filter(x => S.q[x.id] && S.q[x.id][2] === 0);
  return `<section class="setup">
    <div><span class="eyebrow">Quiz corrigé</span><h1>Choisis tes matières</h1></div>
    <p class="muted">Chaque réponse est corrigée et expliquée tout de suite. Sans sélection, toutes les matières sont mélangées.</p>
    <div><div class="label">Matières</div><div class="picker">${catChips(quizSel, "toggleQuiz")}</div></div>
    <div><div class="label">Chapitres</div>${chapPicker(quizSel, "q")}</div>
    <div><div class="label">Nombre de questions</div><div class="picker">
      ${[10, 20, 40].map(n => `<button class="chip" data-act="len" data-n="${n}" aria-pressed="${quizLen === n}">${n}</button>`).join("")}
    </div></div>
    <div class="row">
      <button class="btn primary" data-act="startQuiz">Lancer ${Math.min(quizLen, pool.length)} questions</button>
      <button class="btn" data-act="startWrong" ${wrong.length ? "" : "disabled"}>Refaire mes erreurs (${wrong.length})</button>
      ${quizSel.length ? `<button class="btn" data-act="clearQuiz">Tout désélectionner</button>` : ""}
    </div>
  </section>`;
}
let ORIG = null; // page d'où l'on a lancé un quiz ou des cartes, pour y revenir
const RUNV = /^(run|result|card|cardsEnd|exrun|exres|recite|rchome)$/;
function markOrig() { if (RUNV.test(view)) return; ORIG = { view, LS: LS ? Object.assign({}, LS) : null, FC, mat: [matCat, matSeg, matSub], y: window.scrollY || 0, lab: view === "lesson" && LS ? "Retour au cours" : view === "mat" ? "Retour à la matière" : view === "fiche" ? "Retour à la fiche" : view === "home" ? "Retour à l'accueil" : view === "ex" ? "Retour à S'entraîner" : "Retour" }; }
function backOrig(fallback) { const o = ORIG; ORIG = null; if (!o) return go(fallback || "ex"); if (o.LS) LS = o.LS; if (o.FC) FC = o.FC; [matCat, matSeg, matSub] = o.mat; go(o.view); setTimeout(() => window.scrollTo(0, o.y), 30); }
const origBtn = (cls) => ORIG ? `<button class="btn${cls ? " " + cls : ""}" data-act="backOrig">${ICON.back}${h(ORIG.lab)}</button>` : "";
let RUN_T = null; // titre de la session lancée par le dernier bouton touché
function yrOfSel(c) { const mine = chapSel.filter(k => chCat(k) === c); if (!mine.length) return "toute la matière"; const all = CHBY[c] || [];
  for (const y of [1, 2]) { const ids = all.filter(x => chapYr(x) === y).map(x => x.id); if (ids.length && ids.length === mine.length && ids.every(k => mine.includes(k))) return y === 1 ? "1re année" : "2e année"; }
  return mine.length === 1 && CHID[mine[0]] ? CHID[mine[0]].title : mine.length + " chapitres choisis"; }
function runTitle(b, a, cat) {
  const bt = b.querySelector("b"), lab = (bt ? bt.textContent : [...b.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(" ")).replace(/\s+/g, " ").replace(/\s*[:(]?\s*\d+\s*(q\.|questions?|cartes?)?\)?\s*$/i, "").trim();
  const c = /^(cibleQuiz|cibleCards)$/.test(a) ? cibleCat : cat;
  if (/^(cibleQuiz|cibleCards|quickQuiz|flashCat|quizCat|cardsCat|dueCat)$/.test(a) && CAT[c]) return CAT[c].name + " · " + yrOfSel(c) + (/Cards|flash|due/i.test(a) ? " · flashcards" : "");
  if (/^(chQuiz|chCards)$/.test(a) && CHID[b.dataset.ch]) return CHID[b.dataset.ch].title + " · " + (a === "chQuiz" ? "quiz de la fiche" : "cartes");
  if (a === "memoGo") return "Séance mémoire" + (view === "memo" && MEMCAT && CAT[MEMCAT] ? " · " + CAT[MEMCAT].name : "");
  if (a === "memoCards") return "Cartes qui s'effacent";
  if (a === "memoCh" && CHID[b.dataset.k]) return CHID[b.dataset.k].title + " · rafraîchir";
  if (a === "bbPlan") { const e = EPREUVES.find(x => x.c === b.dataset.e); return "Reprise après le BTS blanc · " + b.dataset.e + (e ? " " + e.t.split(" : ")[0] : ""); }
  if (a === "auQuiz") return "CEJM · " + lab;
  if (a === "auSit") return "CEJM · Notion : auteur puis définition · " + (b.dataset.yr === "2" ? "2e année" : b.dataset.yr === "1" ? "1re année" : "les deux années");
  if (/^(chsQuiz|chsCards)$/.test(a)) { const m = Object.values(COURS_META).find(m => m.chs && (b.dataset.chs || "").split(",").every(k => m.chs.includes(k))); return (m ? m.name + " · " : "") + lab; }
  if (view === "lesson" && LS && CMETA(LS.cid)) return CMETA(LS.cid).name + " · " + lab;
  return lab;
}
function startRun(items, mode) {
  markOrig();
  if (isGuest()) { items = items.filter(x => !lockedCat(x.c)); if (!items.length) { R = null; lockSheet(); return; } }
  if (examTick) { clearInterval(examTick); examTick = null; }
  R = { mode, list: items.map(it => ({ it, order: shuffle([0, 1, 2, 3]), pick: null })), i: 0, start: Date.now(), xp0: S.xp, title: RUN_T }; RUN_T = null;
  if (mode === "exam") {
    R.end = Date.now() + 20 * 60 * 1000;
    examTick = setInterval(() => {
      const t = document.getElementById("timer");
      const left = Math.max(0, R.end - Date.now());
      if (t) { t.textContent = timeLeft(); t.classList.toggle("low", left < 120000); } if (left <= 60000 && left > 59000) tone("warn");
      if (left <= 0) finishExam();
    }, 1000);
  }
  go("run");
}
function timeLeft() {
  const left = Math.max(0, R.end - Date.now());
  const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
  return m + ":" + String(s).padStart(2, "0");
}
/* Questions en deux temps : la décision, puis la raison. Juste seulement si les deux le sont. */
function twoOpts(cur) {
  const T = cur.it.two, L = ["A", "B", "C", "D"]; if (!cur.o2) cur.o2 = shuffle(T.w.map((_, i) => i));
  const done = cur.pick !== null && R.mode === "quiz";
  const d = T.d.map((x, i) => { let cls = "opt"; if (done) { if (x === T.k) cls += " right"; else if (i === cur.p1) cls += " wrong"; } else if (i === cur.p1) cls += " picked";
    return `<button class="${cls}" data-act="tw1" data-i="${i}" ${done ? "disabled" : ""}><span class="k">${i + 1}</span><span>${h(x)}</span></button>`; }).join("");
  const w = cur.p1 == null ? `<p class="tw-k muted">${h(T.l2 || "2. Pourquoi ?")} (choisis d'abord ${T.l1 ? "l'auteur" : "la décision"})</p>` : `<p class="tw-k">${h(T.l2 || "2. Pourquoi ?")}</p><div class="options">${cur.o2.map((wi, pos) => { let cls = "opt"; if (done) { if (wi === 0) cls += " right"; else if (pos === cur.p2) cls += " wrong"; } else if (pos === cur.p2) cls += " picked";
    return `<button class="${cls}" data-act="tw2" data-pos="${pos}" ${done ? "disabled" : ""}><span class="k">${L[pos]}</span><span>${h(T.w[wi])}</span></button>`; }).join("")}</div>`;
  return `<p class="tw-k">${h(T.l1 || "1. Ta décision")}</p><div class="options tw-d">${d}</div>${w}`;
}
function tw1(i) {
  const cur = R && R.list[R.i]; if (!cur || !cur.it.two || i < 0 || i >= cur.it.two.d.length) return;
  if (R.mode === "quiz" && cur.pick !== null) return;
  cur.p1 = i; cur.p2 = null; cur.pick = null; render();
  const t = document.querySelector(".tw-k:not(.muted) + .options, .tw-d ~ .options"); if (t && t.scrollIntoView) try { t.scrollIntoView({ block: "nearest", behavior: fxOn() ? "smooth" : "auto" }); } catch (e) {}
}
function tw2(pos) {
  const cur = R && R.list[R.i]; if (!cur || !cur.it.two || cur.p1 == null || pos < 0 || pos > 3) return;
  if (R.mode === "quiz" && cur.pick !== null) return;
  const T = cur.it.two, dOk = T.d[cur.p1] === T.k, wOk = cur.o2[pos] === 0, ok = dOk && wOk;
  cur.p2 = pos; cur.dOk = dOk; cur.wOk = wOk;
  if (!cur.base) cur.base = cur.it;
  cur.it = Object.assign({}, cur.base, { _dOk: dOk, _wOk: wOk, o: [cur.base.o[0], ok ? cur.base.o[0] : `${T.d[cur.p1]} · ${T.w[cur.o2[pos]]}`, "", ""] }); cur.order = [0, 1, 2, 3];
  if (R.mode === "quiz") pick(ok ? 0 : 1); else { cur.pick = ok ? 0 : 1; render(); }
}
function vRun() {
  if (!R) return vQuizSetup();
  const cur = R.list[R.i], it = cur.it, c = CAT[it.c];
  const answered = cur.pick !== null && R.mode === "quiz";
  const letters = ["A", "B", "C", "D"];
  const opts = cur.order.map((oi, pos) => {
    let cls = "opt";
    if (answered) { if (oi === 0) cls += " right"; else if (pos === cur.pick) cls += " wrong"; }
    else if (R.mode === "exam" && pos === cur.pick) cls += " picked";
    return `<button class="${cls}" data-act="pick" data-pos="${pos}" ${answered ? "disabled" : ""}><span class="k">${letters[pos]}</span><span>${h(it.o[oi])}</span></button>`;
  }).join("");
  const ok = answered && cur.order[cur.pick] === 0;
  const last = R.i === R.list.length - 1;
  const fb = answered ? `<div class="feedback">
      <span class="verdict ${ok ? "ok" : "ko"}">${ok ? "Juste" : "À revoir"}</span>
      ${ok ? "" : it.two ? `<p>${cur.dOk ? "La décision est juste, mais pas la raison." : cur.wOk ? "La raison est juste, mais pas la décision." : "La décision et la raison sont à revoir."}</p><p><b>Bonne réponse :</b> ${h(it.two.k)}, car ${h(lc1(it.two.w[0]))}.</p>` : `<p><b>Bonne réponse :</b> ${h(it.o[0])}</p>`}
      <p class="muted">${h(it.e)}</p>
      ${qxHTML(it)}
      ${!ok && it.ch && CHID[it.ch] ? `<button class="btn small peek-cta" data-act="fichePeek" data-id="${h(it.ch)}" data-hint="${h(it.o[0] + "\u241E" + it.q + " " + it.e)}">${ICON.book}Revoir la fiche : ${h(CHID[it.ch].title)}</button>` : ""}
      <button class="rep-btn" data-act="report" data-t="q" data-id="${h(it.id)}" data-l="${h(String(it.q).slice(0, 140))}">Signaler une erreur</button>
    </div>` : "";
  const head = R.mode === "exam"
    ? `${R.ctrl ? `<span class="ep ctl-tag">Contrôle · ${h(CAT[chCat(R.ctrl)].code)}</span>` : ""}<span class="timer${R.end - Date.now() < 120000 ? " low" : ""}" id="timer">${timeLeft()}</span>`
    : (() => { const pm = it.ch && Object.values(COURS_META).find(m => m.perso && m.chs && m.chs.includes(it.ch)); return pm ? `<span class="ep">${h(pm.code)} · ${h(pm.name)}</span>` : `<span class="ep">${h(c.code)} · ${h(c.name)}</span>`; })();
  const nav = R.mode === "exam"
    ? `<div class="row">
        <button class="btn" data-act="prev" ${R.i === 0 ? "disabled" : ""}>Précédente</button>
        ${last ? `<button class="btn primary" data-act="finishExam">Rendre la copie</button>` : `<button class="btn primary" data-act="next">Suivante</button>`}
        <span class="kbd">${R.list.filter(x => x.pick !== null).length}/${R.list.length} répondues</span>
      </div>`
    : (answered ? `<div class="row"><button class="btn primary" data-act="next" id="nextBtn">${last ? "Voir le bilan" : "Question suivante"}</button><span class="kbd">Entrée</span></div>` : `<span class="kbd">Touches 1 à 4 pour répondre</span>`);
  return `<section class="runner">
    ${R.title ? `<p class="run-title">${h(R.title)}</p>` : ""}<div class="runner-top"><span class="progress-text">${R.mode === "quiz" ? `<button class="quit" data-act="quitRun" aria-label="Quitter le quiz">✕</button>` : ""}Question ${R.i + 1} / ${R.list.length}</span>${head}</div>
    <div class="bar"><i style="width:${pct(R.i + (answered ? 1 : 0), R.list.length)}%"></i></div>
    <div class="qcard">
      ${R.mode === "exam" ? `<span class="ep" style="align-self:flex-start">${h(c.code)} · ${h(c.name)}</span>` : ""}
      <p class="qtext">${h(it.q)}</p>
      ${it.two ? twoOpts(cur) : `<div class="options">${opts}</div>`}
      ${fb}
    </div>
    ${nav}
  </section>`;
}
function pick(pos) {
  const cur = R.list[R.i];
  if (R.mode === "quiz") {
    if (cur.pick !== null) return;
    cur.pick = pos;
    tone(cur.order[pos] === 0 ? "ok" : "ko"); recordQ(cur.it, cur.order[pos] === 0, cur.it.o[cur.order[pos]]); buzz(cur.order[pos] === 0 ? 15 : [35, 45, 35]);
    touch(); render();
    const n = document.getElementById("nextBtn"); if (n) n.focus({ preventScroll: true });
  } else { cur.pick = pos; render(); }
}
function next() {
  if (R.i < R.list.length - 1) { R.i++; render(); window.scrollTo({ top: 0 }); }
  else if (R.mode === "quiz") { const dl = dayLog(); dl.e++; if (R.wk) dl.w = (dl.w || 0) + 1; touch(); go("result"); }
  else finishExam();
}
/* ---------- Classe : classement de la semaine et défi commun ---------- */
const weekId = () => Math.floor((dayNum() + 3) / 7);
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
/* Questions de calcul (montants à calculer) : écartées des formats chronométrés courts, où on n'a pas le temps de poser le calcul */
function qCalc(x) {
  if (x._k == null) { const nq = (String(x.q).match(/\d[\d\s\u00a0\u202f]*(?:[.,]\d+)?/g) || []).length, na = (x.o || []).filter(o => /^\s*[−+-]?\d/.test(o)).length; x._k = nq >= 2 && na >= 3; }
  return x._k;
}
function defiItems() {
  const r = rng(weekId() * 7919 + 17), pool = QS.filter(x => /^p[1-7]$/.test(x.c) && !qCalc(x)).slice().sort((a, b) => a.id < b.id ? -1 : 1);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, 10);
}
const defiDone = () => S.dw && S.dw.w === weekId();
function startDefiWeek() {
  startRun(defiItems(), "exam"); if (!R) return; R.dw = true; R.t0 = Date.now(); R.end = Date.now() + 10 * 45 * 1000;
  render();
}
let CL = { data: null, at: 0, err: "", tab: "sem", busy: false };
async function loadClass(force) {
  if (typeof window.GL_CLASS !== "function" || CL.busy) return;
  if (!force && CL.data && Date.now() - CL.at < 30000) return;
  CL.busy = true;
  try { if (ref && dirty) { clearTimeout(saveTimer); await flush(); } CL.data = await window.GL_CLASS(); CL.at = Date.now(); CL.err = ""; }
  catch (e) { CL.err = (e && e.message) || "Classement indisponible pour l'instant."; }
  CL.busy = false; if (view === "classe" || view === "home" || (view === "amis" && AMT === "classement")) render();
}
function fmtT(sec) { sec = Math.round(sec || 0); return Math.floor(sec / 60) + " min " + String(sec % 60).padStart(2, "0"); }
function vClasse() {
  if (typeof window.GL_CLASS !== "function") return `<section class="stack"><h1>Classe</h1><div class="empty">Le classement et le défi entre camarades sont disponibles sur le site partagé du Grand Livre.</div></section>`;
  const cl = S.cl || {}, on = !!cl.on, dw = defiDone() ? S.dw : null;
  const head = `<section class="page-head"><h1>Classe</h1><p class="muted">Le classement de la semaine et le défi commun. Remise à zéro chaque lundi.</p></section>`;
  if (!on) return head + `<section class="stack cl-join">
    <div class="pf-set" style="padding:16px;display:grid;gap:12px">
      <p style="margin:0"><b>Rejoindre le classement, c'est facultatif.</b> Les camarades qui l'ont rejoint verront seulement : ton pseudo, le nombre de questions que tu as acquises cette semaine, tes jours de révision de la semaine et ton score au défi. Rien d'autre (ni tes erreurs, ni tes notes).</p>
      <label class="cl-ps"><b>Ton pseudo</b><input id="clPseudo" class="pf-in" maxlength="24" value="${h(cl.p || (P().name || window.GL_NAME || "").split(" ")[0] || "")}" placeholder="Ex. : Léa"></label>
      <div class="row"><button class="btn primary" data-act="clJoin">Rejoindre le classement</button></div>
      <p class="muted small" style="margin:0">Tu peux le quitter à tout moment ; ton pseudo disparaît alors du classement.</p>
    </div>
    ${defiCard(dw)}
  </section>`;
  loadClass();
  const d = CL.data, rows = d ? (CL.fil === "amis" ? d.rows.filter(r => r.f || r.me) : d.rows) : [];
  const sem = rows.slice().sort((a, b) => b.acq - a.acq || b.days - a.days || a.p.localeCompare(b.p));
  const df = rows.filter(r => r.dsc != null).sort((a, b) => b.dsc - a.dsc || a.dt - b.dt);
  const rank = (list, me) => { const i = list.findIndex(r => r.me); return i < 0 ? null : i + 1; };
  const medal = i => (i + 1) + "";
  const tbl = CL.tab === "sem"
    ? (sem.length ? `<ol class="cl-list">${sem.map((r, i) => `<li class="${r.me ? "me" : ""}"><span class="cl-r">${medal(i)}</span><b>${h(r.p)}${r.me ? " (toi)" : ""}</b><span class="cl-v"><b>${r.acq}</b> acquise${r.acq > 1 ? "s" : ""}</span><span class="cl-s">${r.days} jour${r.days > 1 ? "s" : ""}</span></li>`).join("")}</ol>` : `<div class="empty">Personne n'a encore rejoint le classement.</div>`)
    : (df.length ? `<ol class="cl-list">${df.map((r, i) => `<li class="${r.me ? "me" : ""}"><span class="cl-r">${medal(i)}</span><b>${h(r.p)}${r.me ? " (toi)" : ""}</b><span class="cl-v"><b>${r.dsc}</b>/10</span><span class="cl-s">${fmtT(r.dt)}</span></li>`).join("")}</ol>` : `<div class="empty">Personne n'a encore fait le défi de cette semaine. Lance-toi !</div>`);
  const rs = rank(sem), rd = rank(df);
  return head + `<section class="stack">
    ${defiCard(dw)}
    <div class="cl-head"><div class="pf-seg" role="group"><button type="button" data-act="clTab" data-v="sem" aria-pressed="${CL.tab === "sem"}">Cette semaine</button><button type="button" data-act="clTab" data-v="defi" aria-pressed="${CL.tab === "defi"}">Défi de la semaine</button></div>
      <div class="pf-seg" role="group" aria-label="Qui afficher"><button type="button" data-act="clFil" data-v="all" aria-pressed="${CL.fil !== "amis"}">Toute la classe</button><button type="button" data-act="clFil" data-v="amis" aria-pressed="${CL.fil === "amis"}">Mes amis</button></div>
      <button class="btn small" data-act="clRefresh" ${CL.busy ? "disabled" : ""}>${CL.busy ? "Mise à jour…" : "Actualiser"}</button></div>
    ${CL.err ? `<p class="bk-err">${h(CL.err)}</p>` : !d ? `<div class="empty">Chargement du classement…</div>` : `<p class="muted small" style="margin:0">${CL.tab === "sem" ? `Classement par questions devenues acquises cette semaine (réussies deux jours différents, à 3 jours d'écart au moins).${rs ? ` Tu es ${rs}${rs === 1 ? "er" : "e"} sur ${sem.length}.` : ""}` : `Mêmes 10 questions pour tout le monde ; seul ton premier essai compte.${rd ? ` Tu es ${rd}${rd === 1 ? "er" : "e"} sur ${df.length}.` : ""}`}</p>${tbl}`}
    <div class="row"><button class="btn small" data-act="clLeave">Quitter le classement</button><span class="muted small">Pseudo : ${h(cl.p || "")}</span></div>
  </section>`;
}
function defiCard(dw) {
  return `<div class="cl-defi"><div><span class="eyebrow">Défi de la semaine</span><b>10 questions des matières pro, les mêmes pour toute la classe</b><span class="muted">${dw ? `Ton score : <b>${dw.sc}/10</b> en ${fmtT(dw.t)}. Tu peux le refaire pour t'entraîner : seul le premier essai compte.` : "7 min 30 maximum, sans correction avant la fin. Seul ton premier essai compte."}</span></div><button class="btn ${dw ? "" : "primary"}" data-act="clDefi">${dw ? "Refaire" : "Relever le défi"}</button></div>`;
}
function classeCard() {
  if (typeof window.GL_CLASS !== "function") return "";
  const on = S.cl && S.cl.on, dw = defiDone() ? S.dw : null;
  let txt = on ? "Vois où tu en es par rapport à la classe cette semaine." : "Compare ta semaine avec tes camarades, si tu le souhaites.";
  if (on && CL.data) { const sem = CL.data.rows.slice().sort((a, b) => b.acq - a.acq || b.days - a.days); const i = sem.findIndex(r => r.me); if (i >= 0) txt = `Tu es ${i + 1}${i === 0 ? "er" : "e"} sur ${sem.length} cette semaine, avec ${sem[i].acq} question${sem[i].acq > 1 ? "s" : ""} acquise${sem[i].acq > 1 ? "s" : ""}.`; }
  if (on) loadClass();
  return `<button class="wk-cta cl-cta" data-act="goClasse"><span class="wk-ic">${ICON.target}</span><span><b>Classe et défi de la semaine</b><small>${h(txt)}${dw ? ` Défi : ${dw.sc}/10.` : " Défi pas encore relevé."}</small></span><span class="wk-go">Voir ›</span></button>`;
}
function finishExam() {
  if (!R || R.mode !== "exam" || R.done) return;
  R.done = true; if (!R.dw) wlog("ex", "all");
  if (examTick) { clearInterval(examTick); examTick = null; }
  R.list.forEach(x => recordQ(x.it, x.pick !== null && x.order[x.pick] === 0, x.pick !== null ? x.it.o[x.order[x.pick]] : ""));
  if (R.ctrl) { const good = R.list.filter(x => x.pick !== null && x.order[x.pick] === 0).length, pc = Math.round(good / R.list.length * 100); S.ctl = S.ctl || {}; (S.ctl[R.ctrl] = S.ctl[R.ctrl] || []).push({ d: dayNum(), pc }); if (S.ctl[R.ctrl].length > 20) S.ctl[R.ctrl].shift(); R.ctlRes = chapStatus(R.ctrl); if (R.ctlRes.ok && pc >= 80) S.xp += 40; }
  if (R.pack != null && S.packs && S.packs[R.pack]) { const good = R.list.filter(x => x.pick !== null && x.order[x.pick] === 0).length, p = S.packs[R.pack]; p.hist = p.hist || []; wlog("pk", "all"); p.hist.push({ d: Date.now(), pc: Math.round(good / R.list.length * 100) }); if (p.hist.length > 20) p.hist.shift(); }
  if (R.dw && !defiDone()) { const good = R.list.filter(x => x.pick !== null && x.order[x.pick] === 0).length; S.dw = { w: weekId(), sc: good, t: Math.round((Date.now() - (R.t0 || Date.now())) / 1000) }; CL.at = 0; }
  dayLog().e++; touch(); go("result");
}
function vResult() {
  if (!R) return vHome();
  const good = R.list.filter(x => x.pick !== null && x.order[x.pick] === 0);
  const bad = R.list.filter(x => !(x.pick !== null && x.order[x.pick] === 0));
  const total = R.list.length;
  const note = Math.round(good.length / total * 20 * 10) / 10;
  const byCat = {};
  R.list.forEach(x => { const k = x.it.c; byCat[k] = byCat[k] || [0, 0]; byCat[k][1]++; if (x.pick !== null && x.order[x.pick] === 0) byCat[k][0]++; });
  const rows = Object.keys(byCat).map(k => `<tr><td><span class="mono">${h(CAT[k].code)}</span> ${h(CAT[k].name)}</td><td class="num debit">${byCat[k][0]}</td><td class="num credit">${byCat[k][1] - byCat[k][0]}</td></tr>`).join("");
  const review = bad.map(x => `<div class="review-item">
      <span class="ep" style="align-self:flex-start">${h(CAT[x.it.c].code)} · ${h(CAT[x.it.c].name)}</span>
      <p class="q">${h(x.it.q)}</p>
      ${x.pick !== null ? `<p class="y">Ta réponse : ${h(x.it.o[x.order[x.pick]])}</p>` : `<p class="y">Pas de réponse</p>`}
      <p class="a">Bonne réponse : ${h(x.it.o[0])}</p>
      <p class="e">${h(x.it.e)}</p>
      ${qxHTML(x.it)}
      ${x.it.ch && CHID[x.it.ch] ? `<button class="btn small peek-cta" data-act="fichePeek" data-id="${h(x.it.ch)}" data-hint="${h(x.it.o[0] + "\u241E" + x.it.q + " " + x.it.e)}">${ICON.book}Revoir la fiche</button>` : ""}
      <button class="rep-btn" data-act="report" data-t="q" data-id="${h(x.it.id)}" data-l="${h(String(x.it.q).slice(0, 140))}">Signaler une erreur</button>
    </div>`).join("");
  return `<section class="runner">
    <div><span class="eyebrow">${R.ctrl ? "Contrôle de chapitre" : R.mode === "exam" ? "QCM chronométré" : R.title ? "Bilan : " + h(R.title) : "Bilan du quiz"}</span><h1>${R.ctrl ? h(chLabel(R.ctrl)) : R.mode === "exam" ? "Ta copie est corrigée" : "Ton grand livre de la session"}</h1></div>
    ${R.pack != null && S.packs && S.packs[R.pack] ? `<div class="ctl-ban"><b>Contrôle blanc : ${packName(S.packs[R.pack])}</b><span><button class="btn small" data-act="pkOpen" data-i="${R.pack}">Retour au contrôle</button></span></div>` : ""}
    ${R.dw ? `<div class="ctl-ban ${S.dw && S.dw.w === weekId() ? "ok" : ""}"><b>Défi de la semaine</b><span>Score retenu pour le classement : ${S.dw ? S.dw.sc : 0}/10 en ${fmtT(S.dw ? S.dw.t : 0)}. <button class="btn small" data-act="goClasse">Voir le classement</button></span></div>` : ""}
    ${R.ctrl && R.ctlRes ? (() => { const st = R.ctlRes, pc = pct(good.length, total); return st.ok ? `<div class="ctl-ban ok"><b>✓ Chapitre validé</b><span>Tu as réussi ce contrôle deux jours différents : c'est acquis. +40 XP. Il reviendra dans tes révisions pour vérifier que tu ne l'oublies pas.</span></div>`
      : pc >= 80 ? `<div class="ctl-ban mid"><b>Réussi : ${st.pass.length} sur 2</b><span>${st.pass.length >= 2 ? "Encore une réussite après le " + dayLabel(st.pass[0] + 3) + " pour valider." : "Repasse ce contrôle à partir du " + dayLabel(st.pass[0] + 3) + " : s'il est encore réussi, le chapitre est validé."}</span></div>`
      : `<div class="ctl-ban ko"><b>Pas encore validé (${pc} %)</b><span>Il faut 80 %. Relis la fiche du chapitre et retravaille tes erreurs, puis repasse le contrôle demain.</span></div>`; })() : ""}
    ${(() => { const pc = pct(good.length, total), C = 2 * Math.PI * 52, msg = pc >= 90 ? ["Excellent !", "Tu maîtrises : passe à un autre chapitre ou augmente la difficulté."] : pc >= 70 ? ["Très bien !", "Encore quelques points à consolider, regarde les corrections."] : pc >= 50 ? ["Pas mal, continue", "Relis les corrections puis refais tes erreurs tout de suite."] : ["On s'accroche !", "Relis la fiche du chapitre, puis refais tes erreurs : c'est comme ça qu'on progresse."];
      return `<div class="res-hero"><div class="ring" style="--pc:${pc}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg${pc >= 70 ? " good" : pc >= 50 ? " mid" : " low"}" cx="60" cy="60" r="52" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - pc / 100)).toFixed(1)}" style="--c0:${C.toFixed(1)}"/></svg><div class="ring-t"><b>${R.mode === "exam" ? String(note).replace(".", ",") : good.length}<small>${R.mode === "exam" ? "/20" : "/" + total}</small></b><span>${pc} %</span></div></div>
        <div class="res-msg"><b>${msg[0]}</b><p>${msg[1]}</p><span class="res-xp">+${S.xp - R.xp0} XP</span></div></div>`; })()}
    <div class="table-wrap"><table class="ledger">
      <thead><tr><th>Libellé</th><th class="num">Débit · acquis</th><th class="num">Crédit · à revoir</th></tr></thead>
      <tbody>${rows}
        <tr class="total"><td>Total</td><td class="num debit">${good.length}</td><td class="num credit">${bad.length}</td></tr>
        <tr><td>Solde</td><td class="num" colspan="2">${pct(good.length, total)} % de réussite</td></tr>
      </tbody>
    </table></div>
    <div class="row">
      ${bad.length ? `<button class="btn primary" data-act="redoErrors">Refaire ces ${bad.length} erreurs</button><button class="btn" data-act="goErr">${ICON.errbook}Cahier des erreurs</button>` : ""}
      <button class="btn" data-act="${R.mode === "exam" ? "goExam" : "goQuiz"}">${R.mode === "exam" ? "Nouveau QCM chronométré" : "Nouveau quiz"}</button>
      ${origBtn("primary")}<button class="btn" data-act="goHome">Accueil</button>
      ${nextBtn(true)}
    </div>
    ${(() => { const ks = {}; bad.forEach(x => { const k = chKey(x.it); ks[k] = (ks[k] || 0) + 1; }); const list = Object.entries(ks).sort((a, b) => b[1] - a[1]); return list.length ? `<div class="res-ch"><h2>Chapitres à retravailler</h2><div class="res-ch-l">${list.map(([k, n]) => `<button class="res-chip" style="${hueStyle(chCat(k))}" data-act="weakPick" data-k="${h(k)}"><span>${h(chLabel(k))}</span><small>${n} erreur${n > 1 ? "s" : ""} · retravailler ›</small></button>`).join("")}</div></div>` : ""; })()}
    ${bad.length ? `<h2>Corrections</h2><div class="review">${review}</div>` : `<div class="empty">Aucune erreur. Le compte est soldé.</div>`}
  </section>`;
}

/* Cartes */
/* Cahier des erreurs */
let EF = { cat: "", ks: null, st: "todo" };
function errList() { return QS.map(x => { const r = S.q[x.id]; return r && r[0] - r[1] > 0 ? { x, n: r[0] - r[1], ok: r[2] === 1, w: (S.ew || {})[x.id] } : null; }).filter(Boolean); }
function errFiltered() {
  return errList().filter(e => (!EF.cat || e.x.c === EF.cat) && (!EF.ks || EF.ks.includes(chKey(e.x))) && (EF.st === "all" || (EF.st === "todo" ? !e.ok : e.ok)))
    .sort((a, b) => (a.ok - b.ok) || b.n - a.n);
}
function vErreurs() {
  const all = errList();
  const head = `<div><span class="eyebrow">S'entraîner</span><h1>Cahier des erreurs</h1></div>
    <p class="muted">Chaque question où tu t'es trompé est gardée ici, avec la bonne réponse et l'explication. Les plus fréquentes passent en premier. Une question est « corrigée » quand ta dernière réponse est juste.</p>`;
  if (!all.length) return `<section class="stack eb">${head}<div class="empty">Aucune erreur pour l'instant. Dès que tu te trompes à un quiz, la question arrive ici.</div><div class="row"><button class="btn primary" data-act="goQuiz">Faire un quiz</button></div></section>`;
  const todo = all.filter(e => !e.ok).length, tot = all.reduce((t, e) => t + e.n, 0);
  const byCh = {}; all.forEach(e => { const k = chKey(e.x), o = byCh[k] || (byCh[k] = { k, c: e.x.c, n: 0, q: 0 }); o.n += e.n; o.q++; });
  const top = Object.values(byCh).sort((a, b) => b.n - a.n || b.q - a.q).slice(0, 5);
  const cats = CATS.filter(c => all.some(e => e.x.c === c.id));
  const list = errFiltered(), shown = list.slice(0, 60);
  const one = EF.ks && EF.ks.length === 1 ? EF.ks[0] : null;
  const fiches = (EF.ks || []).filter(k => CHID[k]);
  const stB = (v, l) => `<button class="eb-f${EF.st === v ? " on" : ""}" data-act="ebSt" data-v="${v}">${l}</button>`;
  const wk = EF.ks ? [] : weakChaps(3);
  return `<section class="stack eb">${head}
    <div class="eb-sum"><div><b>${all.length}</b><span>question${all.length > 1 ? "s" : ""} ratée${all.length > 1 ? "s" : ""}</span></div><div><b>${tot}</b><span>erreur${tot > 1 ? "s" : ""} au total</span></div><div><b>${todo}</b><span>encore à revoir</span></div><div><b>${all.length - todo}</b><span>corrigée${all.length - todo > 1 ? "s" : ""} depuis</span></div></div>
    ${wk.length ? `<div class="stack"><h2>Tes points faibles</h2><p class="muted">Chapitres sous 80 % de réussite. Touche « Retravailler » pour t'entraîner, relire la fiche ou relire tes erreurs.</p>${weakList(3)}</div>` : ""}
    ${EF.ks ? "" : `<div class="stack"><h2>Où tu te trompes le plus</h2>
      <div class="res-ch-l">${top.map(o => `<button class="res-chip" style="${hueStyle(o.c)}" data-act="ebCh" data-k="${h(o.k)}"><span>${h(chLabel(o.k))}</span><small>${o.n} erreur${o.n > 1 ? "s" : ""} sur ${o.q} question${o.q > 1 ? "s" : ""} · voir ›</small></button>`).join("")}</div></div>`}
    <div class="eb-bar">
      <div class="eb-fl"><button class="eb-f${!EF.cat && !EF.ks ? " on" : ""}" data-act="ebCat" data-cat="">Toutes les matières</button>${cats.map(c => `<button class="eb-f${EF.cat === c.id ? " on" : ""}" data-act="ebCat" data-cat="${c.id}">${h(c.code)}</button>`).join("")}</div>
      <div class="eb-fl">${stB("todo", "À revoir")}${stB("ok", "Corrigées")}${stB("all", "Toutes")}</div>
      ${EF.ks ? `<div class="eb-fl"><span class="eb-tag">${one ? h(chLabel(one)) : EF.ks.length + " chapitres"}<button data-act="ebClear" aria-label="Retirer le filtre">×</button></span></div>` : ""}
    </div>
    <div class="row">${list.length ? `<button class="btn primary" data-act="ebTrain">M'entraîner sur ${list.length > 20 ? "20 de ces" : list.length === 1 ? "cette" : "ces " + list.length} erreur${list.length > 1 ? "s" : ""}</button>` : ""}${fiches.map(k => `<button class="btn" data-act="fichePeek" data-id="${k}">Relire la fiche${fiches.length > 1 ? " : " + h(CHID[k].title) : ""}</button>`).join("")}</div>
    ${shown.length ? `<div class="review eb-list">${shown.map(e => `<div class="review-item eb-it" style="${hueStyle(e.x.c)}">
      <div class="eb-h"><span class="tabcode">${h(CAT[e.x.c].code)}</span><small>${h(chLabel(chKey(e.x)))}</small><span class="eb-n">${e.n} erreur${e.n > 1 ? "s" : ""}</span><span class="eb-st ${e.ok ? "ok" : "ko"}">${e.ok ? "Corrigée" : "À revoir"}</span></div>
      <p class="q">${h(e.x.q)}</p>
      ${e.w && e.w.t ? `<p class="y">Ta dernière erreur : ${h(e.w.t)}</p>` : ""}
      <p class="a">Bonne réponse : ${h(e.x.o[0])}</p>
      ${e.x.e ? `<p class="e">${h(e.x.e)}</p>` : ""}
      <button class="rep-btn" data-act="report" data-t="q" data-id="${h(e.x.id)}" data-l="${h(String(e.x.q).slice(0, 140))}">Signaler une erreur</button>
    </div>`).join("")}</div>${list.length > shown.length ? `<p class="muted small">Et ${list.length - shown.length} autres : filtre par matière pour les voir.</p>` : ""}` : `<div class="empty">${EF.st === "todo" ? "Tout est corrigé dans cette sélection. Choisis « Toutes » pour relire tes anciennes erreurs." : "Rien dans cette sélection."}</div>`}
  </section>`;
}
function weakSheet(k) {
  closeSheet();
  const ks = k === "*" ? weakChaps(5).map(o => o.k) : [k], one = ks.length === 1 ? ks[0] : null, fiches = ks.filter(x => CHID[x]);
  const nErr = errList().filter(e => ks.includes(chKey(e.x))).length;
  const el = document.createElement("div"); el.className = "wk-sheet"; el.id = "wkSheet";
  el.innerHTML = `<div class="wk-box" role="dialog" aria-modal="true" aria-labelledby="wkT">
    <button class="wk-x" data-act="wkClose" aria-label="Fermer">×</button>
    <span class="eyebrow">${one ? "Point faible" : "Tes points faibles"}</span><h2 id="wkT">${one ? h(chLabel(one)) : ks.map(x => h(chLabel(x))).join(" · ")}</h2>
    <p class="muted">Tu veux t'entraîner tout de suite, ou relire avant ?</p>
    <div class="wk-opts">
      <button class="wk-opt" data-act="wkTrain" data-k="${h(k)}"><b>${ICON.target}S'entraîner</b><span>Quiz de ${quizLen} questions, en commençant par celles que tu as ratées.</span></button>
      ${one && CHID[one] ? `<button class="wk-opt" data-act="wkFiche" data-id="${one}"><b>${ICON.book}Relire la fiche</b><span>La fiche de cours du chapitre, pour reprendre les bases.</span></button>` : ""}
      <button class="wk-opt" data-act="wkErr" data-k="${h(k)}" ${nErr ? "" : "disabled"}><b>${ICON.errbook}Relire mes erreurs</b><span>${nErr ? `${nErr} question${nErr > 1 ? "s" : ""} ratée${nErr > 1 ? "s" : ""}, avec la bonne réponse et l'explication.` : "Aucune erreur enregistrée ici."}</span></button>
    </div>
    ${!one && fiches.length ? `<div class="wk-read"><b>${ICON.book}Relire une fiche</b><div>${fiches.map(id => `<button class="btn small" data-act="wkFiche" data-id="${id}">${h(CHID[id].title)}</button>`).join("")}</div></div>` : ""}
  </div>`;
  el.addEventListener("click", e => { if (e.target === el) closeSheet(); });
  document.body.appendChild(el);
  const f = el.querySelector(".wk-opt"); if (f) f.focus();
}
const REP_KIND = { q: "Question de quiz", c: "Flashcard", l: "Leçon", f: "Fiche", o: "Question d'oral", i: "Avis sur le Grand Livre" };
const REP_CHOICES = { q: ["La bonne réponse est fausse", "Plusieurs réponses sont justes", "L'explication est fausse ou pas claire", "Faute de frappe ou de français", "Autre"],
  c: ["Le verso est faux", "Ce n'est pas clair", "Faute de frappe ou de français", "Autre"], l: ["Une information est fausse", "Ce n'est pas clair", "Information plus à jour", "Faute de frappe ou de français", "Autre"],
  f: ["Une information est fausse", "Ce n'est pas clair", "Information plus à jour", "Faute de frappe ou de français", "Autre"], o: ["Un élément attendu est faux", "Il manque un élément important", "Autre"],
  i: ["Une idée d'amélioration", "Il manque un cours, un quiz ou un exercice", "Quelque chose ne marche pas (bug)", "J'aime bien", "Autre"] };
function reportSheet(t, id, label) {
  closeSheet();
  const el = document.createElement("div"); el.className = "wk-sheet"; el.id = "wkSheet";
  el.innerHTML = `<form class="wk-box rep-box" role="dialog" aria-modal="true" aria-labelledby="repT">
    <button type="button" class="wk-x" data-act="wkClose" aria-label="Fermer">×</button>
    <span class="eyebrow">${h(REP_KIND[t] || "Contenu")}</span><h2 id="repT">${t === "i" ? "Ton avis compte" : "Signaler une erreur"}</h2>
    ${t === "i" ? `<p class="muted rep-l">Une idée, un manque, un bug ? Écris-le ici : chaque message est lu.</p>` : `<p class="muted rep-l">« ${h(label)} »</p>`}
    <fieldset class="rep-ch"><legend class="sr-only">Type de problème</legend>${(REP_CHOICES[t] || REP_CHOICES.q).map((c, i) => `<label><input type="radio" name="rc" value="${h(c)}"${i === 0 ? " checked" : ""}><span>${h(c)}</span></label>`).join("")}</fieldset>
    ${t === "i" ? `<label class="rep-c"><span>Ton message</span><textarea name="cm" rows="5" maxlength="1500" required placeholder="Ex. : ce serait bien d'avoir un quiz sur les articles du Code civil, ou : le bouton retour ne marche pas sur téléphone."></textarea></label>` : `<label class="rep-c"><span>Précise si tu peux (facultatif)</span><textarea name="cm" rows="3" maxlength="600" placeholder="Ex. : la TVA sur les services est exigible à l'encaissement, pas à la livraison."></textarea></label>`}
    <div class="row"><button type="button" class="btn" data-act="wkClose">Annuler</button><button type="submit" class="btn primary">Envoyer</button></div>
  </form>`;
  el.addEventListener("click", e => { if (e.target === el) closeSheet(); });
  el.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, r = { t, id: String(id), l: String(label).slice(0, 200), ch: f.rc.value, cm: f.cm.value.trim().slice(0, t === "i" ? 1500 : 600), d: Date.now(), v: view };
    if (t === "i" && !r.cm) { f.cm.focus(); return; }
    const b = f.querySelector('[type="submit"]'); b.disabled = true;
    let sent = false;
    if (typeof window.GL_REPORT === "function") { try { await window.GL_REPORT(r); sent = true; } catch (x) {} }
    if (!sent) { S.rp = S.rp || []; S.rp.unshift(r); if (S.rp.length > 100) S.rp.pop(); touch(); }
    closeSheet(); toast(sent ? (t === "i" ? "Merci ! Ton message est envoyé." : "Merci ! Ton signalement est envoyé.") : t === "i" ? "Envoi impossible pour l'instant : crée un compte ou réessaie en ligne." : "Signalement noté dans ton profil.");
  });
  document.body.appendChild(el);
  const f = el.querySelector("input"); if (f) f.focus();
}
function lockSheet(c) {
  closeSheet();
  const el = document.createElement("div"); el.className = "wk-sheet"; el.id = "wkSheet";
  const n = CATS.filter(x => !GUEST_CATS.includes(x.id)).length;
  el.innerHTML = `<div class="wk-box" role="dialog" aria-modal="true" aria-labelledby="lkT">
    <button class="wk-x" data-act="wkClose" aria-label="Fermer">×</button>
    <span class="eyebrow">${c && CAT[c] ? h(CAT[c].code + " · " + CAT[c].name) : "Contenu réservé"}</span><h2 id="lkT">Disponible avec un compte</h2>
    <p class="muted">L'essai ouvre <b>P1 Opérations commerciales</b> et la <b>CEJM</b>. Crée ton compte, c'est gratuit et prêt en 10 secondes, pour débloquer les ${n} autres matières et leurs exercices, le classement et les rappels. Ce que tu as fait pendant l'essai est gardé.</p>
    <div class="row"><button class="btn" data-act="wkClose">Plus tard</button><a class="btn primary" href="/#signup">Créer mon compte</a></div>
  </div>`;
  el.addEventListener("click", e => { if (e.target === el) closeSheet(); });
  document.body.appendChild(el);
}
function closeSheet() { const x = document.getElementById("wkSheet"); if (x) x.remove(); }
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
function weakChaps(limit) {
  const by = {};
  QS.forEach(x => { const r = S.q[x.id]; if (!r || !r[0]) return; const k = chKey(x), o = by[k] || (by[k] = { k, c: x.c, n: 0, ok: 0, last0: 0 }); o.n++; if (r[2] === 1) o.ok++; else o.last0++; });
  return Object.values(by).filter(o => o.n >= 3 && o.ok / o.n < .8).sort((a, b) => a.ok / a.n - b.ok / b.n || b.n - a.n).slice(0, limit || 5);
}
function chLabel(k) { return CHID[k] ? CHID[k].title : CAT[chCat(k)].name + " : questions transversales"; }
function watchChaps(limit) {
  const by = {};
  QS.forEach(x => { const r = S.q[x.id]; if (!r || !r[0]) return; const k = chKey(x), o = by[k] || (by[k] = { k, c: x.c, n: 0, ok: 0, last0: 0 }); o.n++; if (r[2] === 1) o.ok++; else o.last0++; });
  return Object.values(by).filter(o => o.last0 > 0).sort((a, b) => b.last0 - a.last0 || a.ok / a.n - b.ok / b.n).slice(0, limit || 5);
}
function weakList(limit) {
  let w = weakChaps(limit), watch = false;
  if (!w.length) { w = watchChaps(limit); watch = true; }
  const answered = Object.keys(S.q || {}).length;
  if (!w.length) return `<div class="empty">${answered ? `Aucune erreur pour l'instant sur tes ${answered} question${answered > 1 ? "s" : ""} : continue les quiz, les chapitres où tu te trompes apparaîtront ici.` : "Pas encore de point faible repéré : fais quelques quiz et les chapitres où tu te trompes apparaîtront ici."}</div>`;
  return (watch ? `<p class="muted small wk-note">Encore peu de réponses par chapitre : voici les chapitres où tu as déjà fait des erreurs. Le classement s'affine à partir de 3 questions par chapitre.</p>` : "") + `<div class="wk-list">${w.map(o => { const pc = Math.round(o.ok / o.n * 100); return `<div class="wk" style="${hueStyle(o.c)}"><span class="tabcode">${h(CAT[o.c].code)}</span><div class="wk-t"><b>${h(chLabel(o.k))}</b><span class="wk-bar"><i style="width:${pc}%"></i></span><small>${pc} % de réussite sur ${o.n} question${o.n > 1 ? "s" : ""}${o.last0 ? ` · ${o.last0} à revoir` : ""}</small></div><button class="btn small primary" data-act="weakPick" data-k="${h(o.k)}">Retravailler</button></div>`; }).join("")}</div>`;
}
function heatmap() {
  const H = S.h || {}, d0 = dayNum(), weeks = 16, today = new Date(), dow = (today.getDay() + 6) % 7;
  const start = d0 - dow - (weeks - 1) * 7, cells = [], max = Math.max(5, ...Object.values(H));
  let active = 0, total = 0;
  for (let w = 0; w < weeks; w++) { let col = ""; for (let j = 0; j < 7; j++) { const d = start + w * 7 + j; if (d > d0) { col += `<i class="hm-x"></i>`; continue; } const n = H[d] || 0; if (n) { active++; total += n; } const lv = n ? Math.min(4, Math.ceil(n / max * 4)) : 0; const dt = new Date(today.getTime() - (d0 - d) * 86400000); col += `<i class="hm-${lv}${d === d0 ? " hm-today" : ""}" title="${dt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} : ${n} activité${n > 1 ? "s" : ""}"></i>`; } cells.push(`<span class="hm-col">${col}</span>`); }
  return `<div class="hm-wrap no-swipe"><div class="hm-days" aria-hidden="true"><span>L</span><span></span><span>M</span><span></span><span>V</span><span></span><span>D</span></div><div class="hm">${cells.join("")}</div></div>
    <div class="hm-foot"><span><b>${active}</b> jour${active > 1 ? "s" : ""} de révision sur les 16 dernières semaines · <b>${total}</b> réponses et leçons</span><span class="hm-leg">Moins <i class="hm-0"></i><i class="hm-1"></i><i class="hm-2"></i><i class="hm-3"></i><i class="hm-4"></i> Plus</span></div>`;
}
function seg(k, opts) {
  const v = P()[k];
  return `<div class="pf-seg" role="group">${opts.map(([val, lab]) => `<button type="button" data-act="pref" data-k="${k}" data-v="${val}" aria-pressed="${String(v) === String(val)}">${lab}</button>`).join("")}</div>`;
}
let BK = { pending: null, when: "", err: "" };
function bkData() { return JSON.stringify({ app: "grand-livre-bts-cg", at: new Date().toISOString(), data: S }); }
function bkCheck(txt) {
  let o; try { o = JSON.parse(txt); } catch (e) { return null; }
  const d = o && o.app === "grand-livre-bts-cg" ? o.data : o;
  if (!d || d.v !== 1 || typeof d.q !== "object" || typeof d.c !== "object" || typeof d.xp !== "number") return null;
  return { d, at: o.at || (d.u ? new Date(d.u).toISOString() : "") };
}
function bkApply(d) {
  try { localStorage.setItem("gl-backup-prev", JSON.stringify(S)); } catch (e) {}
  S = JSON.parse(JSON.stringify(d)); normS(); if (syncUid) S.uid = syncUid; S.u = Date.now(); renderTop.xp = S.xp; dirty = true; forceSave = true; touch(); render();
}
/* Versions de la progression gardées par le serveur (sauvegardes quotidiennes) */
let PV = { list: null, busy: false, err: "" };
function pvLoad(force) {
  if (!window.GL_PV || PV.busy || (PV.list && !force)) return; PV.busy = true;
  window.GL_PV.list().then(j => { PV.list = j.versions || []; PV.err = ""; }).catch(e => { PV.err = (e && e.message) || "Impossible de charger les versions."; PV.list = PV.list || []; }).then(() => { PV.busy = false; if (view === "profil") render(); });
}
function pvSection() {
  if (!window.GL_PV) return ""; pvLoad();
  const fd = t => new Date(t).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  return `<section class="stack"><div class="sec-head"><h2>Récupérer une ancienne version</h2><p>Le serveur garde une copie de ta progression chaque jour (7 derniers jours), plus la version d'avant le dernier remplacement. Tu peux revenir à l'une d'elles.</p></div>
    ${!PV.list ? `<div class="empty">Chargement des versions…</div>` : !PV.list.length ? `<div class="empty">${PV.err ? h(PV.err) : "Pas encore de version sauvegardée."}</div>` : `<div class="pf-set">${PV.list.map(v => `<div class="pf-row"><div><b>${v.id === "pp" ? "Avant le dernier remplacement" : "Sauvegarde du " + h(fd(v.at))}</b><span>${v.xp} XP · ${v.q} questions travaillées · ${v.l} leçons lues${v.u ? " · dernière activité " + h(fd(v.u)) : ""}</span></div><button class="btn small" data-act="pvRestore" data-id="${h(v.id)}" data-xp="${v.xp}">Restaurer</button></div>`).join("")}</div>`}
    <p class="muted small">Ta progression actuelle (${S.xp} XP) est gardée de côté avant toute restauration : tu peux annuler en restaurant « Avant le dernier remplacement ».</p></section>`;
}
let PFT = (() => { let t = "prog"; try { t = localStorage.getItem("gl-pft") || "prog"; } catch (e) {} return { t: ["prog", "set", "acc"].includes(t) ? t : "prog", lad: false }; })();
function vProfil() {
  const p = P(), L = levelOf(S.xp), span = L.next ? L.next - L.floor : 1, prog = L.next ? Math.round((S.xp - L.floor) / span * 100) : 100;
  const tl = totalLessons(), known = FS.filter(x => S.c[x.id] && S.c[x.id][0] >= 3).length, seen = FS.filter(x => S.c[x.id]).length;
  const qa = Object.values(S.q), tries = qa.reduce((a, r) => a + r[0], 0), oks = qa.reduce((a, r) => a + r[1], 0);
  const name = p.name || window.GL_NAME || "", ini = (name.trim() ? name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2) : "BTS").toUpperCase();
  const st = streakNow(), best = (S.df || {}).best || 0, ex = exCount(), dl = daysLeft();
  const lvIdx = LEVELS.reduce((a, l, i) => S.xp >= l[0] ? i : a, 0);
  const tiles = [
    [st, st > 1 ? "jours d'affilée" : "jour d'affilée", "Série en cours"],
    [`${tl.r}<small>/${tl.n}</small>`, "leçons lues", "Cours"],
    [`${known}<small>/${FS.length}</small>`, "cartes bien sues", `${seen} déjà vues`],
    [`${QS.filter(x => qState(x.id) >= 2).length}<small>/${QS.length}</small>`, "questions acquises", `+${weekAcq().n} cette semaine · ${weekAcq().soon} en bonne voie`],
    [`${validCount().v}<small>/${validCount().n}</small>`, "chapitres validés", "Contrôles réussis 2 fois"],
    [tries ? Math.round(oks / tries * 100) + "<small> %</small>" : "–", "de bonnes réponses", `${oks} sur ${tries} réponses`],
    [ex, "exercices pratiqués", "Guidés et annales"],
    [best, "record au défi 60 s", "Bonnes réponses en 1 min"]
  ];
  const pcs = (a, b) => { if (!b || !a) return 0; const v = a / b * 100; return v < 1 ? Math.round(v * 10) / 10 : Math.round(v); };
  const pTxt = v => (v > 0 && v < 1 ? String(v).replace(".", ",") : v) + " %";
  let anyWorked = 0, anyMast = 0;
  const mats = CATS.map(c => { const ls = lessonStats(c.id), m = mastery(c.id), qs = QBY[c.id] || [], fs = FBY[c.id] || [];
    const wk = qs.filter(x => S.q[x.id]).length + fs.filter(x => S.c[x.id]).length, lp = pcs(ls.r, ls.n), wp = pcs(wk, m.t), mp = pcs(m.m, m.t);
    anyWorked += wk; anyMast += m.m;
    const arc = (r, p, cls) => { const C2 = 2 * Math.PI * r, off = C2 * (1 - Math.min(100, p) / 100); return `<circle class="pr-bg" cx="32" cy="32" r="${r}"/><circle class="pr-fg ${cls}" cx="32" cy="32" r="${r}" style="--c0:${C2.toFixed(1)};stroke-dasharray:${C2.toFixed(1)};stroke-dashoffset:${off.toFixed(1)}"/>`; };
    return `<button class="pf-mat pf-mat-r" style="${hueStyle(c.id)}" data-act="mat" data-cat="${c.id}" data-seg="lecons"><span class="tabcode">${h(c.code)}</span><span class="pf-mat-n">${h(c.name)}</span>
      <svg class="pf-ring" viewBox="0 0 64 64" aria-hidden="true">${arc(28, lp, "l")}${arc(21, wp, "w")}${arc(14, mp, "m")}</svg>
      <span class="pf-mat-v">${pTxt(lp)} <small>lu</small> · ${pTxt(wp)} <small>travaillé</small> · ${pTxt(mp)} <small>maîtrisé</small></span></button>`; }).join("");
  const firstOk = Object.values(S.qd || {}).map(o => o.ok && o.ok[0]).filter(Boolean).sort((a, b) => a - b)[0];
  const mastNote = anyWorked && !anyMast ? `<p class="muted small pf-note">« Maîtrisé » ne compte que ce que tu as réussi <b>deux jours différents, à au moins 3 jours d'écart</b> : c'est la preuve que c'est retenu, pas juste vu. ${firstOk ? `Tes premières questions pourront devenir acquises à partir du <b>${dayLabel(firstOk + 3)}</b> : la révision des acquis te les reproposera.` : ""}</p>` : "";
  return `<section class="pf-hero">
      <div class="pf-id">
        <button class="pf-av${avMine() ? " has-av" : ""}" data-act="avPick" aria-label="Choisir mon avatar">${avMine() ? avSvg(avMine()) : h(ini)}<span class="pf-av-ed" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z"/></svg></span></button>
        <div class="pf-who"><span class="eyebrow">Mon profil</span><h1>${name ? h(name) : "Ton profil"}</h1><p class="pf-lvl">${h(L.name)} · <b>${S.xp} XP</b></p></div>
        ${dl !== null ? `<div class="pf-count"><b>J-${dl}</b><span>avant les écrits</span></div>` : ""}
      </div>
      <div class="pf-xp"><div class="pf-xp-bar"><i style="width:${prog}%"></i></div>
        <p>${L.next ? `Encore <b>${L.next - S.xp} XP</b> pour devenir <b>${h(L.nextName.toLowerCase())}</b>.` : "Niveau maximum atteint : bravo !"}</p></div>
      <details class="pf-more"${PFT.lad ? " open" : ""}><summary>Les 6 niveaux et comment gagner des XP</summary>
      <ol class="pf-ladder">${LEVELS.map((l, i) => `<li class="${i < lvIdx ? "done" : i === lvIdx ? "cur" : ""}"><span class="dot">${i < lvIdx ? "✓" : i + 1}</span><span class="t">${h(l[1])}</span><span class="x">${l[0]} XP</span></li>`).join("")}</ol>
      <p class="pf-how">Un chapitre est validé quand tu réussis son contrôle (80 %) deux jours différents. Tu gagnes des XP en lisant (leçon lue), en répondant juste aux quiz (5 XP la première fois dans la journée, puis 20 XP de bonus quand la question devient acquise), en révisant tes cartes et en réussissant les exercices. Une mauvaise réponse ne rapporte rien : répondre au hasard ne fait pas monter de niveau.</p></details>
    </section>
    <nav class="pf-tabs" role="tablist" aria-label="Sections du profil">${[["prog", "Progression"], ["set", "Réglages"], ["acc", "Compte"]].map(([k, l]) => `<button role="tab" data-act="pfTab" data-t="${k}" aria-selected="${PFT.t === k}">${l}</button>`).join("")}</nav>
    ${PFT.t === "prog" ? `<section class="stack"><h2>Mes chiffres</h2>
      <div class="pf-tiles">${tiles.map(([v, l, sub]) => `<div class="pf-tile"><b>${v}</b><span>${l}</span><small>${sub}</small></div>`).join("")}</div>
    </section>
    <section class="stack"><div class="sec-head"><h2>Mon activité</h2><p>Chaque case est un jour. Plus elle est foncée, plus tu as révisé.</p></div>
      <div class="pf-card">${heatmap()}</div>
    </section>
    <section class="stack"><div class="sec-head"><h2>Mes points faibles</h2><p>Les chapitres où tu te trompes le plus aux quiz.</p></div>
      ${weakList(3)}
      <div class="row"><button class="btn" data-act="goErr">${ICON.errbook}Tout voir dans le cahier des erreurs</button></div>
    </section>
    <section class="stack"><div class="sec-head"><h2>Ma progression par matière</h2><p>Anneau extérieur : <b>leçons lues</b> · milieu : <b>quiz et cartes travaillés</b> · centre : <b>maîtrisés</b>.</p></div>
      ${mastNote}<div class="pf-mats">${mats}</div>
    </section>` : ""}
    ${PFT.t === "set" ? `<section class="stack pf-prefs">
      <div class="pf-set">
        <div class="pf-row"><div><b>Apparence</b><span>Mode jour, mode nuit, ou comme ton appareil.</span></div>${seg("theme", [["auto", "Automatique"], ["light", "Jour"], ["dark", "Nuit"]])}</div>
        <div class="pf-row"><div><b>Taille du texte</b><span>Pour lire plus confortablement.</span></div>${seg("fs", [["m", "Normale"], ["l", "Grande"], ["xl", "Très grande"]])}</div>
        <div class="pf-row"><div><b>Animations</b><span>Coupe les mouvements si tu préfères une appli plus calme.</span></div>${seg("motion", [["on", "Activées"], ["off", "Réduites"]])}</div>
        <div class="pf-row"><div><b>Vibrations</b><span>Une petite vibration à chaque réponse, tampon et niveau (téléphones Android).</span></div>${seg("vib", [["on", "Activées"], ["off", "Coupées"]])}</div>
        <div class="pf-row"><div><b>Visite guidée</b><span>Revoir la présentation de l'appli en 4 étapes.</span></div><button class="btn small" data-act="tourAgain">Relancer</button></div>
        <div class="pf-row"><div><b>Bulles d'explication</b><span>Touche un mot souligné en pointillés pour voir sa définition. Tu peux aussi sélectionner n'importe quel passage (appui long sur mobile) puis toucher « Expliquer ».</span></div>${seg("gt", [["on", "Activées"], ["off", "Coupées"]])}</div>
        <div class="pf-row"><div><b>Sons</b><span>De petits sons discrets : touches, cartes retournées, bonnes et mauvaises réponses, notifications, chronos, niveaux.</span></div>${seg("snd", [["on", "Activés"], ["off", "Coupés"]])}</div>
        <div class="pf-row"><div><b>Questions par quiz</b><span>Pour les boutons « Quiz » de chaque matière.</span></div>${seg("qlen", [[10, "10"], [20, "20"], [40, "40"]])}</div>
        <div class="pf-row"><div><b>Cartes par session</b><span>Pour les cartes du jour et les flashcards d'une matière.</span></div>${seg("clen", [[15, "15"], [30, "30"], [50, "50"]])}</div>
        <div class="pf-row"><div><b>Prénom affiché</b><span>Affiché en haut de ton profil.</span></div><input id="pfName" class="pf-in" aria-label="Prénom affiché" maxlength="40" placeholder="Ton prénom" value="${h(p.name || "")}"></div>
        <div class="pf-row"><div><b>Date des premiers écrits</b><span>Mets celle de ta convocation : le compte à rebours s'y adapte.</span></div><input id="pfDate" class="pf-in" type="date" aria-label="Date des premiers écrits" value="${h(btsState().date)}"></div>
      </div>
      <p class="muted small">Tes réglages sont enregistrés avec ta progression et te suivent sur tes appareils.</p>
    </section>` : ""}
    ${PFT.t === "acc" ? `<div class="pf-settings" aria-hidden="true"></div>${pvSection()}
    <section class="stack"><h2>Ton avis sur le Grand Livre</h2><div class="pf-set"><div class="pf-row"><div><b>Idées, manques, bugs</b><span>Propose une amélioration ou signale un problème. Chaque message est lu.</span></div><button class="btn small primary" data-act="feedback">Donner mon avis</button></div></div></section>
    ${(S.rp || []).length ? `<section class="stack"><div class="sec-head"><h2>Mes signalements</h2><p>${S.rp.length} erreur${S.rp.length > 1 ? "s" : ""} signalée${S.rp.length > 1 ? "s" : ""}, gardée${S.rp.length > 1 ? "s" : ""} ici. Copie-les et envoie-les pour qu'elles soient corrigées.</p></div>
      <div class="rep-list">${S.rp.slice(0, 20).map(r => `<div class="rep-it"><small>${h(REP_KIND[r.t] || r.t)} · ${new Date(r.d).toLocaleDateString("fr-FR")}</small><b>${h(r.ch)}</b><span>« ${h(r.l)} »</span>${r.cm ? `<em>${h(r.cm)}</em>` : ""}</div>`).join("")}</div>
      <div class="row"><button class="btn" data-act="repCopy">Copier mes signalements</button><button class="btn" data-act="repClear">Vider la liste</button></div></section>` : ""}
    <section class="stack"><h2>Sauvegarde de ma progression</h2>
      <div class="pf-set">
        <div class="pf-row"><div><b>Exporter</b><span>Un fichier avec toute ta progression (réponses, cartes, leçons, XP, réglages). Garde-le en lieu sûr.</span></div><div class="row"><button class="btn small" data-act="bkExport">${ICON.archive}Télécharger</button><button class="btn small" data-act="bkCopy">Copier</button></div></div>
        <div class="pf-row"><div><b>Importer</b><span>Remet une sauvegarde à la place de ta progression actuelle. Une copie de l'actuelle est gardée sur cet appareil au cas où.</span></div><label class="btn small file-btn">Choisir un fichier<input type="file" accept=".json,application/json" id="bkFile" hidden></label></div>
        ${BK.pending ? `<div class="pf-row bk-confirm" role="alert"><div><b>Remplacer ta progression ?</b><span>Sauvegarde du ${h(BK.when)} : ${BK.pending.xp || 0} XP, ${Object.keys(BK.pending.q || {}).length} questions travaillées. Actuellement : ${S.xp} XP, ${Object.keys(S.q || {}).length} questions.</span></div><div class="row"><button class="btn small" data-act="bkCancel">Annuler</button><button class="btn small primary" data-act="bkApply">Remplacer</button></div></div>` : ""}
        ${BK.err ? `<p class="bk-err" role="alert">${h(BK.err)}</p>` : ""}
        ${(() => { try { return localStorage.getItem("gl-backup-prev") ? `<div class="pf-row"><div><b>Annuler le dernier import</b><span>Revenir à la progression d'avant l'import.</span></div><button class="btn small" data-act="bkUndo">Revenir en arrière</button></div>` : ""; } catch (e) { return ""; } })()}
      </div>
    </section>` : ""}`;
}
function ctlSection(cat) {
  const L = ctlChaps(cat); if (!L.length) return "";
  const vc = validCount(cat);
  return `<section class="stack ctl-sec" style="${hueStyle(cat)}"><div class="sec-head"><h2>Contrôles de chapitre</h2><p>${vc.v} sur ${vc.n} validé${vc.v > 1 ? "s" : ""}</p></div>
    <p class="muted">10 questions chronométrées, sans correction avant la fin, une fois par jour. Un chapitre est <b>validé</b> quand tu réussis son contrôle à 80 % ou plus <b>deux jours différents</b>, à 3 jours d'écart au moins : la preuve que c'est vraiment retenu, pas juste vu.</p>
    <div class="ctl-list">${L.map(ch => { const st = chapStatus(ch.id), d = dayNum();
      const badge = st.ok ? `<span class="ctl-b ok">✓ Validé</span>` : st.pass.length ? `<span class="ctl-b mid">1 réussite sur 2</span>` : st.tried ? `<span class="ctl-b ko">Meilleur : ${st.best} %</span>` : `<span class="ctl-b">Pas encore passé</span>`;
      const wait = !st.ok && st.pass.length && d < st.pass[0] + 3;
      const btn = st.today ? `<button class="btn small" disabled>Fait aujourd'hui</button>` : wait ? `<button class="btn small" disabled>À partir du ${dayLabel(st.pass[0] + 3).replace(/^\w+ /, "")}</button>` : `<button class="btn small ${st.ok ? "" : "primary"}" data-act="ctlStart" data-k="${h(ch.id)}">${st.ok ? "Repasser" : "Passer le contrôle"}</button>`;
      return `<div class="ctl-row${st.ok ? " is-ok" : ""}"><div class="ctl-t"><b>${h(ch.title)}</b>${badge}</div>${btn}</div>`; }).join("")}</div></section>`;
}
function vCible() {
  const c = CAT[cibleCat] || CAT.p1, q = QS.filter(x => x.c === c.id && chapOk(x)), f = FS.filter(x => x.c === c.id && chapOk(x)), n = chapCount(c.id);
  return `<section class="setup" style="${hueStyle(c.id)}">
    <button class="crumb" data-nav="ex">${ICON.back}S'entraîner</button>
    <div><span class="eyebrow"><span class="tabcode">${h(c.code)}</span> ${h(c.name)}</span><h1>Choisis tes chapitres</h1></div>
    <p class="muted">Touche les chapitres à travailler. Ton choix est enregistré : les boutons Quiz et Flashcards de cette matière ne porteront que sur eux, même la prochaine fois, jusqu'à ce que tu reprennes « Tous les chapitres ».</p>
    ${(() => { const yrs = { 1: (CHBY[c.id] || []).filter(x => chapYr(x) === 1).map(x => x.id), 2: (CHBY[c.id] || []).filter(x => chapYr(x) === 2).map(x => x.id) }; if (!yrs[1].length || !yrs[2].length) return "";
      const mine = chapSel.filter(k => (CHBY[c.id] || []).some(x => x.id === k)).sort().join(","), on = y => mine === yrs[y].slice().sort().join(",");
      return `${c.id === "ce" ? `<div class="panel cible-au"><b>Les auteurs (tous les chapitres)</b><p class="muted small">Incontournables : l'auteur puis la définition. Ou tous les auteurs de l'index, par année.</p><div class="qf-b">${auBtns()}</div></div>` : ""}
      <div><div class="label">Par année</div><div class="picker"><button class="chip" data-act="chapAll" data-cat="${c.id}" aria-pressed="${!mine}">Les deux années</button><button class="chip" data-act="chapYear" data-cat="${c.id}" data-y="1" aria-pressed="${on(1)}">1re année <span class="muted">${yrs[1].length} chapitres</span></button><button class="chip" data-act="chapYear" data-cat="${c.id}" data-y="2" aria-pressed="${on(2)}">2e année <span class="muted">${yrs[2].length} chapitres</span></button></div></div>`; })()}
    ${chapPicker([c.id], "")}
    <div><div class="label">Nombre de questions</div><div class="picker">${[10, 20, 40].map(k => `<button class="chip" data-act="len" data-n="${k}" aria-pressed="${quizLen === k}">${k}</button>`).join("")}</div></div>
    <div class="row cible-go">
      <button class="btn primary" data-act="cibleQuiz" ${q.length ? "" : "disabled"}>Quiz : ${Math.min(quizLen, q.length)} question${Math.min(quizLen, q.length) > 1 ? "s" : ""}</button>
      <button class="btn primary" data-act="cibleCards" ${f.length ? "" : "disabled"}>Flashcards : ${Math.min(P().clen, f.length)} carte${Math.min(P().clen, f.length) > 1 ? "s" : ""}</button>
    </div>
    <p class="muted small">${n ? `${n} chapitre${n > 1 ? "s" : ""} choisi${n > 1 ? "s" : ""} : ` : "Toute la matière : "}${q.length} questions et ${f.length} cartes disponibles.</p>
  </section>
  ${ctlSection(c.id)}`;
}
function vCardsSetup() {
  const due = dueCards(cardSel.length ? cardSel : null, true);
  const n = Math.min(30, due.reviews.length + Math.min(15, due.fresh.length));
  const poolN = FS.filter(x => (!cardSel.length || cardSel.includes(x.c)) && chapOk(x)).length;
  return `<section class="setup">
    <div><span class="eyebrow">Cartes à répétition espacée</span><h1>Tes fiches bristol</h1></div>
    <p class="muted">Retourne la carte, puis réponds honnêtement. « Je savais » : la carte revient plus tard (1, 3, 7, 15 puis 30 jours). « Difficile » : tu l'avais à moitié, elle revient demain sans monter de niveau. « À revoir » : elle revient dans la session et repart au début. Ne coche « Je savais » que si tu avais toute la réponse.</p>
    <div><div class="label">Matières</div><div class="picker">${catChips(cardSel, "toggleCards")}</div></div>
    <div><div class="label">Chapitres</div>${chapPicker(cardSel, "f")}</div>
    <div class="row">
      <button class="btn primary" data-act="startDue" ${n ? "" : "disabled"}>Cartes du jour (${n})</button>
      <button class="btn" data-act="startAllCards">Toutes les cartes, au hasard (${poolN})</button>
      ${cardSel.length ? `<button class="btn" data-act="clearCards">Tout désélectionner</button>` : ""}
    </div>
    ${n ? "" : `<div class="empty">Rien à revoir pour aujourd'hui dans cette sélection. Lance toutes les cartes pour t'entraîner quand même.</div>`}
  </section>`;
}
function startCards(list) {
  if (!list.length) return;
  markOrig();
  C = { q: list.map(it => ({ it, again: 0 })), i: 0, flip: false, knew: 0, again: 0, total: list.length, xp0: S.xp, title: RUN_T }; RUN_T = null;
  go("card");
}
function vCard() {
  if (!C || C.i >= C.q.length) return vCardsEnd();
  const cur = C.q[C.i], it = cur.it, c = CAT[it.c], ch = it.ch && CHID[it.ch];
  const box = (S.c[it.id] || [0])[0];
  const boxes = [1, 2, 3, 4, 5].map(b => `<i class="${b <= box ? "on" : ""}"></i>`).join("");
  const head = `<div class="bristol-head"><span class="ep" title="${h(c.code)} ${h(ch ? ch.title : c.name)}">${h(c.code)} ${h(ch ? ch.title : c.name)}</span><span class="boxes" title="Niveau de la carte">${boxes}</span></div>`;
  return `<section class="runner card-runner${C.flip ? " flipped" : ""}" style="${hueStyle(it.c)}">
    ${C.title ? `<p class="run-title">${h(C.title)}</p>` : ""}<div class="runner-top"><span class="progress-text"><button class="quit" data-act="quitCards" aria-label="Quitter les cartes">✕</button>Carte ${Math.min(C.i + 1, C.q.length)} sur ${C.q.length}</span><span class="kbd">Espace : retourner. 1 : à revoir, 2 : difficile, 3 : je savais</span></div>
    <div class="card3d${C.flip ? " is-flipped" : ""}" data-act="flip" role="button" tabindex="0" aria-label="Retourner la carte">
      <div class="face face-front bristol">${head}<div class="bristol-body">${(() => { const cq = cardQ(it); return `<span class="front-k">${h(cq.k)}</span><p class="front">${h(cq.q)}</p>`; })()}<span class="hint">Touche ou clique pour retourner la carte</span></div></div>
      <div class="face face-back bristol">${head}<div class="bristol-body"><span class="hint">${h(it.f)}</span><p class="back">${h(it.b)}</p></div><span class="stamp ok" aria-hidden="true">Je savais</span><span class="stamp ko" aria-hidden="true">À revoir</span><span class="stamp hd" aria-hidden="true">Difficile</span></div>
    </div>
    <div class="after-flip">
      ${it.m ? `<details class="more-box"><summary>Pour aller plus loin</summary><p>${h(it.m)}</p></details>` : ""}
      <button class="rep-btn" data-act="report" data-t="c" data-id="${h(it.id)}" data-l="${h(String(it.f).slice(0, 140))}">Signaler une erreur</button>
      <p class="swipe-hint">Glisse la carte : à droite, je savais · à gauche, à revoir · vers le haut, difficile</p>
      <div class="card-actions"><button class="btn again" data-act="again">À revoir</button><button class="btn hard" data-act="hard">Difficile</button><button class="btn know" data-act="knew">Je savais</button></div>
    </div>
    <div class="before-flip"><button class="btn primary" data-act="flip">Voir la réponse</button></div>
  </section>`;
}

function answerCard(knew) {
  const cur = C.q[C.i];
  recordC(cur.it, knew); tone(knew === true ? "pop" : knew === "hard" ? "soft" : "unpop"); buzz(knew === true ? 12 : knew === "hard" ? 20 : [25, 35, 25]);
  if (knew) C.knew++; else { C.again++; if (cur.again < 2) C.q.push({ it: cur.it, again: cur.again + 1 }); }
  C.i++; C.flip = false; touch();
  if (C.i >= C.q.length) go("cardsEnd"); else render();
}
function vCardsEnd() {
  if (!C) return vCardsSetup();
  return `<section class="runner">
    <div><span class="eyebrow">Session terminée</span><h1>Cartes rangées</h1></div>
    <div class="table-wrap"><table class="ledger">
      <thead><tr><th>Libellé</th><th class="num">Débit · sues</th><th class="num">Crédit · à revoir</th></tr></thead>
      <tbody><tr class="total"><td>${C.total} cartes revues</td><td class="num debit">${C.knew}</td><td class="num credit">${C.again}</td></tr></tbody>
    </table></div>
    <p class="muted">+${S.xp - C.xp0} XP. Les cartes ratées reviendront dès ta prochaine révision du jour.</p>
    <div class="row">${nextBtn(true)}<button class="btn${nextBtn() ? "" : " primary"}" data-act="goCards">Autre session</button>${origBtn()}<button class="btn" data-act="goHome">Accueil</button></div>
  </section>`;
}

/* Examen blanc */
function vExamSetup() {
  const rows = Object.entries(EXAM_PLAN).map(([k, n]) => `<tr><td><span class="mono">${h(CAT[k].code)}</span> ${h(CAT[k].name)}</td><td class="num">${n}</td></tr>`).join("");
  return `<section class="runner">
    <div><span class="eyebrow">Révision rapide toutes matières</span><h1>QCM chronométré de 20 minutes</h1></div>
    <p class="muted">20 questions tirées dans toutes les matières, sans correction avant la fin. C'est un test de connaissances, pas une simulation d'épreuve : la note sur 20 mesure ta mémoire du cours, pas ta capacité à traiter une étude de cas. Pour t'entraîner comme le jour J, utilise l'épreuve type E5 et les rédactions de l'onglet S'entraîner.</p>
    <div class="row"><button class="btn" data-act="exE5">Épreuve type E5 (exercices à saisir)</button></div>
    <div class="table-wrap"><table class="ledger">
      <thead><tr><th>Matière</th><th class="num">Questions</th></tr></thead>
      <tbody>${rows}<tr class="total"><td>Total</td><td class="num">20</td></tr></tbody>
    </table></div>
    <div class="row"><button class="btn primary" data-act="startExam">Commencer l'examen</button></div>
  </section>`;
}
function startExam() {
  let items = [];
  if (isGuest()) items = shuffle(QS).slice(0, 20);
  else Object.entries(EXAM_PLAN).forEach(([k, n]) => { items = items.concat(shuffle(QBY[k]).slice(0, n)); });
  const dw = dwFor(null, null, 4); items = shuffle(items).slice(0, items.length - dw.length).concat(dw);
  startRun(shuffle(items), "exam");
}

/* ---------- Cours, leçons, fiches (version 5) ---------- */
const LES_MIG = {"p2": [{"v": 2, "m": {"2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 10, "9": 11, "10": 12, "11": 13, "12": 14}}], "p3": [{"v": 2, "m": {"3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9": 11, "10": 12}}], "p4": [{"v": 2, "m": {"4": 5, "5": 7, "6": 8, "7": 9, "8": 10, "9": 11, "10": 12}}], "p1": [{"v": 2, "m": {"5": 6, "6": 8, "7": 9, "8": 10, "9": 11, "10": 12}}], "p6": [{"v": 2, "m": {"4": 5, "5": 6, "6": 7, "7": 9, "8": 11, "9": 12}}]};
const COURS_ORDER = ["me", "or", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "ma", "ce", "ce1", "ce2", "ce3", "ce4", "cg", "an"];
function CMETA(id) { if (COURS_META[id]) return COURS_META[id]; const c = CAT[id]; return c ? Object.assign({ cat: c.id, short: c.name }, c) : null; }
const COURSES_BY_CAT = { ce: ["ce1", "ce2", "ce3", "ce4", "ce"], me: ["me", "or"] };
/* Cours personnels (ajoutés pour un seul compte) : rangés à la fin de leur matière */
Object.keys(COURS_META).forEach(id => { const m = COURS_META[id]; if (!m.perso || !COURS[id]) return; if (!COURS_ORDER.includes(id)) COURS_ORDER.push(id); const l = COURSES_BY_CAT[m.cat] || (COURSES_BY_CAT[m.cat] = [m.cat]); if (!l.includes(id)) l.push(id); });
const coursesOf = cat => COURSES_BY_CAT[cat] || (COURS[cat] ? [cat] : []);
const LESSON_PATH = ["p1", "p2", "p3", "p4", "ce1", "p5", "p6", "ce2", "p7", "ce3", "ma", "cg", "ce4", "an", "me", "or", "ce"];

function inl(s) {
  return h(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*([^*\s][^*]*?)\*/g, "<em>$1</em>");
}
const SPLITC = {};
function splitCourse(cid) {
  if (SPLITC[cid]) return SPLITC[cid];
  const secs = [{ title: "", lines: [] }];
  COURS[cid].split("\n").forEach(l => { if (/^## /.test(l)) secs.push({ title: l.slice(3).trim(), lines: [] }); else secs[secs.length - 1].lines.push(l); });
  return (SPLITC[cid] = secs);
}
const SPLIT = splitCourse;
const nLessons = cid => SPLIT(cid).length - 1;
function lessonLabel(title, k) {
  let m;
  if ((m = title.match(/^Ch\.\s*(\d+)\s*·\s*(.*)$/))) return { lab: "Chapitre " + m[1], t: m[2], num: m[1] };
  if ((m = title.match(/^Thème\s*(\d+)\s*·\s*(.*)$/))) return { lab: "Thème " + m[1], t: m[2], num: m[1] };
  if ((m = title.match(/^(\d+)\.\s+(.*)$/))) return { lab: "Leçon " + m[1], t: m[2], num: m[1] };
  return { lab: "Leçon " + k, t: title, num: String(k) };
}
const isRead = (cid, k) => !!(S.l && S.l[cid + ":" + k]);
function lessonStats(cat) { let n = 0, r = 0; coursesOf(cat).forEach(cid => { const L = nLessons(cid); n += L; for (let k = 1; k <= L; k++) if (isRead(cid, k)) r++; }); return { n, r }; }
function totalLessons() { let n = 0, r = 0; CATS.forEach(c => { const s = lessonStats(c.id); n += s.n; r += s.r; }); return { n, r }; }
const MINC = {};
function readMin(cid, k) { const key = cid + ":" + k; if (!MINC[key]) { const w = SPLIT(cid)[k].lines.join(" ").split(/\s+/).filter(Boolean).length; MINC[key] = Math.max(1, Math.round(w / 170)); } return MINC[key]; }
function firstUnread(cids) { for (const cid of cids) for (let k = 1; k <= nLessons(cid); k++) if (!isRead(cid, k)) return { cid, k }; return null; }
function nextLesson() {
  if (S.last && COURS[S.last.c] && S.last.k <= nLessons(S.last.c)) {
    const { c, k } = S.last;
    if (!isRead(c, k)) return { cid: c, k };
    const s = coursesOf(CMETA(c).cat), rest = s.slice(Math.max(0, s.indexOf(c)));
    for (const cid of rest) for (let j = cid === c ? k + 1 : 1; j <= nLessons(cid); j++) if (!isRead(cid, j)) return { cid, k: j };
  }
  return firstUnread(LESSON_PATH);
}
function nextOf(cid, k) { if (k < nLessons(cid)) return { cid, k: k + 1 }; const s = coursesOf(CMETA(cid).cat), i = s.indexOf(cid); return i >= 0 && i < s.length - 1 ? { cid: s[i + 1], k: 1 } : null; }
function prevOf(cid, k) { if (k > 1) return { cid, k: k - 1 }; const s = coursesOf(CMETA(cid).cat), i = s.indexOf(cid); return i > 0 ? { cid: s[i - 1], k: nLessons(s[i - 1]) } : null; }
function openLesson(cid, k) { if (!COURS[cid]) return; { const m = CMETA(cid); if (m && lockedCat(m.cat)) return lockSheet(m.cat); } k = Math.min(Math.max(1, k || 1), nLessons(cid)); LS = { cid, k, t0: Date.now() }; S.last = { c: cid, k }; touch(); go("lesson"); }
function markRead(cid, k) { const key = cid + ":" + k; if (S.l[key]) return; S.l[key] = 1; try { wlog("l", CMETA(cid).cat); } catch (e) {} if (!LS || !LS.t0 || Date.now() - LS.t0 >= 40000) S.xp += 8; dayLog().l++; bumpStreak(); }
function openMat(cat, seg) { if (!CAT[cat]) cat = (CMETA(cat) || { cat: "p1" }).cat; if (lockedCat(cat)) return lockSheet(cat); if (cat !== matCat) matSub = "fiches"; matCat = cat; matSeg = seg || "lecons"; matFicheQuery = ""; go("mat"); }

/* Rendu du markdown des cours */
const CALLOUTS = [[/^(À retenir|L'essentiel)/i, "retain"], [/^(Exemple|Cas chiffré|En pratique)/i, "example"], [/^(Attention|Piège|Erreur|Erreurs fréquentes)/i, "warn"], [/^(Idée clé|À savoir|Nuance|Correction)/i, "key"], [/^(Méthode|Le jour de l'épreuve|Astuce|Conseil|À l'oral|Ce qui fait la différence)/i, "method"]];
const NUMCELL = /^[−+\-]?\s?\d{1,3}([  .]\d{3})*(,\d+)?\s?(€|%)?$/;
let MDYR = "all";
function mdBlocks(lines, idBase) {
  let out = "", i = 0, sub = 0, lastH = "";
  const isTable = l => /^\s*\|/.test(l), isUl = l => /^- /.test(l), isOl = l => /^\d+\. /.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) {
      const lang = l.slice(3).trim(); const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out += lang === "f" ? `<pre class="formula">${h(buf.join("\n"))}</pre>` : `<div class="code-wrap"><pre class="codeblock">${h(buf.join("\n"))}</pre></div>`;
      continue;
    }
    if (/^### /.test(l)) { lastH = l; out += `<h4 id="${idBase}-${++sub}">${inl(l.slice(4))}</h4>`; i++; continue; }
    if (isTable(l)) {
      const rows = [];
      while (i < lines.length && isTable(lines[i])) rows.push(lines[i++]);
      const cells = r => r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim().replace(/(\d)-(\d)/g, "$1\u2011$2"));
      const body = rows.filter((r, k) => !(k === 1 && /^[\s|:-]+$/.test(r)));
      const head = cells(body[0]), data = body.slice(1).map(cells);
      const numCol = head.map((_, j) => { const v = data.map(r => (r[j] || "").replace(/\*\*/g, "")).filter(Boolean); return v.length > 0 && v.every(x => NUMCELL.test(x)) && v.some(x => /[,€%]|\d[  .]\d{3}/.test(x)); });
      const yc = head.findIndex(c => /^(Thème et chapitre|Chapitre)$/i.test(c));
      const yrs = yc < 0 ? null : data.map(r => { const t = [...(r[yc] || "").matchAll(/\bT([1-6])\b/g)].map(m => +m[1]); return t.length ? [...new Set(t.map(n => n <= 3 ? 1 : 2))] : null; });
      const yOk = yrs && yrs.every(Boolean) && yrs.some(y => y.includes(1)) && yrs.some(y => y.includes(2));
      if (yOk) { const n1 = yrs.filter(y => y.includes(1)).length, n2 = yrs.filter(y => y.includes(2)).length;
        out += `<div class="row md-yr" role="group" aria-label="Filtrer par année">${[["all", `Tout (${data.length})`], ["1", `1re année (${n1})`], ["2", `2e année (${n2})`]].map(([v, l]) => `<button class="chip small" data-act="mdYr" data-yr="${v}" aria-pressed="${MDYR === v}">${l}</button>`).join("")}${/^Auteur$/i.test(head[0]) ? `<button class="btn small primary md-auq" data-act="auQuiz">Quiz sur ces auteurs</button>` : ""}</div>`; }
      out += `<div class="table-wrap"><table class="md-table${yOk ? " md-yrt" : ""}"><thead><tr>${head.map((c, j) => `<th${numCol[j] ? ' class="n"' : ""}>${inl(c)}</th>`).join("")}</tr></thead><tbody>${data.map((r, k) => `<tr${yOk ? ` data-yr="${yrs[k].join(" ")}"${MDYR !== "all" && !yrs[k].includes(+MDYR) ? " hidden" : ""}` : ""}>${head.map((_, j) => `<td${numCol[j] ? ' class="n"' : ""}>${inl(r[j] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      { const ym = lastH.match(/incontournables de (1|2)/i); if (ym && /^Auteur$/i.test(head[0])) out += `<div class="row md-yr"><button class="btn small primary" data-act="auQuiz" data-inc="1" data-yr="${ym[1]}">Quiz sur les incontournables de ${ym[1] === "1" ? "1re" : "2e"} année</button></div>`; }
      continue;
    }
    if (isUl(l) || isOl(l)) {
      const ol = isOl(l), test = ol ? isOl : isUl, items = [];
      while (i < lines.length && test(lines[i])) items.push(lines[i++].replace(ol ? /^\d+\. / : /^- /, ""));
      out += `<${ol ? "ol" : "ul"}>${items.map(t => `<li>${inl(t)}</li>`).join("")}</${ol ? "ol" : "ul"}>`;
      continue;
    }
    if (/^>( |$)/.test(l)) {
      const inner = [];
      while (i < lines.length && /^>( |$)/.test(lines[i])) inner.push(lines[i++].replace(/^> ?/, ""));
      const first = (inner.find(t => t.trim()) || "").replace(/^\*\*/, "");
      const co = CALLOUTS.find(c => c[0].test(first));
      out += `<blockquote class="${co ? "callout " + co[1] : "quote"}">${mdBlocks(inner, idBase + "q" + i)}</blockquote>`;
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(```|### |- |\d+\. |>( |$)|\s*\|)/.test(lines[i])) buf.push(lines[i++]);
    if (!buf.length) { out += `<p>${inl(lines[i++])}</p>`; continue; }
    const t = buf.join(" ");
    out += /^\*\*[^*]+\*\*$/.test(t) ? `<p class="md-label">${inl(t)}</p>` : `<p>${inl(t)}</p>`;
  }
  return out;
}

/* Surlignage des résultats de recherche */
const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function hl(text, q) { const t = h(text); if (!q) return t; return t.replace(new RegExp(reEsc(h(q)), "gi"), m => `<mark>${m}</mark>`); }

/* Onglet Cours */
function resumeCard(nl) {
  const m = CMETA(nl.cid), lb = lessonLabel(SPLIT(nl.cid)[nl.k].title, nl.k);
  return `<div class="resume" style="${hueStyle(m.cat)}"><div><small>${S.last ? "Reprendre" : "Pour commencer"} : ${h(CAT[m.cat].name)}, ${h(lb.lab.toLowerCase())}</small><b>${inl(lb.t)}</b></div><button class="btn primary" data-act="lesson" data-cid="${nl.cid}" data-k="${nl.k}">${S.last ? "Reprendre la lecture" : "Commencer"}</button></div>`;
}
function vCoursList() {
  const nl = nextLesson(), tl = totalLessons();
  return `<section class="page-head">
      <h1>Cours</h1>
      <p class="muted">Chaque matière est découpée en leçons courtes, à lire dans l'ordre. Quand tu passes à la leçon suivante, celle que tu viens de lire est cochée. Tu en as lu ${tl.r} sur ${tl.n}.</p>
      <input class="search" id="coursSearch" type="search" placeholder="Chercher dans les cours : Arendt, syllogisme, CAF, SQL…" aria-label="Chercher dans tous les cours">
    </section>
    <div id="coursHits" hidden></div>
    <div id="coursMain" class="stack">
      ${persoCoursCards()}
      ${nl ? resumeCard(nl) : ""}
      ${groupsOf(dividerCours)}
    </div>`;
}
let COURS_INDEX = null;
function coursIndex() {
  if (COURS_INDEX) return COURS_INDEX;
  COURS_INDEX = [];
  COURS_ORDER.forEach(cid => SPLIT(cid).forEach((s, k) => {
    const text = s.lines.map(l => l.replace(/^(- |\d+\. |> )/, "")).join(" ").replace(/[*|`#>]/g, " ").replace(/\s+/g, " ");
    COURS_INDEX.push({ cid, k, title: k ? lessonLabel(s.title, k).t : "Présentation", text, low: (s.title + " " + text).toLowerCase() });
  }));
  return COURS_INDEX;
}
function renderHits() {
  const box = document.getElementById("coursHits"), main = document.getElementById("coursMain");
  if (!box) return;
  const q = coursQuery.trim().toLowerCase();
  box.hidden = !q; main.hidden = !!q;
  if (!q) return;
  const hits = coursIndex().filter(x => x.low.includes(q)).slice(0, 40);
  box.innerHTML = hits.length ? `<div class="hits">${hits.map(x => {
    const p = x.text.toLowerCase().indexOf(q), m = CMETA(x.cid);
    const from = Math.max(0, p - 70), snip = p < 0 ? x.text.slice(0, 160) + "…" : (from ? "…" : "") + x.text.slice(from, p + q.length + 110) + "…";
    return `<button class="hit" style="${hueStyle(m.cat)}" data-act="hit" data-cid="${x.cid}" data-k="${x.k}"><small>${h(m.cat === "ce" || m.cat === "me" ? m.short : CAT[m.cat].name)}</small><b>${hl(x.title, coursQuery.trim())}</b><span class="muted">${hl(snip, coursQuery.trim())}</span></button>`;
  }).join("")}</div>` : `<div class="empty">Aucun passage ne contient « ${h(coursQuery)} ». Vérifie l'orthographe ou essaie un mot plus court.</div>`;
}

/* Page d'une matière */
function vMat() {
  const c = CAT[matCat] || CAT.p1, ls = lessonStats(c.id), ms = mastery(c.id);
  const segs = [["lecons", `Leçons (${ls.n})`], ["fiche", `Fiches (${(CHBY[c.id] || []).length})`], ["train", "S'entraîner"]];
  const back = { lecons: ["cours", "Tous les cours"], fiche: ["fiches", "Toutes les fiches"], train: ["ex", "S'entraîner"] }[matSeg] || ["cours", "Tous les cours"];
  const body = matSeg === "fiche" ? matFiche(c) : matSeg === "train" ? matTrain(c) : matLecons(c);
  return `<section class="mat-head" style="${hueStyle(c.id)}">
      <button class="crumb" data-nav="${back[0]}">${ICON.back}${back[1]}</button>
      ${binder3d(c)}
      <div class="mat-title"><span class="tabcode">${h(c.code)}</span><h1>${h(c.name)}</h1></div>
      <p class="mat-desc">${h(c.desc)}. ${h(EPTEXT[c.id] || "")}</p>
      <div class="mat-figs"><span><b>${ls.r}/${ls.n}</b> leçons lues</span><span><b>${pct(ms.m, ms.t)} %</b> des quiz et cartes acquis</span><span><b>${validCount(c.id).v}/${validCount(c.id).n}</b> chapitres validés</span><span><b>${QBY[c.id].length}</b> questions de quiz</span></div>
      <div class="seg" role="tablist" aria-label="Contenu de la matière">${segs.map(([k, l]) => `<button role="tab" class="seg-btn" data-act="seg" data-seg="${k}" aria-selected="${matSeg === k}">${l}</button>`).join("")}</div>
    </section>
    <section class="mat-body" style="${hueStyle(c.id)}">${body}</section>`;
}
function matLecons(c) {
  const cids = coursesOf(c.id), multi = cids.length > 1, nl = firstUnread(cids);
  const top = nl ? resumeCard(nl) : `<div class="resume" style="${hueStyle(c.id)}"><div><small>Toutes les leçons sont lues</small><b>Passe à l'entraînement pour fixer ce que tu as lu.</b></div><button class="btn primary" data-act="seg" data-seg="train">S'entraîner</button></div>`;
  return top + cids.map(cid => {
    const m = CMETA(cid), secs = SPLIT(cid);
    const rows = secs.slice(1).map((s, j) => {
      const k = j + 1, lb = lessonLabel(s.title, k), r = isRead(cid, k);
      return `<li><button class="lesson-row${r ? " is-read" : ""}" data-act="lesson" data-cid="${cid}" data-k="${k}"><span class="tick" aria-hidden="true">${r ? ICON.check : h(lb.num)}</span><span class="lr-t">${inl(lb.t)}${r ? '<span class="sr-only"> (lue)</span>' : ""}</span><span class="lr-m">${readMin(cid, k)} min</span></button></li>`;
    }).join("");
    return `<div class="course-block">${multi ? `<h2>${h(m.short)}</h2>` : ""}<div class="md lead">${mdBlocks(secs[0].lines, "lead-" + cid)}</div><ol class="lesson-list">${rows}</ol></div>`;
  }).join("");
}
const FICHE_GROUPS = { T1: "Thème 1 : l'entreprise dans son environnement", T2: "Thème 2 : la régulation de l'activité économique", T3: "Thème 3 : l'organisation de l'activité" };
function ficheItem(x, q, withCat) {
  const f = x.f.replace(/^T\d+ · /, "");
  return `<div class="fi">${withCat ? `<span class="fi-cat" style="${hueStyle(x.c)}">${h(CAT[x.c].code)} ${h(CAT[x.c].name)}</span>` : ""}<dt>${hl(f, q)}</dt><dd>${hl(x.b, q)}${x.m ? `<small>${hl(x.m, q)}</small>` : ""}</dd></div>`;
}
const ficheMatch = (x, q) => !q || (x.f + " " + x.b + " " + x.m).toLowerCase().includes(q.toLowerCase());
function ficheBody(cat, query) {
  const q = (query || "").trim(), items = FBY[cat].filter(x => !x.ch && ficheMatch(x, q));
  if (!items.length) return `<div class="empty">Aucune notion de cette fiche ne contient « ${h(q)} ».</div>`;
  const grp = {}, order = [];
  items.forEach(x => { const m = x.f.match(/^(T\d+) · /), g = m ? m[1] : "_"; if (!grp[g]) { grp[g] = []; order.push(g); } grp[g].push(x); });
  if (order.length === 1) return `<dl class="fiche">${items.map(x => ficheItem(x, q)).join("")}</dl>`;
  order.sort((a, b) => (a === "_") - (b === "_") || (a < b ? -1 : 1));
  return order.map(g => `<div class="fiche-group"><h3>${h(g === "_" ? "Synthèses, auteurs et repères" : FICHE_GROUPS[g] || g)}</h3><dl class="fiche">${grp[g].map(x => ficheItem(x, q)).join("")}</dl></div>`).join("");
}
function matTrain(c) {
  const anns = ANNEX.filter(x => x.tags.some(t => NOTIONS[t][1] === c.id)).sort((a, b) => b.a.year - a.a.year), n = todayCount([c.id]);
  return `<div class="modes">
      <button class="mode lead-mode" data-act="quickQuiz" data-cat="${c.id}"><b>Quiz de 10 questions</b><span>Tirées parmi ${QBY[c.id].length}, corrigées et expliquées une par une.</span></button>
      <button class="mode" data-act="dueCat" data-cat="${c.id}" ${n ? "" : "disabled"}><b>Cartes de la matière</b><span>${n ? `${n} cartes à revoir aujourd'hui.` : "Rien à revoir aujourd'hui dans cette matière."}</span></button>
      <button class="mode" data-act="defi" data-cat="${c.id}"><b>Défi 60 secondes</b><span>Un maximum de bonnes réponses en une minute, sur cette matière (sans calculs).</span></button>
      <button class="mode" data-act="pickChap" data-cat="${c.id}"><b>Chapitres et contrôles</b><span>${chapCount(c.id) ? `${chapCount(c.id)} chapitre${chapCount(c.id) > 1 ? "s" : ""} choisi${chapCount(c.id) > 1 ? "s" : ""} : quiz et cartes ne portent que sur eux.` : "Quiz et flashcards sur les seuls chapitres que tu veux."}</span></button>
      <button class="mode" data-act="quizCat" data-cat="${c.id}"><b>Quiz plus long</b><span>Choisis 20 ou 40 questions, ou mélange avec d'autres matières.</span></button>
    </div>
    ${c.id === "ce" ? `<div class="ex-group"><h2>Les auteurs</h2><p class="muted">Incontournables (auteur puis définition) et quiz sur tous les auteurs de l'index.</p><div class="row qf-b">${auBtns()}</div></div>` : ""}
    ${c.id === "ma" ? `<div class="ex-group"><h2>Entraînement à l'infini</h2><p class="muted">10 questions générées au hasard, de nouveaux nombres à chaque fois.</p><div class="ex-grid g3">${(CHBY.ma || []).filter(x => MATHS.GENERATORS[x.id]).map(x => `<button class="ex-card" style="${hueStyle("ma")}" data-act="genQuiz" data-ch="${x.id}"><b>${h(x.title)}</b><span class="muted">Questions générées</span></button>`).join("")}</div></div>` : ""}
    ${CXG.some(g => g.cat === c.id) ? cxHome(c.id) : ""}
    ${dosSection(c.id)}
    ${SCH.some(x => x.cat === c.id) ? schHome(c.id) : ""}
    ${(GCBY[c.id] || []).length ? `<div class="ex-group"><h2>Exercices guidés</h2><p class="muted">Un exercice type examen découpé en étapes : tu rédiges, puis tu débloques le corrigé de chaque étape.</p><div class="ex-grid">${GCBY[c.id].map(gcCard).join("")}</div></div>` : ""}
    ${anns.length ? `<div class="ex-group"><h2>Annales officielles</h2><p class="muted">Les exercices des vrais sujets qui portent sur ${h(c.name.toLowerCase())}. Compare ta copie au corrigé pour savoir quoi revoir.</p><div class="ann-flat">${anns.map(x => annRow(x, true)).join("")}</div></div>` : ""}`;
}

/* Onglet Fiches */
function vFiches() {
  return `<section class="page-head">
      <h1>Fiches</h1>
      <p class="muted">${CHAP.length} fiches-chapitres (l'idée clé, l'explication simple, les définitions, un exemple, l'essentiel) et un mémo express de ${FS.filter(x => !x.ch).length} notions. Choisis une matière ou cherche directement.</p>
      <input class="search" id="ficheSearch" type="search" placeholder="Chercher : CAF, 4196, Akerlof, syllogisme, pourparlers…" aria-label="Chercher dans toutes les fiches">
      <div class="qf-cta"><span>Tu as lu tes fiches ? Teste-toi :</span><button class="btn small primary" data-act="goQuiz">Quiz</button><button class="btn small" data-act="goCards">Flashcards</button><button class="btn small" data-nav="ex">Tout l'entraînement</button></div>
    </section>
    <div id="ficheHits" hidden></div>
    <div id="ficheMain" class="stack">${groupsOf(dividerFiche)}</div>`;
}
function renderFicheHits() {
  const box = document.getElementById("ficheHits"), main = document.getElementById("ficheMain");
  if (!box) return;
  const q = ficheQuery.trim();
  box.hidden = !q; main.hidden = !!q;
  if (!q) return;
  const ql = q.toLowerCase(), chs = CHAP.filter(x => chText(x).includes(ql)), items = FS.filter(x => !x.ch && ficheMatch(x, q));
  box.innerHTML = (chs.length || items.length) ? `${chs.length ? `<h2>${chs.length} fiche${chs.length > 1 ? "s" : ""}</h2><div class="fcards">${chs.slice(0, 30).map(x => fcard(x, true)).join("")}</div>` : ""}
    ${items.length ? `<h2>${items.length} notion${items.length > 1 ? "s" : ""} du mémo</h2><dl class="fiche">${items.slice(0, 60).map(x => ficheItem(x, q, true)).join("")}</dl>` : ""}` : `<div class="empty">Aucune fiche ne contient « ${h(q)} ». Essaie un mot plus court, ou cherche dans les cours.</div>`;
}

/* Lecteur de leçon */
function vLesson() {
  if (!LS || !COURS[LS.cid]) return vCoursList();
  const { cid, k } = LS, m = CMETA(cid), cat = m.cat, secs = SPLIT(cid), n = secs.length - 1, s = secs[k];
  const lb = lessonLabel(s.title, k), nx = nextOf(cid, k), pv = prevOf(cid, k);
  const outline = secs.slice(1).map((x, j) => { const kk = j + 1, b = lessonLabel(x.title, kk), r = isRead(cid, kk); return `<li><button class="ol-row${kk === k ? " is-cur" : ""}${r ? " is-read" : ""}" data-act="lesson" data-cid="${cid}" data-k="${kk}" ${kk === k ? 'aria-current="true"' : ""}><span class="tick">${r ? ICON.check : h(b.num)}</span><span>${inl(b.t)}</span></button></li>`; }).join("");
  const nxt = nx ? lessonLabel(SPLIT(nx.cid)[nx.k].title, nx.k) : null;
  const nextBtn = nx
    ? `<button class="next-card" data-act="lessonNext"><span>${nx.cid === cid ? "Leçon suivante" : "Partie suivante : " + h(CMETA(nx.cid).short)}</span><b>${inl(nxt.t)}</b></button>`
    : `<button class="next-card" data-act="lessonDone"><span>Dernière leçon de la matière</span><b>Valider et faire un quiz de 10 questions</b></button>`;
  const where = lb.lab.startsWith("Thème") ? `${lb.lab} (partie ${k} sur ${n})` : `${lb.lab} sur ${n}`;
  return `<div class="reader" style="${hueStyle(cat)}">
    <aside class="outline" aria-label="Sommaire">
      <button class="crumb" data-act="mat" data-cat="${cat}" data-seg="lecons">${ICON.back}${h(CAT[cat].name)}</button>
      <p class="ol-title">${h(m.short)}</p>
      <ol>${outline}</ol>
    </aside>
    <article class="lesson">
      <details class="outline-m"><summary>Sommaire : ${h(m.short)}</summary><ol>${outline}</ol></details>
      <p class="lesson-meta"><span class="tabcode">${h(CAT[cat].code)}</span><span>${h(where)}</span><span>${readMin(cid, k)} min de lecture</span>${isRead(cid, k) ? "<span>Déjà lue</span>" : ""}</p>
      <div class="lprog" role="presentation"><i style="width:${pct(k, n)}%"></i></div>
      <h1>${inl(lb.t)}</h1>
      <div class="md">${mdBlocks(s.lines, "l-" + cid + "-" + k)}</div>
      <div class="lesson-test"><div><b>Teste-toi maintenant</b><span>Quelques questions juste après la lecture, c'est ce qui fait le plus retenir.</span></div><div class="row">${m.script ? `<button class="btn small primary" data-act="reciteHome" data-cid="${cid}">Apprendre mon oral par cœur</button>` : ""}${m.chs ? (() => { const lc = (m.lch || [])[k - 1], one = lc ? [lc] : null, nq = L => QS.filter(x => L.includes(x.ch)).length, nf = L => FS.filter(x => L.includes(x.ch)).length; return (one ? `<button class="btn small primary" data-act="chsQuiz" data-chs="${lc}">Quiz de cette leçon (${nq(one)})</button><button class="btn small" data-act="chsCards" data-chs="${lc}">Flashcards de cette leçon (${nf(one)})</button>` : "") + `<button class="btn small${one ? "" : " primary"}" data-act="chsQuiz" data-chs="${m.chs.join(",")}">Quiz de tout le cours (${nq(m.chs)})</button><button class="btn small" data-act="chsCards" data-chs="${m.chs.join(",")}">Flashcards de tout le cours (${nf(m.chs)})</button>`; })() : `<button class="btn small primary" data-act="quickQuiz" data-cat="${cat}">Quiz ${h(CAT[cat].code)}</button><button class="btn small" data-act="flashCat" data-cat="${cat}">Flashcards</button>`}</div></div>
      <p class="rep-row"><button class="rep-btn" data-act="report" data-t="l" data-id="${h(cid + ":" + k)}" data-l="${h(String(lb.t).slice(0, 140))}">Signaler une erreur</button></p>
      <footer class="lesson-foot">${pv ? `<button class="btn" data-act="lessonPrev">Leçon précédente</button>` : `<button class="btn" data-act="mat" data-cat="${cat}" data-seg="lecons">Retour à la matière</button>`}${nextBtn}</footer>
    </article>
  </div>`;
}

function markLocked() {
  if (!isGuest()) return;
  document.querySelectorAll("#view [data-cat]").forEach(e => { if (lockedCat(e.dataset.cat)) { e.classList.add("gl-locked"); const q = e.closest(".qf"); if (q) q.classList.add("gl-locked"); } });
}
function bindView() {
  markLocked();
  const cs = document.getElementById("coursSearch");
  if (cs) { cs.value = coursQuery; cs.addEventListener("input", e => { coursQuery = e.target.value; renderHits(); }); renderHits(); }
  const fs = document.getElementById("ficheSearch");
  if (fs) { fs.value = ficheQuery; fs.addEventListener("input", e => { ficheQuery = e.target.value; renderFicheHits(); }); renderFicheHits(); }
  const ms = document.getElementById("matFicheSearch");
  if (ms) { ms.value = matFicheQuery; ms.addEventListener("input", e => { matFicheQuery = e.target.value; document.getElementById("matFicheList").innerHTML = ficheBody(matCat, matFicheQuery); }); }
}


/* ---------- Fusion : fiches-chapitres, exercices guidés, défi, maths, Mon BTS, 3D ---------- */
const CHID = Object.fromEntries(CHAP.map(c => [c.id, c]));
const chapYr = ch => { const m = String((ch && ch.src) || "").match(/^cejm([12])$/); return m ? +m[1] : null; }; // année du chapitre quand les supports le disent (CEJM)
const CHBY = {}; CHAP.forEach(c => (CHBY[c.cat] = CHBY[c.cat] || []).push(c));
const THEME = Object.fromEntries(IMP_THEMES.map(t => [t.key, t]));
const GCBY = {}; GCASES.forEach(k => (GCBY[k.cat] = GCBY[k.cat] || []).push(k));
const GCID = Object.fromEntries(GCASES.map(k => [k.id, k]));
const REFBY = {}; REFS.forEach(r => (REFBY[r[1]] = REFBY[r[1]] || []).push(r));
const QCH = {}; QS.forEach(x => { if (x.ch) (QCH[x.ch] = QCH[x.ch] || []).push(x); });
const FCH = {}; FS.forEach(x => { if (x.ch) (FCH[x.ch] = FCH[x.ch] || []).push(x); });
const RM = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
let FC = null, matSub = "fiches", GC = null, DF = null, defiTick = null, noteTimer = null;

function toast(t) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = t; el.classList.add("show"); setTimeout(() => { if (performance.now() - (tone.lt || 0) > 120) tone("soft"); }, 0); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 2000);
}

/* Rendu des blocs des fiches importées */
function blocksHTML(list) {
  let out = "", defs = [];
  const flush = () => { if (defs.length) { out += `<dl class="defs">${defs.map(d => `<div><dt>${h(d[1])}</dt><dd>${h(d[2])}</dd></div>`).join("")}</dl>`; defs = []; } };
  const co = (cls, title, body) => `<blockquote class="callout ${cls}"><p class="md-label"><strong>${h(title)}</strong></p>${body}</blockquote>`;
  (list || []).forEach(b => {
    if (!Array.isArray(b)) return;
    if (b[0] === "d") { defs.push(b); return; }
    flush();
    switch (b[0]) {
      case "why": out += co("plain", b[2] || "En clair", `<p>${h(b[1])}</p>`); break;
      case "ex": out += co("example", "Exemple : " + (b[1] || ""), `<ol>${(b[2] || []).map(s => `<li>${h(s)}</li>`).join("")}</ol>`); break;
      case "t": out += `<div class="table-wrap"><table class="md-table"><thead><tr>${(b[1] || []).map(c => `<th>${h(c)}</th>`).join("")}</tr></thead><tbody>${(b[2] || []).map(r => `<tr>${r.map(c => `<td>${h(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`; break;
      case "tip": out += co("method", "Astuce", `<p>${h(b[1])}</p>`); break;
      case "trap": out += co("warn", "Piège", `<p>${h(b[1])}</p>`); break;
      case "l": out += `<ul>${(b[1] || []).map(s => `<li>${h(s)}</li>`).join("")}</ul>`; break;
      case "n": out += co("key", "À noter", `<p>${h(b[1])}</p>`); break;
      case "w": out += co("key", "Important", `<p>${h(b[1])}</p>`); break;
      case "widget": out += `<div class="widget" data-widget="${h(b[1])}"></div>`; break;
      default: if (typeof b[1] === "string") out += `<p>${h(b[1])}</p>`;
    }
  });
  flush();
  return out;
}

/* Lecteur de fiche */
function openFiche(id) {
  if (!CHID[id]) return;
  if (lockedCat(CHID[id].cat)) return lockSheet(CHID[id].cat);
  FC = { id }; S.fr = S.fr || {};
  if (!S.fr[id]) { S.fr[id] = 1; bumpStreak(); }
  clearTimeout(openFiche.t);
  if (!(S.frx || {})[id]) openFiche.t = setTimeout(() => { if (view === "fiche" && FC && FC.id === id) { S.frx = S.frx || {}; if (!S.frx[id]) { S.frx[id] = 1; S.xp += 4; touch(); renderTop(); toast("Fiche lue : +4 XP"); } } }, 30000);
  touch(); go("fiche");
}
const ficheRead = id => !!(S.fr && S.fr[id]);
function ficheOutline(c) {
  const list = CHBY[c.cat]; let lastTh = null;
  return list.map((x, j) => {
    const head = x.th !== lastTh ? `<li class="ol-th">${h((THEME[x.th] || {}).title || "")}</li>` : ""; lastTh = x.th;
    return head + `<li><button class="ol-row${x.id === c.id ? " is-cur" : ""}${ficheRead(x.id) ? " is-read" : ""}" data-act="fiche" data-id="${x.id}"><span class="tick">${ficheRead(x.id) ? ICON.check : j + 1}</span><span>${h(x.title)}</span></button></li>`;
  }).join("");
}
/* ---------- Fiche en premier plan (sans quitter ce qu'on fait) ---------- */
function ficheMd(c) {
  return `<div class="md">
        <blockquote class="callout key"><p class="md-label"><strong>Idée clé</strong></p><p>${h(c.idee)}</p></blockquote>
        ${(c.sections || []).map(s => `<h4>${h(s.h)}</h4>${blocksHTML(s.b)}`).join("")}
        ${c.points && c.points.length ? `<blockquote class="callout retain"><p class="md-label"><strong>L'essentiel</strong></p><ul>${c.points.map(p => `<li>${h(p)}</li>`).join("")}</ul></blockquote>` : ""}
      </div>`;
}
/* Lecture à voix haute des fiches (synthèse vocale de l'appareil, fr-FR) */
const TTS_OK = typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";
const TTS_RATES = [1, 1.25, 1.5, 0.85];
let ttsRun = null;
function ttsVoice() {
  const v = speechSynthesis.getVoices().filter(x => /^fr/i.test(x.lang));
  return v.find(x => /fr[-_]FR/i.test(x.lang) && /(premium|enhanced|natural|neural|google|amélie|thomas|audrey)/i.test(x.name)) || v.find(x => /fr[-_]FR/i.test(x.lang)) || v[0] || null;
}
function ttsRate() { return (S.pref && S.pref.ttsr) || 1; }
function ttsText(el) {
  let t = el.innerText || el.textContent || "";
  t = t.replace(/\s+/g, " ").replace(/€/g, " euros").replace(/\s?%/g, " pour cent").replace(/(\d)\s?×\s?(\d)/g, "$1 fois $2").replace(/ − | - (?=\d)/g, " moins ").replace(/\bHT\b/g, "hors taxes").replace(/\bTTC\b/g, "toutes taxes comprises").replace(/→/g, ", donc ").replace(/\s=\s/g, " égale ").replace(/≥/g, " supérieur ou égal à ").replace(/≤/g, " inférieur ou égal à ");
  return t.trim();
}
function ttsBlocks(root) {
  const all = [...root.querySelectorAll("h1, .md-label, .md h4, .md p, .md li, .md tr, .md pre")].filter(e => !e.closest(".md-label") || e.classList.contains("md-label"));
  return all.filter(e => !all.some(o => o !== e && o.contains(e)) && ttsText(e));
}
function ttsStop() {
  if (!TTS_OK) return;
  const r = ttsRun; ttsRun = null;
  try { speechSynthesis.cancel(); } catch (e) {}
  document.querySelectorAll(".tts-on").forEach(x => x.classList.remove("tts-on"));
  document.querySelectorAll(".tts-btn[aria-pressed='true']").forEach(b => { b.setAttribute("aria-pressed", "false"); b.innerHTML = ttsLabel(false); });
  if (r && r.wake) { try { r.wake.release(); } catch (e) {} }
}
function ttsLabel(on) { return on ? `${ICON.stop}<span>Arrêter la lecture</span>` : `${ICON.speak}<span>Écouter la fiche</span>`; }
function ttsBtnHTML() { return TTS_OK ? `<button class="tts-btn" data-act="tts" aria-pressed="false">${ttsLabel(false)}</button>` : ""; }
function ttsRateHTML() { return TTS_OK ? `<button class="tts-rate" data-act="ttsRate" aria-label="Vitesse de lecture">${String(ttsRate()).replace(".", ",")}×</button>` : ""; }
function ttsToggle(btn) {
  if (!TTS_OK) return;
  if (ttsRun && ttsRun.btn === btn) return ttsStop();
  ttsStop();
  const root = btn.closest(".peek-sheet") || btn.closest(".lesson") || document.getElementById("main"), blocks = root ? ttsBlocks(root) : [];
  if (!blocks.length) return;
  const run = ttsRun = { btn, i: 0, blocks };
  btn.setAttribute("aria-pressed", "true"); btn.innerHTML = ttsLabel(true);
  try { if (navigator.wakeLock) navigator.wakeLock.request("screen").then(w => { if (ttsRun === run) run.wake = w; else w.release(); }).catch(() => {}); } catch (e) {}
  const voice = ttsVoice();
  const next = () => {
    if (ttsRun !== run) return;
    document.querySelectorAll(".tts-on").forEach(x => x.classList.remove("tts-on"));
    if (run.i >= run.blocks.length) { ttsStop(); return; }
    const el = run.blocks[run.i++], u = new SpeechSynthesisUtterance(ttsText(el));
    u.lang = "fr-FR"; if (voice) u.voice = voice; u.rate = ttsRate();
    el.classList.add("tts-on"); try { el.scrollIntoView({ block: "nearest", behavior: fxOn() ? "smooth" : "auto" }); } catch (e) {}
    u.onend = next; u.onerror = e => { if (e.error !== "interrupted" && e.error !== "canceled") next(); };
    run.u = u; speechSynthesis.speak(u);
  };
  next();
}
if (TTS_OK) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => {}; } catch (e) {} document.addEventListener("visibilitychange", () => { if (document.hidden && ttsRun && /iPhone|iPad/.test(navigator.userAgent)) ttsStop(); }); window.addEventListener("pagehide", () => ttsStop()); }

let peekT = null;
function fichePeek(id, hint) {
  const c = CHID[id]; if (!c) return;
  if (lockedCat(c.cat)) return lockSheet(c.cat);
  closeSheet(); peekClose(true);
  S.fr = S.fr || {}; if (!S.fr[id]) { S.fr[id] = 1; bumpStreak(); touch(); }
  clearTimeout(peekT);
  if (!(S.frx || {})[id]) peekT = setTimeout(() => { if (document.getElementById("peek")) { S.frx = S.frx || {}; if (!S.frx[id]) { S.frx[id] = 1; S.xp += 4; touch(); renderTop(); toast("Fiche lue : +4 XP"); } } }, 30000);
  const el = document.createElement("div"); el.className = "peek"; el.id = "peek";
  el.innerHTML = `<div class="peek-sheet" role="dialog" aria-modal="true" aria-labelledby="peekT" style="${hueStyle(c.cat)}">
    <div class="peek-grab" title="Fais glisser vers le bas pour fermer"><span class="peek-handle" aria-hidden="true"></span>
      <div class="peek-bar"><span class="tabcode">${h(CAT[c.cat].code)}</span><span class="peek-k">Fiche · glisse vers le bas pour reprendre</span>${ttsBtnHTML()}<button class="peek-x" data-act="peekClose" aria-label="Fermer la fiche">×</button></div></div>
    <div class="peek-body lesson fiche-view"><h1 id="peekT">${h(c.title)}</h1>${ficheMd(c)}${ficheTrain(c, true)}
      <div class="row peek-foot"><button class="btn primary" data-act="peekClose">Reprendre</button><button class="btn" data-act="peekFull" data-id="${h(id)}">Ouvrir en grand</button></div></div>
  </div>`;
  document.body.appendChild(el); document.documentElement.classList.add("peek-open");
  peekTarget(el.querySelector(".peek-body"), hint); glossify(el);
  el.addEventListener("click", e => { if (e.target === el) peekClose(); });
  el.querySelectorAll("[data-widget]").forEach(w => { const f = typeof MATHS !== "undefined" && MATHS.WIDGETS[w.dataset.widget]; if (f) { try { f(w); } catch (x) { w.remove(); } } });
  requestAnimationFrame(() => el.classList.add("in"));
  const sh = el.querySelector(".peek-sheet"), grab = el.querySelector(".peek-grab"), body = el.querySelector(".peek-body");
  let y0 = null, dy = 0, t0 = 0, fromBody = false;
  const start = e => { if (e.target.closest(".peek-x, .tts-btn")) return; fromBody = !grab.contains(e.target); if (fromBody && body.scrollTop > 0) return; y0 = e.clientY; dy = 0; t0 = Date.now(); };
  const move = e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); if (fromBody && dy < 8) return; sh.style.transition = "none"; sh.style.transform = `translateY(${dy}px)`; el.style.setProperty("--peek-k", String(Math.max(0, 1 - dy / 500))); };
  const end = () => { if (y0 == null) return; const fast = dy / Math.max(1, Date.now() - t0) > .6 && dy > 40; y0 = null; sh.style.transition = ""; if (dy > 120 || fast) peekClose(); else { sh.style.transform = ""; el.style.removeProperty("--peek-k"); } };
  sh.addEventListener("pointerdown", start); window.addEventListener("pointermove", move); window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
  el._off = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", end); window.removeEventListener("pointercancel", end); };
  const x = el.querySelector(".peek-x"); if (x) x.focus({ preventScroll: true });
}
function peekClose(now) {
  const el = document.getElementById("peek"); if (!el) return;
  if (ttsRun && el.contains(ttsRun.btn)) ttsStop();
  if (el._off) el._off();
  document.documentElement.classList.remove("peek-open");
  if (now || !fxOn()) { el.remove(); return; }
  el.classList.remove("in"); el.classList.add("out"); const sh = el.querySelector(".peek-sheet"); if (sh) sh.style.transform = "";
  setTimeout(() => el.remove(), 260);
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && document.getElementById("peek")) peekClose(); });
/* Tous les entraînements liés à une fiche (chapitre) */
const FT_IC = { x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>', s: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h4a2 2 0 0 1 2 2v7"/></svg>', g: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><path d="M12 20h9"/><path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>', k: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.4-6.3 2 2-6.3z"/></svg>' }, FT_KIND = { x: "Calculs express", s: "Schéma", g: "Exercice chiffré", k: "Exercice guidé" };
function exBtnHTML(k, cat) {
  const e = exInfo(k), act = e.pre === "x" ? `data-act="cxOne" data-g="${e.id}" data-cat="${cat}"` : e.pre === "s" ? `data-act="scOpen" data-sid="${e.id}" data-cat="${cat}"` : e.pre === "g" ? `data-act="exStart" data-gid="${e.id}"` : `data-act="gcase" data-id="${e.id}"`;
  return `<button class="ft-it" ${act}><span class="ft-ic" aria-hidden="true">${FT_IC[e.pre]}</span><span><b>${h(e.label)}</b><small>${FT_KIND[e.pre]}${exDone(k) ? " · ✓ réussi" : ""}</small></span></button>`;
}
/* Exercices de la fiche : liste complète, puis rangement de chacun sous la partie de la fiche qui en parle */
function ficheExKeys(c) {
  return [].concat(GENS.filter(g => g.cat === c.cat).map(g => "g:" + g.id), (GCBY[c.cat] || []).map(k => "k:" + k.id), CXG.filter(g => g.cat === c.cat).map(g => "x:" + g.id), SCH.filter(x => x.cat === c.cat).map(x => "s:" + x.id)).filter(k => exInfo(k).ch === c.id);
}
function exSecIdx(k, c) {
  if (EXSEC[k] != null) { const j = (c.sections || []).findIndex(x => nk(x.h).includes(nk(EXSEC[k]))); if (j >= 0) return j; }
  const tok = exInfo(k).tok; let best = -1, bs = 1;
  (c.sections || []).forEach((x, j) => { if (/^en clair/i.test(x.h)) return; const T = new Set(hintTokens(x.h + " " + x.h + " " + JSON.stringify(x.b || []))); let n = 0; tok.forEach(w => { if (T.has(w)) n++; }); if (n > bs) { bs = n; best = j; } });
  return best;
}
const DWFX = { p3c2: ["principales corrections", "Réintégrer ou déduire, et pourquoi"], p1c3: ["Exigibilité et déductibilité", "TVA déductible ou non, et pourquoi"], p3c1: ["Base d'imposition", "TVA exigible, déductible, et pourquoi"], p2c1: ["coût d'acquisition", "Charge ou immobilisation, et pourquoi"], p5c3: ["Le coût variable", "Charge fixe ou variable, et pourquoi"], p6c2: ["La structure", "Classer les postes du bilan fonctionnel"], p4c1: ["Les différents contrats", "CDD et fautes, et pourquoi"], t5c2: ["Modification du contrat", "Modifier le contrat ou les conditions de travail, et pourquoi"], t1c3: ["conditions de validité", "Contrat valable ou annulable, et pourquoi"], t3c3: ["La responsabilité civile", "Quelle responsabilité, et pourquoi"], t4c3: ["données personnelles", "Donnée personnelle ou non, et pourquoi"], p7c4: ["Le RGPD", "Donnée personnelle ou non, et pourquoi"] };
/* Questions « décision puis pourquoi » pour une matière (et éventuellement des chapitres précis) */
function dwKeys(cat, chs, kw) { return Object.keys(DWFX).filter(k => CTLX[k] && CHID[k] && !lockedCat(CHID[k].cat) && (!cat || CHID[k].cat === cat) && (!chs || !chs.length || chs.includes(k)) && (!kw || !kwList(kw).length || kwHit(kw, DWFX[k][1], CHID[k].title))); }
function dwFor(cat, chs, n, kw) {
  const keys = dwKeys(cat, chs, kw);
  if (!keys.length || n <= 0) return [];
  const per = Math.max(1, Math.ceil(n / keys.length));
  return shuffle([].concat(...keys.map(k => { try { return CTLX[k](per); } catch (e) { return []; } }))).slice(0, n);
}
function dwHome() {
  const L = Object.keys(DWFX).filter(k => CTLX[k] && CHID[k] && !lockedCat(CHID[k].cat));
  return `<div class="sec-head"><h2>Décider et justifier</h2><p>Pour chaque situation, choisis d'abord la décision, puis la bonne raison. C'est juste seulement si les deux le sont.</p></div>
    <div class="row"><button class="btn primary" data-act="dwMix">Tout mélanger (15 questions)</button></div>
    ${lockedCat("ce") ? "" : `<div class="ft-grid"><button class="ft-it" style="${hueStyle("ce")}" data-act="auSit" data-yr="1"><span class="ft-ic" aria-hidden="true">${ICON.list}</span><span><b>Une notion : son auteur, puis sa définition</b><small>${h(CAT.ce.code)} · Notions de 1re année · ${AUSIT.filter(x => x.y.includes("1")).length} notions</small></span></button><button class="ft-it" style="${hueStyle("ce")}" data-act="auSit" data-yr="2"><span class="ft-ic" aria-hidden="true">${ICON.list}</span><span><b>Une notion : son auteur, puis sa définition</b><small>${h(CAT.ce.code)} · Notions de 2e année · ${AUSIT.filter(x => x.y.includes("2")).length} notions</small></span></button></div>`}
    <div class="ft-grid">${L.map(k => { const c = CHID[k]; return `<button class="ft-it" style="${hueStyle(c.cat)}" data-act="dwRun" data-ch="${k}"><span class="ft-ic" aria-hidden="true">${ICON.list}</span><span><b>${h(DWFX[k][1])}</b><small>${h(CAT[c.cat].code)} · ${h(c.title)} · ${dwN(k)} questions</small></span></button>`; }).join("")}</div>`;
}
const DWN = {}; function dwN(k) { if (DWN[k] == null) { try { DWN[k] = CTLX[k](10).length; } catch (e) { DWN[k] = 0; } } return DWN[k]; }
function dwBtn(c, big) { const d = DWFX[c.id]; return d && CTLX[c.id] && dwN(c.id) ? `<button class="btn${big ? " primary" : ""}" data-act="dwRun" data-ch="${c.id}">${h(d[1])} (${dwN(c.id)})</button>` : ""; }
function ficheInlineEx(c, si) {
  if (!c._exs) { c._exs = {}; const cnt = {}; ficheExKeys(c).forEach(k => { const j = exSecIdx(k, c); if (j < 0 || (cnt[j] || 0) >= 2) return; cnt[j] = (cnt[j] || 0) + 1; (c._exs[j] = c._exs[j] || []).push(k); }); }
  const L = c._exs[si] || [], dw = DWFX[c.id] && nk(c.sections[si].h).includes(nk(DWFX[c.id][0])) ? dwBtn(c, true) : ""; if (!L.length && !dw) return "";
  return `<div class="fx-in" style="${hueStyle(c.cat)}"><p class="fx-k">${ICON.pen}S'exercer sur cette partie</p>${dw ? `<div class="row">${dw}</div>` : ""}${L.length ? `<div class="ft-grid">${L.map(k => exBtnHTML(k, c.cat)).join("")}</div>` : ""}</div>`;
}
function ficheTrain(c, compact) {
  const nq = (QCH[c.id] || []).length, nf = (FCH[c.id] || []).length;
  const all = ficheExKeys(c);
  const ctl = typeof ctlChaps === "function" && ctlChaps(c.cat).some(x => x.id === c.id);
  if (!nq && !nf && !all.length) return "";
  const ic = FT_IC, kind = FT_KIND;
  const exBtn = k => exBtnHTML(k, c.cat);
  return `<section class="fiche-train${compact ? " compact" : ""}" style="${hueStyle(c.cat)}"><p class="eyebrow">S'entraîner sur cette fiche</p>
    <div class="ft-main">${dwBtn(c)}${nq ? `<button class="btn primary" data-act="chQuiz" data-ch="${c.id}">Quiz de la fiche (${nq})</button>` : ""}${nf ? `<button class="btn" data-act="chCards" data-ch="${c.id}">Cartes (${nf})</button>` : ""}${ctl ? `<button class="btn" data-act="ctlStart" data-k="${c.id}">Contrôle du chapitre</button>` : ""}</div>
    ${all.length ? `<div class="ft-grid">${all.map(exBtn).join("")}</div>` : ""}
  </section>`;
}
/* Fiche récap : l'idée, l'essentiel, les définitions, les tableaux et les pièges, sans les explications ni les exemples (qui restent dans la fiche détaillée) */
let FMODE = (() => { try { return localStorage.getItem("gl-fmode") || "recap"; } catch (e) { return "recap"; } })();
const firstSent = t => { const m = String(t).match(/^.{25,}?[.!?](?=\s+[A-ZÀÂÉÈÊÎÔÛÇ«(]|$)/); return m ? m[0] : String(t); }; // la première phrase d'une définition
function ficheRecap(c) {
  const all = (c.sections || []).flatMap(s => s.b || []), tabs = all.filter(b => b[0] === "t"), traps = all.filter(b => b[0] === "trap" || b[0] === "w");
  /* Définitions : celles du cours (pas les versions « En clair » pour débuter), sans doublon */
  const nk2 = t => String(t).toLowerCase().replace(/\(.*?\)/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean).map(w => w.replace(/s$/, "")).join(" ");
  const seen = new Set(), defs = [];
  (c.sections || []).filter(s => !/^en clair/i.test(s.h)).concat((c.sections || []).filter(s => /^en clair/i.test(s.h))).forEach(s => (s.b || []).forEach(b => { if (b[0] !== "d") return; const k = nk2(b[1]); if (seen.has(k)) return; seen.add(k); defs.push(b); }));
  return `<div class="md fiche-recap">
    <blockquote class="callout key"><p class="md-label"><strong>Idée clé</strong></p><p>${h(c.idee)}</p></blockquote>
    ${c.points && c.points.length ? `<h4>L'essentiel</h4><ul class="recap-pts">${c.points.map(p => `<li>${h(p)}</li>`).join("")}</ul>` : ""}
    ${defs.length ? `<h4>Les mots à savoir définir</h4><dl class="recap-defs">${defs.map(b => `<div><dt>${h(b[1])}</dt><dd>${h(firstSent(b[2]))}</dd></div>`).join("")}</dl>` : ""}
    ${tabs.length ? `<details class="recap-tabs"><summary>${tabs.length > 1 ? `Les ${tabs.length} tableaux` : "Le tableau"} de la fiche</summary>${blocksHTML(tabs)}</details>` : ""}
    ${traps.length ? `<h4>Les pièges</h4>${blocksHTML(traps)}` : ""}
    <p class="recap-more"><button class="btn small" data-act="fmode" data-m="full">Lire la fiche détaillée</button><span class="muted small">explications, exemples et exercices</span></p>
  </div>`;
}
function vFiche() {
  const c = FC && CHID[FC.id]; if (!c) return vFiches();
  const list = CHBY[c.cat], i = list.indexOf(c), pv = list[i - 1], nx = list[i + 1], th = THEME[c.th];
  const nq = (QCH[c.id] || []).length, nf = (FCH[c.id] || []).length, cases = (GCBY[c.cat] || []).filter(k => k.ch === c.id);
  const ol = ficheOutline(c);
  return `<div class="reader" style="${hueStyle(c.cat)}">
    <aside class="outline" aria-label="Fiches de la matière">
      <button class="crumb" data-act="mat" data-cat="${c.cat}" data-seg="fiche">${ICON.back}${h(CAT[c.cat].name)}</button>
      <p class="ol-title">Fiches</p><ol>${ol}</ol>
    </aside>
    <article class="lesson fiche-view">
      <details class="outline-m"><summary>Toutes les fiches : ${h(CAT[c.cat].name)}</summary><ol>${ol}</ol></details>
      <p class="lesson-meta"><span class="tabcode">${h(CAT[c.cat].code)}</span><span>Fiche ${i + 1} sur ${list.length}</span>${th ? `<span>${h(th.title)}</span>` : ""}</p>
      <div class="lprog" role="presentation"><i style="width:${pct(i + 1, list.length)}%"></i></div>
      <h1>${h(c.title)}</h1>
      ${TTS_OK ? `<div class="tts-row">${ttsBtnHTML()}${ttsRateHTML()}</div>` : ""}
      <div class="picker fmode" role="tablist" aria-label="Version de la fiche"><button class="chip" role="tab" data-act="fmode" data-m="recap" aria-pressed="${FMODE === "recap"}">Récap</button><button class="chip" role="tab" data-act="fmode" data-m="full" aria-pressed="${FMODE === "full"}">Fiche détaillée</button></div>
      ${FMODE === "recap" ? ficheRecap(c) : `<div class="md">
        <blockquote class="callout key"><p class="md-label"><strong>Idée clé</strong></p><p>${h(c.idee)}</p></blockquote>
        ${(c.sections || []).map((s, si) => `<h4>${h(s.h)}</h4>${blocksHTML(s.b)}${ficheInlineEx(c, si)}`).join("")}
        ${c.points && c.points.length ? `<blockquote class="callout retain"><p class="md-label"><strong>L'essentiel</strong></p><ul>${c.points.map(p => `<li>${h(p)}</li>`).join("")}</ul></blockquote>` : ""}
      </div>`}
      ${ficheTrain(c)}
      <p class="rep-row"><button class="rep-btn" data-act="report" data-t="f" data-id="${h(c.id)}" data-l="${h(String(c.title).slice(0, 140))}">Signaler une erreur</button></p>
      <footer class="lesson-foot">${pv ? `<button class="btn" data-act="fiche" data-fprev data-id="${pv.id}">Fiche précédente</button>` : `<button class="btn" data-act="mat" data-cat="${c.cat}" data-seg="fiche">Retour à la matière</button>`}
        ${nx ? `<button class="next-card" data-act="fiche" data-fnext data-id="${nx.id}"><span>Fiche suivante</span><b>${h(nx.title)}</b></button>` : `<button class="next-card" data-act="quickQuiz" data-cat="${c.cat}"><span>Dernière fiche de la matière</span><b>Faire un quiz de 10 questions</b></button>`}</footer>
    </article>
  </div>`;
}

/* Onglet « Fiches » d'une matière : fiches, méthode, repères, mémo */
function matFiche(c) {
  const chs = CHBY[c.id] || [], refs = REFBY[c.id] || [], meths = Object.values(METH).filter(m => m.cat === c.id), memo = FBY[c.id].filter(x => !x.ch);
  const subs = [["fiches", `Fiches (${chs.length})`], meths.length ? ["meth", "Méthode"] : null, refs.length ? ["refs", `Repères (${refs.length})`] : null, ["memo", `Mémo express (${memo.length})`]].filter(Boolean);
  if (!subs.find(s => s[0] === matSub)) matSub = subs[0][0];
  const pills = `<div class="picker" role="tablist">${subs.map(([k, l]) => `<button class="chip" role="tab" data-act="sub" data-sub="${k}" aria-pressed="${matSub === k}">${l}</button>`).join("")}</div>`;
  let body = "";
  if (matSub === "fiches") {
    const groups = {}; const order = [];
    chs.forEach(x => { if (!groups[x.th]) { groups[x.th] = []; order.push(x.th); } groups[x.th].push(x); });
    const nr = chs.filter(x => ficheRead(x.id)).length;
    body = `<p class="muted">${chs.length} fiches. Chacune s'ouvre en version récap (l'idée clé, l'essentiel, les définitions, les pièges) ; la fiche détaillée garde les explications et les exemples. Tu en as lu ${nr}.</p>` +
      order.map(t => `<div class="fiche-group"><h3>${h((THEME[t] || {}).title || "")}</h3><div class="fcards">${groups[t].map(x => fcard(x)).join("")}</div></div>`).join("");
  } else if (matSub === "meth") {
    body = meths.map(m => `<div class="stack"><h3>${h(m.title)}</h3>${m.intro ? `<p class="muted">${h(m.intro)}</p>` : ""}<ol class="meth">${m.steps.map(s => `<li><span class="mk">${h(s.k)}</span><div><b>${h(s.name)}</b><p>${h(s.txt || "")}</p>${s.tip ? `<p class="muted">${h(s.tip)}</p>` : ""}</div></li>`).join("")}</ol>${m.note ? `<p class="muted">${h(m.note)}</p>` : ""}</div>`).join("");
  } else if (matSub === "refs") {
    const cfg = Object.values(MCFG).filter(m => m.cat === c.id)[0] || {};
    body = `${cfg.refIntro ? `<p class="muted">${h(cfg.refIntro)}</p>` : ""}<div class="refs">${refs.map(r => `<div class="ref"><b>${h(r[0])}</b>${r[3] ? `<span class="ref-l">${h(r[3])}</span>` : ""}<p>${h(r[4])}</p></div>`).join("")}</div>`;
  } else {
    body = `<p class="muted">Chaque notion tient en une ligne, avec un exemple ou un repère en complément.</p>
      <div class="fiche-tools"><input class="search" id="matFicheSearch" type="search" placeholder="Filtrer le mémo" aria-label="Filtrer le mémo"><button class="btn" data-act="cardsCat" data-cat="${c.id}">Réviser en cartes</button></div>
      <div id="matFicheList" class="stack">${ficheBody(c.id, matFicheQuery)}</div>`;
  }
  return pills + `<div class="stack">${body}</div>`;
}
function fcard(x, withCat) {
  const nq = (QCH[x.id] || []).length, idee = x.idee.length > 130 ? x.idee.slice(0, 127).replace(/\s+\S*$/, "") + "…" : x.idee;
  return `<button class="fcard${ficheRead(x.id) ? " is-read" : ""}" style="${hueStyle(x.cat)}" data-act="fiche" data-id="${x.id}">
    ${withCat ? `<span class="mini">${h(CAT[x.cat].code)} ${h(CAT[x.cat].name)}</span>` : ""}<b>${h(x.title)}</b><span class="muted">${h(idee)}</span>
    <span class="fc-meta">${ficheRead(x.id) ? "Lue" : "À lire"}${nq ? `, ${nq} questions` : ""}</span></button>`;
}

/* Recherche globale dans les fiches */
let CHTXT = null;
function chText(x) {
  if (!CHTXT) { CHTXT = {}; CHAP.forEach(c => { CHTXT[c.id] = (c.title + " " + c.idee + " " + (c.points || []).join(" ") + " " + JSON.stringify(c.sections)).toLowerCase(); }); }
  return CHTXT[x.id];
}

/* Exercices guidés, étape par étape */
function openCase(id) { if (!GCID[id]) return; if (lockedCat(GCID[id].cat)) return lockSheet(GCID[id].cat); GC = { id }; go("gcase"); }
function caseState(id) { S.gc = S.gc || {}; const st = S.gc[id] || (S.gc[id] = { step: 0, notes: {} }); st.ok = st.ok || {}; return st; }
/* Vérification automatique des étapes chiffrées : on compare le résultat du corrigé (dernier « = nombre ») aux nombres de la réponse */
const NUM_RE = /-?\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:,\d+)?|-?\d+(?:[.,]\d+)?/g;
const toNum = t => parseFloat(String(t).replace(/[ \u00a0\u202f]/g, "").replace(",", "."));
const numTol = x => Math.abs(x) >= 100 ? Math.max(1, Math.abs(x) * 0.002) : Math.max(0.011, Math.abs(x) * 0.01);
function stepCheck(key, note) {
  const exp = STEP_EXP[key]; if (!exp) return null;
  const got = (String(note || "").match(NUM_RE) || []).map(toNum).filter(x => !isNaN(x));
  const miss = exp.filter(e => !(Array.isArray(e) ? e : [e]).some(v => got.some(g => Math.abs(g - v) <= numTol(v))));
  return { exp: exp.map(e => Array.isArray(e) ? e[0] : e), ok: !miss.length, none: !got.length, miss: miss.map(e => Array.isArray(e) ? e[0] : e) };
}
function vCase() {
  const k = GCID[GC && GC.id]; if (!k) return vExHome();
  const st = caseState(k.id), n = k.steps.length, ch = CHID[k.ch];
  return `<section class="runner ex-runner" style="${hueStyle(k.cat)}">
    <div class="runner-top"><button class="crumb" data-act="mat" data-cat="${k.cat}" data-seg="train">${ICON.back}${h(CAT[k.cat].name)}</button><span class="progress-text">Étape ${Math.min(st.step + 1, n)} sur ${n}</span></div>
    <div class="qcard">
      <span class="eyebrow">${h(k.src || "Exercice guidé")}${ch ? `, fiche « ${h(ch.title)} »` : ""}</span>
      <h1 class="case-title">${h(k.title)}</h1>
      <div class="ex-enonce"><p style="white-space:pre-line">${h(k.enonce)}</p>${k.question ? `<p class="qtext">${h(k.question)}</p>` : ""}</div>
    </div>
    ${k.steps.map((s, i) => {
      const locked = i > st.step, shown = i < st.step;
      return `<div class="gstep${locked ? " locked" : ""}${shown ? " shown" : ""}" id="gs${i}">
        <div class="gstep-h"><span class="mk">${h(s.k)}</span><b>${h(s.name)}</b>${shown && st.ok[i] === true ? `<span class="ok-badge" title="Juste">${ICON.check}</span>` : shown && st.ok[i] === false ? `<span class="ko-badge" title="À revoir">✕</span>` : ""}</div>
        ${locked ? "" : `${s.tip ? `<p class="muted">${h(s.tip)}</p>` : ""}
        <textarea class="ex-text" rows="3" data-gstep="${i}" placeholder="Ta réponse (brouillon enregistré)">${h(st.notes[i] || "")}</textarea>
        ${shown ? (() => { const ck = stepCheck(k.id + "|" + s.name, st.notes[i]);
          const verdict = ck ? `<p class="gverdict ${ck.ok ? "ok" : "ko"}">${ck.ok ? "Juste" : ck.none ? "Pas de montant dans ta réponse" : "Faux"} : attendu ${ck.exp.map(fmt).join(" et ")}${!ck.ok && !ck.none && ck.exp.length > 1 ? ` ; il manque ou il y a une erreur sur ${ck.miss.map(fmt).join(" et ")}` : ""}.</p>`
            : st.ok[i] == null ? `<div class="gself"><span>Compare avec le corrigé :</span><button class="btn small" data-act="gSelf" data-i="${i}" data-v="1">J'avais juste</button><button class="btn small" data-act="gSelf" data-i="${i}" data-v="0">Je m'étais trompé</button></div>` : "";
          return `<div class="corr ${st.ok[i] === false ? "is-ko" : ""}"><b>Corrigé</b><p style="white-space:pre-line">${h(s.corr)}</p>${verdict}</div>`; })() : `<div class="row"><button class="btn primary" data-act="gReveal" data-i="${i}">Voir le corrigé de cette étape</button></div>`}`}
      </div>`;
    }).join("")}
    ${st.step >= n ? `<div class="panel"><b>Exercice terminé${Object.keys(st.ok).length ? ` : ${Object.values(st.ok).filter(Boolean).length} étape${Object.values(st.ok).filter(Boolean).length > 1 ? "s" : ""} juste${Object.values(st.ok).filter(Boolean).length > 1 ? "s" : ""} sur ${n}` : ""}.</b><p class="muted">Les étapes chiffrées sont vérifiées automatiquement ; pour les autres, compare avec le corrigé et indique si tu avais juste. Refais l'exercice dans quelques jours pour vérifier que c'est acquis.</p><div class="row"><button class="btn" data-act="gReset">Recommencer</button><button class="btn primary" data-act="mat" data-cat="${k.cat}" data-seg="train">Autres exercices</button></div></div>` : ""}
  </section>`;
}
function gcCard(k) { const st = (S.gc || {})[k.id]; const done = st && st.step >= k.steps.length; return `<button class="ex-card" style="${hueStyle(k.cat)}" data-act="gcase" data-id="${k.id}"><b>${h(k.title)}</b><span class="muted">${k.steps.length} étapes${done ? ", terminé" : st && st.step ? `, étape ${st.step + 1}` : ""}</span></button>`; }

/* Défi 60 secondes */
function startDefi(cats) {
  if (defiTick) clearInterval(defiTick);
  const pool = shuffle(QS.filter(x => (!cats || cats.includes(x.c)) && !qCalc(x)));
  DF = { pool, i: 0, ok: 0, ko: 0, miss: [], end: Date.now() + 60000, last: null, cats, order: shuffle([0, 1, 2, 3]), done: false };
  defiTick = setInterval(() => {
    const t = document.getElementById("defiTimer"), left = Math.max(0, DF.end - Date.now());
    if (t) { t.textContent = Math.ceil(left / 1000) + " s"; t.classList.toggle("low", left < 10000); const b = document.getElementById("defiBar"); if (b) b.style.width = (left / 600) + "%"; } secTick(left, "df");
    if (left <= 0) finishDefi();
  }, 250);
  go("defi");
}
function defiPick(pos) {
  if (!DF || DF.done) return;
  const it = DF.pool[DF.i], ok = DF.order[pos] === 0;
  recordQ(it, ok, it.o[DF.order[pos]]);
  if (ok) DF.ok++; else { DF.ko++; DF.miss.push(it); }
  DF.last = { ok, good: it.o[0] };
  DF.i = (DF.i + 1) % DF.pool.length; DF.order = shuffle([0, 1, 2, 3]);
  render();
}
function finishDefi() {
  if (!DF || DF.done) return;
  DF.done = true; clearInterval(defiTick); defiTick = null;
  S.df = S.df || { best: 0 }; DF.record = DF.ok > S.df.best; if (DF.record) S.df.best = DF.ok;
  S.xp += DF.ok * 2; wlog("df", "all"); dayLog().e++; bumpStreak(); touch();
  if (view === "defi") render();
}
function vDefi() {
  if (!DF) return vExHome();
  if (DF.done) {
    return `<section class="runner">
      <div><span class="eyebrow">Défi 60 secondes</span><h1>${DF.ok} bonne${DF.ok > 1 ? "s" : ""} réponse${DF.ok > 1 ? "s" : ""}</h1></div>
      <p class="muted">${DF.record ? "Nouveau record !" : `Ton record : ${(S.df || {}).best || 0}.`} ${DF.ko} erreur${DF.ko > 1 ? "s" : ""}, +${DF.ok * 2} XP.</p>
      <div class="row"><button class="btn primary" data-act="defi">Rejouer</button><button class="btn" data-nav="ex">S'entraîner</button></div>
      ${DF.miss.length ? `<h2>À revoir</h2><div class="review">${DF.miss.map(x => `<div class="review-item"><p class="q">${h(x.q)}</p><p class="a">Bonne réponse : ${h(x.o[0])}</p><p class="e">${h(x.e)}</p></div>`).join("")}</div>` : ""}
    </section>`;
  }
  const it = DF.pool[DF.i], left = Math.max(0, DF.end - Date.now()), L = ["A", "B", "C", "D"];
  return `<section class="runner defi" style="${hueStyle(it.c)}">
    <div class="runner-top"><span class="eyebrow">Défi 60 secondes${DF.cats ? " : " + h(CAT[DF.cats[0]].name) : ""}</span><span class="timer${left < 10000 ? " low" : ""}" id="defiTimer">${Math.ceil(left / 1000)} s</span><span class="progress-text">${DF.ok} juste${DF.ok > 1 ? "s" : ""}, ${DF.ko} erreur${DF.ko > 1 ? "s" : ""}</span></div>
    <div class="bar"><i id="defiBar" style="width:${left / 600}%"></i></div>
    ${DF.last ? `<p class="defi-last ${DF.last.ok ? "ok" : "ko"}">${DF.last.ok ? "Juste !" : "Raté : " + h(DF.last.good)}</p>` : `<p class="defi-last">Réponds vite : touches 1 à 4.</p>`}
    <div class="qcard"><span class="ep" style="align-self:flex-start">${h(CAT[it.c].code)} ${h(CAT[it.c].name)}</span><p class="qtext">${h(it.q)}</p>
      <div class="options">${DF.order.map((oi, pos) => `<button class="opt" data-act="dPick" data-pos="${pos}"><span class="k">${L[pos]}</span><span>${h(it.o[oi])}</span></button>`).join("")}</div></div>
  </section>`;
}

/* Maths : entraînement généré à l'infini */
function genQuiz(ch) {
  const gens = MATHS.GENERATORS[ch]; if (!gens || !gens.length) return;
  const items = Array.from({ length: 10 }, (_, k) => { const g = gens[k % gens.length](); return { id: "g" + ch + "-" + k, c: "ma", q: g.q, o: [g.good].concat(g.bad), e: g.e || "" }; });
  startRun(shuffle(items), "quiz");
}
const EP_TOTAL = EPREUVES.reduce((s, e) => s + e.k, 0);
function btsState() { S.bts = S.bts || {}; if (!S.bts.date) S.bts.date = "2027-05-17"; S.bts.notes = S.bts.notes || {}; S.bts.check = S.bts.check || {}; return S.bts; }
function daysLeft() { const b = btsState(), d = new Date(b.date + "T08:00:00"); const n = Math.ceil((d - new Date()) / 86400000); return isNaN(n) ? null : Math.max(0, n); }
function frDate(iso) { try { return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch (e) { return iso; } }
function simAvg() { const b = btsState(); let s = 0; EPREUVES.forEach(e => { let v = parseFloat(b.notes[e.c]); if (isNaN(v)) v = e.ex; s += Math.min(20, Math.max(0, v)) * e.k; }); return s / EP_TOTAL; }
function simText() {
  const avg = simAvg(), ok = avg >= 10, miss = (10 * EP_TOTAL - avg * EP_TOTAL);
  return { avg: avg.toFixed(2).replace(".", ",") + " / 20", ok, tip: "Un point gagné en E5 (coefficient 9) pèse trois fois plus qu'un point en maths ou en anglais (coefficient 3)." + (ok ? "" : ` Il te manque ${(Math.ceil(miss * 10) / 10).toString().replace(".", ",")} points pondérés, soit par exemple ${(Math.ceil(miss / 9 * 10) / 10).toString().replace(".", ",")} point de plus en E5.`) };
}
function effortByCat() {
  const E = {}; const add = (c, v) => { if (c && CAT[c]) E[c] = (E[c] || 0) + v; };
  Object.entries(S.q || {}).forEach(([id, r]) => add(id.replace(/q\d+$/, ""), r[0]));
  Object.entries(S.c || {}).forEach(([id, r]) => add(id.replace(/k\d+$/, ""), 1 + (r[0] || 0)));
  Object.keys(S.l || {}).forEach(k => { const cid = k.split(":")[0]; try { add(CMETA(cid).cat, 6); } catch (e) {} });
  Object.keys(S.fr || {}).forEach(id => add(CHID[id] && CHID[id].cat, 3));
  Object.keys(S.x || {}).forEach(id => { const g = GENS.find(x => x.id === id) || GCASES.find(x => x.id === id) || (typeof REDACBY !== "undefined" && REDACBY[id]); add(g && g.cat, 8); });
  ANNEX.forEach(x => { const st = (S.an || {})[x.id]; if (st && (st.d || st.r)) add(annCat(x), 10); });
  return E;
}
function balanceHTML() {
  const E = effortByCat(), per = {};
  Object.entries(E).forEach(([c, v]) => { const eps = EPREUVES.filter(e => e.cats.includes(c)); eps.forEach(e => per[e.c] = (per[e.c] || 0) + v / eps.length); });
  const tot = Object.values(per).reduce((a, b) => a + b, 0);
  const head = `<section class="stack"><h2>Ton équilibre de révision</h2><p class="muted">Ce que tu as travaillé dans l'appli (réponses, cartes, leçons, exercices), comparé au poids de chaque épreuve dans la note finale.</p>`;
  if (tot < 80) return head + `<div class="empty">Encore trop peu d'activité pour comparer. Reviens après quelques séances.</div></section>`;
  const rows = EPREUVES.map(e => { const me = (per[e.c] || 0) / tot * 100, w = e.k / EP_TOTAL * 100, low = me < w * .6; return { e, me, w, low }; });
  const lows = rows.filter(r => r.low).sort((a, b) => (a.me - a.w) - (b.me - b.w));
  return head + `<div class="bal">${rows.map(r => `<div class="bal-r${r.low ? " low" : ""}"><b>${r.e.c}</b><span class="bal-t">${h(r.e.t)}</span>
      <div class="bal-bars"><span class="bal-b me" style="width:${Math.min(100, r.me).toFixed(1)}%"></span><span class="bal-b w" style="width:${r.w.toFixed(1)}%"></span></div>
      <span class="bal-n">${Math.round(r.me)} % <small>/ ${Math.round(r.w)} %</small></span></div>`).join("")}</div>
    <p class="bal-key"><span><i class="me"></i>ton temps</span><span><i class="w"></i>poids dans la note</span></p>
    ${lows.length ? `<p class="bal-tip"><b>À renforcer :</b> ${lows.slice(0, 3).map(r => `${r.e.c} (${Math.round(r.me)} % de ton temps pour ${Math.round(r.w)} % de la note)`).join(", ")}.</p>` : `<p class="bal-tip ok">Ton temps est bien réparti par rapport aux coefficients.</p>`}
  </section>`;
}
function vBts() {
  const b = btsState(), dl = daysLeft(), now = new Date(), cur = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0"), sim = simText();
  const doneN = BTS_CHECK.filter((_, i) => b.check[i]).length;
  return `<section class="bts-hero">
      <div class="stack"><h1>Mon BTS</h1><p class="muted">Tes épreuves, leur poids dans la note finale, ton planning et ta check-list jusqu'à l'examen.</p></div>
      <div class="count3d"><span class="big">${flap(dl)}</span><span>avant les premiers écrits</span>
        <label class="small-date">Date estimée <input type="date" id="btsDate" value="${h(b.date)}"></label></div>
    </section>
    ${bbSection()}
    ${plSection()}
    <p class="muted">Date par défaut estimée d'après la session 2026 (écrits du 18 au 21 mai). Remplace-la par celle de ta convocation dès que tu la reçois.</p>
    <section class="stack"><h2>Les épreuves et leur poids</h2>
      <div class="table-wrap"><table class="md-table ep-table"><thead><tr><th>Épreuve</th><th>Intitulé</th><th class="n">Coef.</th><th>Forme</th><th>Réviser</th></tr></thead><tbody>
      ${EPREUVES.map(e => `<tr><td><b>${e.c}</b></td><td>${h(e.t)}</td><td class="n"><b>${e.k}</b> <span class="muted">(${Math.round(e.k / EP_TOTAL * 100)} %)</span></td><td>${h(e.f)}</td><td><div class="row">${e.cats.map(c => `<button class="chip" style="${hueStyle(c)}" data-act="mat" data-cat="${c}" data-seg="lecons"><span class="mono">${h(CAT[c].code)}</span></button>`).join("")}</div></td></tr>`).join("")}
      </tbody></table></div>
      <p class="muted">39 coefficients au total ; le diplôme s'obtient avec une moyenne pondérée d'au moins 10 sur 20. La forme de certaines épreuves (CCF ou ponctuelle) dépend de ton statut et de ton établissement : vérifie avec ton centre.</p>
    </section>
    ${balanceHTML()}
    <section class="stack"><h2>Simulateur de moyenne</h2><p class="muted">Entre tes notes estimées : tu vois tout de suite où un point gagné rapporte le plus.</p>
      <div class="sim">${EPREUVES.map(e => `<label class="sim-f"><span><b>${e.c}</b> coefficient ${e.k}</span><input type="number" min="0" max="20" step="0.5" data-note="${e.c}" value="${h(b.notes[e.c] != null ? b.notes[e.c] : e.ex)}"></label>`).join("")}</div>
      <div class="sim-out"><div><span class="eyebrow">Moyenne estimée</span><div class="big" id="simAvg">${sim.avg}</div></div><span class="pill ${sim.ok ? "ok" : "ko"}" id="simVerdict">${sim.ok ? "Admis" : "Pas encore"}</span><p class="muted" id="simTip">${h(sim.tip)}</p></div>
    </section>
    <section class="stack"><h2>Les grandes étapes de l'année</h2>
      <div class="plan-tl">${BTS_PLAN.map(m => { const cls = m[0] === cur ? "now" : m[0] < cur ? "past" : ""; return `<div class="pm ${cls}"><h3>${m[1]}${cls === "now" ? ` <span class="pill">Ce mois-ci</span>` : ""}</h3><ul>${m[2].map(x => `<li>${h(x)}</li>`).join("")}</ul></div>`; }).join("")}</div>
    </section>
    <section class="stack"><h2>Check-list avant l'examen <span class="muted">${doneN} sur ${BTS_CHECK.length}</span></h2>
      <div class="checks">${BTS_CHECK.map((t, i) => `<label><input type="checkbox" data-check="${i}" ${b.check[i] ? "checked" : ""}><span>${h(t)}</span></label>`).join("")}</div>
    </section>`;
}

/* Liaisons après chaque rendu */
function bindFusion() {
  document.querySelectorAll("[data-widget]").forEach(el => { const f = MATHS.WIDGETS[el.dataset.widget]; if (f) { try { f(el); } catch (e) { el.remove(); } } else el.remove(); });
  document.querySelectorAll("textarea[data-gstep]").forEach(t => t.addEventListener("input", () => { const st = caseState(GC.id); st.notes[t.dataset.gstep] = t.value; clearTimeout(noteTimer); noteTimer = setTimeout(touch, 900); }));
  document.querySelectorAll("[data-bb]").forEach(inp => inp.addEventListener("change", () => { S.bb = S.bb || {}; const v = inp.value.trim().replace(",", "."), n = v === "" ? null : Math.max(0, Math.min(20, +v)); S.bb[inp.dataset.bb] = { n: n != null && !isNaN(n) ? n : null, d: dayNum() }; touch(); const y = window.scrollY; render(); window.scrollTo(0, y); }));
  const bd = document.getElementById("btsDate");
  if (bd) bd.addEventListener("change", () => { btsState().date = bd.value; touch(); render(); });
  document.querySelectorAll("[data-sit], [data-sitf]").forEach(inp => inp.addEventListener(inp.tagName === "SELECT" ? "change" : "input", () => {
    const x = S.sit && S.sit[OSIT]; if (!x) return; x.f = x.f || {};
    if (inp.dataset.sit) x[inp.dataset.sit] = inp.value; else x.f[inp.dataset.sitf] = inp.value;
    clearTimeout(bindView.st); bindView.st = setTimeout(touch, 800);
  }));
  document.querySelectorAll("[data-orck]").forEach(cb => cb.addEventListener("change", () => { if (OR) OR.list[OR.i].ck[cb.dataset.orck] = cb.checked; }));
  if (PB) {
    document.querySelectorAll("[data-pbex]").forEach(cb => cb.addEventListener("change", () => { const k = cb.dataset.pbex; PB.ex = PB.ex || []; PB.ex = cb.checked ? PB.ex.concat(k) : PB.ex.filter(x => x !== k); const y = window.scrollY; render(); window.scrollTo(0, y); return; const pv = document.getElementById("pbPrev"); if (pv) pv.innerHTML = packPreview(packData(PB)); const sm = document.querySelector(".pk-exbox summary .pill"); if (sm) sm.textContent = PB.ex.length + " choisi" + (PB.ex.length > 1 ? "s" : ""); }));
    document.querySelectorAll("[data-pbch]").forEach(cb => cb.addEventListener("change", () => { const k = cb.dataset.pbch; PB.chs = cb.checked ? PB.chs.concat(k) : PB.chs.filter(x => x !== k); if (!cb.checked) PB.secs = (PB.secs || []).filter(x => x.split("|")[0] !== k); render(); return; const pv = document.getElementById("pbPrev"); if (pv) pv.innerHTML = packPreview(packData(PB)); const sv = document.querySelector('[data-act="pbSave"]'); if (sv) { const d = packData(PB); sv.disabled = !(d.qs.length || d.fs.length); } }));
    const kw = document.getElementById("pbKw"); if (kw) kw.addEventListener("input", () => { PB.kw = kw.value; const d = packData(PB), pv = document.getElementById("pbPrev"); if (pv) pv.innerHTML = packPreview(d); const sv = document.querySelector('[data-act="pbSave"]'); if (sv) sv.disabled = !(d.qs.length || d.fs.length); });
    const nm = document.getElementById("pbName"); if (nm) nm.addEventListener("input", () => { PB.name = nm.value; });
    const dt = document.getElementById("pbDate"); if (dt) dt.addEventListener("change", () => { PB.date = dt.value; });
  }
  const bf = document.getElementById("bkFile");
  if (bf) bf.addEventListener("change", () => { const f = bf.files && bf.files[0]; if (!f) return;
    if (f.size > 20e6) { BK = { pending: null, when: "", err: "Fichier trop gros pour être une sauvegarde du Grand Livre." }; render(); return; }
    f.text().then(t => { const r = bkCheck(t); BK = r ? { pending: r.d, when: r.at ? new Date(r.at).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "date inconnue", err: "" } : { pending: null, when: "", err: "Ce fichier n'est pas une sauvegarde du Grand Livre." }; render(); }); });
  const pd = document.getElementById("pfDate");
  if (pd) pd.addEventListener("change", () => { if (pd.value) { btsState().date = pd.value; touch(); render(); } });
  const pn = document.getElementById("pfName");
  if (pn) pn.addEventListener("change", () => { P().name = pn.value.trim().slice(0, 40); touch(); render(); });
  document.querySelectorAll("[data-note]").forEach(inp => inp.addEventListener("input", () => {
    btsState().notes[inp.dataset.note] = inp.value; const s = simText();
    $("#simAvg").textContent = s.avg; const v = $("#simVerdict"); v.textContent = s.ok ? "Admis" : "Pas encore"; v.className = "pill " + (s.ok ? "ok" : "ko"); $("#simTip").textContent = s.tip;
    clearTimeout(noteTimer); noteTimer = setTimeout(touch, 900);
  }));
  document.querySelectorAll("[data-check]").forEach(cb => cb.addEventListener("change", () => { btsState().check[cb.dataset.check] = cb.checked; touch(); render(); }));
  if (view === "home") mountShelf();
}

/* Cartes en 3D : la carte se retourne sans recharger la vue */
function flipCard() {
  if (!C) return;
  C.flip = !C.flip; tone("flip");
  const r = document.querySelector(".card-runner");
  if (r) { r.classList.toggle("flipped", C.flip); const c3 = r.querySelector(".card3d"); if (c3) c3.classList.toggle("is-flipped", C.flip); } else render();
}

/* Inclinaison 3D au survol des tuiles */
(function () {
  if (RM) return;
  let cur = null;
  document.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    const d = e.target.closest ? e.target.closest(".divider, .fcard, .mode") : null;
    if (cur && cur !== d) { cur.style.removeProperty("--rx"); cur.style.removeProperty("--ry"); }
    cur = d; if (!d) return;
    const r = d.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    d.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg"); d.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
  }, { passive: true });
})();

/* Étagère de classeurs en 3D (Three.js) */
const SHELF = { ok: null };
function webglOK() { try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
function isDark() { const t = document.documentElement.getAttribute("data-theme"); if (t) return t === "dark"; try { return matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; } }
function shelfHint() { try { return matchMedia("(pointer: coarse)").matches ? "Glisse sur les classeurs, lâche pour ouvrir" : "Clique sur un classeur pour l'ouvrir"; } catch (e) { return "Clique sur un classeur pour l'ouvrir"; } }
function noiseFill(g, w, hh, a, n) { for (let k = 0; k < n; k++) { g.fillStyle = `rgba(${Math.random() < .5 ? "0,0,0" : "255,255,255"},${Math.random() * a})`; g.fillRect(Math.random() * w, Math.random() * hh, 1 + Math.random() * 2, 1 + Math.random() * 2); } }
function spineTexture(cat, dark) {
  const T = window.THREE, cv = document.createElement("canvas"); cv.width = 512; cv.height = 2048;
  const g = cv.getContext("2d"), hs = HUE[cat] || [214, 30], col = `hsl(${hs[0]}, ${Math.round(hs[1] * .78)}%, ${dark ? 44 : 38}%)`; g.scale(2, 2);
  g.fillStyle = col; g.fillRect(0, 0, 256, 1024);
  noiseFill(g, 256, 1024, .025, 2500);
  /* tranche arrondie : ombre sur les bords, reflet vers la gauche */
  const grad = g.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, "rgba(0,0,0,.38)"); grad.addColorStop(.08, "rgba(0,0,0,.05)"); grad.addColorStop(.18, "rgba(255,255,255,.12)"); grad.addColorStop(.3, "rgba(255,255,255,0)"); grad.addColorStop(.9, "rgba(0,0,0,.06)"); grad.addColorStop(1, "rgba(0,0,0,.4)");
  g.fillStyle = grad; g.fillRect(0, 0, 256, 1024);
  /* liserés haut et bas */
  g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(0, 0, 256, 8); g.fillRect(0, 1016, 256, 8);
  /* porte-étiquette en plastique */
  g.fillStyle = "#F5F7FA"; roundRect(g, 34, 68, 188, 156, 8); g.fill();
  g.fillStyle = "#18202B"; g.font = "600 84px 'Source Serif 4', Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(CAT[cat].code, 128, 148);
  
  /* titre vertical : gros caractères, sur deux lignes si besoin */
  {
    const name = CAT[cat].name, words = name.split(" "), LEN = 530, THICK = 196;
    const fontAt = f => `600 ${f}px 'Source Sans 3', 'Segoe UI', sans-serif`;
    let best = null;
    for (let f = 104; f >= 44 && !best; f -= 2) {
      g.font = fontAt(f);
      if (g.measureText(name).width <= LEN && f * 1.0 <= THICK) { best = { f, lines: [name] }; break; }
      if (words.length > 1 && f * 2.1 <= THICK) {
        let cut = 1, bestW = Infinity;
        for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(" "), b = words.slice(i).join(" "), w = Math.max(g.measureText(a).width, g.measureText(b).width); if (w < bestW) { bestW = w; cut = i; } }
        if (bestW <= LEN) best = { f, lines: [words.slice(0, cut).join(" "), words.slice(cut).join(" ")] };
      }
    }
    if (!best) best = { f: 44, lines: [name] };
    g.save(); g.translate(128, 540); g.rotate(-Math.PI / 2); g.textAlign = "center"; g.textBaseline = "middle"; g.font = fontAt(best.f);
    const lh = best.f * 1.02, y0 = -(best.lines.length - 1) * lh / 2;
    best.lines.forEach((t, i) => { g.fillStyle = "#ffffff"; g.fillText(t, 0, y0 + i * lh); });
    g.restore();
  }
  /* trou de préhension avec anneau métallique */
  g.beginPath(); g.arc(128, 905, 42, 0, Math.PI * 2); g.fillStyle = "#C3CBD6"; g.fill();
  g.beginPath(); g.arc(128, 905, 30, 0, Math.PI * 2); g.fillStyle = dark ? "#121821" : "#2B3546"; g.fill();
  /* progression */
  const ls = lessonStats(cat), pr = ls.n ? ls.r / ls.n : 0;
  g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(40, 972, 176, 12);
  if (pr > 0) { g.fillStyle = "#E0A84A"; g.fillRect(40, 972, Math.max(8, 176 * pr), 12); }
  const tex = new T.CanvasTexture(cv); tex.anisotropy = 16; if (T.sRGBEncoding) tex.encoding = T.sRGBEncoding; return { tex, col };
}
function pagesTexture(col) {
  const T = window.THREE, cv = document.createElement("canvas"); cv.width = 128; cv.height = 256; const g = cv.getContext("2d");
  g.fillStyle = col; g.fillRect(0, 0, 128, 256);
  g.fillStyle = "#F5F7FA"; g.fillRect(14, 12, 104, 232);
  for (let y = 14; y < 244; y += 3) { g.fillStyle = "rgba(89,101,122,.14)"; g.fillRect(14, y, 104, 1); }
  g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(14, 12, 104, 3);
  const t = new T.CanvasTexture(cv); if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; return t;
}
function woodTexture(base, w, hh, rings) {
  const T = window.THREE, cv = document.createElement("canvas"); cv.width = w; cv.height = hh; const g = cv.getContext("2d");
  g.fillStyle = base; g.fillRect(0, 0, w, hh);
  for (let k = 0; k < rings; k++) {
    const y0 = Math.random() * hh, amp = 2 + Math.random() * 6, f = .004 + Math.random() * .01, ph = Math.random() * 6;
    g.strokeStyle = `rgba(${Math.random() < .7 ? "70,40,15" : "255,230,190"},${.05 + Math.random() * .12})`; g.lineWidth = .6 + Math.random() * 1.6;
    g.beginPath(); for (let x = 0; x <= w; x += 8) { const y = y0 + Math.sin(x * f + ph) * amp + Math.sin(x * f * 3.1) * amp * .3; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }
  noiseFill(g, w, hh, .05, Math.round(w * hh / 60));
  const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 8; if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; return t;
}
function roundRect(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function initShelf() {
  const T = window.THREE;
  const r = new T.WebGLRenderer({ antialias: true, alpha: true }); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
  if (T.sRGBEncoding) r.outputEncoding = T.sRGBEncoding; if (T.ACESFilmicToneMapping) { r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.15; }
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1.6, 0.1, 100);
  scene.add(new T.HemisphereLight(0xffffff, 0x59657a, 0.45));
  scene.add(new T.AmbientLight(0xffffff, 0.18));
  const dl = new T.DirectionalLight(0xfff6ec, 1.3); dl.position.set(-3.5, 6.5, 6); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048); dl.shadow.radius = 5; dl.shadow.bias = -0.0006; Object.assign(dl.shadow.camera, { left: -6, right: 6, top: 5, bottom: -2, near: 1, far: 22 }); scene.add(dl);
  const dl2 = new T.DirectionalLight(0xffffff, 0.3); dl2.position.set(5, 2.5, 4); scene.add(dl2);
  const rim = new T.PointLight(0xffe9cf, 0.35, 12); rim.position.set(0, 4.2, 2.2); scene.add(rim);
  const group = new T.Group(); scene.add(group);
  const binders = [], n = CATS.length, width = n * 0.68;
  const Mat = T.MeshPhysicalMaterial || T.MeshStandardMaterial;
  CATS.forEach((c, i) => {
    const hgt = 2.35 + ((i * 37) % 5) * 0.08, depth = 1.9 + ((i * 53) % 3) * 0.05, geo = new T.BoxGeometry(0.6, hgt, depth);
    const side = new Mat({ color: 0xffffff, roughness: .5, metalness: 0, clearcoat: .25, clearcoatRoughness: .5 });
    const spine = new Mat({ roughness: .45, metalness: 0, clearcoat: .3, clearcoatRoughness: .45 });
    const top = new T.MeshStandardMaterial({ color: 0xffffff, roughness: .9 });
    const m = new T.Mesh(geo, [side, side, top, top, spine, side]);
    const x = (i - (n - 1) / 2) * 0.68;
    m.position.set(x, hgt / 2, -Math.abs(i - (n - 1) / 2) * 0.03 - (depth - 1.9) / 2); m.rotation.y = (i - (n - 1) / 2) * -0.012 + (((i * 29) % 7) - 3) * 0.006;
    m.userData = { cat: c.id, baseZ: m.position.z, out: 0, side, spine, top };
    m.castShadow = true; m.receiveShadow = true; group.add(m); binders.push(m);
  });
  /* meuble en bois : planche, montants, fond */
  const wood = woodTexture("#4a2c1a", 1024, 128, 90), woodSide = woodTexture("#3f2516", 512, 512, 140), woodBack = woodTexture("#33200f", 1024, 512, 220);
  wood.repeat.set(1, 1); woodSide.repeat.set(1, 1); woodBack.repeat.set(2, 1);
  const woodMat = new T.MeshStandardMaterial({ map: wood, roughness: .45, metalness: 0 });
  const plank = new T.Mesh(new T.BoxGeometry(width + 0.62, 0.2, 2.5), woodMat);
  plank.position.set(0, -0.1, -0.15); plank.receiveShadow = true; plank.castShadow = true; group.add(plank); SHELF.plank = plank;
  const lip = new T.Mesh(new T.BoxGeometry(width + 0.62, 0.06, 0.05), new T.MeshStandardMaterial({ color: 0x2a170b, roughness: .4 }));
  lip.position.set(0, -0.12, 1.11); group.add(lip);
  const sideMat = new T.MeshStandardMaterial({ map: woodSide, roughness: .5 });
  [-1, 1].forEach(sg => { const up = new T.Mesh(new T.BoxGeometry(0.16, 3.3, 2.5), sideMat); up.position.set(sg * (width / 2 + 0.23), 1.45, -0.15); up.castShadow = true; up.receiveShadow = true; group.add(up); });
  const back = new T.Mesh(new T.PlaneGeometry(width + 0.5, 3.2), new T.MeshStandardMaterial({ map: woodBack, roughness: .7 }));
  back.position.set(0, 1.45, -1.38); back.receiveShadow = true; group.add(back); SHELF.back = back; SHELF.sideMat = sideMat;
  const stand = new T.Mesh(new T.BoxGeometry(width + 0.62, 0.2, 2.5), woodMat); stand.position.set(0, 3.0, -0.15); group.add(stand);
  Object.assign(SHELF, { r, scene, cam, group, binders, ray: new T.Raycaster(), mouse: new T.Vector2(-9, -9), px: 0, py: 0, hover: null, t0: performance.now(), dark: null, running: false });
  const el = r.domElement; el.className = "shelf-canvas"; el.setAttribute("aria-hidden", "true");
  const aim = e => { const b = el.getBoundingClientRect(); SHELF.mouse.set((e.clientX - b.left) / b.width * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1); };
  const pickAt = e => { aim(e); SHELF.ray.setFromCamera(SHELF.mouse, SHELF.cam); const hit = SHELF.ray.intersectObjects(SHELF.binders)[0]; return hit ? hit.object : null; };
  /* Au doigt : le classeur sous le doigt s'allume ; on ouvre celui sur lequel on lâche */
  let touching = false, skipClick = 0;
  el.addEventListener("pointerdown", e => { if (e.pointerType === "touch") { touching = true; aim(e); SHELF.px = SHELF.mouse.x; SHELF.py = SHELF.mouse.y; } });
  el.addEventListener("pointermove", e => { aim(e); SHELF.px = SHELF.mouse.x; SHELF.py = SHELF.mouse.y; });
  el.addEventListener("pointerup", e => {
    if (e.pointerType !== "touch" || !touching) return; touching = false;
    const b = pickAt(e); skipClick = Date.now();
    if (b) { buzz && buzz(12); openMat(b.userData.cat, "lecons"); }
    else { SHELF.mouse.set(-9, -9); SHELF.px = 0; SHELF.py = 0; }
  });
  el.addEventListener("pointercancel", () => { touching = false; SHELF.mouse.set(-9, -9); SHELF.px = 0; SHELF.py = 0; });
  el.addEventListener("pointerleave", e => { if (e.pointerType === "touch" && touching) return; SHELF.mouse.set(-9, -9); SHELF.px = 0; SHELF.py = 0; });
  el.addEventListener("click", e => { if (Date.now() - skipClick < 700) return; const b = SHELF.hover || pickAt(e); if (b) openMat(b.userData.cat, "lecons"); });
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => paintShelf(true)); } catch (e) {}
}
function paintShelf(force) {
  const dark = isDark(); if (!force && SHELF.dark === dark && SHELF.painted === S.u) return;
  SHELF.dark = dark; SHELF.painted = S.u; const T = window.THREE;
  SHELF.binders.forEach(m => {
    const { tex, col } = spineTexture(m.userData.cat, dark); if (m.userData.spine.map) m.userData.spine.map.dispose(); m.userData.spine.map = tex; m.userData.spine.needsUpdate = true;
    const c = new T.Color(col); if (T.sRGBEncoding && c.convertSRGBToLinear) c.convertSRGBToLinear(); m.userData.side.color = c.multiplyScalar(dark ? .8 : 1);
    if (m.userData.top.map) m.userData.top.map.dispose(); m.userData.top.map = pagesTexture(col); m.userData.top.needsUpdate = true;
  });
  SHELF.plank.material.color = new T.Color(dark ? 0xcfc4bb : 0xffffff);
  if (SHELF.sideMat) SHELF.sideMat.color = new T.Color(dark ? 0xcfc4bb : 0xffffff);
  if (SHELF.back) SHELF.back.material.color = new T.Color(dark ? 0xb8aca2 : 0xffffff);
}
function sizeShelf() {
  const host = document.getElementById("shelf3d"); if (!host || !SHELF.r) return;
  const w = host.clientWidth || 600, hh = host.clientHeight || 300;
  SHELF.r.setSize(w, hh, false); SHELF.cam.aspect = w / hh;
  const vf = SHELF.cam.fov * Math.PI / 180, spanW = CATS.length * 0.68 + 0.95, spanH = 3.7;
  const dW = (spanW / 2) / Math.tan(vf / 2) / SHELF.cam.aspect, dH = (spanH / 2) / Math.tan(vf / 2);
  SHELF.dist = Math.max(dW, dH) * 1.04 + 0.95; SHELF.cam.updateProjectionMatrix();
}
function shelfFrame(now) {
  if (!SHELF.r || !SHELF.r.domElement.isConnected) { SHELF.running = false; return; }
  const sway = 0;
  const cam = SHELF.cam; cam.position.set(SHELF.px * .25, 1.75 + SHELF.py * .15, SHELF.dist); cam.lookAt(0, 1.45, 0);
  SHELF.ray.setFromCamera(SHELF.mouse, cam);
  const hit = SHELF.ray.intersectObjects(SHELF.binders)[0], hov = hit ? hit.object : null;
  if (hov !== SHELF.hover) { SHELF.hover = hov; SHELF.r.domElement.style.cursor = hov ? "pointer" : "default"; const lab = document.getElementById("shelfLabel"); if (lab) lab.textContent = hov ? `${CAT[hov.userData.cat].code} ${CAT[hov.userData.cat].name} : ${matchMedia("(pointer: coarse)").matches ? "lâche pour ouvrir" : "ouvrir"}` : shelfHint(); }
  SHELF.binders.forEach((m, i) => { const target = m === hov ? 0.55 : 0; m.userData.out += (target - m.userData.out) * (RM ? 1 : 0.2); m.position.z = m.userData.baseZ + m.userData.out; m.position.y = m.geometry.parameters.height / 2 + m.userData.out * 0.12; });
  SHELF.r.render(SHELF.scene, cam);
  requestAnimationFrame(shelfFrame);
}
function mountShelf() {
  const host = document.getElementById("shelf3d"); if (!host) return;
  if (SHELF.ok === null) SHELF.ok = !!window.THREE && webglOK();
  if (!SHELF.ok) { host.classList.add("no3d"); return; }
  try {
    if (!SHELF.r) initShelf();
    host.prepend(SHELF.r.domElement); sizeShelf(); paintShelf();
    if (!SHELF.fontsHooked && document.fonts && document.fonts.ready) { SHELF.fontsHooked = true; document.fonts.ready.then(() => paintShelf(true)); }
    if (!SHELF.ro && window.ResizeObserver) { SHELF.ro = new ResizeObserver(() => sizeShelf()); }
    if (SHELF.ro) { SHELF.ro.disconnect(); SHELF.ro.observe(host); }
    if (!SHELF.running) { SHELF.running = true; requestAnimationFrame(shelfFrame); }
  } catch (e) { SHELF.ok = false; host.classList.add("no3d"); }
}


/* ---------- Recherche globale : tout le contenu en un seul endroit ---------- */
const nrm = s => String(s || "").split("").map(c => (c.normalize("NFD")[0] || c).toLowerCase()[0] || c).join("");
const SVG2 = p => `<svg class="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I2 = {
  search: SVG2('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>'),
  close: SVG2('<path d="M6 6l12 12M18 6 6 18"/>'),
  enter: SVG2('<path d="M20 5v7a3 3 0 0 1-3 3H5"/><path d="m9 11-4 4 4 4"/>'),
};
const GS_TYPES = [["lesson", "Leçons"], ["fiche", "Fiches"], ["annale", "Annales"], ["ref", "Repères"], ["case", "Exercices guidés"], ["memo", "Mémo express"]];
const GS_W = { lesson: 4, fiche: 4, annale: 3, ref: 3, case: 2, memo: 1 };
const GS_SUGG = ["TVA", "amortissement", "CAF", "seuil de rentabilité", "rupture conventionnelle", "syllogisme", "SQL", "provision"];
let GSI = null, GS = { open: false, q: "", cat: "", act: 0, hits: [] }, gsTimer = null;
function gsIndex() {
  if (GSI) return GSI;
  GSI = [];
  const add = (type, cat, title, text, go, extra) => GSI.push(Object.assign({ type, cat, title, text, go, nt: nrm(title), nx: nrm(text) }, extra || {}));
  coursIndex().forEach(x => { if (x.k) add("lesson", CMETA(x.cid).cat, x.title, x.text, { cid: x.cid, k: x.k }, { where: CMETA(x.cid).short }); });
  CHAP.forEach(c => add("fiche", c.cat, c.title, c.idee + " " + (c.points || []).join(" ") + " " + JSON.stringify(c.sections || []).replace(/"[a-z]+":|[{}\[\]"]/g, " ").replace(/\s+/g, " "), { ch: c.id }, { lead: c.idee }));
  REFS.forEach(r => add("ref", r[1], r[0], (r[3] || "") + " " + r[4], { ch: r[2], cat: r[1] }, { lead: r[4] }));
  GCASES.forEach(k => add("case", k.cat, k.title, k.enonce + " " + (k.question || ""), { id: k.id }));
  ANNEX.forEach(x => add("annale", annCat(x), x.t, `${x.a.ep} ${EPREUVE_INFO[x.a.ep].name} ${x.a.year} ${x.a.place} ${x.a.cas} annale ${x.w.join(" ")} ${x.tags.map(t => NOTIONS[t][0]).join(" ")}`, { id: x.id }, { where: `${x.a.ep} ${x.a.year} : ${x.a.cas}`, lead: x.w.join(" ; ") }));
  FS.forEach(x => { if (!x.ch) add("memo", x.c, x.f, x.b + " " + (x.m || ""), { cat: x.c }, { lead: x.b }); });
  return GSI;
}
function gsTerms(q) { return nrm(q).split(/[\s,;:'’()«»"?!.]+/).filter(t => t.length > 1 || /\d/.test(t)); }
function gsSearch(q, cat) {
  const terms = gsTerms(q); if (!terms.length) return [];
  const out = [];
  for (const e of gsIndex()) {
    if (cat && e.cat !== cat) continue;
    let sc = 0, ok = true;
    for (const t of terms) {
      const inT = e.nt.includes(t), inX = inT || e.nx.includes(t);
      if (!inX) { ok = false; break; }
      sc += inT ? 10 : 2;
      if (inT && (e.nt.startsWith(t) || e.nt.includes(" " + t))) sc += 3;
    }
    if (!ok) continue;
    const full = nrm(q).trim(); if (full.length > 3 && (e.nt + " " + e.nx).includes(full)) sc += 6;
    out.push({ e, sc: sc + GS_W[e.type] });
  }
  return out.sort((a, b) => b.sc - a.sc).slice(0, 60).map(x => { x.e._sc = x.sc; return x.e; });
}
function gsMark(txt, terms) {
  const n = nrm(txt), marks = [];
  terms.forEach(t => { let p = n.indexOf(t); while (p >= 0 && marks.length < 40) { marks.push([p, p + t.length]); p = n.indexOf(t, p + t.length); } });
  marks.sort((a, b) => a[0] - b[0]);
  let out = "", last = 0;
  marks.forEach(([a, b]) => { if (a < last) return; out += h(txt.slice(last, a)) + "<mark>" + h(txt.slice(a, b)) + "</mark>"; last = b; });
  return out + h(txt.slice(last));
}
function gsSnip(e, terms) {
  if (e.lead && e.type !== "fiche") return gsMark(e.lead.length > 220 ? e.lead.slice(0, 217) + "…" : e.lead, terms);
  const t = e.text, p = terms.map(x => e.nx.indexOf(x)).filter(x => x >= 0).sort((a, b) => a - b)[0];
  if (p == null) return gsMark(t.slice(0, 170) + (t.length > 170 ? "…" : ""), terms);
  const from = Math.max(0, p - 60);
  let s = t.slice(from, p + 130); s = (from ? "…" : "") + s.replace(/^\S*\s/, from ? "" : "$&") + (p + 130 < t.length ? "…" : "");
  return gsMark(s, terms);
}
function gsOpen(q) {
  GS.open = true; GS.act = -1; GS.q = typeof q === "string" ? q : ""; GS.cat = "";
  let el = document.getElementById("gs");
  if (!el) {
    el = document.createElement("div"); el.id = "gs"; el.className = "gs"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Rechercher dans le Grand Livre");
    el.innerHTML = `<div class="gs-backdrop" data-act="gsClose"></div>
      <div class="gs-panel">
        <div class="gs-bar">${I2.search}<input id="gsInput" type="search" autocomplete="off" spellcheck="false" placeholder="Un mot, une notion, un compte : TVA, CAF, licenciement…" aria-label="Rechercher" aria-controls="gsList"><button class="gs-x" data-act="gsClose" aria-label="Fermer">${I2.close}</button></div>
        <div class="gs-cats" id="gsCats"></div>
        <div class="gs-list" id="gsList" role="listbox"></div>
        <div class="gs-foot"><span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>Entrée</kbd> ouvrir</span><span><kbd>Échap</kbd> fermer</span></div>
      </div>`;
    document.body.appendChild(el);
    const inp = el.querySelector("#gsInput");
    inp.addEventListener("input", () => { GS.q = inp.value; GS.act = -1; clearTimeout(gsTimer); gsTimer = setTimeout(gsRender, 90); });
    inp.addEventListener("keydown", gsKey);
  }
  el.hidden = false; document.documentElement.classList.add("gs-on");
  const inp = el.querySelector("#gsInput"); inp.value = GS.q; gsRender();
  requestAnimationFrame(() => { inp.focus(); inp.select(); });
}
function gsClose() { const el = document.getElementById("gs"); if (el) el.hidden = true; GS.open = false; document.documentElement.classList.remove("gs-on"); }
function gsRecent() { try { return JSON.parse(localStorage.getItem("gl-recent") || "[]"); } catch (e) { return []; } }
function gsRemember(q) { q = q.trim(); if (q.length < 2) return; try { const r = gsRecent().filter(x => nrm(x) !== nrm(q)); r.unshift(q); localStorage.setItem("gl-recent", JSON.stringify(r.slice(0, 6))); } catch (e) {} }
function gsRender() {
  const list = document.getElementById("gsList"), cats = document.getElementById("gsCats"); if (!list) return;
  const q = GS.q.trim(), terms = gsTerms(q);
  GS.hits = q ? gsSearch(q, GS.cat) : [];
  const counts = {}; if (q) gsSearch(q, "").forEach(e => counts[e.cat] = (counts[e.cat] || 0) + 1);
  cats.innerHTML = q ? `<button class="chip" data-act="gsCat" data-cat="" aria-pressed="${!GS.cat}">Tout</button>` + CATS.filter(c => counts[c.id]).map(c => `<button class="chip" style="${hueStyle(c.id)}" data-act="gsCat" data-cat="${c.id}" aria-pressed="${GS.cat === c.id}">${h(c.code)} <span class="muted">${counts[c.id]}</span></button>`).join("") : "";
  if (!q) {
    const rec = gsRecent();
    list.innerHTML = `<div class="gs-empty">
      ${rec.length ? `<p class="eyebrow">Tes dernières recherches</p><div class="gs-sugg">${rec.map(r => `<button class="chip" data-act="gsSugg" data-q="${h(r)}">${h(r)}</button>`).join("")}</div>` : ""}
      <p class="eyebrow">Essaie par exemple</p><div class="gs-sugg">${GS_SUGG.map(r => `<button class="chip" data-act="gsSugg" data-q="${h(r)}">${h(r)}</button>`).join("")}</div>
      <p class="muted">La recherche fouille les ${totalLessons().n} leçons, les ${CHAP.length} fiches, les repères, les exercices guidés et le mémo express. Plusieurs mots : seuls les résultats qui les contiennent tous s'affichent.</p></div>`;
    return;
  }
  if (!GS.hits.length) { list.innerHTML = `<div class="gs-empty"><p><b>Rien pour « ${h(q)} »${GS.cat ? " dans " + h(CAT[GS.cat].name) : ""}.</b></p><p class="muted">Vérifie l'orthographe, enlève un mot ou essaie un synonyme (par exemple « amortissement » plutôt que « amortir »).</p></div>`; return; }
  let i = 0;
  const best = t => Math.max(0, ...GS.hits.filter(e => e.type === t).map(e => e._sc || 0));
  list.innerHTML = GS_TYPES.slice().sort((x, y) => best(y[0]) - best(x[0])).map(([t, lab]) => {
    const hs = GS.hits.filter(e => e.type === t); if (!hs.length) return "";
    return `<div class="gs-group"><p class="gs-gh">${lab} <span>${hs.length}</span></p>${hs.slice(0, t === "memo" ? 8 : 12).map(e => {
      const k = GS.hits.indexOf(e); i++;
      const where = e.where ? e.where : (e.type === "case" || e.type === "ref") && e.go.ch && CHID[e.go.ch] ? CHID[e.go.ch].title : CAT[e.cat].name;
      return `<button class="gs-hit${k === GS.act ? " is-act" : ""}" role="option" aria-selected="${k === GS.act}" id="gsh${k}" style="${hueStyle(e.cat)}" data-act="gsGo" data-i="${k}">
        <span class="gs-code">${h(CAT[e.cat].code)}</span>
        <span class="gs-main"><b>${gsMark(e.title, terms)}</b><small>${h(where || "")}</small><span class="gs-snip">${gsSnip(e, terms)}</span></span>
        <span class="gs-go">${I2.enter}</span></button>`;
    }).join("")}</div>`;
  }).join("");
  const vis = [...list.querySelectorAll(".gs-hit")].map(x => +x.dataset.i);
  if (!vis.includes(GS.act)) GS.act = vis[0];
  list.querySelectorAll(".gs-hit").forEach(x => { const on = +x.dataset.i === GS.act; x.classList.toggle("is-act", on); x.setAttribute("aria-selected", on); });
}
function gsKey(ev) {
  if (ev.key === "Escape") { ev.preventDefault(); gsClose(); return; }
  if (!GS.hits.length) return;
  const vis = [...document.querySelectorAll("#gsList .gs-hit")].map(b => +b.dataset.i), pos = Math.max(0, vis.indexOf(GS.act));
  if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
    ev.preventDefault(); GS.act = vis[(pos + (ev.key === "ArrowDown" ? 1 : vis.length - 1)) % vis.length];
    document.querySelectorAll("#gsList .gs-hit").forEach(b => { const on = +b.dataset.i === GS.act; b.classList.toggle("is-act", on); b.setAttribute("aria-selected", on); });
    const a = document.getElementById("gsh" + GS.act); if (a) a.scrollIntoView({ block: "nearest" });
  } else if (ev.key === "Enter") { ev.preventDefault(); gsGo(GS.act); }
}
function gsGo(i) {
  const e = GS.hits[i]; if (!e) return;
  const q = GS.q.trim(), terms = gsTerms(q); gsRemember(q); gsClose();
  if (e.type === "lesson") { openLesson(e.go.cid, e.go.k); gsFlash(terms); }
  else if (e.type === "fiche") { openFiche(e.go.ch); gsFlash(terms); }
  else if (e.type === "case") openCase(e.go.id);
  else if (e.type === "annale") openAnn(e.go.id);
  else if (e.type === "ref") { if (e.go.ch && CHID[e.go.ch]) { openFiche(e.go.ch); gsFlash(terms); } else { openMat(e.go.cat, "fiche"); matSub = "refs"; render(); } }
  else { openMat(e.go.cat, "fiche"); matSub = "memo"; matFicheQuery = e.title; render(); const s = document.getElementById("matFicheSearch"); if (s) s.value = e.title; }
}
/* Après ouverture : on amène l'œil sur le premier passage qui contient le mot cherché */
function gsFlash(terms) {
  if (!terms.length) return;
  requestAnimationFrame(() => {
    const els = [...document.querySelectorAll(".lesson .md p, .lesson .md li, .lesson .md td, .lesson .md dd, .lesson .md dt, .lesson .md h3, .lesson .md h4, .lesson .md blockquote")];
    const t = els.find(el => terms.every(x => nrm(el.textContent).includes(x))) || els.find(el => nrm(el.textContent).includes(terms[0]));
    if (!t) return;
    t.classList.add("gs-flash"); t.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" });
    setTimeout(() => t.classList.remove("gs-flash"), 2600);
  });
}

/* ---------- 3D minimaliste : transitions en profondeur, classeur, compte à rebours à volets ---------- */
let FX_KEY = "";
function fxKey() {
  switch (view) {
    case "lesson": return "lesson:" + (LS ? LS.cid + "-" + LS.k : "");
    case "fiche": return "fiche:" + (FC ? FC.id : "");
    case "run": return "run:" + (R ? R.i + "/" + R.list.length + R.mode : "");
    case "card": return "card:" + (C ? C.i : "");
    case "mat": return "mat:" + matCat + "-" + matSeg;
    case "defi": return "defi:" + (DF && DF.done ? "fin" : "jeu");
    case "gcase": return "gcase:" + (GC ? GC.id : "");
    case "annex": return "annex:" + (AX ? AX.id : "");
    default: return view;
  }
}
function fx3d() {
  const k = fxKey(); if (k === FX_KEY) return;
  const prev = FX_KEY; FX_KEY = k;
  const v = document.getElementById("view"); if (!v || RM) return;
  const same = prev && prev.split(":")[0] === k.split(":")[0];
  const kind = same && /^(lesson|fiche|annex)/.test(k) ? "fx-page" : same && /^(run|card)/.test(k) ? "fx-card" : "fx-rise";
  v.classList.remove("fx-page", "fx-card", "fx-rise"); void v.offsetWidth; v.classList.add(kind);
  clearTimeout(fx3d.t); fx3d.t = setTimeout(() => v.classList.remove(kind), 900);
}
/* Chiffres sur volets (J-216) */
function flap(n) {
  if (n == null) return `<em class="flap"><i>?</i></em>`;
  const s = "J-" + n;
  return `<em class="flap" role="text" aria-label="${s}">${s.split("").map((ch, i) => `<i class="${ch === "-" ? "sep" : ""}" style="--d:${i * 70}ms" aria-hidden="true">${ch}</i>`).join("")}</em>`;
}
/* Classeur en 3D pour l'en-tête d'une matière */
function binder3d(c) {
  const ls = lessonStats(c.id), p = ls.n ? Math.round(ls.r / ls.n * 100) : 0;
  return `<div class="b3" aria-hidden="true"><div class="b3-box">
    <i class="b3-face b3-front"><span class="b3-label"><b>${h(c.code)}</b><small>${h(c.name)}</small><em><u style="width:${p}%"></u></em></span><span class="b3-ring"></span></i>
    <i class="b3-face b3-back"></i>
    <i class="b3-face b3-spine"><b>${h(c.code)}</b><span class="b3-hole"></span></i>
    <i class="b3-face b3-pages"></i>
    <i class="b3-face b3-top"></i>
    <i class="b3-face b3-bottom"></i>
  </div><span class="b3-shadow"></span></div>`;
}
ANN.forEach(a => a.ex.forEach((x, i) => { x.id = a.id + "-" + (i + 1); x.n = i + 1; x.a = a; }));
const ANNEX = ANN.flatMap(a => a.ex), ANNEXID = Object.fromEntries(ANNEX.map(x => [x.id, x]));

/* ---------- S'entraîner sur les annales, correction de copie par Claude ---------- */
let ANF = { ep: "", tag: "" }, AX = null, ANP = { id: null, copy: [], ref: [] }, annCtl = null, annBusy = false, annErr = "", annTimerT = null, annSaveT = null;
let SAMPLE = null, SAMPLE_IMG = null, SAMPLE_STATE = "wait";
(async function () {
  try {
    if (!window.claude || typeof window.claude.use !== "function") { SAMPLE_STATE = "off"; return; }
    SAMPLE = await window.claude.use("sample");
    if (!SAMPLE) { SAMPLE_STATE = "off"; } else {
      SAMPLE_STATE = "ok";
      try { const l = await SAMPLE.limits(); SAMPLE_IMG = l && l.images ? l.images : null; } catch (e) { SAMPLE_IMG = null; }
    }
  } catch (e) { SAMPLE_STATE = "off"; }
  if (view === "annex" || view === "ex") render();
})();
const annState = id => { S.an = S.an || {}; return S.an[id] || (S.an[id] = {}); };
const annDone = id => !!(S.an && S.an[id] && S.an[id].d);
const epLabel = ep => `${ep} ${EPREUVE_INFO[ep].name}`;
const annCat = x => { const c = x.tags.map(t => NOTIONS[t] && NOTIONS[t][1]).find(Boolean); return c || EPREUVE_INFO[x.a.ep].cat; };
function annMinutes(x) {
  const I = EPREUVE_INFO[x.a.ep], tot = x.a.ex.reduce((s, e) => s + (e.pts || 0), 0);
  if (I.dur && x.pts && tot) return Math.round(I.dur * x.pts / tot / 5) * 5;
  if (I.dur) return Math.round(I.dur / x.a.ex.length / 5) * 5;
  if (x.a.ep === "E1") return x.a.year >= 2025 ? 90 : x.n === 1 ? 150 : 90;
  return 60;
}
const fmtMin = m => m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + String(m % 60).padStart(2, "0") : ""}` : `${m} min`;
function annScore(id) { const r = (S.an || {})[id]; return r && r.r && r.r.note != null ? r.r : null; }
function annRow(x, withAnn) {
  const sc = annScore(x.id), d = annDone(x.id), c = annCat(x);
  return `<button class="ann-row${d ? " is-done" : ""}" style="${hueStyle(c)}" data-act="annOpen" data-id="${x.id}">
    <span class="ann-n">${x.a.ep === "E5" ? "M" : x.a.ep === "E1" ? "P" : x.a.ep === "E3" ? "Ex" : "M"}${x.n}</span>
    <span class="ann-main"><b>${h(x.t)}</b>${withAnn ? `<small>${h(epLabel(x.a.ep))}, ${x.a.year}${x.a.place !== "Métropole" ? " " + h(x.a.place) : ""} : ${h(x.a.cas)}</small>` : ""}<span class="ann-tags">${x.tags.slice(0, 4).map(t => `<i>${h(NOTIONS[t][0].split(/[:,(]/)[0].trim())}</i>`).join("")}</span></span>
    <span class="ann-side">${x.pts ? `<b>${x.pts} pts</b>` : ""}<small>${sc ? `${fmtNote(sc.note)} / ${sc.sur || x.pts || 20}` : d ? "Fait" : fmtMin(annMinutes(x))}</small></span>
  </button>`;
}
const fmtNote = n => (Math.round(n * 2) / 2).toLocaleString("fr-FR");
const ANN_OPEN = new Set();
document.addEventListener("toggle", e => { const d = e.target; if (d.classList && d.classList.contains("ann-more")) d.open ? ANN_OPEN.add(d.dataset.ann) : ANN_OPEN.delete(d.dataset.ann); }, true);
function annCard(a) {
  const nd = a.ex.filter(x => annDone(x.id)).length;
  return `<article class="ann-card" style="${hueStyle(EPREUVE_INFO[a.ep].cat)}">
    <header class="ann-head">
      <div class="ann-id"><span class="tabcode">${a.ep}</span><span class="ann-year">${a.year}</span>${a.place !== "Métropole" ? `<span class="pill">${h(a.place)}</span>` : ""}</div>
      <h3>${h(a.cas)}</h3><p class="muted">${h(a.desc)}</p>
      <div class="ann-links">${a.links.map(([l, u]) => `<a class="btn small" href="${h(u)}" target="_blank" rel="noopener noreferrer">${h(l)}${ICON_EXT}</a>`).join("")}<span class="muted small">${nd ? `${nd} sur ${a.ex.length} fait${nd > 1 ? "s" : ""}` : ""}</span></div>
    </header>
    <details class="ann-more" data-ann="${h(a.ep + a.year + a.place)}"${ANN_OPEN.has(a.ep + a.year + a.place) ? " open" : ""}><summary>Voir les ${a.ex.length} exercice${a.ex.length > 1 ? "s" : ""}</summary><div class="ann-list">${a.ex.map(x => annRow(x)).join("")}</div></details>
  </article>`;
}
const ICON_EXT = `<svg class="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`;
let EXT = (() => { try { const t = localStorage.getItem("gl-extab") || "quiz"; return t === "duel" ? "quiz" : t; } catch (e) { return "quiz"; } })();
function setExTab(t) { EXT = t; try { localStorage.setItem("gl-extab", t); } catch (e) {} }
function exTabs() {
  const T = [["ctl", ICON.target, "Préparer un contrôle", `${(S.packs || []).length ? (S.packs || []).length + " contrôle" + ((S.packs || []).length > 1 ? "s" : "") + " préparé" + ((S.packs || []).length > 1 ? "s" : "") : "Matière, chapitre, thème"}`], ["quiz", ICON.cards, "Quiz et cartes", `${QS.length} questions · ${FS.length} cartes`], ["justif", ICON.list, "Décider et justifier", `${Object.keys(DWFX).filter(k => CTLX[k] && !lockedCat(CHID[k] && CHID[k].cat)).length} entraînements · décision puis pourquoi`], ["chiffres", ICON.calc, "Exercices chiffrés", `${CXG.length} calculs express · ${GENS.length} exercices`], ["guides", ICON.steps, "Exercices guidés", `${GCASES.length} cas en étapes`], ["schemas", ICON.schema, "Schémas", `${SCH.length} processus à reconstituer`], ["annales", ICON.archive, "Annales", `${ANNEX.length} exercices officiels`], ["redac", ICON.pen, "Rédactions", `${REDAC.length} sujets`], ["oraux", ICON.talk, "Oraux E6 et E7", `${ORAL.length} questions du jury`]];
  return `<nav class="ex-tabs" aria-label="Types d'entraînement">${T.map(([k, ic, t, sub]) => `<button class="ex-tab" data-act="exTab" data-t="${k}" aria-current="${EXT === k ? "page" : "false"}"><span class="ex-tab-ic" aria-hidden="true">${ic}</span><b>${t}</b><small>${sub}</small></button>`).join("")}</nav>`;
}
/* ---------- Duels : deux élèves, les mêmes questions, le plus juste et le plus rapide gagne ---------- */
const DUEL_NET = () => (typeof window.GL_DUEL === "object" && window.GL_DUEL) || null;
const DUEL_T = 20;
let DU = null, duTick = null, duPoll = null;
let DH = { list: null, mates: [], at: 0, busy: false, err: "", inv: 0 };
const duelCfg = () => { S.duf = S.duf || { cats: ["p1", "p2", "p3"], n: 10 }; return S.duf; };
const duScore = (ans, t) => ans.reduce((s, ok, i) => s + (ok ? 100 + Math.max(0, 50 - Math.floor((t[i] || 0) / 1000) * 3) : 0), 0);
const duHue = s => { let x = 0; s = String(s || ""); for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) % 360; return x; };
const duIni = n => String(n || "?").trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
const duAv = (n, cls) => { const a = typeof avOf === "function" ? avOf(n) : ""; return a ? `<span class="du-av has-av${cls ? " " + cls : ""}" aria-hidden="true">${avSvg(a)}</span>` : `<span class="du-av${cls ? " " + cls : ""}" style="--ah:${duHue(n)}" aria-hidden="true">${h(duIni(n))}</span>`; };
function duelStop() { clearInterval(duTick); duTick = null; clearInterval(duPoll); duPoll = null; }
function duelPool(cats) { return QS.filter(x => cats.includes(x.c) && !lockedCat(x.c) && x.o && x.o.length === 4 && !qCalc(x)); }
function duelPick(cats, n) { const p = shuffle(duelPool(cats)); return p.slice(0, n).map(x => x.id); }
function duelItems(ids, seed) {
  const by = {}; QS.forEach(x => { by[x.id] = x; });
  return ids.map((id, i) => { const it = by[id]; if (!it) return null; const r = rng((seed >>> 0) + i * 7919), o = [0, 1, 2, 3];
    for (let k = 3; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; } return { it, order: o }; });
}
async function loadDuels(force) {
  const N = DUEL_NET(); if (!N || DH.busy) return;
  if (!force && DH.list && Date.now() - DH.at < 30000) return;
  DH.busy = true;
  try { const j = await N.list(); DH.list = j.duels || []; DH.mates = j.mates || []; DH.at = Date.now(); DH.err = ""; }
  catch (e) { DH.err = (e && e.message) || "Duels indisponibles pour l'instant."; if (!DH.list) DH.list = []; DH.at = Date.now(); }
  DH.busy = false;
  const inv = duelInvites().length, chg = inv !== DH.inv; DH.inv = inv;
  amisBadge();
  if ((view === "amis" && AMT === "duels") || (view === "home" && chg)) render();
}
const duelInvites = () => (DH.list || []).filter(d => d.me === "b" && d.you && !d.you.started && !d.you.ans.length && d.status !== "done" && d.status !== "declined");
function duelHomeCard() {
  if (!DUEL_NET()) return "";
  loadDuels();
  const inv = duelInvites(); if (!inv.length) return "";
  const d = inv[0];
  return `<button class="wk-cta du-inv" data-act="duOpen" data-id="${h(d.id)}"><span class="wk-ic">${ICON.duel}</span><span><b>${h(d.opp ? d.opp.name : "Un camarade")} te défie en duel !</b><small>${d.n} questions${d.opp && d.opp.done ? ` · score à battre : ${d.opp.score}` : ""}${inv.length > 1 ? ` · et ${inv.length - 1} autre${inv.length > 2 ? "s" : ""} défi${inv.length > 2 ? "s" : ""}` : ""}</small></span><span class="wk-go">Relever ›</span></button>`;
}
function duelHome() {
  const N = DUEL_NET(), cfg = duelCfg(), cats = CATS.filter(c => (QBY[c.id] || []).length && !lockedCat(c.id));
  if (N) loadDuels();
  const inv = N ? duelInvites() : [], hist = N ? (DH.list || []).filter(d => !inv.includes(d)).slice(0, 10) : [];
  const st = S.dus || { w: 0, l: 0, d: 0 }, pool = duelPool(cfg.cats).length;
  const res = d => { if (d.status === "declined") return ["Refusé", ""]; if (d.status !== "done") return [d.you && d.you.done ? "En attente" : "À jouer", "p"]; const a = d.you.score, b = d.opp ? d.opp.score : 0; return a > b ? ["Victoire", "w"] : a < b ? ["Défaite", "l"] : ["Égalité", ""]; };
  return `<section class="stack">
    <div class="sec-head"><h2>Duels</h2><p>Les mêmes questions pour toi et ton adversaire, ${DUEL_T} secondes par question. Une bonne réponse rapporte 100 points, plus un bonus de vitesse.</p></div>
    <div class="du-hero"><div class="du-vs"><div class="du-p">${duAv(P().name || window.GL_NAME || "Moi")}<b>Toi</b></div><span class="du-x">VS</span><div class="du-p"><span class="du-av" style="--ah:45" aria-hidden="true">?</span><b>Ton adversaire</b></div></div>
      <p class="muted" style="text-align:center;position:relative;z-index:1">${st.w + st.l + st.d ? `Ton bilan : <b>${st.w}</b> victoire${st.w > 1 ? "s" : ""}, <b>${st.l}</b> défaite${st.l > 1 ? "s" : ""}, <b>${st.d}</b> égalité${st.d > 1 ? "s" : ""}.` : "Ton premier duel t'attend."}</p></div>
    ${inv.length ? `<div class="stack" style="gap:8px"><h3>Défis reçus</h3>${inv.map(d => `<div class="du-card du-inv" style="cursor:default">${duAv(d.opp ? d.opp.name : "?")}<span><b>${h(d.opp ? d.opp.name : "Un camarade")}</b><br><small class="muted">${d.n} questions · ${d.cats.map(c => CAT[c] ? CAT[c].code : c).join(", ")}${d.opp && d.opp.done ? ` · ${d.opp.score} points à battre` : ""}</small></span><span class="row" style="gap:6px"><button class="btn small" data-act="duDecline" data-id="${h(d.id)}">Refuser</button><button class="btn small primary" data-act="duOpen" data-id="${h(d.id)}">Jouer</button></span></div>`).join("")}</div>` : ""}
    <div class="pf-set" style="padding:16px;display:grid;gap:12px">
      <h3>Nouveau duel</h3>
      <div><div class="label">Matières</div><div class="picker">${cats.map(c => `<button class="chip" data-act="duCat" data-c="${c.id}" aria-pressed="${cfg.cats.includes(c.id)}"><span class="mono">${h(c.code)}</span>${h(c.name)}</button>`).join("")}</div></div>
      <div class="row"><span class="label" style="margin:0">Questions</span><div class="pf-seg" role="group">${[5, 10, 15].map(n => `<button type="button" data-act="duN" data-n="${n}" aria-pressed="${cfg.n === n}">${n}</button>`).join("")}</div><span class="muted small">${pool} questions disponibles</span></div>
      ${N ? `<div class="row"><button class="btn primary" data-act="duNew" ${pool < cfg.n ? "disabled" : ""}>${ICON.duel}Créer un duel avec un code</button><button class="btn" data-act="duBot" ${pool < cfg.n ? "disabled" : ""}>Contre le Grand Livre</button></div>
        ${DH.mates.length ? `<div><div class="label">Ou défie directement un camarade du classement</div><div class="du-mates">${DH.mates.map(m => `<button class="chip" data-act="duMate" data-k="${h(m.k)}" ${pool < cfg.n ? "disabled" : ""}>${duAv(m.p, "xs")}${h(m.p)}</button>`).join("")}</div></div>` : `<p class="muted small" style="margin:0">Les camarades qui ont rejoint le classement de la classe apparaîtront ici pour être défiés directement.</p>`}`
        : `<div class="row"><button class="btn primary" data-act="duBot" ${pool < cfg.n ? "disabled" : ""}>${ICON.duel}Duel contre le Grand Livre</button></div><p class="muted small" style="margin:0">${isGuest() ? "Crée ton compte pour défier tes camarades." : "Les duels entre camarades se jouent sur le site partagé du Grand Livre. Ici, affronte un adversaire virtuel."}</p>`}
    </div>
    ${N ? `<div class="pf-set" style="padding:16px;display:grid;gap:10px"><h3>Rejoindre un duel</h3><p class="muted small" style="margin:0">Ton camarade t'a donné un code de 5 caractères.</p>
      <div class="row"><input id="duCode" class="pf-in du-code-in" maxlength="5" autocomplete="off" autocapitalize="characters" placeholder="CODE" aria-label="Code du duel"><button class="btn primary" data-act="duJoin">Rejoindre</button></div>
      ${DH.err ? `<p class="muted small" style="margin:0">${h(DH.err)}</p>` : ""}</div>` : ""}
    ${hist.length ? `<div class="stack" style="gap:8px"><h3>Mes duels</h3>${hist.map(d => { const [t, c] = res(d); return `<button class="du-card" data-act="duOpen" data-id="${h(d.id)}">${duAv(d.opp ? d.opp.name : "?")}<span><b>${h(d.opp ? d.opp.name : "En attente d'un adversaire")}</b><br><small class="muted">${d.n} questions · ${d.you ? d.you.score : 0}${d.opp && (d.status === "done") ? " – " + d.opp.score : ""} points · code ${h(d.id)}</small></span><span class="du-tag ${c}">${t}</span></button>`; }).join("")}</div>` : ""}
  </section>`;
}
function duelBegin(o) {
  duelStop();
  const items = duelItems(o.ids, o.seed).filter(Boolean);
  if (!items.length) { toast("Ces questions ne sont pas disponibles dans ta version. Recharge la page."); return; }
  DU = Object.assign({ items, i: 0, picks: [], times: [], stage: "lobby", qT0: 0 }, o);
  if (DU.bot) {
    const acc = .55 + Math.random() * .25; DU.botAns = items.map(() => Math.random() < acc); DU.botT = items.map(() => 3500 + Math.random() * 11000);
    DU.oppName = "Le Grand Livre"; DU.stage = "count"; DU.startAt = Date.now() + 3200;
  }
  duelLoop(); go("duel");
}
function duelFromSrv(d) {
  if (!d) return;
  if (DU && DU.id === d.id) { duelSync(d); return; }
  const mine = d.you || { ans: [], t: [] };
  duelBegin({ id: d.id, ids: d.ids, seed: d.seed, srv: d, oppName: d.opp ? d.opp.name : "", stage0: true });
  DU.picks = mine.ans.map(ok => ok ? 1 : 0); DU.times = mine.t.slice(); DU.i = mine.ans.length;
  duelSync(d, true);
}
function duelSync(d, first) {
  if (!DU || DU.bot) return;
  const rr = () => { if (view === "duel") render(); };
  DU.srv = d; if (d.opp) DU.oppName = d.opp.name;
  if (d.status === "done") { if (DU.stage !== "end") duelEnd(); return; }
  if (DU.i >= DU.items.length) { if (DU.stage !== "wait") { DU.stage = "wait"; rr(); } else duelBoard(); return; }
  if (d.status === "wait" && !(d.you && d.you.started)) { if (DU.stage !== "lobby") { DU.stage = "lobby"; rr(); } return; }
  if (DU.stage === "lobby") {
    const wait = d.mode === "live" && d.startAt > d.now ? d.startAt - d.now : 3000;
    DU.stage = "count"; DU.startAt = Date.now() + wait; rr(); return;
  }
  if (DU.stage === "play" || DU.stage === "wait") duelBoard();
}
function duelLoop() {
  duelStop();
  duTick = setInterval(() => {
    if (!DU || view !== "duel") return;
    if (DU.stage === "count") { const left = Math.ceil((DU.startAt - Date.now()) / 1000); const el = document.getElementById("duCount");
      if (left <= 0) { DU.stage = "play"; DU.qT0 = Date.now(); if (DU.bot && !DU.botStart) DU.botStart = DU.qT0; render(); tone("go"); return; }
      if (el && el.dataset.n !== String(left)) { el.dataset.n = String(left); el.textContent = left; el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; tone("xp"); buzz(10); } return; }
    if (DU.stage === "play") {
      const el = document.getElementById("duBar"), tt = document.getElementById("duSec"), left = Math.max(0, DUEL_T * 1000 - (Date.now() - DU.qT0));
      if (el) el.style.width = (left / (DUEL_T * 10)) + "%";
      if (tt) { const s = Math.ceil(left / 1000); tt.textContent = s + " s"; tt.classList.toggle("low", s <= 5); } if (!DU.lock) secTick(left, "du" + DU.i);
      if (DU.bot) duelBoard();
      if (left <= 0 && !DU.lock) duelAnswer(-1);
    }
    if (DU.stage === "wait" && DU.bot) { if (duBotN() >= DU.items.length) duelEnd(); else duelBoard(); }
  }, 100);
  if (!DU.bot) duPoll = setInterval(async () => {
    const N = DUEL_NET(); if (!DU || !N || view !== "duel" || DU.stage === "end" || document.hidden) return;
    try { const j = await N.get(DU.id); duelSync(j.duel); } catch (e) {}
  }, 1500);
}
function duBotN() { if (!DU || !DU.bot || !DU.botStart) return 0; let t = DU.botStart, n = 0; for (const x of DU.botT) { t += x + 900; if (Date.now() >= t) n++; else break; } return n; }
function duOpp() {
  if (DU.bot) { const n = duBotN(); const ans = DU.botAns.slice(0, n); return { name: DU.oppName, n, ans, score: duScore(ans, DU.botT), done: n >= DU.items.length, joined: true }; }
  const o = DU.srv && DU.srv.opp; return o ? { name: o.name, n: o.n, ok: o.ok, score: o.score, done: o.done, joined: o.joined, ans: o.ans } : { name: DU.oppName || "En attente…", n: 0, score: 0, done: false, joined: false };
}
function duDots(n, ans, cur, total) { let x = ""; for (let i = 0; i < total; i++) x += `<i class="${i < n ? (ans ? (ans[i] ? "ok" : "ko") : "on") : ""}${i === cur ? " cur" : ""}"></i>`; return `<span class="du-dots" aria-hidden="true">${x}</span>`; }
function duBoardHTML() {
  const o = duOpp(), me = duScore(DU.picks.map(Boolean), DU.times);
  return `<div class="du-board" id="duBoard" aria-live="polite">
    <div class="du-side"><b>Toi</b><span class="du-sc" id="duMe">${me}</span>${duDots(DU.picks.length, DU.picks, DU.stage === "play" ? DU.i : -1, DU.items.length)}</div>
    <span class="du-x" style="font-size:1.1rem">VS</span>
    <div class="du-side r"><b>${h(o.name)}</b><span class="du-sc" id="duOp">${o.score}</span>${duDots(o.n, DU.bot ? o.ans : null, -1, DU.items.length)}</div>
  </div>`;
}
function duelBoard() { const b = document.getElementById("duBoard"); if (!b) return; const old = document.getElementById("duOp"), prev = old ? old.textContent : ""; b.outerHTML = duBoardHTML(); const nw = document.getElementById("duOp"); if (nw && prev && nw.textContent !== prev) { nw.classList.add("bump"); setTimeout(() => nw.classList.remove("bump"), 300); } }
function duelAnswer(pos) {
  if (!DU || DU.stage !== "play" || DU.lock) return;
  const cur = DU.items[DU.i], ok = pos >= 0 && cur.order[pos] === 0, t = Math.min(DUEL_T * 1000, Date.now() - DU.qT0);
  DU.lock = true; DU.picks.push(ok ? 1 : 0); DU.times.push(t);
  recordQ(cur.it, ok, pos >= 0 ? cur.it.o[cur.order[pos]] : ""); touch();
  tone(ok ? "ok" : "ko"); buzz(ok ? 15 : [35, 45, 35]);
  document.querySelectorAll(".du-opt").forEach((b, p) => { b.disabled = true; if (cur.order[p] === 0) b.classList.add("right", "du-opt", "flash-ok"); else if (p === pos) b.classList.add("wrong"); });
  const me = document.getElementById("duMe"); if (me) { me.textContent = duScore(DU.picks.map(Boolean), DU.times); if (ok) { me.classList.add("bump"); setTimeout(() => me.classList.remove("bump"), 300); } }
  const N = DUEL_NET(), i = DU.i;
  if (!DU.bot && N) N.ans(DU.id, i, ok, t).then(j => { if (DU && j && j.duel && DU.id === j.duel.id) { DU.srv = j.duel; if (DU.i >= DU.items.length && DU.stage !== "end") duelSync(j.duel); } }).catch(() => {});
  setTimeout(() => {
    if (!DU || DU.stage === "end") return; DU.lock = false; DU.i++;
    if (DU.i >= DU.items.length) { if ((DU.bot && duBotN() >= DU.items.length) || (DU.srv && DU.srv.status === "done")) return duelEnd(); DU.stage = "wait"; render(); return; }
    DU.qT0 = Date.now(); render();
  }, ok ? 650 : 1300);
}
function duelEnd() {
  if (!DU) return;
  DU.stage = "end"; duelStop();
  const me = duScore(DU.picks.map(Boolean), DU.times), o = duOpp(), r = me > o.score ? "w" : me < o.score ? "l" : "d";
  S.dlog = S.dlog || {};
  if (!DU.bot && !S.dlog[DU.id]) { S.dlog[DU.id] = r; const k = Object.keys(S.dlog); if (k.length > 60) delete S.dlog[k[0]]; S.dus = S.dus || { w: 0, l: 0, d: 0 }; S.dus[r]++; wlog("du", "all"); S.xp += r === "w" ? 30 : r === "d" ? 15 : 5; touch(); }
  render();
  setTimeout(() => { if (view !== "duel") return; if (r === "w") { fxStamp("Victoire", me + " à " + o.score); confettiBurst(80); tone("lvl"); } else if (r === "d") fxStamp("Égalité", me + " partout"); else fxStamp("Défaite", o.score + " à " + me); }, 350);
  DH.at = 0;
}
function vDuel() {
  if (!DU) { AMT = "duels"; return vAmis(); }
  const o = duOpp(), myName = P().name || window.GL_NAME || "Moi";
  const top = `<div class="runner-top"><span class="progress-text"><button class="quit" data-act="duQuit" aria-label="Quitter le duel">✕</button>Duel${DU.bot ? " contre le Grand Livre" : ` · code ${h(DU.id)}`}</span><span class="ep">${DU.items.length} questions</span></div>`;
  if (DU.stage === "lobby") {
    const joined = o && o.joined && DU.srv && DU.srv.opp;
    return `<section class="runner stack">${top}
      <div class="du-hero"><div class="du-vs"><div class="du-p">${duAv(myName)}<b>Toi</b></div><span class="du-x">VS</span><div class="du-p" id="duLobbyOpp">${joined ? duAv(o.name) : `<span class="du-av" style="--ah:45">?</span>`}<b>${joined ? h(o.name) : DU.srv && DU.srv.opp ? h(DU.srv.opp.name) : "En attente…"}</b></div></div></div>
      <div class="pf-set" style="padding:18px;display:grid;gap:14px;justify-items:center;text-align:center">
        <p style="margin:0">${DU.srv && DU.srv.opp ? `Défi envoyé à <b>${h(DU.srv.opp.name)}</b>. Il le verra en ouvrant le Grand Livre.` : "Donne ce code à ton adversaire :"}</p>
        <div class="du-code" aria-label="Code ${h(DU.id)}">${DU.id.split("").map(c => `<span>${h(c)}</span>`).join("")}</div>
        <div class="du-wait" aria-hidden="true"><i></i><i></i><i></i></div>
        <p class="muted small" style="margin:0">Dès qu'il rejoint, le duel démarre pour vous deux en même temps.</p>
        <div class="row" style="justify-content:center">${navigator.share ? `<button class="btn" data-act="duShare">Partager le code</button>` : `<button class="btn" data-act="duCopy">Copier le code</button>`}<button class="btn primary" data-act="duSolo">Jouer sans attendre</button></div>
        <p class="muted small" style="margin:0">« Jouer sans attendre » : tu fais ton duel maintenant, ton adversaire le fera plus tard avec les mêmes questions.</p>
      </div></section>`;
  }
  if (DU.stage === "count") return `<section class="runner stack">${top}
      <div class="du-hero"><div class="du-vs"><div class="du-p">${duAv(myName)}<b>Toi</b></div><span class="du-x">VS</span><div class="du-p">${duAv(o.name)}<b>${h(o.name)}</b></div></div></div>
      <div class="du-count" id="duCount" data-n="" aria-live="assertive">3</div><p class="muted" style="text-align:center">Prépare-toi : ${DUEL_T} secondes par question.</p></section>`;
  if (DU.stage === "play") {
    const cur = DU.items[DU.i], it = cur.it, c = CAT[it.c], L4 = ["A", "B", "C", "D"];
    return `<section class="runner">${top}${duBoardHTML()}
      <div class="du-tt"><span>Question ${DU.i + 1} / ${DU.items.length}</span><span id="duSec">${DUEL_T} s</span></div>
      <div class="du-timer"><i id="duBar" style="width:100%"></i></div>
      <div class="qcard"><span class="ep" style="align-self:flex-start">${h(c.code)} · ${h(c.name)}</span><p class="qtext">${h(it.q)}</p>
        <div class="options">${cur.order.map((oi, p) => `<button class="opt du-opt" data-act="duPick" data-pos="${p}"><span class="k">${L4[p]}</span><span>${h(it.o[oi])}</span></button>`).join("")}</div></div>
      <span class="kbd">Touches 1 à 4 pour répondre</span></section>`;
  }
  if (DU.stage === "wait") return `<section class="runner stack">${top}${duBoardHTML()}
      <div class="pf-set" style="padding:18px;display:grid;gap:12px;justify-items:center;text-align:center">
        <b style="font-size:1.1rem">Tu as terminé avec ${duScore(DU.picks.map(Boolean), DU.times)} points !</b>
        <div class="du-wait" aria-hidden="true"><i></i><i></i><i></i></div>
        <p class="muted" style="margin:0">${DU.bot ? "Le Grand Livre termine ses questions…" : o.joined ? `${h(o.name)} est en train de jouer (${o.n}/${DU.items.length}).` : `${h(o.name || "Ton adversaire")} n'a pas encore commencé. Tu verras le résultat dans Amis › Duels${DUEL_NET() ? ", et tu recevras une notification si tes rappels sont activés" : ""}.`}</p>
        <button class="btn" data-act="duBack">Retour aux duels</button></div></section>`;
  const me = duScore(DU.picks.map(Boolean), DU.times), r = me > o.score ? "w" : me < o.score ? "l" : "d";
  const oa = o.ans || [], ot = DU.bot ? DU.botT : ((DU.srv && DU.srv.opp && DU.srv.opp.t) || []);
  return `<section class="runner stack">${top}
    <div class="du-hero"><div class="du-vs"><div class="du-p">${duAv(myName)}<b>Toi</b><span class="du-sc" style="font-size:2rem">${me}</span></div><span class="du-x">${r === "w" ? "Gagné" : r === "l" ? "VS" : "="}</span><div class="du-p">${duAv(o.name)}<b>${h(o.name)}</b><span class="du-sc" style="font-size:2rem">${o.score}</span></div></div>
      <p style="text-align:center;margin:0;position:relative;z-index:1;font:800 1.3rem var(--f-display)">${r === "w" ? "Victoire !" : r === "l" ? "Défaite… la revanche ?" : "Égalité parfaite"}</p>
      <p class="muted" style="text-align:center;margin:0;position:relative;z-index:1">${DU.picks.filter(Boolean).length}/${DU.items.length} bonnes réponses pour toi, ${oa.filter(Boolean).length}/${DU.items.length} pour ${h(o.name)}.${!DU.bot && S.dlog && S.dlog[DU.id] ? ` +${r === "w" ? 30 : r === "d" ? 15 : 5} XP` : ""}</p></div>
    <div class="pf-set du-res" style="padding:14px 16px"><h3>Question par question</h3>
      ${DU.items.map((x, i) => { const mine = DU.picks[i], th = oa[i]; return `<div class="du-row"><span class="du-mk ${mine ? "ok" : ""}" title="Toi">${mine ? "✓" : "✗"}</span><span><b>${h(x.it.q)}</b><br><small class="muted">Réponse : ${h(x.it.o[0])} · toi ${((DU.times[i] || 0) / 1000).toFixed(1).replace(".", ",")} s</small>${!mine && x.it.ch && CHID[x.it.ch] ? `<br><button class="btn small peek-cta" data-act="fichePeek" data-id="${h(x.it.ch)}">${ICON.book}Revoir la fiche</button>` : ""}</span><span class="du-mk ${th === undefined ? "na" : th ? "ok" : ""}" title="${h(o.name)}">${th === undefined ? "–" : th ? "✓" : "✗"}</span><span class="muted small">${ot[i] ? ((ot[i]) / 1000).toFixed(1).replace(".", ",") + " s" : ""}</span></div>`; }).join("")}
    </div>
    <div class="row"><button class="btn primary" data-act="duAgain">${DU.bot ? "Rejouer" : "Revanche"}</button><button class="btn" data-act="duBack">Retour aux duels</button></div>
  </section>`;
}
async function duelCreate(opp) {
  const N = DUEL_NET(), cfg = duelCfg(); if (!N) return;
  const ids = duelPick(cfg.cats, cfg.n); if (ids.length < 5) return toast("Choisis plus de matières.");
  try { const j = await N.create({ ids, cats: cfg.cats, opp: opp || undefined }); duelFromSrv(j.duel); toast(j.merged ? "Ton ami t'avait déjà défié : vous jouez ce duel ensemble !" : j.existing ? "Ton défi est déjà envoyé, on attend ton ami." : opp ? "Défi envoyé ! Le duel démarre dès qu'il accepte." : "Duel créé : donne le code."); }
  catch (e) { toast((e && e.message) || "Impossible de créer le duel pour l'instant."); }
}
async function duelJoinCode(code) {
  const N = DUEL_NET(); code = String(code || "").trim().toUpperCase(); if (!N || code.length < 4) return toast("Tape le code du duel.");
  try { const j = await N.join(code); duelFromSrv(j.duel); } catch (e) { toast((e && e.message) || "Code introuvable."); }
}
function duelDeepLink() {
  try { const u = new URL(location.href), c = u.searchParams.get("duel"); if (!c || !DUEL_NET()) return; u.searchParams.delete("duel"); history.replaceState(null, "", u.pathname + u.search + u.hash); setTimeout(() => duelJoinCode(c), 600); } catch (e) {}
}
document.addEventListener("keydown", e => { if (view === "duel" && DU && DU.stage === "play" && /^[1-4]$/.test(e.key) && !e.target.closest("input,textarea")) duelAnswer(+e.key - 1); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && view === "duel" && DU && !DU.bot && DUEL_NET()) DUEL_NET().get(DU.id).then(j => duelSync(j.duel)).catch(() => {}); });

/* ---------- Amis : code ami, comparaison, duels, réviser ensemble, classement ---------- */
let AMT = "amis", FRX = null;
let FR = { data: null, at: 0, busy: false, err: "" };
const FRN = () => (typeof window.GL_FRIENDS === "object" && window.GL_FRIENDS) || null;
const ROOMN = () => (typeof window.GL_ROOM === "object" && window.GL_ROOM) || null;
function amisBadge() {
  const n = duelInvites().length + ((FR.data && FR.data.incoming) || []).length, b = document.getElementById("navAmis");
  if (b) { b.hidden = !n; b.textContent = n; }
}
async function loadFriends(force) {
  if (force) avLoad(true);
  const N = FRN(); if (!N || FR.busy) return;
  if (!force && FR.data && Date.now() - FR.at < 30000) return;
  FR.busy = true;
  try { FR.data = await N.list(); FR.at = Date.now(); FR.err = ""; } catch (e) { FR.err = (e && e.message) || "Amis indisponibles pour l'instant."; FR.at = Date.now(); }
  FR.busy = false; amisBadge();
  if (view === "amis" && AMT === "amis") render();
}
function amisHomeCard() {
  if (!FRN()) return "";
  loadFriends();
  const inc = (FR.data && FR.data.incoming) || []; if (!inc.length) return "";
  return `<button class="wk-cta du-inv" data-act="amGo" data-t="amis"><span class="wk-ic">${ICON.friends}</span><span><b>${h(inc[0].name)} veut t'ajouter en ami</b><small>${inc.length > 1 ? `Et ${inc.length - 1} autre${inc.length > 2 ? "s" : ""} demande${inc.length > 2 ? "s" : ""}. ` : ""}Accepte pour comparer vos semaines et vous défier.</small></span><span class="wk-go">Voir ›</span></button>`;
}
function vAmis() {
  const T = [["amis", ICON.friends, "Mes amis", FR.data ? `${FR.data.friends.length} ami${FR.data.friends.length > 1 ? "s" : ""}` : "Code ami"], ["duels", ICON.duel, "Duels", DUEL_NET() ? "Défie un ami" : "Contre le Grand Livre"], ["salle", ICON.talk, "Réviser ensemble", "Quiz en direct à plusieurs"], ["classement", ICON.target, "Classement", "Semaine et défi commun"]];
  const tabs = `<nav class="ex-tabs am-tabs" aria-label="Amis">${T.map(([k, ic, t, sub]) => `<button class="ex-tab" data-act="amGo" data-t="${k}" aria-current="${AMT === k ? "page" : "false"}"><span class="ex-tab-ic" aria-hidden="true">${ic}</span><b>${t}</b><small>${sub}</small></button>`).join("")}</nav>`;
  const body = AMT === "duels" ? duelHome() : AMT === "salle" ? roomHome() : AMT === "classement" ? vClasse().replace(/^<section class="page-head">[\s\S]*?<\/section>/, "") : friendsPanel();
  return `<section class="page-head"><h1>Amis</h1><p class="muted">Révise avec tes camarades : compare-toi, défie-les en duel ou faites un quiz ensemble en direct.</p></section>${tabs}${body}`;
}
function frBars(me, him) { const mx = Math.max(me, him, 1); return `<div class="fr-duo"><div><i style="width:${Math.round(me / mx * 100)}%"></i></div><div><i style="width:${Math.round(him / mx * 100)}%"></i></div></div>`; }
function friendsPanel() {
  const N = FRN();
  if (!N) return `<section class="stack"><div class="pf-set am-empty"><span class="big"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg></span><b>Les amis se retrouvent sur le site partagé du Grand Livre</b><span>${isGuest() ? "Crée ton compte gratuit pour ajouter tes camarades, comparer vos semaines et vous défier." : "Ici, tu peux t'entraîner en duel contre le Grand Livre dans l'onglet Duels."}</span>${isGuest() ? `<a class="btn primary" href="/#signup">Créer mon compte</a>` : ""}</div></section>`;
  loadFriends();
  const d = FR.data;
  if (!d) return `<section class="stack"><div class="empty">${FR.err ? h(FR.err) : "Chargement de tes amis…"}</div></section>`;
  const mine = d.mine || {}, me = P().name || window.GL_NAME || "Moi";
  const card = f => {
    const open = FRX === f.k, mx = Math.max(1, ...f.activite);
    return `<div class="fr-card"><button class="fr-top" data-act="frOpen" data-k="${h(f.k)}" aria-expanded="${open}">${duAv(f.name)}<span><b>${h(f.name)}</b>${f.serie >= 2 ? ` <span class="du-tag w">Série ${f.serie} j</span>` : ""}<br><small>${f.niveau} · ${f.semAcq} acquise${f.semAcq > 1 ? "s" : ""} et ${f.semJours} jour${f.semJours > 1 ? "s" : ""} cette semaine${f.dernier === 0 ? " · a révisé aujourd'hui" : f.dernier != null ? ` · vu il y a ${f.dernier} j` : ""}</small></span>
        <span class="fr-week" aria-hidden="true">${f.activite.map(v => `<i class="${v ? "on" : ""}" style="height:${Math.max(3, v / mx * 26)}px"></i>`).join("")}</span></button>
      ${open ? `<div class="fr-cmp"><div class="fr-legend"><span>Toi</span><span>${h(f.name)}</span></div>
        ${[["Acquises cette semaine", mine.semAcq, f.semAcq], ["Jours de révision cette semaine", mine.semJours, f.semJours], ["Série en cours", mine.serie, f.serie], ["Questions acquises au total", mine.acquises, f.acquises], ["XP", mine.xp, f.xp]].map(([l, a, b]) => `<div class="fr-row"><div class="lbl">${l}<span>${(a || 0).toLocaleString("fr-FR")} · ${(b || 0).toLocaleString("fr-FR")}</span></div>${frBars(a || 0, b || 0)}</div>`).join("")}
        ${f.defi != null || mine.defi != null ? `<p class="muted small" style="margin:0">Défi de la semaine : toi ${mine.defi != null ? mine.defi + "/10" : "pas encore fait"}, ${h(f.name)} ${f.defi != null ? f.defi + "/10" : "pas encore fait"}.</p>` : ""}
        ${f.forts.length ? `<div><div class="label">Ses points forts</div><div class="fr-chips">${f.forts.map(m => `<span class="fr-chip">${h(CAT[m.c] ? CAT[m.c].code : m.c)} · ${m.r} %</span>`).join("")}${f.faibles.map(m => `<span class="fr-chip ko">${h(CAT[m.c] ? CAT[m.c].code : m.c)} · ${m.r} %</span>`).join("")}</div><p class="muted small" style="margin:4px 0 0">Demande-lui un coup de main sur ses matières fortes, ou aide-le sur les tiennes.</p></div>` : ""}
        <div class="row"><button class="btn small primary" data-act="duMate" data-k="${h(f.k)}">${ICON.duel}Le défier en duel</button><button class="btn small" data-act="rmWith" data-name="${h(f.name)}">Réviser ensemble</button><button class="btn small" data-act="frDel" data-k="${h(f.k)}" data-name="${h(f.name)}">Retirer</button></div></div>` : ""}
    </div>`;
  };
  return `<section class="stack">
    <div class="pf-set fr-code" style="padding:16px">
      <span class="eyebrow">Ton code ami</span>
      <div class="du-code" aria-label="Code ami ${h(d.code)}">${d.code.split("").map(c => c === "-" ? `<i>–</i>` : `<span>${h(c)}</span>`).join("")}</div>
      <p class="muted small" style="margin:0">Donne-le à tes camarades : ils pourront t'ajouter, et tu choisis d'accepter.</p>
      <div class="row" style="justify-content:center">${navigator.share ? `<button class="btn small" data-act="frShare">Partager</button>` : ""}<button class="btn small" data-act="frCopy">Copier</button></div>
    </div>
    <div class="pf-set" style="padding:16px;display:grid;gap:10px"><h3>Ajouter un ami</h3>
      <div class="row"><input id="frCode" class="pf-in du-code-in" maxlength="7" autocomplete="off" autocapitalize="characters" placeholder="ABC-123" aria-label="Code ami de ton camarade"><button class="btn primary" data-act="frAdd">Ajouter</button></div>
      ${d.outgoing.length ? `<p class="muted small" style="margin:0">En attente de réponse : ${d.outgoing.map(o => h(o.name)).join(", ")}.</p>` : ""}</div>
    ${d.incoming.length ? `<div class="stack" style="gap:8px"><h3>Demandes reçues</h3>${d.incoming.map(r => `<div class="du-card du-inv" style="cursor:default">${duAv(r.name)}<span><b>${h(r.name)}</b><br><small class="muted">veut t'ajouter en ami</small></span><span class="row" style="gap:6px"><button class="btn small" data-act="frNo" data-k="${h(r.k)}">Refuser</button><button class="btn small primary" data-act="frYes" data-k="${h(r.k)}">Accepter</button></span></div>`).join("")}</div>` : ""}
    ${d.friends.length ? `<div class="stack" style="gap:10px"><h3>Mes amis</h3>${d.friends.map(card).join("")}</div>`
      : `<div class="pf-set am-empty"><span class="big"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg></span><b>Pas encore d'amis ici</b><span>Échange ton code avec tes camarades de classe. Une fois acceptés, vous comparez vos semaines, vous vous défiez en duel et vous révisez ensemble.</span></div>`}
    <p class="muted small" style="margin:0">Tes amis voient ton niveau, tes XP, ta série, tes questions acquises, tes jours de révision et tes matières fortes et faibles. Jamais tes erreurs ni tes réponses. Retire un ami à tout moment.</p>
  </section>`;
}

/* Réviser ensemble : une salle, un organisateur, tout le monde voit la même question */
let RO = null, rmPoll = null, rmTick = null;
const roomCfg = () => { S.rmf = S.rmf || { cats: duelCfg().cats.slice(), n: 10 }; return S.rmf; };
function roomStop() { clearInterval(rmPoll); rmPoll = null; clearInterval(rmTick); rmTick = null; }
function roomHome() {
  const N = ROOMN();
  if (!N) return `<section class="stack"><div class="pf-set am-empty"><span class="big"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span><b>Réviser ensemble, c'est sur le site partagé</b><span>${isGuest() ? "Crée ton compte pour ouvrir une salle avec tes camarades." : "Ouvre le Grand Livre en ligne pour faire un quiz en direct avec tes camarades."}</span></div></section>`;
  return `<section class="stack">
    <div class="du-hero"><b style="font:800 1.25rem var(--f-display);position:relative;z-index:1">Un quiz en direct, à plusieurs</b><p class="muted" style="margin:0;position:relative;z-index:1">L'organisateur ouvre une salle et donne le code. Tout le monde voit la même question en même temps, puis la correction avec les réponses de chacun. Idéal en permanence, à la bibliothèque ou en appel.</p></div>
    <div class="pf-set" style="padding:16px;display:grid;gap:10px"><h3>Ouvrir une salle</h3><p class="muted small" style="margin:0">Jusqu'à 8 élèves. Tu choisiras les matières une fois tout le monde arrivé.</p><div class="row"><button class="btn primary" data-act="rmNew">Ouvrir une salle</button></div></div>
    <div class="pf-set" style="padding:16px;display:grid;gap:10px"><h3>Rejoindre une salle</h3>
      <div class="row"><input id="rmCode" class="pf-in du-code-in" maxlength="5" autocomplete="off" autocapitalize="characters" placeholder="CODE" aria-label="Code de la salle"><button class="btn primary" data-act="rmJoin">Rejoindre</button></div></div>
  </section>`;
}
function roomEnter(room) {
  roomStop(); RO = { srv: room, local: {}, sig: "" };
  rmPoll = setInterval(async () => {
    const N = ROOMN(); if (!RO || !N || view !== "room" || document.hidden) return;
    try { const j = await N.get(RO.srv.id); roomApply(j.room); } catch (e) { if (e && /existe plus/.test(e.message || "")) { toast("La salle a été fermée."); RO = null; roomStop(); AMT = "salle"; go("amis"); } }
  }, 1200);
  rmTick = setInterval(() => {
    if (!RO || view !== "room" || RO.srv.phase !== "q") return;
    const left = Math.max(0, RO.srv.left - (Date.now() - RO.got)), el = document.getElementById("rmBar"), tt = document.getElementById("rmSec");
    if (el) el.style.width = (left / RO.srv.T * 100) + "%"; if (tt) { const s = Math.ceil(left / 1000); tt.textContent = s + " s"; tt.classList.toggle("low", s <= 5); }
  }, 150);
  RO.got = Date.now(); RO.sig = roomSig(room); go("room");
}
function roomSig(r) { return [r.phase, r.idx, r.host, r.members.map(m => m.k + (m.here ? 1 : 0) + (m.answered ? 1 : 0) + (m.score) + (m.pos ?? "")).join(","), r.mine ? 1 : 0].join("|"); }
function roomApply(r) {
  if (!RO) return;
  const prev = RO.srv; RO.srv = r; RO.got = Date.now();
  if (r.phase === "q" && (prev.phase !== "q" || prev.idx !== r.idx)) { tone("xp"); buzz(10); }
  if (r.phase === "reveal" && prev.phase === "q") { const me = r.members.find(m => m.me); if (me && me.ok) tone("ok"); }
  const sig = roomSig(r); if (sig !== RO.sig) { RO.sig = sig; if (view === "room") render(); }
}
function roomItem() { const r = RO.srv; if (r.idx < 0 || !r.ids.length) return null; return duelItems([r.ids[r.idx]], (r.seed >>> 0) + r.idx * 7919)[0]; }
function vRoom() {
  if (!RO) { AMT = "salle"; return vAmis(); }
  const r = RO.srv, L4 = ["A", "B", "C", "D"], host = r.members.find(m => m.host);
  const top = `<div class="runner-top"><span class="progress-text"><button class="quit" data-act="rmQuit" aria-label="Quitter la salle">✕</button>Salle ${h(r.id)}</span><span class="ep">${r.members.filter(m => m.here).length} présent${r.members.filter(m => m.here).length > 1 ? "s" : ""}</span></div>`;
  const mem = (showAns) => `<div class="rm-mem">${r.members.map(m => `<span class="rm-m${m.here ? "" : " off"}${r.phase === "q" && m.answered ? " done" : ""}">${duAv(m.name)}${h(m.me ? "Toi" : m.name)}${m.host ? ` <span class="host">· organise</span>` : ""}${showAns ? ` <b>${m.score}</b>` : ""}</span>`).join("")}</div>`;
  if (r.phase === "lobby") {
    const cfg = roomCfg(), cats = CATS.filter(c => (QBY[c.id] || []).length && !lockedCat(c.id)), pool = duelPool(cfg.cats).length;
    return `<section class="runner stack">${top}
      <div class="pf-set" style="padding:18px;display:grid;gap:12px;justify-items:center;text-align:center"><p style="margin:0">Code de la salle à donner à tes camarades :</p>
        <div class="du-code" aria-label="Code ${h(r.id)}">${r.id.split("").map(c => `<span>${h(c)}</span>`).join("")}</div>
        <div class="row" style="justify-content:center">${navigator.share ? `<button class="btn small" data-act="rmShare">Partager</button>` : `<button class="btn small" data-act="rmCopy">Copier le code</button>`}</div></div>
      <div class="pf-set" style="padding:16px;display:grid;gap:10px"><h3>Dans la salle</h3>${mem(false)}</div>
      ${r.host ? `<div class="pf-set" style="padding:16px;display:grid;gap:12px"><h3>Le quiz</h3>
        <div><div class="label">Matières</div><div class="picker">${cats.map(c => `<button class="chip" data-act="rmCat" data-c="${c.id}" aria-pressed="${cfg.cats.includes(c.id)}"><span class="mono">${h(c.code)}</span>${h(c.name)}</button>`).join("")}</div></div>
        <div class="row"><span class="label" style="margin:0">Questions</span><div class="pf-seg" role="group">${[5, 10, 15, 20].map(n => `<button type="button" data-act="rmN" data-n="${n}" aria-pressed="${cfg.n === n}">${n}</button>`).join("")}</div></div>
        <div class="row"><button class="btn primary" data-act="rmStart" ${pool < 3 ? "disabled" : ""}>Lancer le quiz pour tout le monde</button></div></div>`
        : `<div class="pf-set am-empty"><div class="du-wait" aria-hidden="true"><i></i><i></i><i></i></div><span>${h(host ? host.name : "L'organisateur")} va lancer le quiz…</span></div>`}
    </section>`;
  }
  if (r.phase === "q" || r.phase === "reveal") {
    const x = roomItem(); if (!x) return `<section class="runner">${top}<div class="empty">Question introuvable dans ta version : recharge la page.</div></section>`;
    const it = x.it, c = CAT[it.c], mine = RO.local[r.idx] != null ? RO.local[r.idx] : r.mine ? r.mine.pos : null, rev = r.phase === "reveal";
    const answered = r.members.filter(m => m.answered).length, pres = r.members.filter(m => m.here).length;
    const opts = x.order.map((oi, p) => {
      let cls = "opt rm-opt"; if (rev) { if (oi === 0) cls += " right"; else if (p === mine) cls += " wrong"; } else if (p === mine) cls += " picked";
      const who = rev ? r.members.filter(m => m.pos === p) : [];
      return `<button class="${cls}" data-act="rmPick" data-pos="${p}" ${mine != null || rev ? "disabled" : ""}><span class="k">${L4[p]}</span><span>${h(it.o[oi])}</span>${who.length ? `<span class="rm-who">${who.map(m => duAv(m.name)).join("")}</span>` : ""}</button>`;
    }).join("");
    const nbOk = rev ? r.members.filter(m => m.ok).length : 0;
    return `<section class="runner">${top}
      <div class="du-tt"><span>Question ${r.idx + 1} / ${r.n}</span>${rev ? `<span>${nbOk}/${r.members.filter(m => m.pos !== undefined).length} juste${nbOk > 1 ? "s" : ""}</span>` : `<span id="rmSec">${Math.ceil(r.left / 1000)} s</span>`}</div>
      ${rev ? "" : `<div class="du-timer"><i id="rmBar" style="width:${r.left / r.T * 100}%"></i></div>`}
      <div class="qcard"><span class="ep" style="align-self:flex-start">${h(c.code)} · ${h(c.name)}</span><p class="qtext">${h(it.q)}</p><div class="options">${opts}</div>
        ${rev ? `<div class="feedback"><span class="verdict ${mine != null && x.order[mine] === 0 ? "ok" : "ko"}">${mine == null ? "Pas répondu" : x.order[mine] === 0 ? "Juste" : "À revoir"}</span><p class="muted">${h(it.e)}</p>${it.ch && CHID[it.ch] ? `<button class="btn small peek-cta" data-act="fichePeek" data-id="${h(it.ch)}">${ICON.book}Revoir la fiche : ${h(CHID[it.ch].title)}</button>` : ""}</div>` : ""}
      </div>
      ${mem(rev)}
      <div class="row">${rev ? (r.host ? `<button class="btn primary" data-act="rmNext">${r.idx + 1 >= r.n ? "Voir le bilan" : "Question suivante"}</button>` : `<span class="muted small">${h(host ? host.name : "L'organisateur")} passe à la suite…</span>`)
        : `<span class="muted small">${mine != null ? `Réponse envoyée. ${answered}/${pres} ont répondu.` : "Touches 1 à 4 pour répondre."}</span>${r.host ? `<button class="btn small" data-act="rmNext">Afficher la réponse</button>` : ""}`}</div>
    </section>`;
  }
  const rank = r.members.slice().sort((a, b) => b.score - a.score), medal = i => (i + 1);
  const hard = (r.hist || []).map((x, i) => ({ i, ok: Object.values(x).filter(Boolean).length, n: Object.keys(x).length })).filter(q => q.n && q.ok / q.n < .5);
  const items = duelItems(r.ids, 0);
  return `<section class="runner stack">${top}
    <div class="du-hero"><b style="font:800 1.4rem var(--f-display);position:relative;z-index:1">Bilan du groupe</b><p class="muted" style="margin:0;position:relative;z-index:1">${r.n} questions · ${r.members.length} participant${r.members.length > 1 ? "s" : ""}</p></div>
    <ol class="rm-rank" style="list-style:none;padding:0;margin:0">${rank.map((m, i) => `<li class="${m.me ? "me" : ""}"><span>${medal(i)}</span>${duAv(m.name)}<b>${h(m.me ? "Toi" : m.name)}</b><span><b>${m.score}</b>/${r.n}</span></li>`).join("")}</ol>
    <div class="pf-set" style="padding:16px;display:grid;gap:10px"><h3>À retravailler ensemble</h3>
      ${hard.length ? hard.map(q => { const it = items[q.i] && items[q.i].it; return it ? `<div class="du-row" style="grid-template-columns:1fr auto"><span><b>${h(it.q)}</b><br><small class="muted">Réponse : ${h(it.o[0])} · ${q.ok}/${q.n} juste${q.ok > 1 ? "s" : ""}</small>${it.ch && CHID[it.ch] ? `<br><button class="btn small peek-cta" data-act="fichePeek" data-id="${h(it.ch)}">${ICON.book}Revoir la fiche</button>` : ""}</span></div>` : ""; }).join("") : `<p class="muted" style="margin:0">Aucune question ratée par la majorité du groupe. Bravo !</p>`}
    </div>
    <div class="row">${r.host ? `<button class="btn primary" data-act="rmNext">Nouvelle partie</button>` : ""}<button class="btn" data-act="rmQuit">Quitter la salle</button></div>
  </section>`;
}
async function roomPick(pos) {
  if (!RO) return; const r = RO.srv, N = ROOMN(); if (r.phase !== "q" || RO.local[r.idx] != null) return;
  const x = roomItem(); if (!x) return;
  const ok = x.order[pos] === 0; RO.local[r.idx] = pos;
  recordQ(x.it, ok, x.it.o[x.order[pos]]); touch(); buzz(12);
  render();
  try { const j = await N.ans(r.id, r.idx, pos, ok); roomApply(j.room); } catch (e) {}
}
document.addEventListener("keydown", e => { if (view === "room" && RO && RO.srv.phase === "q" && /^[1-4]$/.test(e.key) && !e.target.closest("input,textarea")) roomPick(+e.key - 1); });
function amisDeepLink() { try { const u = new URL(location.href); if (!u.searchParams.get("amis")) return; u.searchParams.delete("amis"); history.replaceState(null, "", u.pathname + u.search + u.hash); AMT = "amis"; setTimeout(() => go("amis"), 300); } catch (e) {} }

/* Fenêtre de confirmation aux couleurs de l'appli (remplace la boîte grise du navigateur) */
function askConfirm(title, text, ok, opts) {
  opts = opts || {};
  return new Promise(res => {
    closeSheet();
    const el = document.createElement("div"); el.className = "wk-sheet"; el.id = "wkSheet";
    el.innerHTML = `<div class="wk-box" role="alertdialog" aria-modal="true" aria-labelledby="cfT" aria-describedby="cfD">
      ${opts.name ? `<div style="display:flex;justify-content:center">${duAv(opts.name).replace('class="du-av"', 'class="du-av" style="width:56px;height:56px;--ah:' + duHue(opts.name) + '"')}</div>` : ""}
      <h2 id="cfT" style="text-align:center;padding:0">${h(title)}</h2>${text ? `<p class="muted" id="cfD" style="text-align:center">${h(text)}</p>` : ""}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px"><button class="btn" data-cf="0">${h(opts.cancel || "Annuler")}</button><button class="btn primary${opts.danger ? " cf-danger" : ""}" data-cf="1">${h(ok || "Confirmer")}</button></div></div>`;
    const done = v => { document.removeEventListener("keydown", key); el.remove(); res(v); };
    const key = e => { if (e.key === "Escape") done(false); };
    el.addEventListener("click", e => { const b = e.target.closest("[data-cf]"); if (b) done(b.dataset.cf === "1"); else if (e.target === el) done(false); });
    document.addEventListener("keydown", key);
    document.body.appendChild(el); buzz(10); tone("open");
    setTimeout(() => { const b = el.querySelector('[data-cf="1"]'); if (b) b.focus({ preventScroll: true }); }, 30);
  });
}

/* Boîte de réception : défis et demandes d'amis arrivent en direct, où que l'on soit dans l'appli */
const IB = { seen: (() => { try { return new Set(JSON.parse(localStorage.getItem("gl-inbox-seen") || "[]")); } catch (e) { return new Set(); } })(), q: [], timer: null, busy: false, first: true };
function ibSave() { try { localStorage.setItem("gl-inbox-seen", JSON.stringify([...IB.seen].slice(-80))); } catch (e) {} }
async function inboxPoll() {
  const N = DUEL_NET(); if (!N || !N.inbox || IB.busy || document.hidden) return;
  IB.busy = true; avLoad();
  try {
    const j = await N.inbox(), items = [];
    if (j.fsig) { if (IB.fsig && j.fsig !== IB.fsig) { FR.at = 0; FRX = null; loadFriends(true); } IB.fsig = j.fsig; }
    if (j.v) { if (!IB.v) IB.v = j.v; else if (j.v !== IB.v && !IB.upd) { IB.upd = true; IB.q.unshift({ key: "u", kind: "upd", name: "GL", sub: "Recharge pour profiter des dernières améliorations." }); ibNext(); } }
    (j.duels || []).forEach(d => items.push({ key: "d:" + d.id, kind: "duel", id: d.id, name: d.from, sub: d.live ? `${d.n} questions · en direct, ton adversaire t'attend !` : `${d.n} questions${d.score != null ? ` · ${d.score} points à battre` : ""}` }));
    (j.friends || []).forEach(f => items.push({ key: "f:" + f.k + ":" + f.at, kind: "ami", k: f.k, name: f.name, sub: "veut t'ajouter en ami" }));
    (j.accepted || []).forEach(f => items.push({ key: "a:" + f.k + ":" + (f.at || 0), kind: "ok", name: f.name, sub: "a accepté ta demande : vous êtes amis !" }));
    (j.results || []).forEach(d => { if (!d.lastMine && !(DU && DU.id === d.id)) items.push({ key: "r:" + d.id, kind: "res", id: d.id, name: d.opp, sub: d.me > d.them ? `Tu gagnes ${d.me} à ${d.them} !` : d.me < d.them ? `${d.opp} gagne ${d.them} à ${d.me}.` : `Égalité ${d.me} partout.`, win: d.me > d.them }); else IB.seen.add("r:" + d.id); });
    const inv = (j.duels || []).length + (j.friends || []).length, b = document.getElementById("navAmis"); if (b) { b.hidden = !inv; b.textContent = inv; }
    const fresh = items.filter(x => !IB.seen.has(x.key)), silent = IB.first && !IB.seen.size;
    if (fresh.length) {
      fresh.forEach(x => IB.seen.add(x.key)); ibSave();
      fresh.forEach(x => { if (!silent || x.kind === "duel" || x.kind === "ami") IB.q.push(x); });
      DH.at = 0; FR.at = 0; loadDuels(true); loadFriends(true);
      ibNext();
    }
    IB.first = false;
  } catch (e) {}
  IB.busy = false;
}
function ibBusy() { return (view === "duel" && DU && DU.stage === "play") || (view === "room" && RO && RO.srv.phase === "q") || (view === "run" && R && R.mode === "exam"); }
function ibNext() {
  if (document.querySelector(".ib") || !IB.q.length) return;
  if (ibBusy()) { setTimeout(ibNext, 4000); return; }
  const x = IB.q.shift(), el = document.createElement("div");
  el.className = "ib"; el.setAttribute("role", "alertdialog"); el.setAttribute("aria-label", x.kind === "duel" ? "Défi en duel" : "Demande d'ami");
  const title = x.kind === "upd" ? "Nouvelle version du Grand Livre" : x.kind === "duel" ? h(x.name) + " te défie en duel" : x.kind === "ok" ? h(x.name) : x.kind === "res" ? "Duel terminé contre " + h(x.name) : h(x.name);
  const btns = x.kind === "duel" ? `<button class="btn small" data-ib="later">Plus tard</button><button class="btn small primary" data-ib="go">Jouer maintenant</button>`
    : x.kind === "ami" ? `<button class="btn small" data-ib="no">Refuser</button><button class="btn small primary" data-ib="yes">Accepter</button>`
    : x.kind === "ok" ? `<button class="btn small" data-ib="later">OK</button><button class="btn small primary" data-ib="friends">Voir mes amis</button>`
    : x.kind === "upd" ? `<button class="btn small" data-ib="later">Plus tard</button><button class="btn small primary" data-ib="reload">Recharger</button>`
    : `<button class="btn small" data-ib="later">OK</button><button class="btn small primary" data-ib="res">Voir le résultat</button>`;
  el.innerHTML = `${duAv(x.name)}<div><b>${title}</b><small>${h(x.sub)}</small></div><div class="row">${btns}</div><div class="ib-bar"><i></i></div>`;
  document.body.appendChild(el); requestAnimationFrame(() => el.classList.add("in"));
  tone(x.kind === "ok" || (x.kind === "res" && x.win) ? "lvl" : "notif"); buzz([60, 40, 60]); if (x.kind === "ok" || (x.kind === "res" && x.win)) confettiBurst(40);
  let done = false;
  const close = () => { if (done) return; done = true; el.classList.remove("in"); setTimeout(() => { el.remove(); ibNext(); }, 450); };
  el.addEventListener("click", e => {
    const a = e.target.closest("[data-ib]"); if (!a) return; const v = a.dataset.ib;
    if (v === "go") { duelStop(); DU = null; duelJoinCode(x.id); }
    if (v === "reload") { try { if (dirty) flush(); } catch (e) {} setTimeout(() => location.reload(), 300); }
    if (v === "friends") { AMT = "amis"; FR.at = 0; go("amis"); loadFriends(true); }
    if (v === "res") { duelStop(); DU = null; const N = DUEL_NET(); if (N) N.get(x.id).then(j => duelFromSrv(j.duel)).catch(() => {}); }
    if (v === "yes" || v === "no") { const F = FRN(); if (F) F.respond(x.k, v === "yes").then(() => { if (v === "yes") { toast("Nouvel ami : " + x.name); confettiBurst(40); } FR.at = 0; loadFriends(true); }).catch(() => {}); }
    close();
  });
  setTimeout(close, 15000);
}
setInterval(inboxPoll, 6000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) inboxPoll(); });

/* ---------- Simulateur d'oral ---------- */
let OR = null, OF = { e: "E6", n: 5, t: 120 }, orTick = null;
function oralHome() {
  const hist = (S.or || []).slice(-5).reverse(), sits = S.sit || [];
  const nE = e => ORAL.filter(x => x.e === e).length;
  return `<section class="stack">
    <div class="sec-head"><h2>Simulateur d'oral</h2><p>Le jury te pose des questions sur tes situations professionnelles. Réponds à voix haute avant le chrono, puis vérifie les éléments attendus.</p></div>
    <div class="or-set">
      <div><div class="label">Épreuve</div><div class="pf-seg" role="group">${[["E6", `E6 · comptabilité, fiscal, social (${nE("E6")})`], ["E7", `E7 · gestion et finance (${nE("E7")})`], ["mix", "Les deux"]].map(([v, l]) => `<button type="button" data-act="orF" data-k="e" data-v="${v}" aria-pressed="${OF.e === v}">${l}</button>`).join("")}</div></div>
      <div><div class="label">Questions</div><div class="pf-seg" role="group">${[3, 5, 8].map(v => `<button type="button" data-act="orF" data-k="n" data-v="${v}" aria-pressed="${OF.n === v}">${v}</button>`).join("")}</div></div>
      <div><div class="label">Temps par réponse</div><div class="pf-seg" role="group">${[[90, "1 min 30"], [120, "2 min"], [180, "3 min"]].map(([v, l]) => `<button type="button" data-act="orF" data-k="t" data-v="${v}" aria-pressed="${OF.t === v}">${l}</button>`).join("")}</div></div>
      <button class="btn primary" data-act="orStart">${ICON.talk}Lancer l'oral blanc</button>
    </div>
    ${hist.length ? `<div class="or-hist"><b>Tes derniers oraux</b>${hist.map(o => `<span class="pill ${o.pc >= 60 ? "ok" : "ko"}">${h(o.e === "mix" ? "E6 + E7" : o.e)} · ${o.pc} % · ${new Date(o.d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>`).join("")}</div>` : ""}
  </section>
  <section class="stack">
    <div class="sec-head"><h2>Préparer mes situations</h2><p>Le jury part de tes situations du passeport professionnel. Rédige chacune avec cette trame en 7 points : tu sauras la présenter en 5 minutes.</p></div>
    <div class="sit-list">${sits.map((x, i) => `<button class="sit-card" data-act="sitOpen" data-i="${i}"><span class="mini">${h(x.p || "")}</span><b>${h(x.t || "Situation sans titre")}</b><span class="muted">${ORAL_TRAME.filter(([k]) => (x.f || {})[k]).length} sur ${ORAL_TRAME.length} rubriques remplies</span></button>`).join("")}
      <button class="sit-card add" data-act="sitNew">+ Nouvelle situation</button></div>
    ${OSIT != null && sits[OSIT] ? sitForm(sits[OSIT], OSIT) : ""}
  </section>`;
}
let OSIT = null;
function sitForm(x, i) {
  x.f = x.f || {};
  return `<div class="sit-form" id="sitForm">
    <div class="sit-row"><label>Titre<input class="pf-in" data-sit="t" value="${h(x.t || "")}" placeholder="Ex. : rapprochement bancaire de mars"></label>
    <label>Processus<select class="pf-in" data-sit="p">${["", "P1", "P2", "P3", "P4", "P5", "P6", "P7"].map(p => `<option${x.p === p ? " selected" : ""}>${p}</option>`).join("")}</select></label></div>
    ${ORAL_TRAME.map(([k, hint]) => `<label class="sit-f"><b>${h(k)}</b><span class="muted">${h(hint)}</span><textarea class="ex-text" rows="2" data-sitf="${h(k)}">${h(x.f[k] || "")}</textarea></label>`).join("")}
    <div class="row"><button class="btn" data-act="sitClose">Fermer</button><button class="btn" data-act="sitDel" data-i="${i}">Supprimer</button><button class="btn primary" data-act="sitTrain" data-i="${i}">S'entraîner sur cette situation</button></div>
    <p class="muted small">Enregistré automatiquement.</p>
  </div>`;
}
function oralStart(only) {
  const pool = (only ? ORAL.filter(x => x.c === only || x.c === "me") : ORAL.filter(x => OF.e === "mix" || x.e === OF.e)).filter(x => !lockedCat(x.c));
  const gen = shuffle(pool.filter(x => x.c === "me")).slice(0, 1), rest = shuffle(pool.filter(x => x.c !== "me"));
  const list = gen.concat(rest).slice(0, OF.n).map(q => ({ q, ck: {}, done: false }));
  OR = { list, i: 0, end: Date.now() + OF.t * 1000, t: OF.t, e: only ? "Situation" : OF.e };
  go("oral");
}
function oralTimer() {
  clearInterval(orTick);
  orTick = setInterval(() => {
    if (view !== "oral" || !OR) { clearInterval(orTick); return; }
    const el = document.getElementById("orTime"), cur = OR.list[OR.i]; if (!el || cur.done) return;
    const left = Math.max(0, Math.round((OR.end - Date.now()) / 1000));
    el.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
    el.parentNode.classList.toggle("low", left <= 20); if (left === 20) tone("warn"); secTick(left * 1000, "or" + OR.i);
    const bar = document.getElementById("orBar"); if (bar) bar.style.width = (100 - left / OR.t * 100) + "%";
    if (!left) { cur.done = true; buzz([40, 60, 40]); render(); }
  }, 250);
}
function vOral() {
  if (!OR) return vExHome();
  if (OR.i >= OR.list.length) return oralEnd();
  const cur = OR.list[OR.i], q = cur.q, c = CAT[q.c] || CAT.me;
  setTimeout(oralTimer, 0);
  const left = Math.max(0, Math.round((OR.end - Date.now()) / 1000));
  return `<section class="runner or-run" style="${hueStyle(q.c)}">
    <div class="runner-top"><span class="progress-text"><button class="quit" data-act="orQuit" aria-label="Quitter l'oral">✕</button>Question ${OR.i + 1} / ${OR.list.length}</span><span class="ep">${h(q.e)} · ${h(c.code)} ${h(c.name)}</span></div>
    <div class="qcard">
      <span class="eyebrow">Le jury te demande :</span>
      <p class="qtext or-q">« ${h(q.q)} »</p>
      ${cur.done ? `<div class="or-ck"><b>Coche ce que tu as dit :</b>${q.pts.map((p, j) => `<label><input type="checkbox" data-orck="${j}" ${cur.ck[j] ? "checked" : ""}><span>${h(p)}</span></label>`).join("")}</div>
        <p class="or-piege"><b>Ce que le jury guette :</b> ${h(q.piege)}</p>
        ${'<button class="rep-btn" data-act="report" data-t="o" data-id="' + h(q.e + "-" + q.c + "-" + ORAL.indexOf(q)) + '" data-l="' + h(q.q.slice(0, 140)) + '">Signaler une erreur</button>'}`
      : `<div class="or-clock"><span class="or-time" id="orTime">${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span><span class="muted">Réponds à voix haute, comme devant le jury. Fais des phrases complètes et donne un exemple de ta structure.</span><div class="bar"><i id="orBar" style="width:${100 - left / OR.t * 100}%"></i></div></div>`}
    </div>
    <div class="row">${cur.done ? `<button class="btn primary" data-act="orNext">${OR.i === OR.list.length - 1 ? "Voir le bilan" : "Question suivante"}</button>` : `<button class="btn primary" data-act="orDone">J'ai fini de répondre</button>`}</div>
  </section>`;
}
function oralEnd() {
  clearInterval(orTick);
  const sc = OR.list.map(x => Object.values(x.ck).filter(Boolean).length / x.q.pts.length), pc = Math.round(sc.reduce((a, b) => a + b, 0) / sc.length * 100);
  if (!OR.saved) { OR.saved = 1; S.or = S.or || []; S.or.push({ d: Date.now(), e: OR.e, pc }); if (S.or.length > 30) S.or.shift();
    S.xp += Math.round(OR.list.length * 4 * pc / 100); const dl = dayLog(); dl.e++; dl.x = (dl.x || 0) + 1; bumpStreak(); touch(); }
  const weak = OR.list.filter((x, i) => sc[i] < .5);
  return `<section class="runner">
    <div><span class="eyebrow">Oral blanc terminé</span><h1>${pc} % des éléments attendus</h1></div>
    <p class="muted">${pc >= 75 ? "Très solide : le jury aurait eu ses réponses. Entraîne-toi maintenant à être plus concis." : pc >= 50 ? "Correct, mais il manque des éléments clés : reprends les questions ci-dessous." : "Les bases manquent encore : relis les fiches des processus concernés avant le prochain oral."}</p>
    <div class="or-sum">${OR.list.map((x, i) => `<div class="or-it${sc[i] < .5 ? " ko" : ""}"><span class="mini">${h(x.q.e)} · ${h((CAT[x.q.c] || CAT.me).code)}</span><b>${h(x.q.q)}</b><span>${Math.round(sc[i] * 100)} % · ${Object.values(x.ck).filter(Boolean).length} sur ${x.q.pts.length}</span>${sc[i] < 1 ? `<ul>${x.q.pts.filter((_, j) => !x.ck[j]).map(p => `<li>${h(p)}</li>`).join("")}</ul>` : ""}</div>`).join("")}</div>
    <div class="row"><button class="btn primary" data-act="orAgain">Nouvel oral blanc</button>${weak.length ? `<button class="btn" data-act="orRedo">Refaire les ${weak.length} question${weak.length > 1 ? "s" : ""} ratée${weak.length > 1 ? "s" : ""}</button>` : ""}<button class="btn" data-act="orBack">Retour</button></div>
  </section>`;
}
/* ---------- Packs contrôle : matière, chapitres, thème ---------- */
const nz = t => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
let PB = null, PK = null;
function kwList(kw) { return String(kw || "").split(/[,;]/).map(nz).map(x => x.trim()).filter(x => x.length >= 2).map(w => w.includes(" ") || w.length <= 5 ? w : w.slice(0, Math.max(4, w.length - 5))); }
function kwHit(kw, ...txt) { const k = kwList(kw); if (!k.length) return true; const t = nz(txt.join(" ")); return k.some(w => t.includes(w)); }
/* Points précis d'un chapitre = ses parties de fiche ; une question en fait partie si elle partage assez de mots-clés avec la partie */
const SECTOK = {};
function secTok(chid, i) { const k = chid + "|" + i; if (!SECTOK[k]) { const c = CHID[chid], sct = c && c.sections && c.sections[i]; SECTOK[k] = new Set(sct ? hintTokens(sct.h + " " + JSON.stringify(sct.b).replace(/["\[\],]/g, " ")) : []); } return SECTOK[k]; }
function inSecs(p, chid, ...txt) {
  const secs = (p.secs || []).filter(x => x.split("|")[0] === chid); if (!secs.length) return true;
  const tw = hintTokens(txt.join(" ")); return secs.some(x => { const T = secTok(chid, +x.split("|")[1]); let n = 0; tw.forEach(w => { if (T.has(w)) n++; }); return n >= 2; });
}
/* Exercices d'un contrôle : mots-clés de chaque exercice, chapitre le plus proche, réussite */
const EXTOK = {};
/* Rattachement explicite des exercices aux fiches (le calcul automatique se trompait sur ceux-ci) */
const EXCH = { "g:p3rd": "p3c2", "g:p3rf": "p3c2", "g:p3exig": "p3c1", "g:p3tva": "p3c1", "g:p2rl": "p2c5", "g:p2dout": "p2c3", "g:p2prov": "p2c3", "g:p6ratios": "p6c3", "g:p6levier": "p6c3", "g:p7sql": "p7c2", "g:p5mod": "p5c4", "g:p4lic": "p4c1",
  "x:tvadec": "p1c3", "x:htttc": "p1c3", "x:coef": "p1c2", "x:agios": "p1c5", "x:cession": "p2c2", "x:depcli": "p2c3", "x:ca12": "p3c1", "x:amvp": "p3c2", "x:dcli": "p6c3", "s:sc-tva-reg": "p3c1", "s:sc-dsn": "p4c5" };
/* Partie de la fiche sous laquelle placer l'exercice, quand le calcul automatique ne suffit pas */
const EXSEC = { "g:p3rd": "principales corrections", "g:p3rf": "principales corrections", "g:p3is": "Les déficits", "x:rfisc": "principales corrections", "x:amvp": "principales corrections", "s:sc-is": "Le principe", "g:p3exig": "Base d'imposition", "s:sc-tva-exig": "Base d'imposition", "g:p3tva": "Régimes et obligations", "s:sc-tva-reg": "Régimes et obligations", "x:ca12": "Régimes et obligations", "x:htttc": "Le mécanisme", "g:p2rl": "affectation", "g:p6fonc": "La structure" };
function exInfo(key) {
  if (EXTOK[key]) return EXTOK[key];
  const [pre, id] = [key.slice(0, 1), key.slice(2)]; let t = "", cat = "", label = "", ch = "";
  if (pre === "x") { const g = CXBY[id]; if (g) { t = g.t + " " + (g.make().hint || ""); cat = g.cat; label = g.t; } }
  else if (pre === "s") { const x = SCHBY[id]; if (x) { t = x.title + " " + x.idee + " " + x.rows.map(r => r.n.map(n => n[0]).join(" ")).join(" "); cat = x.cat; label = x.title; } }
  else if (pre === "g") { const g = GENS.find(z => z.id === id); if (g) { t = g.title; cat = g.cat; label = g.title; } }
  else if (pre === "k") { const k = GCASES.find(z => z.id === id); if (k) { t = k.title + " " + (k.enonce || "") + " " + (k.question || ""); cat = k.cat; label = k.title; ch = k.ch; } }
  const tok = new Set(hintTokens(t)); if (EXCH[key]) ch = EXCH[key];
  if (!ch && cat) { let best = 0; (CHBY[cat] || []).forEach(c => { const T = new Set(hintTokens(c.title + " " + c.idee + " " + (c.sections || []).map(x => x.h).join(" "))); let n = 0; tok.forEach(w => { if (T.has(w)) n++; }); if (n > best) { best = n; ch = c.id; } }); }
  return EXTOK[key] = { tok, cat, label, ch, pre, id };
}
function exDone(key) {
  const e = exInfo(key);
  if (e.pre === "x") { const r = (S.cx || {})[e.id]; return !!(r && r[0] >= 5 && r[1] / r[0] >= .7); }
  if (e.pre === "s") { const r = (S.sch || {})[e.id]; return !!(r && Math.max(r.t || 0, r.c || 0) >= 80); }
  if (e.pre === "g") { const r = (S.x || {})[e.id]; return !!(r && r[1] >= 70); }
  if (e.pre === "k") { const k = GCASES.find(z => z.id === e.id), st = (S.gc || {})[e.id]; return !!(k && st && st.ok && Object.keys(st.ok).length >= k.steps.length); }
  return false;
}
function exMatch(ex, ...txt) { const tw = hintTokens(txt.join(" ")); return ex.some(k => { const T = exInfo(k).tok; let n = 0; tw.forEach(w => { if (T.has(w)) n++; }); return n >= 2; }); }
function packData(p) {
  const chs = p.chs || [], inCh = k => !chs.length || chs.includes(k);
  const qs = QS.filter(x => x.c === p.cat && inCh(chKey(x)) && kwHit(p.kw, x.q, x.e, x.o && x.o[0]) && inSecs(p, chKey(x), x.q, x.o && x.o[0], x.e));
  let fs = FS.filter(x => x.c === p.cat && inCh(chKey(x)) && kwHit(p.kw, x.f, x.b, x.m) && inSecs(p, chKey(x), x.f, x.b));
  let focusEx = false;
  if ((p.ex || []).length) { const q2 = qs.filter(x => exMatch(p.ex, x.q, x.o && x.o[0], x.e)); if (q2.length >= 5) { qs.length = 0; qs.push(...q2); fs = fs.filter(x => exMatch(p.ex, x.f, x.b)); focusEx = true; } }
  const fiches = (chs.length ? chs : (CHBY[p.cat] || []).map(c => c.id)).filter(id => CHID[id] && (chs.length || !kwList(p.kw).length || kwHit(p.kw, CHID[id].title, CHID[id].idee)));
  const gens = GENS.filter(g => g.cat === p.cat && (kwList(p.kw).length ? kwHit(p.kw, g.title) : true));
  const cases = (GCBY[p.cat] || []).filter(k => inCh(k.ch) && kwHit(p.kw, k.title, k.enonce));
  const oral = ORAL.filter(o => o.c === p.cat && kwHit(p.kw, o.q, o.pts.join(" ")));
  const ex = p.ex || [], pick = (pre, id) => ex.includes(pre + ":" + id);
  let cx = [], sch = [], g2 = gens, k2 = cases;
  if (ex.length) { g2 = GENS.filter(g => pick("g", g.id)); k2 = GCASES.filter(k => pick("k", k.id)); cx = CXG.filter(g => pick("x", g.id)); sch = SCH.filter(x => pick("s", x.id)); }
  return { qs, fs, fiches, gens: g2, cases: k2, cx, sch, oral, chosen: !!ex.length, focusEx };
}
function packName(p) { return p.name || (CAT[p.cat].code + (p.kw ? " · " + p.kw : (p.chs || []).length === 1 && CHID[p.chs[0]] ? " · " + CHID[p.chs[0]].title : "")); }
function packReady(p, d) { d = d || packData(p); const n = d.qs.length + d.fs.length; const ok = d.qs.filter(x => qState(x.id) >= 2).length + d.fs.filter(x => cState(x.id) >= 2).length, w = d.qs.filter(x => S.q[x.id] && S.q[x.id][2] === 1).length;
  const qr = n ? Math.min(1, (ok + w * .5) / n) : 0, ex = p.ex || []; if (!ex.length) return Math.round(qr * 100);
  const er = ex.filter(exDone).length / ex.length; return Math.round((n ? (qr + er) / 2 : er) * 100); }
function daysTo(date) { if (!date) return null; const t = new Date(date + "T08:00:00"); return Math.ceil((t - new Date()) / 864e5); }
function packHome() {
  const packs = S.packs || [];
  return `<section class="stack">
    <div class="sec-head"><h2>Préparer un contrôle</h2><p>Choisis la matière, les chapitres et, si tu veux, un thème précis : l'appli te prépare tout : fiches, quiz, cartes, exercices et un contrôle blanc.</p></div>
    ${packs.length ? `<div class="pk-list">${packs.map((p, i) => { const d = packData(p), r = packReady(p, d), dt = daysTo(p.date), last = (p.hist || []).slice(-1)[0];
      return `<button class="pk-card" style="${hueStyle(p.cat)}" data-act="pkOpen" data-i="${i}"><span class="tabcode">${h(CAT[p.cat].code)}</span><b>${h(packName(p))}</b>
        <span class="muted">${d.qs.length} questions · ${d.fs.length} cartes${d.gens.length + d.cases.length ? ` · ${d.gens.length + d.cases.length} exercices` : ""}</span>
        <span class="pk-meta">${dt != null ? `<span class="pill ${dt <= 3 ? "ko" : ""}">${dt > 1 ? `Dans ${dt} jours` : dt === 1 ? "Demain" : dt === 0 ? "Aujourd'hui" : "Passé"}</span>` : ""}${last ? `<span class="pill">Contrôle blanc : ${last.pc} %</span>` : ""}</span>
        <span class="meter"><i style="width:${r}%"></i></span><small>${r} % prêt</small></button>`; }).join("")}</div>` : ""}
    ${PB ? packBuilder() : `<button class="btn primary" data-act="pkNew">+ Nouveau contrôle</button>`}
  </section>`;
}
function packBuilder() {
  const cats = CATS.filter(c => (QBY[c.id] || []).length && !lockedCat(c.id)), p = PB;
  const d = p.cat ? packData(p) : null, chList = p.cat ? (CHBY[p.cat] || []).filter(c => (QCH[c.id] || []).length || FS.some(x => x.ch === c.id)) : [];
  return `<div class="pk-build" id="pkBuild">
    <h3>Nouveau contrôle</h3>
    <div><div class="label">1. Matière</div><div class="picker">${cats.map(c => `<button class="chip" data-act="pbCat" data-c="${c.id}" aria-pressed="${p.cat === c.id}"><span class="mono">${h(c.code)}</span>${h(c.name)}</button>`).join("")}</div></div>
    ${p.cat ? `<div><div class="label">2. Chapitres <span class="muted">(aucun coché = toute la matière)</span></div>
      <div class="pk-chs">${chList.map(c => `<label><input type="checkbox" data-pbch="${c.id}" ${p.chs.includes(c.id) ? "checked" : ""}><span>${h(c.title)}</span></label>`).join("")}</div></div>
    ${pbExList(p)}
    <label class="pk-f"><span class="label">4. Thème précis <span class="muted">(facultatif : un ou plusieurs mots séparés par des virgules)</span></span><input class="pf-in" id="pbKw" value="${h(p.kw)}" placeholder="Ex. : réintégration, déduction, amende"></label>
    <div class="pk-row"><label class="pk-f"><span class="label">Nom du contrôle</span><input class="pf-in" id="pbName" value="${h(p.name)}" placeholder="${h(packName(p))}"></label>
      <label class="pk-f"><span class="label">Date du contrôle <span class="muted">(facultatif)</span></span><input class="pf-in" id="pbDate" type="date" value="${h(p.date)}"></label></div>
    <div class="pk-prev" id="pbPrev">${packPreview(d)}</div>
    <div class="row"><button class="btn" data-act="pbCancel">Annuler</button><button class="btn primary" data-act="pbSave" ${d && (d.qs.length || d.fs.length) ? "" : "disabled"}>Créer le contrôle</button></div>` : ""}
  </div>`;
}
function pbExList(p) {
  const chs = p.chs || [], ex = p.ex || [];
  const all = [].concat(CXG.filter(g => g.cat === p.cat).map(g => "x:" + g.id), SCH.filter(x => x.cat === p.cat).map(x => "s:" + x.id), GENS.filter(g => g.cat === p.cat).map(g => "g:" + g.id), (GCBY[p.cat] || []).map(k => "k:" + k.id));
  if (!all.length) return "";
  const kind = { x: "Calcul express", s: "Schéma", g: "Exercice chiffré", k: "Exercice guidé" };
  const row = key => { const e = exInfo(key); return `<label class="pk-ex"><input type="checkbox" data-pbex="${key}" ${ex.includes(key) ? "checked" : ""}><span><b>${h(e.label)}</b><small>${kind[e.pre]}${exDone(key) ? " · ✓ déjà réussi" : ""}</small></span></label>`; };
  const groups = chs.length ? chs.map(id => ({ t: CHID[id] ? CHID[id].title : id, list: all.filter(k => exInfo(k).ch === id) })).concat([{ t: "Autres exercices de la matière", list: all.filter(k => !chs.includes(exInfo(k).ch)), more: true }]) : [{ t: "", list: all }];
  return `<div class="pk-exbox"><div class="label">3. Les exercices sur lesquels tu seras évalué <span class="muted">(facultatif)</span></div>
    <p class="muted small" style="margin:4px 0 0">Coche-les : les questions, les cartes et le pourcentage « prêt » se concentrent alors sur eux.${ex.length ? ` <b>${ex.length} choisi${ex.length > 1 ? "s" : ""}.</b>` : ""}</p>
    ${groups.filter(g => g.list.length).map(g => g.more ? `<details class="pk-exg"><summary class="pk-ext">${h(g.t)} (${g.list.length})</summary>${g.list.map(row).join("")}</details>` : `<div class="pk-exg">${g.t ? `<span class="pk-ext">${h(g.t)}</span>` : ""}${g.list.map(row).join("")}</div>`).join("")}
  </div>`;
}
function packPreview(d) {
  if (!d) return "";
  return `<b>Pour ce contrôle :</b> ${d.fiches.length} fiche${d.fiches.length > 1 ? "s" : ""} · ${d.qs.length} question${d.qs.length > 1 ? "s" : ""} · ${d.fs.length} carte${d.fs.length > 1 ? "s" : ""} · ${d.gens.length + d.cases.length + (d.cx || []).length + (d.sch || []).length} exercice${d.gens.length + d.cases.length + (d.cx || []).length + (d.sch || []).length > 1 ? "s" : ""}${d.chosen ? " choisis" : ""}${d.oral.length ? ` · ${d.oral.length} question${d.oral.length > 1 ? "s" : ""} d'oral` : ""}${!d.qs.length && !d.fs.length ? `<br><span class="muted">Aucune question ne correspond : élargis les chapitres ou change le thème.</span>` : ""}`;
}
const onSite = () => typeof window.GL_GUEST === "boolean";
function icsEsc(t) { return String(t).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
function icsFold(l) { const o = []; while (l.length > 70) { o.push(l.slice(0, 70)); l = " " + l.slice(70); } o.push(l); return o.join("\r\n"); }
function icsInfo(p) {
  const c = CAT[p.cat], d = String(p.date).replace(/-/g, ""), d2 = new Date(p.date + "T12:00:00"); d2.setDate(d2.getDate() + 1);
  const end = d2.getFullYear() + String(d2.getMonth() + 1).padStart(2, "0") + String(d2.getDate()).padStart(2, "0");
  const title = "Contrôle " + (p.name ? c.code + " : " + p.name : ": " + packName(p));
  const chs = (p.chs || []).map(id => CHID[id] ? CHID[id].title : "").filter(Boolean);
  const desc = c.name + (chs.length ? "\nChapitres : " + chs.join(", ") : "") + (p.kw ? "\nThème : " + p.kw : "") + "\nRévise-le dans le Grand Livre : S'entraîner › Préparer un contrôle.";
  return { d, end, title, desc };
}
function icsFile(i) {
  const p = (S.packs || [])[i]; if (!p || !p.date) return;
  const x = icsInfo(p), uid = "gl-ctl-" + (p.id || i) + "-" + x.d + "@grand-livre";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Grand Livre BTS CG//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
    "UID:" + uid, "DTSTAMP:" + stamp, "DTSTART;VALUE=DATE:" + x.d, "DTEND;VALUE=DATE:" + x.end, "SUMMARY:" + icsEsc(x.title), "DESCRIPTION:" + icsEsc(x.desc), "TRANSP:TRANSPARENT",
    "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc("Demain : " + x.title + ". Dernière révision !"), "TRIGGER:-PT6H", "END:VALARM",
    "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsEsc(x.title + " dans 3 jours : lance le contrôle blanc."), "TRIGGER:-P2DT6H", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR"].map(icsFold).join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" }), url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = ("controle-" + CAT[p.cat].code + "-" + x.d).toLowerCase() + ".ics"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  closeSheet(); toast("Ouvre le fichier pour l'ajouter à ton agenda");
}
function icsSheet(i) {
  const p = (S.packs || [])[i]; if (!p || !p.date) return;
  closeSheet();
  const x = icsInfo(p), g = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(x.title) + "&dates=" + x.d + "/" + x.end + "&details=" + encodeURIComponent(x.desc);
  const el = document.createElement("div"); el.className = "wk-sheet"; el.id = "wkSheet";
  el.innerHTML = `<div class="wk-box" role="dialog" aria-modal="true" aria-labelledby="icsT">
    <button class="wk-x" data-act="wkClose" aria-label="Fermer">×</button>
    <span class="eyebrow">${h(CAT[p.cat].code)} · ${h(new Date(p.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }))}</span><h2 id="icsT">Ajouter le contrôle à mon agenda</h2>
    <p class="muted">${onSite() ? "Avec un rappel la veille à 18 h et un autre trois jours avant." : "Le rappel se règle dans ton agenda après l'ajout."}</p>
    <div class="ics-list">
      ${onSite() ? `<button class="btn primary" data-act="icsFile" data-i="${i}">${ICON.cal}iPhone, Outlook ou autre agenda (fichier .ics)</button>` : ""}
      <a class="btn${onSite() ? "" : " primary"}" href="${h(g)}" target="_blank" rel="noopener">${ICON.cal}Google Agenda</a>
    </div>
  </div>`;
  el.addEventListener("click", e => { if (e.target === el) closeSheet(); });
  document.body.appendChild(el);
}
function vPack() {
  const p = PK != null && (S.packs || [])[PK]; if (!p) { setExTab("ctl"); return vExHome(); }
  const d = packData(p), r = packReady(p, d), dt = daysTo(p.date), c = CAT[p.cat];
  const nRead = d.fiches.filter(ficheRead).length, acq = d.qs.filter(x => qState(x.id) >= 2).length, wrong = d.qs.filter(x => S.q[x.id] && S.q[x.id][2] === 0).length;
  const hist = p.hist || [], exL = p.ex || [];
  const nxt = d.fiches.length && nRead < d.fiches.length ? "f" : exL.length && exL.some(k => !exDone(k)) ? "e" : d.qs.length && acq < d.qs.length * .6 ? "q" : d.fs.length && d.fs.filter(x => cState(x.id) >= 2).length < d.fs.length * .6 ? "c" : d.qs.length >= 5 ? "b" : "";
  const nx = k => nxt === k ? " pk-next" : "";
  return `<section class="pk-page" style="${hueStyle(p.cat)}">
    <div class="runner-top"><button class="crumb" data-act="pkBack">${ICON.back}Contrôles</button>${dt != null ? `<span class="pill ${dt <= 3 ? "ko" : ""}">${dt > 1 ? `Contrôle dans ${dt} jours` : dt === 1 ? "Contrôle demain" : dt === 0 ? "Contrôle aujourd'hui" : "Contrôle passé"}</span>` : ""}</div>
    <div class="pk-hero"><span class="tabcode">${h(c.code)}</span><h1>${h(packName(p))}</h1>
      <p class="muted">${h(c.name)}${(p.chs || []).length ? " · " + p.chs.map(id => CHID[id] ? CHID[id].title + ((p.secs || []).some(x => x.split("|")[0] === id) ? " (" + p.secs.filter(x => x.split("|")[0] === id).map(x => (CHID[id].sections[+x.split("|")[1]] || {}).h).filter(Boolean).join(", ") + ")" : "") : "").join(" · ") : " · toute la matière"}${p.kw ? ` · thème : « ${h(p.kw)} »` : ""}</p>
      <div class="pk-ready"><div class="meter"><i style="width:${r}%"></i></div><span><b>${r} %</b> prêt · ${acq}/${d.qs.length} questions acquises${wrong ? ` · ${wrong} à revoir` : ""}</span></div></div>
    <ol class="pk-steps">
      ${d.fiches.length ? `<li class="${nx("f")}"><div><b>${ICON.book}Relire</b><span>${nRead} fiche${nRead > 1 ? "s" : ""} lue${nRead > 1 ? "s" : ""} sur ${d.fiches.length}</span></div><div class="pk-btns">${d.fiches.map(id => `<button class="btn small${ficheRead(id) ? "" : " primary"}" data-act="fichePeek" data-id="${id}" data-hint="${h((p.secs || []).filter(x => x.split("|")[0] === id).map(x => (CHID[id].sections[+x.split("|")[1]] || {}).h || "").join(" "))}">${ficheRead(id) ? "✓ " : ""}${h(CHID[id].title)}</button>`).join("")}</div></li>` : ""}
      ${d.qs.length ? `<li class="${nx("q")}"><div><b>${ICON.cards}S'entraîner aux questions</b><span>${d.qs.length} questions pour ce contrôle</span></div><div class="pk-btns"><button class="btn small primary" data-act="pkQuiz" data-n="10">Quiz de 10</button>${d.qs.length > 10 ? `<button class="btn small" data-act="pkQuiz" data-n="20">Quiz de 20</button>` : ""}<button class="btn small" data-act="pkQuiz" data-n="999">Toutes (${d.qs.length})</button>${wrong ? `<button class="btn small" data-act="pkWrong">Mes ${wrong} erreurs</button>` : ""}</div></li>` : ""}
      ${(() => { const ks = dwKeys(p.cat, p.chs, p.kw), n = ks.reduce((t, k) => t + dwN(k), 0); return ks.length ? `<li><div><b>${ICON.list}Décider et justifier</b><span>D'abord la décision, puis le pourquoi : juste seulement si les deux le sont. Le contrôle blanc en contient aussi.</span></div><div class="pk-btns"><button class="btn small primary" data-act="pkDw">S'entraîner (${Math.min(10, n)})</button></div></li>` : ""; })()}
      ${d.fs.length ? `<li class="${nx("c")}"><div><b>${ICON.cards}Mémoriser</b><span>${d.fs.length} cartes</span></div><div class="pk-btns"><button class="btn small primary" data-act="pkCards">Réviser les cartes</button></div></li>` : ""}
      ${d.gens.length || d.cases.length || d.cx.length || d.sch.length ? `<li class="${d.chosen ? "pk-exam" : ""}${nx("e")}"${d.chosen ? ' style="order:-1"' : ""}><div><b>${ICON.calc}${d.chosen ? "Tes exercices du contrôle" : "Exercices"}</b><span>${d.chosen ? `${(p.ex || []).filter(exDone).length} réussi${(p.ex || []).filter(exDone).length > 1 ? "s" : ""} sur ${(p.ex || []).length} · réussi = 70 % ou plus${d.focusEx ? " · les questions et les cartes du contrôle portent sur ces exercices" : ""}` : "Comme au contrôle : calculs et justifications"}</span></div><div class="pk-btns">${d.cx.map(g => `<button class="btn small${exDone("x:" + g.id) ? "" : " primary"}" data-act="pkCx" data-g="${g.id}">${exDone("x:" + g.id) ? "✓ " : ""}${h(g.t)}</button>`).join("")}${d.sch.map(x => `<button class="btn small${exDone("s:" + x.id) ? "" : " primary"}" data-act="scOpen" data-sid="${x.id}" data-cat="${x.cat}">${exDone("s:" + x.id) ? "✓ " : ""}${h(x.title)}</button>`).join("")}${d.gens.map(g => `<button class="btn small${d.chosen && !exDone("g:" + g.id) ? " primary" : ""}" data-act="exStart" data-gid="${g.id}">${d.chosen && exDone("g:" + g.id) ? "✓ " : ""}${h(g.title)}</button>`).join("")}${d.cases.map(k => `<button class="btn small${d.chosen && !exDone("k:" + k.id) ? " primary" : ""}" data-act="gcase" data-id="${k.id}">${d.chosen && exDone("k:" + k.id) ? "✓ " : ""}${h(k.title)}</button>`).join("")}</div></li>` : ""}
      ${d.qs.length >= 5 ? `<li class="pk-exam${nx("b")}"><div><b>${ICON.clock}Contrôle blanc</b><span>${Math.min(15, d.qs.length)} questions chronométrées, sans correction avant la fin.${hist.length ? ` Dernier : <b>${hist[hist.length - 1].pc} %</b>${hist.length > 1 ? ` (avant : ${hist[hist.length - 2].pc} %)` : ""}.` : ""}</span></div><div class="pk-btns"><button class="btn small primary" data-act="pkExam">Lancer le contrôle blanc</button></div></li>` : ""}
      ${d.oral.length ? `<li><div><b>${ICON.talk}À l'oral</b><span>${d.oral.length} question${d.oral.length > 1 ? "s" : ""} du jury sur ce thème</span></div><div class="pk-btns"><button class="btn small" data-act="pkOral">S'entraîner à l'oral</button></div></li>` : ""}
    </ol>
    <div class="row">${p.date && dt != null && dt >= 0 ? `<button class="btn small" data-act="pkIcs">${ICON.cal}Ajouter à mon agenda</button>` : ""}<button class="btn small" data-act="pkEdit">Modifier le contrôle</button><button class="btn small" data-act="pkDel">Supprimer le contrôle</button></div>
  </section>`;
}
/* ---------- Révision express (avant un examen blanc : sujets annoncés et incontournables) ---------- */
let RXI = null, RXEP = "";
const rxItems = () => (typeof RX !== "undefined" && RX && RX.items ? RX.items.filter(it => !lockedCat(it.cat) && !(it.need && !it.need.some(id => CHID[id]))) : []);
function rxOn() { if (typeof RX === "undefined" || !RX) return false; const e = daysTo(RX.to), s = daysTo(RX.from); return e != null && e >= 0 && s != null && s <= 21; }
function rxResolve(keys, pool) { return (keys || []).map(k => k.charAt(0) === "@" ? pool.find(x => (x.q || x.f) === k.slice(1)) : pool.find(x => x.id === k)).filter(Boolean); }
function rxQs(it) { const a = rxResolve(it.q, QS), b = it.qch ? QS.filter(x => it.qch.includes(x.ch) && !a.includes(x)) : []; return a.concat(b); }
function rxFs(it) { const a = rxResolve(it.f, FS), b = it.qch ? FS.filter(x => it.qch.includes(x.ch) && !a.includes(x)) : []; return a.concat(b); }
function rxPick(it) { // 10 questions au plus : d'abord les ratées, puis les jamais faites, puis le reste
  const L = rxQs(it), r = x => { const s = S.q[x.id]; return !s ? 1 : s[2] === 0 ? 0 : 2; };
  return shuffle(L).sort((a, b) => r(a) - r(b)).slice(0, it.q && !it.qch ? L.length : 10);
}
function rxStat(it) {
  const L = rxQs(it), seen = L.filter(x => S.q[x.id]), ok = seen.filter(x => S.q[x.id][2] === 1).length, read = !!(S.rx && S.rx[it.id]);
  const ready = read && (!L.length || (seen.length >= Math.min(6, L.length) && ok / seen.length >= .6));
  return { n: L.length, seen: seen.length, ok, read, ready };
}
function rxEp(ep) { return (RX.eps || []).find(e => e.ep === ep) || { ep, t: (EPREUVES.find(e => e.c === ep) || {}).t || ep }; }
function rxDateTxt() { const s = daysTo(RX.from), e = daysTo(RX.to); return s > 1 ? `dans ${s} jours` : s === 1 ? "demain" : e >= 0 ? "en cours" : "terminés"; }
function persoCoursCards() {
  return Object.values(COURS_META).filter(m => m.perso && COURS[m.id]).map(m => {
    const n = nLessons(m.id); let k = 1, r = 0; for (let i = n; i >= 1; i--) { if (isRead(m.id, i)) r++; else k = i; }
    return `<button class="wk-cta" data-act="lesson" data-cid="${m.id}" data-k="${k}"><span class="wk-ic">${ICON.book}</span><span><b>${h(m.name)}</b><small>Ton cours personnel · ${r} leçon${r > 1 ? "s" : ""} lue${r > 1 ? "s" : ""} sur ${n}</small></span><span class="wk-go">Ouvrir ›</span></button>`;
  }).join("");
}
function rxHomeCard() {
  if (!rxOn()) return "";
  const its = rxItems(); if (!its.length) return "";
  const done = its.filter(it => rxStat(it).ready).length, eps = [...new Set(its.map(it => it.ep))].length;
  return `<button class="wk-cta" data-act="rxOpen"><span class="wk-ic">${ICON.clock}</span><span><b>${h(RX.title)} ${rxDateTxt()} : révision express</b><small>${eps} épreuves, ${its.length} fiches express · ${done} prête${done > 1 ? "s" : ""}</small></span><span class="wk-go">Réviser ›</span></button>`;
}
function rxBtns(it, s, inRead) {
  const b = [];
  if (!inRead) b.push(`<button class="btn small${s.read ? "" : " primary"}" data-act="rxRead" data-id="${it.id}">${ICON.book}L'essentiel</button>`);
  if (s.n) b.push(`<button class="btn small${(s.read || inRead) && !s.ready ? " primary" : ""}" data-act="rxQuiz" data-id="${it.id}">Quiz${s.n > 10 && it.qch ? " de 10" : ` (${s.n})`}</button>`);
  if (it.dw && typeof CTLX !== "undefined" && CTLX[it.dw]) b.push(`<button class="btn small" data-act="dwRun" data-ch="${it.dw}">Décider et justifier</button>`);
  [it.gen, it.gen2].filter(Boolean).forEach(g => { const x = GENS.find(y => y.id === g); if (x) b.push(`<button class="btn small" data-act="exStart" data-gid="${g}">Exercice : ${h(x.title.charAt(0).toLowerCase() + x.title.slice(1))}</button>`); });
  if (it.cx) b.push(`<button class="btn small" data-act="rxCx" data-id="${it.id}">Calcul express</button>`);
  (it.gc || []).forEach(g => { const x = GCASES.find(y => y.id === g); if (x) b.push(`<button class="btn small" data-act="gcase" data-id="${g}">Cas guidé : ${h(x.title)}</button>`); });
  (it.rd || []).forEach(r => { const x = REDACBY[r]; if (x) b.push(`<button class="btn small" data-act="exRedac" data-rid="${r}">Rédaction : ${h(x.title)}</button>`); });
  if (it.oral) b.push(`<button class="btn small" data-act="rxOral" data-e="${it.oral}">Questions du jury ${h(it.oral)}</button>`);
  (it.act || []).forEach(([a, l]) => b.push(`<button class="btn small" data-act="${a}">${h(l)}</button>`));
  if (rxFs(it).length) b.push(`<button class="btn small" data-act="rxCards" data-id="${it.id}">Cartes (${Math.min(20, rxFs(it).length)})</button>`);
  (it.les || []).forEach(([c, k, l]) => { if (COURS[c] && k <= nLessons(c)) b.push(`<button class="btn small" data-act="lesson" data-cid="${c}" data-k="${k}">${h(l || "La leçon")}</button>`); });
  if (it.ch && CHID[it.ch]) b.push(`<button class="btn small" data-act="fiche" data-id="${it.ch}">La fiche complète</button>`);
  (it.fiches || []).forEach(([id, l]) => { if (CHID[id]) b.push(`<button class="btn small" data-act="fiche" data-id="${id}">Fiche : ${h(l)}</button>`); });
  return b.join("");
}
function vRx() {
  const its = rxItems();
  if (!its.length) return `<section class="pk-page"><div class="runner-top"><button class="crumb" data-nav="home">${ICON.back}Accueil</button></div><p class="muted">Aucune révision express en ce moment.</p></section>`;
  const order = (RX.eps || []).map(e => e.ep), eps = [...new Set(its.map(it => it.ep))].sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
  const row = it => { const s = rxStat(it), c = CAT[it.cat];
    const info = [c && it.cat !== "me" ? h(c.code) : "", it.annonce ? "<b>sujet annoncé</b>" : "", s.read ? "essentiel lu" : `essentiel : ${it.min || 3} min`, s.n ? (s.seen ? `${s.ok}/${s.seen} réussies (${s.n} questions)` : `${s.n} questions`) : "", s.ready ? "<b>prêt</b>" : ""].filter(Boolean).join(" · ");
    return `<li style="${hueStyle(it.cat)}"${it.annonce ? ' class="pk-next"' : ""}><div><b>${h(it.t)}</b><span>${info}</span></div><div class="pk-btns">${rxBtns(it, s)}</div></li>`; };
  if (RXEP && !eps.includes(RXEP)) RXEP = "";
  const nav = `<button class="chip" data-act="rxJump" data-ep="" aria-pressed="${!RXEP}">Tout</button>` + eps.map(ep => { const w = (rxEp(ep).when || "").split(" ")[0]; return `<button class="chip" data-act="rxJump" data-ep="${ep}" aria-pressed="${RXEP === ep}">${w ? h(w.slice(0, 3)) + " · " : ""}${h(ep)}</button>`; }).join("");
  return `<section class="pk-page">
    <div class="runner-top"><button class="crumb" data-nav="home">${ICON.back}Accueil</button><span class="pill ${daysTo(RX.from) <= 3 ? "ko" : ""}">${h(RX.title)} ${rxDateTxt()}</span></div>
    <div class="pk-hero"><h1>Révision express</h1><p class="muted">${h(RX.intro || "")}</p>
      <p class="muted small">Pour chaque fiche : lis l'essentiel, fais le quiz, puis un exercice. Elle est « prête » quand l'essentiel est lu et que tu réussis au moins 60 % des questions faites.</p>
      <div class="picker">${nav}</div></div>
    ${eps.filter(ep => !RXEP || ep === RXEP).map(ep => { const e = rxEp(ep), L = its.filter(it => it.ep === ep).sort((a, b) => (b.annonce ? 1 : 0) - (a.annonce ? 1 : 0)), r = L.filter(it => rxStat(it).ready).length;
      return `<div class="stack" id="rx-${ep}"><div class="sec-head"><h2 class="grp-title">${h(ep)} · ${h(e.t)}</h2><p>${e.when ? h(e.when) + " · " : ""}${r}/${L.length} prête${r > 1 ? "s" : ""}</p></div><ol class="pk-steps">${L.map(row).join("")}</ol></div>`; }).join("")}
  </section>`;
}
function vRxRead() {
  const it = rxItems().find(x => x.id === RXI); if (!it) return vRx();
  const c = CAT[it.cat], s = rxStat(it), e = rxEp(it.ep);
  return `<div class="reader" style="${hueStyle(it.cat)}"><article class="lesson">
    <div class="runner-top"><button class="crumb" data-act="rxOpen">${ICON.back}Révision express</button></div>
    <p class="lesson-meta">${c && it.cat !== "me" ? `<span class="tabcode">${h(c.code)}</span>` : ""}<span>${h(it.ep)} · ${h(e.t)}</span>${it.annonce ? "<span>Sujet annoncé</span>" : ""}<span>${it.min || 3} min de lecture</span></p>
    <h1>${inl(it.t)}</h1>
    <div class="md">${mdBlocks(String(it.md).split("\n"), "rx-" + it.id)}</div>
    <div class="lesson-test"><div><b>À toi maintenant</b><span>${s.n ? "Un quiz ciblé, puis un exercice." : "Passe à la pratique."}</span></div><div class="row pk-btns">${rxBtns(it, s, true)}</div></div>
  </article></div>`;
}
/* ---------- Apprendre son oral par cœur (texte découpé en phrases : on devine la suite, puis on la dévoile) ---------- */
let RC = null;
const reciteKeys = () => Object.keys(COURS_META).filter(id => COURS_META[id].script && COURS_META[id].script.length);
const rcNote = t => /^\(/.test(t);
function rcStat(key, ci, li) { return (S.rc || {})[key + "|" + ci + "-" + li]; }
function rcWeak(key) { const sc = COURS_META[key].script, out = []; sc.forEach((c, ci) => c[2].forEach((t, li) => { if (rcNote(t)) return; const r = rcStat(key, ci, li); if (!r || r[2] === 0) out.push(ci + "-" + li); })); return out; }
function rcHint(t) { return t.split(/\s+/).map(w => { const m = w.match(/^([«(]?)(\S)(.*?)([.,;:!?»)]*)$/); return m ? m[1] + m[2] + m[3].replace(/[^\s'’-]/g, "·").slice(0, 3) + m[4] : w; }).join(" "); }
function reciteStart(key, cards, weakOnly) {
  const sc = COURS_META[key].script, weak = weakOnly ? new Set(rcWeak(key)) : null, items = [];
  sc.forEach((c, ci) => { if (cards && !cards.includes(ci)) return; c[2].forEach((t, li) => { if (weak && !rcNote(t) && !weak.has(ci + "-" + li)) return; if (weak && rcNote(t)) return; items.push({ ci, li }); }); });
  if (!items.length) { toast(weakOnly ? "Aucune phrase à revoir : tout est su !" : "Rien à réciter"); return; }
  RC = { key, items, i: 0, shown: false, hint: false, res: [], cards, weakOnly };
  if (rcNote(sc[items[0].ci][2][items[0].li])) RC.shown = true;
  go("recite");
}
function vReciteHome() {
  const key = (RC && RC.key) || reciteKeys()[0]; if (!key) return vCoursList();
  const m = COURS_META[key], sc = m.script, weak = rcWeak(key), tot = sc.reduce((n, c) => n + c[2].filter(t => !rcNote(t)).length, 0);
  return `<section class="pk-page">
    <div class="runner-top"><button class="crumb" data-act="lesson" data-cid="${key}" data-k="1">${ICON.back}${h(m.name)}</button></div>
    <div class="pk-hero"><h1>Apprendre mon oral par cœur</h1>
      <p class="muted">Lis le début, dis la phrase suivante à voix haute, puis touche « Voir la suite » pour vérifier. Réponds honnêtement : les phrases ratées ou jamais récitées restent dans « Phrases pas encore sues ».</p>
      <div class="pk-ready"><div class="meter"><i style="width:${pct(tot - weak.length, tot)}%"></i></div><span><b>${tot - weak.length}/${tot}</b> phrases sues</span></div></div>
    <div class="row"><button class="btn primary" data-act="rcGo" data-key="${key}">Toute la présentation</button><button class="btn" data-act="rcGo" data-key="${key}" data-weak="1" ${weak.length ? "" : "disabled"}>Phrases pas encore sues (${weak.length})</button></div>
    <ol class="pk-steps">${sc.map((c, ci) => { const n = c[2].filter(t => !rcNote(t)).length, ok = n - weak.filter(x => +x.split("-")[0] === ci).length;
      return `<li${ok === n ? "" : ' class="pk-next"'}><div><b>Carte ${h(c[0])}</b><span>${h(c[1])} · ${ok}/${n} phrases sues</span></div><div class="pk-btns"><button class="btn small" data-act="rcGo" data-key="${key}" data-card="${ci}">Réciter cette carte</button></div></li>`; }).join("")}</ol>
  </section>`;
}
function vRecite() {
  if (!RC) return vReciteHome();
  const sc = COURS_META[RC.key].script;
  if (RC.i >= RC.items.length) {
    const ok = RC.res.filter(x => x === true).length, n = RC.res.filter(x => x === true || x === false).length, weak = rcWeak(RC.key).length;
    return `<section class="pk-page"><div class="pk-hero"><h1>${ok === n ? "Récitation parfaite" : "Récitation terminée"}</h1>
      <p class="muted">${ok} phrase${ok > 1 ? "s" : ""} sue${ok > 1 ? "s" : ""} sur ${n}. ${weak ? `Dans toute la présentation, ${weak} phrase${weak > 1 ? "s ne sont" : " n'est"} pas encore sue${weak > 1 ? "s" : ""}.` : "Toute ta présentation est sue."}</p></div>
      <div class="row">${weak ? `<button class="btn primary" data-act="rcGo" data-key="${RC.key}" data-weak="1">Travailler les phrases pas encore sues</button>` : ""}<button class="btn" data-act="rcAgain">Recommencer</button><button class="btn" data-act="rcHome">Choisir une carte</button></div></section>`;
  }
  const cur = RC.items[RC.i], card = sc[cur.ci], t = card[2][cur.li], note = rcNote(t);
  const before = RC.items.slice(0, RC.i).filter(x => x.ci === cur.ci).map(x => { const r = RC.res[RC.items.indexOf(x)]; return `<p class="rc-line${r === false ? " rc-ko" : ""}">${h(card[2][x.li])}</p>`; }).join("");
  const done = RC.items.slice(0, RC.i).length;
  return `<section class="runner rc">
    <div class="runner-top"><span class="progress-text"><button class="quit" data-act="rcHome" aria-label="Arrêter">✕</button>Phrase ${done + 1} / ${RC.items.length}</span><span class="ep">Carte ${h(card[0])} · ${h(card[1])}</span></div>
    <div class="lprog"><i style="width:${pct(done, RC.items.length)}%"></i></div>
    <div class="rc-box">${before}
      ${RC.shown ? `<p class="rc-line rc-cur${note ? " rc-note" : ""}">${h(t)}</p>` : `<button class="rc-mask" data-act="rcShow">${RC.hint ? `<span class="rc-hint">${h(rcHint(t))}</span>` : "Dis la suite à voix haute…"}<small>Touche pour voir la suite</small></button>`}
    </div>
    <div class="row rc-act">${RC.shown
      ? (note ? `<button class="btn primary" data-act="rcNext" data-ok="skip">Continuer</button>` : `<button class="btn primary" data-act="rcNext" data-ok="1">${ICON.check}Je l'avais</button><button class="btn" data-act="rcNext" data-ok="0">À revoir</button>`)
      : `<button class="btn primary" data-act="rcShow">Voir la suite</button>${RC.hint ? "" : `<button class="btn" data-act="rcHint">Indice : premières lettres</button>`}`}</div>
  </section>`;
}
/* ---------- Ma mémoire : ce que tu retiens chapitre par chapitre, et ce qui commence à s'effacer ----------
   Chaque question ou carte déjà travaillée a une « force » : elle baisse avec les jours sans révision,
   d'autant moins vite que tu l'as réussie de nombreux jours différents (courbe de l'oubli). */
const MEM_S = [1, 4, 10, 21, 45, 90]; // jours avant de retomber vers 37 %, selon le nombre de jours réussis
function memQ(id, d) {
  const r = S.q[id]; if (!r || !r[0]) return null; const o = (S.qd || {})[id];
  if (!o || !o.ok.length) return r[2] === 1 ? .35 : .05;
  return Math.exp(-Math.max(0, d - o.ok[o.ok.length - 1]) / MEM_S[Math.min(o.ok.length, 5)]);
}
function memC(id, d) {
  const r = S.c[id]; if (!r) return null; const box = r[0]; if (!box) return .1;
  return Math.exp(-Math.max(0, d - (r[1] - (INTERVALS[box] || 1))) / MEM_S[Math.min(box, 5)]);
}
function memChap(k, off) {
  const d = dayNum() + (off || 0), qs = QCH[k] || [], fs = FCH[k] || []; let s = 0, n = 0;
  qs.forEach(x => { const v = memQ(x.id, d); if (v != null) { s += v; n++; } });
  fs.forEach(x => { const v = memC(x.id, d); if (v != null) { s += v; n++; } });
  const tot = qs.length + fs.length; return { k, n, tot, m: n ? s / n : null };
}
const MEM_LV = [[.8, "Solide", "ok"], [.55, "À entretenir", "mid"], [.3, "S'efface", "warn"], [0, "Presque oublié", "ko"]];
const memLv = m => m == null ? ["Pas encore travaillé", "none"] : MEM_LV.find(x => m >= x[0]).slice(1);
function memChaps(cats) { return CHAP.filter(c => (!cats || cats.includes(c.cat)) && !lockedCat(c.cat) && ((QCH[c.id] || []).length + (FCH[c.id] || []).length)).map(c => Object.assign(memChap(c.id), { c })); }
function memSum(cats, off) {
  const L = memChaps(cats).map(x => off ? Object.assign(memChap(x.k, off), { c: x.c }) : x), w = L.filter(x => x.m != null);
  const tot = w.reduce((a, x) => a + x.n, 0), m = tot ? w.reduce((a, x) => a + x.m * x.n, 0) / tot : null;
  return { L, w, m, fading: w.filter(x => x.m < .55).length, solid: w.filter(x => x.m >= .8).length };
}
/* Séance mémoire : d'abord ce qui est en train de s'effacer (ni neuf, ni déjà perdu), puis le plus oublié */
function memQuizItems(pool, n) {
  const d = dayNum(), sc = x => { const v = memQ(x.id, d); return v == null ? 9 : v < .7 ? (v >= .15 ? v : .7 + v) : 5 + v; };
  return pool.filter(x => memQ(x.id, d) != null && memQ(x.id, d) < .7).sort((a, b) => sc(a) - sc(b)).slice(0, n);
}
function memCardItems(n) { const d = dayNum(); return FS.filter(x => !lockedCat(x.c) && memC(x.id, d) != null && memC(x.id, d) < .7).sort((a, b) => memC(a.id, d) - memC(b.id, d)).slice(0, n); }
let MEMCAT = "";
const memBar = (m, cls) => `<span class="mem-bar ${cls}" role="img" aria-label="Mémoire ${m == null ? "inconnue" : Math.round(m * 100) + " %"}"><i style="width:${m == null ? 0 : Math.max(3, Math.round(m * 100))}%"></i></span>`;
function memRow(x) {
  const [lab, cls] = memLv(x.m), in7 = x.m != null ? memChap(x.k, 7).m : null;
  return `<div class="mem-row"><div class="mem-t"><b>${h(x.c.title)}</b><small>${x.m == null ? `${x.tot} questions et cartes à découvrir` : `${Math.round(x.m * 100)} % · ${lab} · vu ${x.n} sur ${x.tot}${in7 != null && x.m - in7 > .08 ? ` · ${Math.round(in7 * 100)} % dans 7 jours sans révision` : ""}`}</small>${memBar(x.m, cls)}</div>
    <button class="btn small${x.m != null && x.m < .55 ? " primary" : ""}" data-act="memoCh" data-k="${x.k}">${x.m == null ? "Commencer" : "Rafraîchir"}</button></div>`;
}
function memoHomeCard() {
  const s = memSum(); if (!s.w.length) return "";
  const nq = memQuizItems(QS.filter(x => !lockedCat(x.c)), 15).length;
  return `<section class="mem-home"><div><span class="eyebrow">Ma mémoire</span><b>${Math.round(s.m * 100)} % de ce que tu as travaillé est encore en tête</b>
    <p class="muted">${s.fading ? `${s.fading} chapitre${s.fading > 1 ? "s" : ""} commence${s.fading > 1 ? "nt" : ""} à s'effacer.` : "Rien ne s'efface pour l'instant."} ${s.solid} solide${s.solid > 1 ? "s" : ""}.</p></div>
    <div class="row">${nq ? `<button class="btn primary" data-act="memoGo">Séance mémoire (${nq} questions)</button>` : ""}<button class="btn" data-act="memoOpen">Voir ma mémoire</button></div></section>`;
}
function vMemo() {
  const cats = MEMCAT ? [MEMCAT] : null, s = memSum(cats), s7 = memSum(cats, 7), d = dayNum();
  const nq = memQuizItems(QS.filter(x => !lockedCat(x.c) && (!cats || cats.includes(x.c))), 15).length, nc = memCardItems(30).filter(x => !cats || cats.includes(x.c)).length;
  const groups = CATS.filter(c => (!MEMCAT || c.id === MEMCAT) && s.L.some(x => x.c.cat === c.id)).map(c => {
    const L = s.L.filter(x => x.c.cat === c.id).sort((a, b) => (a.m == null) - (b.m == null) || (a.m || 0) - (b.m || 0)), w = L.filter(x => x.m != null);
    const m = w.length ? w.reduce((a, x) => a + x.m * x.n, 0) / w.reduce((a, x) => a + x.n, 0) : null;
    return `<details class="mem-g" style="${hueStyle(c.id)}"${MEMCAT || (w.length && m < .55) ? " open" : ""}><summary><span class="tabcode">${h(c.code)}</span><b>${h(c.name)}</b><span class="muted">${m == null ? "pas encore travaillé" : `${Math.round(m * 100)} % · ${w.length} chapitre${w.length > 1 ? "s" : ""} travaillé${w.length > 1 ? "s" : ""} sur ${L.length}`}</span>${memBar(m, memLv(m)[1])}</summary><div class="mem-list">${L.map(memRow).join("")}</div></details>`;
  }).join("");
  return `<section class="page-head"><h1>Ma mémoire</h1><p class="muted">Ce que tu retiens encore, chapitre par chapitre. Une notion revue juste avant de l'oublier tient beaucoup plus longtemps : la séance mémoire te fait revoir en priorité ce qui commence à s'effacer.</p></section>
    <section class="mem-top">
      <div class="fig"><b>${s.m == null ? "-" : Math.round(s.m * 100) + " %"}</b><span>encore en tête aujourd'hui</span></div>
      <div class="fig"><b>${s7.m == null ? "-" : Math.round(s7.m * 100) + " %"}</b><span>dans 7 jours sans réviser</span></div>
      <div class="fig"><b>${s.fading}</b><span>chapitre${s.fading > 1 ? "s" : ""} qui s'efface${s.fading > 1 ? "nt" : ""}</span></div>
      <div class="fig"><b>${s.solid}</b><span>chapitre${s.solid > 1 ? "s" : ""} solide${s.solid > 1 ? "s" : ""}</span></div>
    </section>
    <div class="row">${nq ? `<button class="btn primary" data-act="memoGo">Séance mémoire : ${nq} questions</button>` : `<button class="btn primary" disabled>Rien ne s'efface pour l'instant</button>`}${nc ? `<button class="btn" data-act="memoCards">Cartes qui s'effacent (${nc})</button>` : ""}</div>
    <div class="picker" role="group" aria-label="Matière"><button class="chip" data-act="memoCat" data-c="" aria-pressed="${!MEMCAT}">Toutes</button>${CATS.filter(c => !lockedCat(c.id) && memChaps([c.id]).length).map(c => `<button class="chip" data-act="memoCat" data-c="${c.id}" aria-pressed="${MEMCAT === c.id}">${h(c.code)}</button>`).join("")}</div>
    ${s.w.length ? "" : `<p class="panel muted">Ta mémoire se remplit au fil des quiz et des cartes : fais quelques quiz, puis reviens ici voir ce que tu retiens.</p>`}
    <section class="stack">${groups}</section>
    <p class="muted small">Estimation à partir de tes réponses : une question réussie sur plusieurs jours différents s'oublie de plus en plus lentement ; une erreur la remet à zéro.</p>`;
}
/* ---------- Après les BTS blancs : tes notes, et ce qu'il faut reprendre ---------- */
function bbSection() {
  const bb = S.bb || {}, rows = EPREUVES.filter(e => e.cats.some(c => CAT[c]));
  const done = rows.filter(e => bb[e.c] && bb[e.c].n != null && bb[e.c].n !== "");
  const todo = done.map(e => ({ e, n: +bb[e.c].n })).filter(x => x.n < 12).sort((a, b) => (12 - b.n) * b.e.k - (12 - a.n) * a.e.k);
  const weak = e => memChaps(e.cats).sort((a, b) => (a.m == null ? .4 : a.m) - (b.m == null ? .4 : b.m)).slice(0, 3);
  return `<section class="stack" id="bbSec"><h2>Mes BTS blancs</h2><p class="muted">Note tes résultats : l'appli te montre les épreuves à reprendre en premier (note basse et gros coefficient) et, pour chacune, les chapitres que tu retiens le moins.</p>
    <div class="sim">${rows.map(e => `<label class="sim-f"><span><b>${e.c}</b> ${h(e.t.split(" : ")[0])}</span><input type="number" min="0" max="20" step="0.25" inputmode="decimal" placeholder="Note" data-bb="${e.c}" value="${h(bb[e.c] && bb[e.c].n != null ? bb[e.c].n : "")}"></label>`).join("")}</div>
    ${done.length ? `<div class="row"><button class="btn small" data-act="bbToSim">Mettre ces notes dans le simulateur</button></div>` : ""}
    ${todo.length ? `<div class="bb-todo">${todo.map(({ e, n }) => `<div class="bb-e"><div class="bb-h"><b>${e.c} · ${h(e.t.split(" : ")[0])}</b><span class="pill ${n < 10 ? "ko" : ""}">${String(n).replace(".", ",")}/20 · coef. ${e.k}</span></div>
      <div class="mem-list">${weak(e).map(memRow).join("")}</div><div class="row"><button class="btn small primary" data-act="bbPlan" data-e="${e.c}">Quiz de reprise ${e.c}</button></div></div>`).join("")}</div>`
      : done.length ? `<p class="panel">Toutes tes notes sont à 12 ou plus : garde le rythme avec la séance mémoire.</p>` : ""}
  </section>`;
}
function bbHomeCard() {
  if (typeof RX === "undefined" || !RX) return ""; const e = daysTo(RX.to); if (e == null || e >= 0 || e < -30) return "";
  const n = Object.values(S.bb || {}).filter(x => x && x.n != null && x.n !== "").length; if (n) return "";
  return `<button class="wk-cta" data-act="bbOpen"><span class="wk-ic">${ICON.check}</span><span><b>BTS blancs terminés</b><small>Note tes résultats : tu verras les épreuves et les chapitres à reprendre en premier.</small></span><span class="wk-go">Noter ›</span></button>`;
}
function auBtns() { const nAu = y => QS.filter(x => x.t && /^au/.test(x.t) && (y === "all" || x.t.includes(y))).length, nAd = y => QS.filter(x => x.t && x.t.startsWith("ad" + y + ":")).length, ser = (n, k) => n > k ? `série de ${k} sur ${n}` : `${n} q.`;
  return `<button class="btn small primary" data-act="auSit" data-yr="1">Notion 1re année <span>${AUSIT.filter(x => x.y.includes("1")).length} notions</span></button> <button class="btn small primary" data-act="auSit" data-yr="2">Notion 2e année <span>${AUSIT.filter(x => x.y.includes("2")).length} notions</span></button> <button class="btn small primary" data-act="auQuiz" data-inc="1" data-yr="1">Incontournables 1re année <span>auteur + définition · ${ser(nAd("1"), 16)}</span></button> <button class="btn small primary" data-act="auQuiz" data-inc="1" data-yr="2">Incontournables 2e année <span>auteur + définition · ${ser(nAd("2"), 16)}</span></button> <button class="btn small" data-act="auQuiz" data-yr="1">Auteurs 1re année <span>${ser(nAu("1"), 15)}</span></button> <button class="btn small" data-act="auQuiz" data-yr="2">Auteurs 2e année <span>${ser(nAu("2"), 15)}</span></button> <button class="btn small" data-act="auQuiz" data-yr="all">Tous les auteurs <span>${ser(nAu("all"), 15)}</span></button> <button class="btn small" data-act="lesson" data-cid="ce" data-k="2">Lire l'index des auteurs</button>`; }
function specialQuizzes() { // les quiz qui ne vivent que dans un cours, regroupés ici
  const nAu = y => QS.filter(x => x.t && /^au/.test(x.t) && (y === "all" || x.t.includes(y))).length, nAd = y => QS.filter(x => x.t && x.t.startsWith("ad" + y + ":")).length;
  const cards = [];
  if (!lockedCat("ce") && nAu("all")) cards.push(`<div class="qf" style="${hueStyle("ce")}"><div class="qf-h"><span class="tabcode">${h(CAT.ce.code)}</span><b>CEJM : les auteurs</b></div><div class="qf-b">${auBtns()}</div></div>`);
  Object.values(COURS_META).filter(m => m.perso && COURS[m.id] && m.chs).forEach(m => { const nq = QS.filter(x => m.chs.includes(x.ch)).length, nf = FS.filter(x => m.chs.includes(x.ch)).length;
    cards.push(`<div class="qf" style="${hueStyle(m.cat)}"><div class="qf-h"><span class="tabcode">${h(m.code)}</span><b>${h(m.name)}</b></div><div class="qf-b">${nq ? `<button class="btn small primary" data-act="chsQuiz" data-chs="${m.chs.join(",")}">Quiz du cours <span>${nq > 15 ? `série de 15 sur ${nq}` : nq + " q."}</span></button>` : ""}${nf ? `<button class="btn small" data-act="chsCards" data-chs="${m.chs.join(",")}">Flashcards <span>${nf}</span></button>` : ""}${m.script ? `<button class="btn small" data-act="reciteHome" data-cid="${m.id}">Oral par cœur</button>` : ""}</div></div>`); });
  if (rxOn()) cards.push(`<div class="qf" style="${hueStyle("p2")}"><div class="qf-h"><b>${h(RX.title)}</b></div><div class="qf-b"><button class="btn small primary" data-act="rxOpen">Révision express <span>quiz par sujet</span></button></div></div>`);
  return cards.length ? `<h3 class="qf-title">Quiz des cours</h3><p class="muted small">Les quiz qu'on lance aussi depuis un cours, rassemblés ici.</p><div class="qf-grid">${cards.join("")}</div>` : "";
}
function vExHome() {
  const n = todayCount(), eps = ["E5", "E4", "E3", "E1"];
  const pool = ANN.filter(a => !ANF.ep || a.ep === ANF.ep), exPool = pool.flatMap(a => a.ex);
  const tagCount = {}; exPool.forEach(x => x.tags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
  if (ANF.tag && !tagCount[ANF.tag]) ANF.tag = "";
  const done = ANNEX.filter(x => annDone(x.id)).length;
  const body = ANF.tag
    ? `<div class="ann-flat">${exPool.filter(x => x.tags.includes(ANF.tag)).sort((a, b) => b.a.year - a.a.year).map(x => annRow(x, true)).join("")}</div>`
    : (() => {
        const all = pool.slice().sort((a, b) => b.year - a.year || eps.indexOf(a.ep) - eps.indexOf(b.ep)), first = ANF.ep ? all : all.slice(0, 6), rest = ANF.ep ? [] : all.slice(6);
        return `<div class="ann-grid">${first.map(annCard).join("")}</div>` + (rest.length ? `<details class="ann-more ann-rest" data-ann="rest"${ANN_OPEN.has("rest") ? " open" : ""}><summary>Voir les ${rest.length} autres sujets (${rest[rest.length - 1].year} à ${rest[0].year})</summary><div class="ann-grid">${rest.map(annCard).join("")}</div></details>` : "");
      })();
  return `<section class="page-head">
      <h1>S'entraîner</h1>
      <p class="muted">Choisis le type d'entraînement : chaque onglet regroupe un format.</p>
    </section>
      ${(() => { const el = errList(), td = el.filter(e => !e.ok).length, wk = weakChaps(5); return `<button class="wk-cta" data-act="goErr"><span class="wk-ic">${ICON.errbook}</span><span><b>Mes erreurs et points faibles</b><small>${el.length ? `${td} question${td > 1 ? "s" : ""} à revoir${wk.length ? ` · ${wk.length} chapitre${wk.length > 1 ? "s" : ""} faible${wk.length > 1 ? "s" : ""} : ${h(chLabel(wk[0].k))}` : ""}` : "Rien pour l'instant : tes erreurs de quiz arriveront ici."}</small></span><span class="wk-go">Ouvrir ›</span></button>`; })()}
    ${exTabs()}
    ${EXT === "quiz" ? `<section class="stack">
      <div class="sec-head"><h2>Quiz et flashcards</h2><p>Toutes matières mélangées, ou une matière précise juste en dessous.</p></div>
      <div class="modes">
        <button class="mode lead-mode" data-act="today" ${n ? "" : "disabled"}><b>Cartes du jour</b><span>${n ? `${n} cartes à revoir, de 5 à 10 minutes.` : "Rien à revoir aujourd'hui."}</span></button>
        <button class="mode" data-act="goQuiz"><b>Quiz corrigé</b><span>${QS.length} questions, expliquées juste après ta réponse.</span></button>
        <button class="mode" data-act="dueQuiz" ${dueQs().length ? "" : "disabled"}><b>Révision des acquis</b><span>${dueQs().length ? `${dueQs().length} question${dueQs().length > 1 ? "s" : ""} à revérifier aujourd'hui.` : "Rien à revérifier aujourd'hui."}</span></button>
        <button class="mode" data-act="memoOpen"><b>Ma mémoire</b><span>Ce que tu retiens par chapitre, et une séance sur ce qui s'efface.</span></button>
        <button class="mode" data-act="goExam"><b>QCM chrono</b><span>20 questions toutes matières en 20 minutes.</span></button>
        <button class="mode" data-act="defi"><b>Défi 60 secondes</b><span>Record actuel : ${(S.df || {}).best || 0}.</span></button>
      </div>
      <div class="row"><button class="btn" data-act="goCards">Flashcards au choix (${FS.length})</button></div>
      ${specialQuizzes()}
      <h3 class="qf-title">Par matière</h3>
      <div class="qf-grid">${CATS.filter(c => (QBY[c.id] || []).length || FS.some(x => x.c === c.id)).map(c => { const nf = FS.filter(x => x.c === c.id).length, nq = (QBY[c.id] || []).length; return `<div class="qf" style="${hueStyle(c.id)}"><div class="qf-h"><span class="tabcode">${h(c.code)}</span><b>${h(c.name)}</b></div><div class="qf-b">${nq ? `<button class="btn small primary" data-act="quickQuiz" data-cat="${c.id}">Quiz <span>${quizLen} q.</span></button>` : ""}${nf ? `<button class="btn small" data-act="flashCat" data-cat="${c.id}">Flashcards <span>${nf}</span></button>` : ""}<button class="btn small qf-ch" data-act="pickChap" data-cat="${c.id}">${chapCount(c.id) ? `${chapCount(c.id)} chapitre${chapCount(c.id) > 1 ? "s" : ""}` : "Chapitres"}</button></div></div>`; }).join("")}</div>
    </section>` : ""}
    ${EXT === "justif" ? `<section class="stack">${dwHome()}</section>` : ""}
    ${EXT === "chiffres" ? `<section class="stack">${cxHome()}${dosSection()}</section>` : ""}
    ${EXT === "annales" ? `<div class="ann-stats"><span class="pill"><b>${ANN.length}</b> sujets</span><span class="pill"><b>${ANNEX.length}</b> exercices</span><span class="pill"><b>${done}</b> faits</span></div><section class="stack">
      <div class="sec-head"><h2>Annales officielles</h2><p>Touche un sujet pour voir ses exercices.</p></div>
      <div class="picker" role="tablist" aria-label="Épreuve">
        <button class="chip" data-act="annEp" data-ep="" aria-pressed="${!ANF.ep}">Toutes</button>
        ${eps.map(e => `<button class="chip" data-act="annEp" data-ep="${e}" aria-pressed="${ANF.ep === e}">${h(epLabel(e))} <span class="muted">${ANN.filter(a => a.ep === e).reduce((s, a) => s + a.ex.length, 0)}</span></button>`).join("")}
      </div>
      <details class="ann-tagbox"${ANF.tag ? " open" : ""}><summary>${ANF.tag ? `Notion : ${h(NOTIONS[ANF.tag][0].split(/[:,(]/)[0].trim())}` : "Filtrer par notion"}</summary><div class="ann-tagbar">${Object.keys(NOTIONS).filter(t => tagCount[t]).map(t => `<button class="chip small" style="${hueStyle(NOTIONS[t][1])}" data-act="annTag" data-tag="${t}" aria-pressed="${ANF.tag === t}">${h(NOTIONS[t][0].split(/[:,(]/)[0].trim())} <span class="muted">${tagCount[t]}</span></button>`).join("")}</div></details>
      ${body}
    </section>
    <p class="muted small">Sujets officiels de l'Éducation nationale, liens vers les sites qui les publient (Comprendre la compta gestion, Compta Online, académie de Lille, Réviser BTS CG). Les corrigés marqués « non officiel » sont rédigés par ces sites.</p>` : ""}
    ${EXT === "guides" ? `<section class="stack">
      <div class="sec-head"><h2>Exercices guidés</h2><p>${GCASES.length} exercices type examen, découpés en étapes avec un corrigé pour chacune.</p></div>
      ${CATS.filter(c => (GCBY[c.id] || []).length).map(c => `<details class="ex-group ann-more gc-more" data-ann="gc-${c.id}"${ANN_OPEN.has("gc-" + c.id) ? " open" : ""} style="${hueStyle(c.id)}"><summary><h3><span class="tabcode">${h(c.code)}</span>${h(c.name)} <span class="muted small">${GCBY[c.id].length} exercice${GCBY[c.id].length > 1 ? "s" : ""}</span></h3></summary><div class="ex-grid">${GCBY[c.id].map(gcCard).join("")}</div></details>`).join("")}
    </section>` : ""}
    ${EXT === "ctl" ? packHome() : ""}
    ${EXT === "schemas" ? schHome() : ""}
    ${EXT === "oraux" ? oralHome() : ""}
    ${EXT === "redac" ? `<section class="stack">
      <div class="sec-head"><h2>Rédactions</h2><p>CEJM, analyse de processus, culture générale : tu rédiges, puis tu compares au corrigé modèle avec une grille d'auto-évaluation.</p></div>
      <div class="ex-grid">${REDAC.map(redCard).join("")}</div>
    </section>` : ""}`;
}
function openAnn(id) {
  const x = ANNEXID[id]; if (!x) return;
  if (lockedCat(annCat(x))) return lockSheet(annCat(x));
  if (ANP.id !== id) ANP = { id, copy: [], ref: [] };
  AX = { id }; annErr = ""; go("annex");
}
function photoStrip(kind) {
  const list = ANP[kind] || [];
  return list.length ? `<div class="ann-photos">${list.map((f, i) => `<figure><img src="${URL.createObjectURL(f)}" alt="Photo ${i + 1}"><button class="ann-x" data-act="annPhotoDel" data-kind="${kind}" data-i="${i}" aria-label="Retirer la photo ${i + 1}">×</button></figure>`).join("")}</div>` : "";
}
function vAnnEx() {
  const x = AX && ANNEXID[AX.id]; if (!x) return vExHome();
  const a = x.a, st = annState(x.id), c = annCat(x), I = EPREUVE_INFO[a.ep], i = a.ex.indexOf(x), pv = a.ex[i - 1], nx = a.ex[i + 1];
  const canImg = !!SAMPLE_IMG, r = st.r;
  const corrBlock = SAMPLE_STATE === "off"
    ? `<div class="panel"><b>Correction automatique indisponible ici.</b><p class="muted">La correction automatique n'est pas activée sur ce site. Tu peux quand même comparer avec le corrigé et marquer l'exercice comme fait.</p><div class="row"><button class="btn" data-act="annDone">${st.d ? "Marqué comme fait" : "Marquer comme fait"}</button></div></div>`
    : `<div class="ann-send">
        <details class="ann-ref"${ANP.ref.length || st.ref ? " open" : ""}><summary>Ajouter le corrigé officiel pour une correction plus précise <span class="muted">(facultatif)</span></summary>
          <p class="muted small">Sans l'énoncé ni le corrigé, la correction ne voit pas les annexes : elle juge surtout ta méthode. Colle ici le passage du corrigé de cette mission${canImg ? ", ou ajoute des photos de l'énoncé et du corrigé" : ""}.</p>
          <textarea class="ex-text" id="annRef" rows="4" placeholder="Corrigé de la mission (copier-coller depuis le PDF)">${h(st.ref || "")}</textarea>
          ${canImg ? `<label class="btn small file-btn">Photos de l'énoncé ou du corrigé<input type="file" accept="${h((SAMPLE_IMG.mediaTypes || ["image/jpeg", "image/png", "image/webp"]).join(","))}" multiple data-photo="ref" hidden></label>${photoStrip("ref")}` : ""}
        </details>
        <div class="row"><button class="btn primary" data-act="annCorrect" ${annBusy ? "disabled" : ""}>${annBusy ? "Correction en cours…" : r ? "Corriger à nouveau" : "Faire corriger ma copie"}</button>${annBusy ? `<button class="btn" data-act="annStop">Arrêter</button>` : ""}<button class="btn" data-act="annDone">${st.d ? "Fait" : "Marquer comme fait"}</button></div>
        ${annBusy ? `<p class="muted ann-wait"><span class="dot"></span>Ta copie est comparée aux attendus. Compte 30 secondes à 2 minutes.</p>` : ""}
        ${annErr ? `<p class="ann-err">${h(annErr)}</p>` : ""}
      </div>`;
  return `<section class="runner ann-ex" style="${hueStyle(c)}">
    <div class="runner-top"><button class="crumb" data-nav="ex">${ICON.back}Annales</button><span class="progress-text">${a.ep === "E1" ? "Partie" : a.ep === "E3" ? "Exercice" : "Mission"} ${x.n} sur ${a.ex.length}</span></div>
    <div class="qcard">
      <span class="eyebrow">${h(epLabel(a.ep))}${I.old ? ` (${I.old})` : ""}, session ${a.year}${a.place !== "Métropole" ? ", " + h(a.place) : ""} : ${h(a.cas)}</span>
      <h1 class="case-title">${h(x.t)}</h1>
      <p class="ann-meta">${x.pts ? `<b>${x.pts} points</b>` : ""}<span>Temps conseillé : ${fmtMin(annMinutes(x))}</span><span class="ann-chrono" id="annChrono">${st.ts ? "Chrono : " + fmtSec(st.ts) : ""}</span></p>
      <div class="ann-links">${a.links.map(([l, u]) => `<a class="btn small" href="${h(u)}" target="_blank" rel="noopener noreferrer">${h(l)}${ICON_EXT}</a>`).join("")}<button class="btn small" data-act="annTimer">${annTimerT ? "Arrêter le chrono" : st.ts ? "Reprendre le chrono" : "Lancer le chrono"}</button></div>
      <h2 class="ann-h">Ce qu'on te demande</h2>
      <ol class="ann-work">${x.w.map(t => `<li>${h(t)}</li>`).join("")}</ol>
      <p class="muted small">Les données chiffrées et les annexes sont dans le sujet : ouvre-le à côté.</p>
      <h2 class="ann-h">Notions à mobiliser</h2>
      <div class="ann-notions">${x.tags.map(t => `<button class="chip" style="${hueStyle(NOTIONS[t][1])}" data-act="annNotion" data-q="${h(NOTIONS[t][2])}">${h(NOTIONS[t][0])}</button>`).join("")}</div>
    </div>
    <div class="qcard">
      <h2 class="ann-h">Ta copie</h2>
      <textarea class="ex-text ann-copy" id="annText" rows="12" placeholder="Rédige ici tes réponses : écritures (date, comptes, débit, crédit, libellé), calculs, explications…">${h(st.t || "")}</textarea>
      ${canImg ? `<div class="row"><label class="btn small file-btn">Ajouter des photos de ta copie papier<input type="file" accept="${h((SAMPLE_IMG.mediaTypes || ["image/jpeg", "image/png", "image/webp"]).join(","))}" multiple data-photo="copy" hidden></label><span class="muted small">${SAMPLE_IMG.maxCount ? `Jusqu'à ${SAMPLE_IMG.maxCount} photos au total.` : ""} Les photos ne sont pas enregistrées.</span></div>${photoStrip("copy")}` : ""}
      ${corrBlock}
      ${annGrid(x, st)}
    </div>
    ${r ? annResult(x, r) : ""}
    <footer class="lesson-foot">${pv ? `<button class="btn" data-act="annOpen" data-id="${pv.id}">${a.ep === "E1" ? "Partie" : "Mission"} précédente</button>` : `<button class="btn" data-nav="ex">Toutes les annales</button>`}
      ${nx ? `<button class="next-card" data-act="annOpen" data-id="${nx.id}"><span>${a.ep === "E1" ? "Partie" : a.ep === "E3" ? "Exercice" : "Mission"} suivante</span><b>${h(nx.t)}</b></button>` : `<button class="next-card" data-nav="ex"><span>Sujet terminé</span><b>Choisir une autre annale</b></button>`}</footer>
  </section>`;
}
const fmtSec = s => { s = Math.round(s); const m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min ${String(s % 60).padStart(2, "0")} s`; };
function annGrid(x, st) {
  const g = st.g || [], n = x.w.length, done = x.w.every((_, i) => g[i] != null), sur = x.pts || 20;
  const sc = x.w.reduce((t, _, i) => t + (g[i] || 0), 0), note = Math.round(sc / (2 * n) * sur * 2) / 2;
  const opts = [[2, "Juste"], [1, "En partie"], [0, "Faux ou pas fait"]];
  return `<details class="ann-gridev"${SAMPLE_STATE !== "ok" || g.length ? " open" : ""}><summary>${ICON.list}Auto-évaluation avec le corrigé ${done ? `<span class="pill ${note >= sur / 2 ? "ok" : "ko"}">${fmtNote(note)} / ${sur}</span>` : `<span class="muted small">${g.filter(v => v != null).length} sur ${n}</span>`}</summary>
    <p class="muted small">Ouvre le corrigé du sujet, puis pour chaque demande indique si ta réponse est juste. Sois exigeant : « juste » veut dire le bon compte, le bon montant et la justification.</p>
    <ol class="ag-list">${x.w.map((t, i) => `<li><span>${h(t)}</span><div class="ag-b" role="group" aria-label="Ma réponse">${opts.map(([v, l]) => `<button class="ag-o v${v}" data-act="agSet" data-i="${i}" data-v="${v}" aria-pressed="${g[i] === v}">${l}</button>`).join("")}</div></li>`).join("")}</ol>
    ${done ? `<div class="ag-res"><b>Environ ${fmtNote(note)} / ${sur}</b>${g.some(v => v < 2) ? `<span class="muted"> · Notions à revoir :</span><div class="ann-notions">${x.tags.map(t => `<button class="chip" style="${hueStyle(NOTIONS[t][1])}" data-act="annNotion" data-q="${h(NOTIONS[t][2])}">${h(NOTIONS[t][0])}</button>`).join("")}</div>` : `<span class="muted"> · Tout est juste, bravo.</span>`}</div>` : ""}
  </details>`;
}
function annResult(x, r) {
  const sur = r.sur || x.pts || 20;
  return `<section class="qcard ann-res">
    <div class="ann-res-head"><div><span class="eyebrow">Correction automatique${r.at ? ", " + h(new Date(r.at).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })) : ""}</span><h2>${r.note != null ? `Environ ${fmtNote(r.note)} / ${sur}` : "Correction"}</h2></div>
      <span class="pill ${r.fiabilite === "haute" ? "ok" : ""}">Fiabilité ${h(r.fiabilite || "moyenne")}</span></div>
    ${r.resume ? `<p>${h(r.resume)}</p>` : ""}
    ${r.reussi && r.reussi.length ? `<div class="ann-ok"><b>Ce qui est juste</b><ul>${r.reussi.map(t => `<li>${h(t)}</li>`).join("")}</ul></div>` : ""}
    ${r.erreurs && r.erreurs.length ? `<div class="ann-errs"><b>Erreurs à revoir</b>${r.erreurs.map(e => `<div class="ann-e ${e.gravite === "majeure" ? "maj" : ""}"><p class="ann-e-h"><span class="pill ${e.gravite === "majeure" ? "ko" : ""}">${e.gravite === "majeure" ? "Majeure" : "Mineure"}</span><b>${h(e.point || "")}</b></p>${e.probleme ? `<p>${h(e.probleme)}</p>` : ""}${e.correction ? `<p class="ann-fix"><b>La bonne démarche :</b> ${h(e.correction)}</p>` : ""}</div>`).join("")}</div>` : ""}
    ${r.a_revoir && r.a_revoir.length ? `<div class="ann-rev"><b>À revoir dans l'appli</b><div class="ann-notions">${r.a_revoir.filter(t => NOTIONS[t]).map(t => `<button class="chip" style="${hueStyle(NOTIONS[t][1])}" data-act="annNotion" data-q="${h(NOTIONS[t][2])}">${h(NOTIONS[t][0])}</button>`).join("")}</div></div>` : ""}
    ${r.conseil ? `<p class="ann-tip"><b>Conseil :</b> ${h(r.conseil)}</p>` : ""}
    <p class="muted small">Correction automatique : elle peut se tromper, surtout sans le corrigé officiel. Vérifie toujours avec le corrigé du sujet.</p>
  </section>`;
}
function annPrompt(x, st, nCopy, nRef) {
  const a = x.a, I = EPREUVE_INFO[a.ep];
  const vig = x.v.map(k => VIG[k] || k);
  const ids = Object.entries(NOTIONS).map(([k, v]) => `${k} = ${v[0]}`).join("\n");
  return `Tu es correcteur de l'épreuve ${a.ep} « ${I.name} » du BTS Comptabilité et Gestion (France). Tu corriges la copie d'un étudiant sur un exercice d'annale officielle, avec bienveillance mais sans complaisance.

ANNALE : session ${a.year}, ${a.place}, cas « ${a.cas} » (${a.desc}).
EXERCICE : ${a.ep === "E1" ? "Partie" : a.ep === "E3" ? "Exercice" : "Mission"} ${x.n} « ${x.t} »${x.pts ? `, ${x.pts} points` : ""}.
TRAVAUX DEMANDÉS :
${x.w.map((t, i) => `${i + 1}. ${t}`).join("\n")}

POINTS DE VIGILANCE DU CORRECTEUR :
${vig.map(t => "- " + t).join("\n")}
- Les règles fiscales, sociales et comptables à appliquer sont celles de la session ${a.year}.${a.year < 2025 ? " Si un numéro de compte ou un taux a changé depuis, accepte celui de l'époque et signale la version actuelle." : ""}

${st.ref ? `EXTRAIT DU CORRIGÉ FOURNI PAR L'ÉTUDIANT (référence prioritaire) :\n"""\n${st.ref.slice(0, 20000)}\n"""\n\n` : ""}COPIE DE L'ÉTUDIANT (texte) :
"""
${(st.t || "").slice(0, 40000) || "(aucun texte : la copie est en photo)"}
"""
${nCopy || nRef ? `\nIMAGES JOINTES : ${nCopy ? `les ${nCopy} première(s) sont la copie manuscrite de l'étudiant` : ""}${nCopy && nRef ? " ; " : ""}${nRef ? `les ${nRef} suivante(s) sont l'énoncé ou le corrigé officiel` : ""}.\n` : ""}
RÈGLES :
- Tu n'as ni l'énoncé complet ni ses annexes, sauf ce qui est fourni ci-dessus. N'invente jamais de données. Quand tu ne peux pas vérifier un montant, juge la méthode et dis-le.
- Repère les erreurs de fond (règle mal appliquée, compte erroné, sens débit/crédit, calcul faux, oubli d'une étape demandée, absence de justification) et les erreurs de forme qui coûtent des points.
- Si un travail demandé n'est pas traité, signale-le comme erreur majeure.
- Note sur ${x.pts || 20} : estime la note qu'un correcteur donnerait, ou null si la copie est vide ou illisible.
- "fiabilite" vaut "haute" si un corrigé est fourni, sinon "moyenne", ou "faible" si la copie est très incomplète ou illisible.
- "a_revoir" ne contient que des identifiants de cette liste :
${ids}

Réponds UNIQUEMENT avec un objet JSON valide, en français, sans texte autour :
{"note": nombre ou null, "sur": ${x.pts || 20}, "fiabilite": "haute" | "moyenne" | "faible", "resume": "2 phrases maximum", "reussi": ["…"], "erreurs": [{"point": "titre court", "probleme": "ce qui ne va pas, précisément", "correction": "la bonne démarche ou la bonne réponse", "gravite": "majeure" | "mineure"}], "a_revoir": ["identifiant"], "conseil": "une phrase"}`;
}
async function annCorrect() {
  const x = AX && ANNEXID[AX.id]; if (!x || annBusy) return;
  annSaveNow();
  const st = annState(x.id);
  if (!(st.t || "").trim() && !ANP.copy.length) { annErr = "Écris ta copie ou ajoute une photo avant de demander la correction."; render(); return; }
  if (!SAMPLE) { annErr = "La correction automatique n'est pas disponible dans cette vue."; render(); return; }
  const imgs = ANP.copy.concat(ANP.ref).slice(0, (SAMPLE_IMG && SAMPLE_IMG.maxCount) || 0);
  const nCopy = Math.min(ANP.copy.length, imgs.length), nRef = imgs.length - nCopy;
  annBusy = true; annErr = ""; annCtl = new AbortController(); render();
  try {
    const opts = { signal: annCtl.signal, modelTier: "complex", cache: false };
    if (imgs.length) opts.images = imgs;
    const res = await SAMPLE.json(annPrompt(x, st, nCopy, nRef), opts);
    if (!res || typeof res !== "object") throw { code: "invalid_json" };
    const out = { note: typeof res.note === "number" ? Math.max(0, Math.min(res.note, res.sur || x.pts || 20)) : null, sur: res.sur || x.pts || 20, fiabilite: res.fiabilite, resume: String(res.resume || ""), reussi: (res.reussi || []).map(String).slice(0, 12), erreurs: (res.erreurs || []).slice(0, 20).map(e => ({ point: String(e.point || ""), probleme: String(e.probleme || ""), correction: String(e.correction || ""), gravite: e.gravite === "majeure" ? "majeure" : "mineure" })), a_revoir: (res.a_revoir || []).map(String).filter(t => NOTIONS[t]).slice(0, 8), conseil: String(res.conseil || ""), at: Date.now() };
    const first = !st.d; st.r = out; st.d = 1;
    if (first) { S.xp += 15; dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak(); }
    touch(); toast(first ? "Copie corrigée : +15 XP" : "Copie corrigée");
  } catch (e) {
    const code = e && e.code;
    annErr = code === "cancelled" ? "" : code === "not_granted" || code === "sampling_disabled" || code === "capability_disabled" || code === "not_declared" ? "Tu n'as pas autorisé l'appli à utiliser la correction automatique. Tu peux le permettre dans les autorisations de la page, puis réessayer."
      : code === "rate_limited" ? "Trop de demandes pour l'instant, ou la limite d'usage est atteinte. Réessaie plus tard."
      : code === "image_rejected" ? "Une photo n'a pas été acceptée (format ou taille). Essaie une autre photo, en JPEG ou PNG."
      : code === "images_unavailable" ? "Les photos ne peuvent pas être envoyées dans cette vue : colle ta copie en texte."
      : code === "prompt_too_large" ? "Ta copie ou le corrigé collé est trop long : envoie une mission à la fois."
      : code === "session_expired" ? "Ta session a expiré : reconnecte-toi puis réessaie."
      : code === "refused" ? "Ce contenu n'a pas pu être corrigé. Reformule ou retire les éléments sans rapport avec l'exercice."
      : "La correction n'a pas abouti. Réessaie dans un instant.";
    if (code === "not_granted" || code === "sampling_disabled" || code === "not_declared") SAMPLE_STATE = "denied";
  } finally { annBusy = false; annCtl = null; if (view === "annex") { render(); const rr = document.querySelector(".ann-res, .ann-err"); if (rr) rr.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); } }
}
function annSaveNow() {
  const x = AX && ANNEXID[AX.id]; if (!x) return;
  const st = annState(x.id), t = document.getElementById("annText"), rf = document.getElementById("annRef");
  if (t) st.t = t.value.slice(0, 60000);
  if (rf) st.ref = rf.value.slice(0, 30000);
}
function annTimerToggle() {
  const x = AX && ANNEXID[AX.id]; if (!x) return;
  const st = annState(x.id);
  if (annTimerT) { clearInterval(annTimerT); annTimerT = null; touch(); render(); return; }
  let last = Date.now();
  annTimerT = setInterval(() => { const now = Date.now(); st.ts = (st.ts || 0) + (now - last) / 1000; last = now; const el = document.getElementById("annChrono"); if (el) el.textContent = "Chrono : " + fmtSec(st.ts) + " sur " + fmtMin(annMinutes(x)) + " conseillées"; if (view !== "annex") { clearInterval(annTimerT); annTimerT = null; } }, 1000);
  render();
}
function bindAnn() {
  if (view !== "annex") return;
  const t = document.getElementById("annText"), rf = document.getElementById("annRef");
  [t, rf].forEach(el => el && el.addEventListener("input", () => { annSaveNow(); clearTimeout(annSaveT); annSaveT = setTimeout(touch, 1200); }));
  document.querySelectorAll("input[data-photo]").forEach(inp => inp.addEventListener("change", () => {
    annSaveNow();
    const kind = inp.dataset.photo, max = (SAMPLE_IMG && SAMPLE_IMG.maxCount) || 6, room = Math.max(0, max - ANP.copy.length - ANP.ref.length);
    const files = [...inp.files].filter(f => /^image\//.test(f.type)).slice(0, room);
    if (inp.files.length > files.length) toast(room ? `Seulement ${room} photo${room > 1 ? "s" : ""} de plus` : "Nombre maximal de photos atteint");
    ANP[kind] = ANP[kind].concat(files); render();
  }));
}
function suggestAnn(cat) {
  const pool = ANNEX.filter(x => !annDone(x.id));
  return pool.find(x => x.tags.some(t => NOTIONS[t][1] === cat)) || pool.find(x => x.a.ep === "E5") || pool[0] || null;
}

/* ---------- Exercices à réponse saisie (générateurs chiffrés, écritures, rédactions) ---------- */
const r2 = x => Math.round((x + Math.sign(x) * 1e-9) * 100) / 100;
const fmt = x => { const v = r2(x); return v.toLocaleString("fr-FR", { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 }); };
const fmt4 = x => (Math.round(x * 10000) / 10000).toLocaleString("fr-FR", { maximumFractionDigits: 4 });
const ri = (a, b, step) => { step = step || 1; return a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1)); };
const pk = a => a[Math.floor(Math.random() * a.length)];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
function tb(head, rows) {
  return `<div class="table-wrap"><table class="md-table"><thead><tr>${head.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function jr(lines) { // lignes attendues → tableau de journal
  return tb(["Compte", "Intitulé", "Débit", "Crédit"], lines.map(l => [l.acc[0], l.label, l.d ? fmt(l.d) : "", l.c ? fmt(l.c) : ""]));
}
const L = (acc, label, d, c) => ({ acc: Array.isArray(acc) ? acc : [acc], label, d: r2(d || 0), c: r2(c || 0) });
const GEN = Object.fromEntries(GENS.map(g => [g.id, g]));

/* ---------- Dossiers type E5 : une entreprise, des missions qui s'enchaînent, un barème sur 20 ---------- */
const pc = x => String(x).replace(".", ",") + " %";
const DOSSID = Object.fromEntries(DOSS.map(d => [d.id, d]));
function accHint(dg) { for (let n = dg.length; n >= 2; n--) { const k = dg.slice(0, n); if (ACC_HINT[k]) return ACC_HINT[k]; } return ""; }
const ACC_NAME = Object.fromEntries(ACC_LIST);
function accDatalist() { return `<datalist id="pcgList">${ACC_LIST.map(([n, l]) => `<option value="${n}">${h(l)}</option>`).join("")}</datalist>`; }

function startDos(id) {
  const d = DOSSID[id]; if (!d) return;
  if (d.cats.some(lockedCat)) return lockSheet(d.cats.find(lockedCat));
  if (exTick) { clearInterval(exTick); exTick = null; }
  const o = d.make();
  X = { mode: "dos", d: { id: d.id, title: d.title, ent: d.ent, ctx: o.ctx }, list: o.missions.map((m, k) => Object.assign({ gid: d.id + "-m" + (k + 1), cat: d.cats[0], user: null, res: null }, m)), i: 0, xp0: S.xp };
  X.end = Date.now() + d.minutes * 60000;
  exTick = setInterval(() => { const t = document.getElementById("exTimer"); const left = Math.max(0, X.end - Date.now()); if (t) { t.textContent = exLeft(); t.classList.toggle("low", left < 300000); } if (left <= 0) finishE5(); }, 1000);
  go("exrun");
}
function dosNote() { const tot = X.list.reduce((s, it) => s + (it.pts || 0), 0) || 20; return r2(X.list.reduce((s, it) => s + (it.pts || 0) * (it.res ? it.res.score : 0), 0) * 20 / tot); }
function ren5(t) {
  return String(t)
    .replace(/<p><b>Atelier Brun SARL<\/b> fabrique des meubles sur mesure à La Seyne-sur-Mer\./g, "<p><b>Azur Bureau SAS</b> fabrique aussi du mobilier sur mesure dans son atelier.")
    .replace(/<b>Méditerranée Distribution SAS<\/b>, grossiste en produits d'entretien à Hyères,/g, "<b>Azur Bureau SAS</b>")
    .replace(/<b>Bleu Horizon SARL<\/b>, agence de voyages à Toulon,/g, "<b>Azur Bureau SAS</b>")
    .replace(/Atelier Brun SARL|Méditerranée Distribution SAS|Bleu Horizon SARL/g, "Azur Bureau SAS")
    .replace(/Atelier Brun|Méditerranée Distribution|Bleu Horizon/g, "Azur Bureau")
    .replace(/Le gérant/g, "Le président").replace(/le gérant/g, "le président");
}
function startExamE5() {
  if (EXAM5.some(id => DOSSID[id] && DOSSID[id].cats.some(lockedCat))) return lockSheet("p2");
  if (exTick) { clearInterval(exTick); exTick = null; }
  const ctx = `<p><b>Azur Bureau SAS</b>, à Toulon, conçoit dans son atelier et vend du mobilier et des fournitures de bureau aux entreprises. Elle emploie 9 salariés, relève du régime réel normal de TVA (déclaration mensuelle) et clôture ses comptes au 31 décembre 2026. C'est une PME : chiffre d'affaires inférieur à 10 M€, capital entièrement libéré et détenu à plus de 75 % par des personnes physiques.</p>
    <p>Le sujet comporte <b>5 dossiers indépendants</b>, notés chacun sur 20 points (100 points au total, ramenés à une note sur 20). Durée : 4 h 30. Commence par le dossier que tu maîtrises le mieux, et pose toujours tes calculs.</p>
    ${tb(["Dossier", "Thème", "Points", "Temps conseillé"], EXAM5.map((id, n) => [n + 1, h(DOSSID[id].title), 20, DOSSID[id].minutes + " min"]))}`;
  const list = [];
  EXAM5.forEach((id, n) => { const d = DOSSID[id], o = d.make(), dctx = ren5(o.ctx), lab = "Dossier " + (n + 1) + " · " + d.title;
    o.missions.forEach((m, k) => list.push(Object.assign({}, m, { title: ren5(m.title), enonce: ren5(m.enonce), corr: m.corr ? ren5(m.corr) : m.corr, model: m.model ? ren5(m.model) : m.model, gid: id + "-m" + (k + 1), cat: d.cats[0], user: null, res: null, dlab: lab, dn: n + 1, dctx, dfirst: k === 0 }))); });
  X = { mode: "dos", exam: true, d: { id: "e5-blanc", title: "Examen blanc E5 complet", ent: "Azur Bureau SAS", ctx }, list, i: 0, xp0: S.xp };
  X.end = Date.now() + EXAM5_MIN * 60000; e5Save();
  exTick = setInterval(() => { const t = document.getElementById("exTimer"); const left = Math.max(0, X.end - Date.now()); if (t) { t.textContent = exLeft(); t.classList.toggle("low", left < 300000); } if (left <= 0) finishE5(); }, 1000);
  go("exrun");
}
function dosCard(d) {
  const r = (S.x || {})[d.id];
  return `<button class="ex-card dos-card" style="${hueStyle(d.cats[0])}" data-act="dosStart" data-did="${d.id}"><span class="mini">${d.cats.map(c => h(CAT[c].code)).join(" · ")} · ${d.minutes} min</span><b>${h(d.title)}</b><span class="muted">${h(d.ent)} : ${r ? `meilleure note ${String(r[1] / 5).replace(".", ",")} / 20, dernière ${String(r[2] / 5).replace(".", ",")}` : "nouveaux chiffres à chaque essai"}</span></button>`;
}
function dosSection(cat) {
  const list = cat ? DOSS.filter(d => d.cats.includes(cat)) : DOSS, gens = cat ? GENS.filter(g => g.cat === cat) : [];
  if (!list.length && !gens.length) return "";
  const groups = cat ? "" : ["p1", "p2", "p3", "p4", "p5", "p6", "ma"].map(c => `<details class="ex-group ann-more gc-more" data-ann="gen-${c}"${ANN_OPEN.has("gen-" + c) ? " open" : ""} style="${hueStyle(c)}"><summary><h3><span class="tabcode">${h(CAT[c].code)}</span>${h(CAT[c].name)} <span class="muted small">${GENS.filter(g => g.cat === c).length} exercices</span></h3></summary><div class="ex-grid">${GENS.filter(g => g.cat === c).map(exCard).join("")}</div></details>`).join("");
  return `<div class="ex-group dos-group">
      ${cat ? "" : (() => { const r = (S.x || {})["e5-blanc"], o = e5Load(); if (o) { const left = Math.max(0, Math.round((o.end - Date.now()) / 60000)); return `<button class="e5-cta" data-act="exam5Resume"><span class="e5-ic">${ICON.clock}</span><span><b>Reprendre ton examen blanc E5</b><small>${o.list.filter(m => m.user).length} missions sur ${o.list.length} commencées · ${left > 0 ? `il reste ${Math.floor(left / 60)} h ${String(left % 60).padStart(2, "0")}` : "temps écoulé : voir la correction"}.</small></span><span class="wk-go">Reprendre ›</span></button><p class="muted small" style="margin:-6px 0 14px"><button class="rep-btn" data-act="exam5Drop">Abandonner cet examen</button></p>`; } return `<button class="e5-cta" data-act="exam5"><span class="e5-ic">${ICON.clock}</span><span><b>Examen blanc E5 complet</b><small>Une entreprise, 5 dossiers, 4 h 30, noté sur 20 comme le jour J. Nouveaux chiffres à chaque sujet.${r ? ` Ta meilleure note : ${fmtN20(r[1] / 5)}/20.` : ""}</small></span><span class="wk-go">Commencer ›</span></button>`; })()}
      <h2>${cat ? "Cas pratiques à saisir" : "Épreuve E5 : dossiers à saisir"}</h2>
      <p class="muted">${cat ? "Tu calcules et tu passes les écritures, l'appli corrige ligne par ligne. Nouveaux chiffres à chaque essai." : "Comme le jour J : une entreprise, des missions qui s'enchaînent (les montants d'une mission servent à la suivante), un chrono et une note sur 20. Tu calcules, tu passes les écritures, l'appli corrige ligne par ligne."}</p>
      ${list.length ? `<div class="ex-grid">${list.map(dosCard).join("")}</div>` : ""}
      ${gens.length ? `<div class="ex-grid">${gens.map(exCard).join("")}</div>` : ""}
      ${cat ? "" : `<div class="row"><button class="btn" data-act="exE5">Épreuve rapide : 6 exercices de P1 à P4 en 45 min</button></div><h3 class="qf-title">Exercices courts, par matière</h3>${groups}`}
    </div>`;
}
const REDACBY = Object.fromEntries(REDAC.map(r => [r.id, r]));

/* Moteur */
let X = null; // session d'exercices
const parseNum = s => { if (s == null) return NaN; const t = String(s).replace(/[\s  €%]/g, "").replace(",", "."); return t === "" || t === "-" ? NaN : Number(t); };
function makeInst(gid) { const g = GEN[gid]; const o = g.make(); return Object.assign({ gid, cat: g.cat, title: g.title, user: null, res: null }, o); }
function startEx(gids, mode, minutes) {
  if (isGuest()) { const g = gids.map(id => GENS.find(x => x.id === id)).find(x => x && lockedCat(x.cat)); if (g) return lockSheet(g.cat); }
  if (exTick) { clearInterval(exTick); exTick = null; }
  X = { mode, list: gids.map(makeInst), i: 0, xp0: S.xp };
  if (mode === "e5") {
    X.end = Date.now() + minutes * 60000;
    exTick = setInterval(() => { const t = document.getElementById("exTimer"); const left = Math.max(0, X.end - Date.now()); if (t) { t.textContent = exLeft(); t.classList.toggle("low", left < 300000); } if (left <= 0) finishE5(); }, 1000);
  }
  go("exrun");
}
let exTick = null;
function exLeft() { const left = Math.max(0, X.end - Date.now()); const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60; return m >= 60 ? Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0") + ":" + String(s).padStart(2, "0") : m + ":" + String(s).padStart(2, "0"); }
function readUser() {
  const it = X.list[X.i];
  const f = [...document.querySelectorAll("[data-fi]")].map(e => e.value);
  const rows = [...document.querySelectorAll("tr[data-row]")].map(tr => ({ acc: tr.querySelector("[data-a]").value, d: tr.querySelector("[data-d]").value, c: tr.querySelector("[data-c]").value }));
  const tx = document.querySelector("[data-tx]");
  it.user = { f, rows, t: tx ? tx.value : "" };
  if (X.exam) e5Save();
}
/* L'examen blanc survit à une fermeture de l'appli : copie sur l'appareil */
const E5K = "gl-e5-encours";
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden" && view === "exrun" && X && X.exam && !X.done) try { readUser(); } catch (e) {} });
function e5Save() { try { if (X && X.exam && !X.done) localStorage.setItem(E5K, JSON.stringify(X)); } catch (e) {} }
function e5Load() { try { const o = JSON.parse(localStorage.getItem(E5K) || "null"); return o && o.exam && !o.done && o.end > Date.now() - 864e5 ? o : null; } catch (e) { return null; } }
function e5Drop() { try { localStorage.removeItem(E5K); } catch (e) {} }
function e5Resume() {
  const o = e5Load(); if (!o) return;
  if (exTick) { clearInterval(exTick); exTick = null; }
  X = o; X.xp0 = S.xp;
  if (X.end <= Date.now()) { finishE5(); return; }
  exTick = setInterval(() => { const t = document.getElementById("exTimer"); const left = Math.max(0, X.end - Date.now()); if (t) { t.textContent = exLeft(); t.classList.toggle("low", left < 300000); } if (left <= 0) finishE5(); }, 1000);
  go("exrun");
}
function grade(it) {
  if (it.kind === "txt") { const ck = it.ck || []; it.res = { fr: [], lr: [], extra: [], score: it.crit.length ? ck.filter(Boolean).length / it.crit.length : 0, txt: true }; return it.res; }
  const tolOf = fd => fd.tol != null ? fd.tol : 0.02;
  const fr = (it.fields || []).map((fd, k) => { if (fd.opts) return { ok: it.user.f[k] === fd.ans, v: it.user.f[k] }; const v = parseNum(it.user.f[k]); const tol = tolOf(fd); const ok = !isNaN(v) && (Math.abs(v - fd.ans) <= tol || (fd.pct && Math.abs(v * 100 - fd.ans) <= tol)); return { ok, v }; });
  let lr = [], extra = [];
  if (it.lines && it.lines.length) {
    const tol = it.tol || 0.02;
    const exp = it.lines.map(l => ({ l, net: r2(l.d - l.c), got: 0, hit: false }));
    (it.user.rows || []).forEach(r => {
      const dg = String(r.acc || "").replace(/\D/g, ""); const d = parseNum(r.d) || 0, c = parseNum(r.c) || 0;
      if (!dg && !d && !c) return;
      const e = exp.find(x => x.l.acc.some(a => dg.startsWith(a)));
      if (e) { e.got = r2(e.got + d - c); e.hit = true; } else extra.push(dg || "?");
    });
    lr = exp.map(x => ({ l: x.l, ok: x.hit && Math.abs(x.got - x.net) <= tol, got: x.got }));
    const ud = (it.user.rows || []).reduce((s, r) => s + (parseNum(r.d) || 0), 0), uc = (it.user.rows || []).reduce((s, r) => s + (parseNum(r.c) || 0), 0);
    it.balance = Math.abs(ud - uc) <= 0.02;
  }
  const good = fr.filter(x => x.ok).length + lr.filter(x => x.ok).length, tot = fr.length + lr.length + extra.length;
  it.res = { fr, lr, extra, score: tot ? good / tot : 0 };
  return it.res;
}
function recordEx(it) {
  S.x = S.x || {};
  const r = S.x[it.gid] || [0, 0, 0];
  const sc = Math.round(it.res.score * 100);
  S.x[it.gid] = [r[0] + 1, Math.max(r[1], sc), sc]; { const g = GENS.find(x => x.id === it.gid); if (g) wlog("x", g.cat); }
  S.xp += it.res.score >= .5 ? Math.round(15 * it.res.score) : 0; dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak();
}
function exInputs(it, locked) {
  const res = it.res;
  if (it.kind === "txt") {
    const t = it.user && it.user.t || "";
    if (!locked) return `<textarea class="ex-text" data-tx rows="8" placeholder="Rédige ta réponse comme sur ta copie : calcul, argument, conclusion.">${h(t)}</textarea>`;
    const k = X.list.indexOf(it), ck = it.ck || [];
    return `<div class="dos-mine"><div class="label">Ta réponse</div><p style="white-space:pre-line">${t ? h(t) : "<i>Pas de réponse.</i>"}</p></div>
      <div class="feedback"><span class="verdict ok">Corrigé modèle</span><div class="md ex-corr">${mdBlocks(it.model.split("\n"), "dos" + k)}</div>
      <div class="label">Coche ce que ta réponse contient vraiment : ta note se met à jour</div>
      <div class="ex-crit">${it.crit.map((c, j) => `<label><input type="checkbox" data-act="dosCk" data-m="${k}" data-j="${j}" ${ck[j] ? "checked" : ""}> ${h(c)}</label>`).join("")}</div></div>`;
  }
  const fields = (it.fields || []).map((fd, k) => {
    const st = res ? (res.fr[k].ok ? "ok" : "ko") : "";
    const uv = it.user ? it.user.f[k] || "" : "";
    if (fd.opts) return `<label class="ex-field ex-choice ${st}"><span>${h(fd.label)}</span><select data-fi="${k}" ${locked ? "disabled" : ""}><option value="">Choisir…</option>${fd.opts.map(o => `<option${o === uv ? " selected" : ""}>${h(o)}</option>`).join("")}</select>${res ? `<em>${res.fr[k].ok ? "Juste" : "Attendu : " + h(fd.ans)}</em>` : ""}</label>`;
    return `<label class="ex-field ${st}"><span>${h(fd.label)}</span><input inputmode="decimal" data-fi="${k}" value="${h(uv)}" ${locked ? "disabled" : ""} placeholder="0,00">${res ? `<em>${res.fr[k].ok ? "Juste" : "Attendu : " + fmt(fd.ans) + (fd.pct ? " %" : "")}</em>` : ""}</label>`;
  }).join("");
  let journal = "";
  if (it.lines && it.lines.length) {
    const n = Math.max((it.user && it.user.rows ? it.user.rows.length : 0), it.lines.length + 1);
    const rows = Array.from({ length: n }, (_, k) => { const r = it.user && it.user.rows && it.user.rows[k] || {}; return `<tr data-row><td><input data-a list="pcgList" inputmode="numeric" value="${h(r.acc || "")}" placeholder="Compte" ${locked ? "disabled" : ""}>${locked && r.acc && ACC_NAME[String(r.acc).replace(/\D/g, "")] ? `<small class="acc-n">${h(ACC_NAME[String(r.acc).replace(/\D/g, "")])}</small>` : ""}</td><td><input data-d inputmode="decimal" value="${h(r.d || "")}" placeholder="Débit" ${locked ? "disabled" : ""}></td><td><input data-c inputmode="decimal" value="${h(r.c || "")}" placeholder="Crédit" ${locked ? "disabled" : ""}></td></tr>`; }).join("");
    journal = `${locked ? "" : accDatalist()}<div class="ex-journal"><div class="label">Écriture au journal (numéro de compte, montants)</div><div class="table-wrap"><table class="md-table jtab"><thead><tr><th>Compte</th><th>Débit</th><th>Crédit</th></tr></thead><tbody>${rows}</tbody></table></div>${locked ? "" : `<button class="btn small" data-act="exRow">Ajouter une ligne</button>`}</div>`;
    if (res) journal += `<div class="ex-check">${res.lr.map(x => `<span class="${x.ok ? "ok" : "ko"}">${x.ok ? "✓" : "✗"} ${h(x.l.acc[0])} ${h(x.l.label)} : ${x.l.d ? "débit " + fmt(x.l.d) : "crédit " + fmt(x.l.c)}${x.ok ? "" : " (ta saisie : " + fmt(x.got) + ")"}</span>`).join("")}${res.extra.map(a => `<span class="ko">✗ Compte en trop : ${h(a)}${accHint(a) ? ` <em class="acc-hint">${h(accHint(a))}</em>` : ""}</span>`).join("")}${it.balance === false ? `<span class="ko">✗ Ton écriture n'est pas équilibrée</span>` : ""}</div>`;
  }
  return `<div class="ex-fields">${fields}</div>${journal}`;
}
function exCard(g) {
  const r = (S.x || {})[g.id];
  return `<button class="ex-card" style="${hueStyle(g.cat)}" data-act="exStart" data-gid="${g.id}"><b>${h(g.title)}</b><span class="muted">${r ? `Meilleur score : ${r[1]} %, en ${r[0]} essai${r[0] > 1 ? "s" : ""}` : "Pas encore fait"}</span></button>`;
}
function redCard(r) {
  const s = (S.x || {})[r.id];
  return `<button class="ex-card" style="${hueStyle(r.cat)}" data-act="exRedac" data-rid="${r.id}"><span class="mini">${h(CAT[r.cat].code)}</span><b>${h(r.title)}</b><span class="muted">${s ? `Dernière auto-évaluation : ${s[2]} %` : "À rédiger"}</span></button>`;
}
function vExHomeOld() {
  const n = todayCount();
  const groups = ["p1", "p2", "p3", "p4", "p5", "p6", "ma"].map(c => `<div class="ex-group" style="${hueStyle(c)}"><h3><span class="tabcode">${h(CAT[c].code)}</span>${h(CAT[c].name)}</h3><div class="ex-grid">${GENS.filter(g => g.cat === c).map(exCard).join("")}</div></div>`).join("");
  return `<section class="page-head">
      <h1>S'entraîner</h1>
      <p class="muted">Choisis un format. Tout est corrigé et compte dans ta progression. Si tu ne sais pas par où commencer : les cartes du jour, puis un exercice chiffré.</p>
    </section>
    <section class="modes">
      <button class="mode lead-mode" data-act="today" ${n ? "" : "disabled"}><b>Cartes du jour</b><span>${n ? `${n} cartes à revoir, de 5 à 10 minutes.` : "Rien à revoir aujourd'hui."}</span></button>
      <button class="mode" data-act="goQuiz"><b>Quiz corrigé</b><span>${QS.length} questions, expliquées juste après ta réponse. Choisis tes matières.</span></button>
      <button class="mode" data-act="exE5"><b>Épreuve type E5</b><span>6 exercices de P1 à P4 à saisir en 45 minutes, notés sur 20.</span></button>
      <button class="mode" data-act="goExam"><b>QCM chrono</b><span>20 questions toutes matières en 20 minutes, sans correction avant la fin.</span></button>
      <button class="mode" data-act="defi"><b>Défi 60 secondes</b><span>Un maximum de bonnes réponses en une minute, sans calculs. Record actuel : ${(S.df || {}).best || 0}.</span></button>
    </section>
    <div class="row"><button class="btn" data-act="goCards">Cartes au choix (${FS.length})</button><button class="btn" data-act="startWrong" ${QS.some(x => S.q[x.id] && S.q[x.id][2] === 0) ? "" : "disabled"}>Refaire mes erreurs de quiz</button></div>
    <section class="stack">
      <div class="sec-head"><h2>Exercices chiffrés</h2><p>${GENS.length} types d'exercices, avec de nouveaux montants à chaque essai.</p></div>
      ${groups}
    </section>
    <section class="stack">
      <div class="sec-head"><h2>Exercices guidés</h2><p>${GCASES.length} exercices type examen, découpés en étapes avec un corrigé pour chacune.</p></div>
      ${CATS.filter(c => (GCBY[c.id] || []).length).map(c => `<div class="ex-group" style="${hueStyle(c.id)}"><h3><span class="tabcode">${h(c.code)}</span>${h(c.name)}</h3><div class="ex-grid">${GCBY[c.id].map(gcCard).join("")}</div></div>`).join("")}
    </section>
    <section class="stack">
      <div class="sec-head"><h2>Rédactions</h2><p>CEJM, analyse de processus, culture générale.</p></div>
      <div class="ex-grid">${REDAC.map(redCard).join("")}</div>
    </section>`;
}

function vExRun() {
  if (!X) return vExHome();
  const it = X.list[X.i], c = CAT[it.cat], last = X.i === X.list.length - 1, dos = X.mode === "dos", e5 = X.mode === "e5" || dos;
  const showCorr = it.res && !e5;
  const head = e5 ? `<span class="timer" id="exTimer">${exLeft()}</span>` : `<span class="ep">${h(c.code)} · ${h(c.name)}</span>`;
  const actions = e5
    ? `<div class="row">${X.i ? `<button class="btn" data-act="exPrev">Précédent</button>` : ""}${last ? `<button class="btn primary" data-act="exFinishE5">Rendre la copie</button>` : `<button class="btn primary" data-act="exNextE5">${dos ? "Mission suivante" : "Exercice suivant"}</button>`}</div>`
    : (it.res ? `<div class="row"><button class="btn primary" data-act="exAgain">Nouvel exercice du même type</button><button class="btn" data-act="exHome">Tous les exercices</button></div>` : `<div class="row"><button class="btn primary" data-act="exCheck">Vérifier</button><button class="btn" data-act="exShow">Voir le corrigé sans répondre</button></div>`);
  return `<section class="runner ex-runner">
    <div class="runner-top"><span class="progress-text">${dos ? `Mission ${X.i + 1} / ${X.list.length}` : e5 ? `Exercice ${X.i + 1} / ${X.list.length}` : "Exercice"}</span>${head}</div>
    ${dos ? `<div class="dos-steps">${X.list.map((m, k) => `${m.dfirst && X.exam ? `<span class="dos-dn">D${m.dn}</span>` : ""}<button class="dos-step${k === X.i ? " on" : ""}${m.user ? " done" : ""}" data-act="dosGo" data-i="${k}" aria-label="${m.dlab ? h(m.dlab) + ", " : ""}mission ${k + 1}">${k + 1}</button>`).join("")}</div>
    <details class="dos-ctx"${X.i === 0 ? " open" : ""}><summary><b>${h(X.d.ent)}</b> : ${X.exam ? "présentation du sujet" : "présentation du dossier"}</summary>${X.d.ctx}</details>
    ${X.exam && it.dctx ? `<details class="dos-ctx"${it.dfirst ? " open" : ""}><summary><b>${h(it.dlab)}</b> : contexte</summary>${it.dctx}</details>` : ""}` : ""}
    <div class="qcard">
      <span class="eyebrow">${X.exam && it.dn ? `Dossier ${it.dn} · ` : ""}${dos ? `Mission ${X.i + 1} · ${it.pts} point${it.pts > 1 ? "s" : ""} : ` : ""}${h(it.title)}</span>
      <div class="ex-enonce">${it.enonce}</div>
      ${exInputs(it, !!it.res && !e5)}
      ${showCorr ? `<div class="feedback"><span class="verdict ${it.res.score >= 0.999 ? "ok" : "ko"}">${Math.round(it.res.score * 100)} % juste</span><div class="ex-corr">${it.corr}</div></div>` : ""}
    </div>
    ${actions}
  </section>`;
}
function finishE5() {
  if (!X || (X.mode !== "e5" && X.mode !== "dos") || X.done) return;
  if (view === "exrun") readUser();
  X.done = true; if (exTick) { clearInterval(exTick); exTick = null; }
  if (X.exam) e5Drop();
  if (X.mode === "dos") {
    X.list.forEach(it => { if (!it.user) it.user = { f: [], rows: [], t: "" }; grade(it); });
    dosRecord(true); S.xp += Math.round(dosNote() * (X.exam ? 6 : 2)); dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak();
  } else X.list.forEach(it => { if (!it.user) it.user = { f: [], rows: [] }; grade(it); recordEx(it); });
  touch(); go("exres");
}
function dosRecord(first) {
  S.x = S.x || {};
  const sc = Math.round(dosNote() * 5), r = S.x[X.d.id] || [0, 0, 0];
  S.x[X.d.id] = [r[0] + (first ? 1 : 0), Math.max(r[1], sc), sc];
}
const fmtN20 = n => (Math.round(n * 4) / 4).toLocaleString("fr-FR");
function vDosRes() {
  const note = dosNote();
  const rows = (X.exam ? EXAM5.map((id, n) => { const ms = X.list.filter(m => m.dn === n + 1), p = ms.reduce((a, m) => a + m.pts * m.res.score, 0), t = ms.reduce((a, m) => a + m.pts, 0); return `<tr class="total"><td>Dossier ${n + 1} · ${h(DOSSID[id].title)}</td><td class="num">${fmtN20(p)} / ${t}</td></tr>`; }).join("") : "") + X.list.map((it, k) => `<tr><td>${X.exam ? "D" + it.dn + " · " : ""}${k + 1}. ${h(it.title)}</td><td class="num" id="dosPts${k}">${fmtN20(it.pts * it.res.score)} / ${it.pts}</td></tr>`).join("");
  const det = X.list.map((it, k) => `<details class="lib-cat"${it.res.score < 0.999 ? " open" : ""}><summary><span class="code">${k + 1}</span><h3>${h(it.title)}</h3><span class="ep" id="dosEp${k}">${fmtN20(it.pts * it.res.score)} / ${it.pts}</span></summary><div class="ex-detail"><div class="ex-enonce">${it.enonce}</div>${exInputs(it, true)}${it.corr ? `<div class="ex-corr">${it.corr}</div>` : ""}</div></details>`).join("");
  return `<section class="runner">
    <div><span class="eyebrow">${X.exam ? "Examen blanc corrigé" : "Dossier E5 corrigé"} : ${h(X.d.ent)}</span><h1>${h(X.d.title)}</h1></div>
    <div class="score-line"><span class="score" id="dosNote">${fmtN20(note)}<small> /20</small></span><span class="muted">+${S.xp - X.xp0} XP</span></div>
    <div class="table-wrap"><table class="ledger"><thead><tr><th>Mission</th><th class="num">Points</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="muted">Montants et lignes d'écriture sont corrigés automatiquement. Pour l'analyse rédigée, coche toi-même les critères remplis. À l'examen, la démarche et la présentation comptent aussi : pose toujours tes calculs.</p>
    <div class="row"><button class="btn primary" data-act="dosStart" data-did="${X.d.id}">Refaire avec d'autres chiffres</button><button class="btn" data-act="exHome">Tous les exercices</button></div>
    <h2>Corrections</h2><div class="setup">${det}</div>
  </section>`;
}
function vExRes() {
  if (!X) return vExHome();
  if (X.mode === "dos") return vDosRes();
  const tot = X.list.reduce((s, it) => s + (it.res ? it.res.score : 0), 0), note = Math.round(tot / X.list.length * 200) / 10;
  const rows = X.list.map((it, k) => `<tr><td>${k + 1}. ${h(it.title)}</td><td class="num">${Math.round(it.res.score * 100)} %</td></tr>`).join("");
  const det = X.list.map((it, k) => `<details class="lib-cat"><summary><span class="code">${k + 1}</span><h3>${h(it.title)}</h3><span class="ep">${Math.round(it.res.score * 100)} %</span></summary><div class="ex-detail"><div class="ex-enonce">${it.enonce}</div>${exInputs(it, true)}<div class="ex-corr">${it.corr}</div></div></details>`).join("");
  return `<section class="runner">
    <div><span class="eyebrow">Épreuve type E5 corrigée</span><h1>Ta copie</h1></div>
    <div class="score-line"><span class="score">${String(note).replace(".", ",")}<small> /20</small></span><span class="muted">+${S.xp - X.xp0} XP</span></div>
    <div class="table-wrap"><table class="ledger"><thead><tr><th>Exercice</th><th class="num">Réussite</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="muted">Note calculée sur les montants et les lignes d'écriture justes. À l'examen, la démarche et la présentation rapportent aussi des points : rédige toujours tes calculs.</p>
    <div class="row"><button class="btn primary" data-act="exE5">Nouvelle épreuve type E5</button><button class="btn" data-act="exHome">Tous les exercices</button></div>
    <h2>Corrections</h2><div class="setup">${det}</div>
  </section>`;
}
let RD = null; // rédaction en cours
function vRedac() {
  const r = REDACBY[RD && RD.id]; if (!r) return vExHome();
  return `<section class="runner ex-runner">
    <div class="runner-top"><span class="progress-text">Rédaction</span><span class="ep">${h(CAT[r.cat].code)} · ${h(CAT[r.cat].name)}</span></div>
    <div class="qcard">
      <span class="eyebrow">${h(r.title)}</span>
      <p class="qtext">${h(r.enonce)}</p>
      <textarea class="ex-text" id="rdText" rows="10" placeholder="Rédige ta réponse ici, comme sur ta copie." ${RD.shown ? "disabled" : ""}>${h(RD.text || "")}</textarea>
      ${RD.shown ? `<div class="feedback"><span class="verdict ok">Corrigé modèle</span><div class="md ex-corr">${mdBlocks(r.model.split("\n"), "rd")}</div>
        <div class="label">Coche ce que ta copie contient vraiment</div>
        <div class="ex-crit">${r.crit.map((c, k) => `<label><input type="checkbox" data-crit="${k}" ${RD.crit && RD.crit[k] ? "checked" : ""}> ${h(c)}</label>`).join("")}</div></div>` : ""}
    </div>
    <div class="row">${RD.shown ? `<button class="btn primary" data-act="rdScore">Enregistrer mon auto-évaluation</button><button class="btn" data-act="exHome">Tous les exercices</button>` : `<button class="btn primary" data-act="rdShow">Comparer au corrigé</button>`}</div>
  </section>`;
}
const SCHBY = Object.fromEntries(SCH.map(s => [s.id, s]));
const schNodes = s => s.rows.flatMap((r, ri) => r.n.map(n => ({ t: n[0], s: n[1] || "", fix: n[2] === 0, r: ri })));
let SC = null, scFrom = "ex";
function schStart(id, mode) {
  const s = SCHBY[id]; if (!s) return;
  const nodes = schNodes(s), blk = nodes.map((n, i) => n.fix ? -1 : i).filter(i => i >= 0);
  let hide = [];
  if (mode === "trous") { const k = Math.max(3, Math.round(blk.length * .45)); hide = shuffle(blk).slice(0, Math.min(k, blk.length)); }
  else if (mode === "cons") hide = blk.slice();
  const lr = shuffle(s.leurres || []).slice(0, mode === "cons" ? 3 : 2);
  SC = { id, mode, hide: new Set(hide), place: {}, pick: null, slot: null, done: false, bank: shuffle(hide.map(i => nodes[i].t).concat(lr)) };
}
function schSet(i, k) { // place l'étiquette k de la banque dans la case i
  Object.keys(SC.place).forEach(j => { if (SC.place[j] === k) delete SC.place[j]; });
  SC.place[i] = k; SC.pick = null; SC.slot = null; tone("pop"); buzz(8);
}
function schCheck() {
  const s = SCHBY[SC.id], nodes = schNodes(s), ids = [...SC.hide];
  const good = ids.filter(i => SC.place[i] != null && SC.bank[SC.place[i]] === nodes[i].t).length, pc = Math.round(good / ids.length * 100);
  SC.done = true; SC.pc = pc; SC.good = good;
  S.sch = S.sch || {}; const r = S.sch[s.id] = S.sch[s.id] || {}, key = SC.mode === "cons" ? "c" : "t", first = !(r[key] >= 80);
  r[key] = Math.max(r[key] || 0, pc); r.d = dayNum(); wlog("sc", s.cat);
  if (first && pc >= 80) { S.xp += key === "c" ? 25 : 15; setTimeout(() => fxStamp(key === "c" ? "Schéma construit" : "Schéma complété", pc + " % de bonnes cases"), 150); }
  else S.xp += pc >= 50 ? 3 : 1;
  if (pc === 100) setTimeout(() => confettiBurst(), 200);
  tone(pc >= 80 ? "ok" : "ko"); dayLog().e++; bumpStreak(); touch(); renderTop();
}
function schFlow(s) {
  const nodes = schNodes(s); let gi = 0;
  const play = SC && SC.id === s.id && SC.mode !== "voir";
  return `<div class="sc-flow" style="${hueStyle(s.cat)}">${s.rows.map((row, ri) => {
    const n = row.n.length, prev = ri ? s.rows[ri - 1].n.length : 0, par = ri && n === prev && n > 1 && n <= 3;
    const arrows = ri ? `<div class="sc-arrows${par ? " par" : ""}" style="--n:${par ? n : 1}">${Array.from({ length: par ? n : 1 }, (_, k) => `<span class="sc-ar" style="grid-column:${k + 1}" aria-hidden="true"></span>`).join("")}${row.a ? `<em class="sc-cap">${h(row.a)}</em>` : ""}</div>` : "";
    const cells = row.n.map(() => {
      const i = gi++, nd = nodes[i], hid = play && SC.hide.has(i);
      if (!hid) return `<div class="sc-node${nd.fix ? " fix" : ""}"><b>${h(nd.t)}</b>${nd.s ? `<small>${h(nd.s)}</small>` : ""}</div>`;
      const k = SC.place[i], lab = k != null ? SC.bank[k] : "";
      if (SC.done) { const ok = lab === nd.t;
        return `<div class="sc-node ${ok ? "ok" : "ko"}"><b>${lab ? h(lab) : "Case vide"}</b>${ok ? "" : `<span class="sc-fix">Réponse : ${h(nd.t)}</span>`}${nd.s ? `<small>${h(nd.s)}</small>` : ""}</div>`; }
      const hint = SC.mode === "trous" && nd.s;
      return `<button class="sc-node slot${k != null ? " filled" : ""}${SC.slot === i ? " sel" : ""}" data-act="scSlot" data-i="${i}" aria-label="${k != null ? "Case remplie : " + h(lab) + ". Touche pour la vider" : "Case vide n° " + (i + 1)}"><b>${k != null ? h(lab) : "?"}</b>${hint ? `<small>${h(nd.s)}</small>` : ""}</button>`;
    }).join("");
    return arrows + `<div class="sc-row${n === 4 ? " n4" : ""}" style="--n:${n}">${cells}</div>`;
  }).join("")}</div>`;
}
function schCard(s) {
  const r = (S.sch || {})[s.id] || {};
  const st = r.c >= 80 ? "Construit seul ✓" : r.t >= 80 ? "Trous complétés ✓" : r.t || r.c ? `Meilleur score : ${Math.max(r.t || 0, r.c || 0)} %` : `${schNodes(s).length} cases`;
  return `<button class="ex-card sc-card" style="${hueStyle(s.cat)}" data-act="scOpen" data-sid="${s.id}" data-cat="${s.cat}"><span class="mini">${h(CAT[s.cat].code)}</span><b>${h(s.title)}</b><span class="muted">${st}</span></button>`;
}
function schHome(cat) {
  const cats = CATS.filter(c => SCH.some(s => s.cat === c.id) && (!cat || c.id === cat));
  const nOk = SCH.filter(s => ((S.sch || {})[s.id] || {}).c >= 80).length;
  return `<section class="stack">
    ${cat ? `<div class="ex-group"><h2>Schémas</h2><p class="muted">Visualise le processus, puis reconstitue-le : à trous ou entièrement seul.</p>` : `<div class="sec-head"><h2>Schémas de processus</h2><p>Pour comprendre d'un coup d'œil comment s'enchaîne un processus. Regarde le schéma, puis entraîne-toi : <b>à trous</b> (quelques cases à remettre) ou <b>à construire</b> (toutes les cases, avec des pièges).</p></div>
    <div class="sc-how"><span><b>1</b> Regarde</span><span><b>2</b> Complète les trous</span><span><b>3</b> Reconstruis-le seul</span>${nOk ? `<span class="pill">${nOk}/${SCH.length} construits seul</span>` : ""}</div>`}
    ${cats.map(c => `<div class="ex-group" style="${hueStyle(c.id)}">${cat ? "" : `<h3><span class="tabcode">${h(c.code)}</span> ${h(c.name)}</h3>`}<div class="ex-grid">${SCH.filter(s => s.cat === c.id).map(schCard).join("")}</div></div>`).join("")}
    ${cat ? "</div>" : ""}
  </section>`;
}
function vSchema() {
  const s = SC && SCHBY[SC.id]; if (!s) return vExHome();
  const ids = [...SC.hide], left = ids.filter(i => SC.place[i] == null).length, used = new Set(Object.values(SC.place));
  const modes = [["voir", "Voir"], ["trous", "À trous"], ["cons", "À construire"]];
  return `<section class="runner ex-runner sc-run">
    <div class="runner-top"><button class="btn small" data-act="scBack">← Schémas</button><span class="ep">${h(CAT[s.cat].code)} · ${h(CAT[s.cat].name)}</span></div>
    <div class="qcard">
      <span class="eyebrow">Schéma</span>
      <h2 class="sc-title">${h(s.title)}</h2>
      <p class="muted">${h(s.idee)}</p>
      <div class="seg sc-seg" role="tablist" aria-label="Mode">${modes.map(([k, l]) => `<button role="tab" data-act="scMode" data-m="${k}" aria-selected="${SC.mode === k}">${l}</button>`).join("")}</div>
      ${SC.mode === "cons" && !SC.done && !Object.keys(SC.place).length ? `<p class="sc-tip">Astuce : refais-le d'abord sur une feuille de mémoire, puis place les étiquettes pour te faire corriger. Attention, ${(s.leurres || []).length ? "quelques étiquettes sont des pièges" : "aucune étiquette n'est de trop"}.</p>` : ""}
      ${SC.mode === "trous" && !SC.done && !Object.keys(SC.place).length ? `<p class="sc-tip">Touche une étiquette, puis la case où elle va. Les précisions sous les cases t'aident. Deux étiquettes sont des pièges.</p>` : ""}
      ${schFlow(s)}
      ${SC.mode !== "voir" && !SC.done ? `<div class="sc-bank" aria-label="Étiquettes à placer">${SC.bank.map((t, k) => used.has(k) ? "" : `<button class="sc-chip" data-act="scChip" data-k="${k}" aria-pressed="${SC.pick === k}">${h(t)}</button>`).join("") || `<span class="muted small">Toutes les étiquettes sont placées.</span>`}</div>` : ""}
      ${SC.done ? `<div class="feedback"><span class="verdict ${SC.pc >= 80 ? "ok" : "ko"}">${SC.good}/${ids.length} cases justes · ${SC.pc} %</span><p>${SC.pc === 100 ? "Parfait, tu maîtrises ce schéma." : SC.pc >= 80 ? "Très bien, regarde les cases en rouge." : "Relis le schéma complet, puis recommence."}</p></div>` : ""}
      ${SC.mode === "voir" || SC.done ? `<div class="sc-key" style="${hueStyle(s.cat)}"><b>À retenir</b><p>${h(s.retenir)}</p></div>` : ""}
    </div>
    <div class="row">${SC.mode === "voir" ? `<button class="btn primary" data-act="scMode" data-m="trous">Compléter les trous</button><button class="btn" data-act="scMode" data-m="cons">Le construire seul</button>`
      : SC.done ? `<button class="btn primary" data-act="scMode" data-m="${SC.mode}">Recommencer</button>${SC.mode === "trous" ? `<button class="btn" data-act="scMode" data-m="cons">Passer à « À construire »</button>` : ""}<button class="btn" data-act="scMode" data-m="voir">Voir le schéma complet</button><button class="btn" data-act="scNext">Schéma suivant</button>`
      : `<button class="btn primary" data-act="scCheck" ${left === ids.length ? "disabled" : ""}>${left ? `Corriger (${left} case${left > 1 ? "s" : ""} vide${left > 1 ? "s" : ""})` : "Corriger"}</button><button class="btn" data-act="scReset" ${Object.keys(SC.place).length ? "" : "disabled"}>Tout retirer</button>`}</div>
  </section>`;
}

/* ---------- Avatars : dessins originaux inspirés des grands univers de la pop culture ---------- */
const AVK = (() => {
  const E = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const eyes = (y = 35, c = "#2b2440", dx = 6.5, r = 2.4) => E(32 - dx, y, r, c) + E(32 + dx, y, r, c) + E(32 - dx + .8, y - .9, .8, "#fff") + E(32 + dx + .8, y - .9, .8, "#fff");
  const smile = (y = 42, c = "#2b2440", w = 5) => `<path d="M${32 - w} ${y}q${w} ${w * .8} ${w * 2} 0" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
  const blush = (y = 40, c = "#ff8fa3") => `<ellipse cx="22" cy="${y}" rx="3" ry="1.8" fill="${c}" opacity=".5"/><ellipse cx="42" cy="${y}" rx="3" ry="1.8" fill="${c}" opacity=".5"/>`;
  const head = (c, y = 37, rx = 15, ry = 16) => `<ellipse cx="32" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
  const body = c => `<path d="M10 64c2-11 10-16 22-16s20 5 22 16z" fill="${c}"/>`;
  const S1 = "#ffd9b8", S2 = "#e8b48c", S3 = "#b07a52", S4 = "#7a4f33";
  const A = {
    /* Science-fiction */
    astro: { n: "Astronaute", g: "sf", bg: ["#16213e", "#2c3e80"], d: body("#e9edf5") + `<circle cx="32" cy="34" r="20" fill="#f4f6fb" stroke="#c9d1e3" stroke-width="2"/><rect x="17" y="24" width="30" height="21" rx="10" fill="#26315e"/><path d="M21 28q6-3 12 0" stroke="#8fb4ff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>` + E(26, 35, 2, "#ffd36b") + E(38, 35, 2, "#ffd36b") + `<rect x="27" y="52" width="10" height="5" rx="1.5" fill="#ff6b6b"/>` + E(12, 14, 1.2, "#fff") + E(52, 10, 1, "#fff") + E(56, 24, .8, "#fff") },
    robot: { n: "Robot", g: "sf", bg: ["#0f3d3e", "#167d7f"], d: body("#9aa7b8") + `<line x1="32" y1="9" x2="32" y2="17" stroke="#9aa7b8" stroke-width="2.5"/>` + E(32, 8, 3, "#ff5e7e") + `<rect x="16" y="17" width="32" height="28" rx="8" fill="#c8d2df"/><rect x="20" y="24" width="24" height="11" rx="5.5" fill="#1d2433"/>` + E(26, 29.5, 3, "#5ef2ff") + E(38, 29.5, 3, "#5ef2ff") + `<rect x="25" y="38" width="14" height="3" rx="1.5" fill="#7d8899"/><rect x="12" y="26" width="4" height="10" rx="2" fill="#9aa7b8"/><rect x="48" y="26" width="4" height="10" rx="2" fill="#9aa7b8"/>` },
    alien: { n: "Extraterrestre", g: "sf", bg: ["#1b1035", "#4a2a8c"], d: body("#5a3fa8") + `<path d="M24 16 19 7M40 16l5-9" stroke="#7be08a" stroke-width="2.5" stroke-linecap="round"/>` + E(19, 7, 3, "#c6ff8a") + E(45, 7, 3, "#c6ff8a") + `<path d="M32 14c11 0 17 8 17 17 0 11-9 19-17 19s-17-8-17-19c0-9 6-17 17-17z" fill="#7be08a"/><ellipse cx="25" cy="32" rx="5" ry="7" transform="rotate(-20 25 32)" fill="#14102a"/><ellipse cx="39" cy="32" rx="5" ry="7" transform="rotate(20 39 32)" fill="#14102a"/>` + E(24, 29, 1.4, "#fff") + E(40, 29, 1.4, "#fff") + `<path d="M29 43q3 2 6 0" stroke="#2f6b3a" stroke-width="2" fill="none" stroke-linecap="round"/>` },
    pilote: { n: "Pilote de l'espace", g: "sf", bg: ["#2b1b3d", "#d35454"], d: body("#2f3b55") + head(S2) + `<path d="M15 34c0-12 7-19 17-19s17 7 17 19v-4H15z" fill="#3d4a66"/><rect x="15" y="29" width="34" height="9" rx="4.5" fill="#ff9b3d"/><rect x="18" y="31" width="28" height="5" rx="2.5" fill="#ffd36b" opacity=".6"/>` + smile(44, "#5a3a2a", 4) + `<rect x="28" y="50" width="8" height="8" rx="2" fill="#ff9b3d"/>` },
    /* Fantasy */
    mage: { n: "Magicien", g: "fa", bg: ["#1d1a4d", "#4b3fb8"], d: body("#4b3fb8") + head(S1, 39, 13, 14) + `<path d="M18 33 33 3l14 30z" fill="#2e2a8c"/><path d="M14 34h36" stroke="#2e2a8c" stroke-width="5" stroke-linecap="round"/>` + `<path d="m30 14 1.2 2.6 2.8.3-2.1 1.9.6 2.8-2.5-1.4-2.5 1.4.6-2.8-2.1-1.9 2.8-.3z" fill="#ffd36b"/>` + E(38, 24, 1.2, "#ffd36b") + eyes(39, "#2b2440", 5.5, 2) + `<path d="M20 44c3 14 21 14 24 0-4 3-8 2-12 2s-8 1-12-2z" fill="#f2f2f7"/><path d="M27 45q5-3 10 0" stroke="#f2f2f7" stroke-width="3" stroke-linecap="round"/>` },
    elfe: { n: "Elfe", g: "fa", bg: ["#123d2a", "#2f8a5b"], d: body("#2f8a5b") + `<path d="M14 30c-4-2-8-8-9-12 5 2 9 5 11 9zM50 30c4-2 8-8 9-12-5 2-9 5-11 9z" fill="${S1}"/>` + `<path d="M16 30c0-12 7-18 16-18s16 6 16 18v20c-3-6-3-14-3-14H19s0 8-3 14z" fill="#f6dc8a"/>` + head(S1, 36, 13, 15) + `<path d="M19 30c4-8 22-8 26 0-6-4-20-4-26 0z" fill="#f6dc8a"/><path d="M20 26q12-6 24 0" stroke="#6fcf97" stroke-width="2.5" fill="none"/>` + E(32, 22, 2, "#9be0b8") + eyes(36, "#2d6a4f", 5.5, 2.2) + smile(43, "#8a4b3a", 3.5) },
    chevalier: { n: "Chevalier", g: "fa", bg: ["#3a2a1a", "#a5652e"], d: body("#8d99ae") + `<path d="M32 4c4 2 6 6 5 11-3-2-7-2-10 0-1-5 1-9 5-11z" fill="#e63946"/><path d="M16 28c0-10 7-15 16-15s16 5 16 15v16c0 4-7 8-16 8s-16-4-16-8z" fill="#c0c8d4"/><rect x="18" y="31" width="28" height="4" rx="2" fill="#2b2f3a"/><path d="M32 35v14" stroke="#9aa3b2" stroke-width="2"/>` + E(22, 42, 1, "#2b2f3a") + E(22, 46, 1, "#2b2f3a") + E(42, 42, 1, "#2b2f3a") + E(42, 46, 1, "#2b2f3a") },
    dragon: { n: "Petit dragon", g: "fa", bg: ["#3d0f1f", "#b23a48"], d: body("#2a9d5c") + `<path d="M20 20 15 7l11 8zM44 20l5-13-11 8z" fill="#f4d35e"/><ellipse cx="32" cy="36" rx="17" ry="15" fill="#3cc47c"/><ellipse cx="32" cy="43" rx="10" ry="7" fill="#a6f0c6"/>` + E(28, 42, 1.3, "#1d5c3a") + E(36, 42, 1.3, "#1d5c3a") + eyes(31, "#1d1d2b", 7, 3) + `<path d="M24 22l3 4 3-4 2 4 2-4 3 4 3-4" fill="none" stroke="#2a9d5c" stroke-width="2" stroke-linejoin="round"/><path d="M28 48q4 2 8 0" stroke="#1d5c3a" stroke-width="2" fill="none" stroke-linecap="round"/>` },
    /* Manga et animé */
    ninja: { n: "Ninja", g: "ma", bg: ["#111827", "#374151"], d: body("#1f2937") + head("#1f2937", 36, 16, 17) + `<rect x="17" y="29" width="30" height="11" rx="5.5" fill="${S2}"/>` + `<path d="M26 33l5 2M38 33l-5 2" stroke="#1f2937" stroke-width="1.6" stroke-linecap="round"/>` + E(26, 35.5, 2, "#1f2937") + E(38, 35.5, 2, "#1f2937") + `<rect x="15" y="22" width="34" height="5" rx="2" fill="#e63946"/><path d="M47 24l9-3-6 7z" fill="#e63946"/>` },
    samourai: { n: "Samouraï", g: "ma", bg: ["#3b0d0d", "#9b2226"], d: body("#264653") + `<path d="M23 15c0-6 18-6 18 0" fill="#1b1b2b"/><rect x="27" y="7" width="10" height="7" rx="3" fill="#1b1b2b"/>` + head(S1, 37, 14, 15) + `<path d="M18 30c2-10 26-10 28 0-6-5-22-5-28 0z" fill="#1b1b2b"/><rect x="17" y="27" width="30" height="4" rx="2" fill="#f1f1f1"/>` + `<path d="M24 34l5 1.5M40 34l-5 1.5" stroke="#1b1b2b" stroke-width="1.8" stroke-linecap="round"/>` + E(27, 37.5, 1.8, "#1b1b2b") + E(37, 37.5, 1.8, "#1b1b2b") + `<path d="M29 44h6" stroke="#8a4b3a" stroke-width="2" stroke-linecap="round"/>` },
    heroine: { n: "Héroïne manga", g: "ma", bg: ["#3d1356", "#e05aa7"], d: body("#ffffff") + `<path d="M27 52h10l-5 6z" fill="#e05aa7"/>` + `<path d="M12 40c-2-16 6-28 20-28s22 12 20 28l-5-6-3 8-3-10H22l-3 10-3-8z" fill="#ff7bbd"/>` + head(S1, 38, 13, 14) + `<path d="M17 32c2-10 10-14 15-14s13 4 15 14l-6-6-2 5-4-7-3 6-3-6-4 7-2-5z" fill="#ff7bbd"/>` + `<ellipse cx="26" cy="38" rx="3" ry="4" fill="#5b2a86"/><ellipse cx="38" cy="38" rx="3" ry="4" fill="#5b2a86"/>` + E(27, 36.5, 1.3, "#fff") + E(39, 36.5, 1.3, "#fff") + blush(43) + `<path d="M30 45q2 1.5 4 0" stroke="#8a4b3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>` },
    kitsune: { n: "Masque de renard", g: "ma", bg: ["#2a1a3d", "#c75b39"], d: body("#c0392b") + `<path d="M17 24 14 8l12 9zM47 24l3-16-12 9z" fill="#fdfdfd"/><path d="M17 22 16 12l7 6zM47 22l1-10-7 6z" fill="#e74c3c"/><path d="M15 30c0-9 8-14 17-14s17 5 17 14c0 8-9 18-17 22-8-4-17-14-17-22z" fill="#fdfdfd"/>` + `<path d="M21 31q4-3 8 1M43 31q-4-3-8 1" stroke="#c0392b" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M22 24q3-2 5 0M42 24q-3-2-5 0" stroke="#e74c3c" stroke-width="2" fill="none" stroke-linecap="round"/>` + E(32, 44, 2, "#2b2440") + `<path d="M26 38q6 3 12 0" stroke="#c0392b" stroke-width="1.6" fill="none"/>` },
    /* Super-héros */
    masque: { n: "Héros masqué", g: "sh", bg: ["#0d1b4c", "#1e56c8"], d: `<path d="M6 64c3-14 12-20 26-20s23 6 26 20z" fill="#d62839"/>` + body("#1e56c8") + `<path d="M26 50l6 6 6-6" fill="#ffd166"/>` + head(S2, 35) + `<path d="M17 29c0-10 6-15 15-15s15 5 15 15c-4-5-10-6-15-6s-11 1-15 6z" fill="#2b1d16"/>` + `<path d="M16 33c5-3 11-3 16 1 5-4 11-4 16-1-1 4-5 7-9 6-3 0-5-2-7-3-2 1-4 3-7 3-4 1-8-2-9-6z" fill="#d62839"/>` + E(25, 35, 1.8, "#fff") + E(39, 35, 1.8, "#fff") + smile(43, "#5a3a2a", 4) },
    etoile: { n: "Héroïne étoile", g: "sh", bg: ["#2d0b3a", "#7b2cbf"], d: body("#7b2cbf") + `<path d="m32 49 2 4 4.5.5-3.3 3 1 4.5-4.2-2.4-4.2 2.4 1-4.5-3.3-3 4.5-.5z" fill="#ffd166"/>` + `<path d="M14 44c-3-18 5-30 18-30s21 12 18 30c-2-6-3-10-3-10H17s-1 4-3 10z" fill="#f4a261"/>` + head(S3, 36, 14, 15) + `<path d="M18 30c3-8 9-11 14-11s11 3 14 11c-6-3-10-6-14-6s-8 3-14 6z" fill="#f4a261"/><rect x="17" y="31" width="30" height="7" rx="3.5" fill="#ffd166"/>` + E(25, 34.5, 1.7, "#2b2440") + E(39, 34.5, 1.7, "#2b2440") + smile(43, "#4a2a1a", 4) },
    ombre: { n: "Justicier de l'ombre", g: "sh", bg: ["#0b0b14", "#2d2f45"], d: body("#24263a") + `<path d="M12 46c0-22 8-34 20-34s20 12 20 34c-4-4-6-10-6-10H18s-2 6-6 10z" fill="#3a3d5c"/>` + head(S2, 37, 13, 14) + `<path d="M19 33c4-3 9-3 13 0 4-3 9-3 13 0v4c-4 2-9 2-13-1-4 3-9 3-13 1z" fill="#1a1b2b"/>` + E(26, 35, 1.6, "#9ad1ff") + E(38, 35, 1.6, "#9ad1ff") + `<path d="M28 44q4 1.5 8 0" stroke="#5a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>` },
    /* Jeux vidéo */
    pixel: { n: "Héros 8 bits", g: "jv", bg: ["#1a2f1a", "#3f8f3f"], d: (() => { const P = ["...HHHHHH...", "..HHHHHHHH..", "..HSSSSSSH..", "..SSESSESS..", "..SSSSSSSS..", "...SSMMSS...", "....SSSS....", "..TTTYYTTT..", ".TTTTYYTTTT.", ".TTTTTTTTTT."], C = { H: "#2d1b4e", S: "#f3c39a", E: "#1b1b2b", M: "#d9777f", T: "#2a9d8f", Y: "#ffd166" };
      return P.map((r, y) => [...r].map((c, x) => C[c] ? `<rect x="${8 + x * 4}" y="${12 + y * 4.4}" width="4.1" height="4.5" fill="${C[c]}"/>` : "").join("")).join(""); })() },
    joueur: { n: "Joueur pro", g: "jv", bg: ["#10182b", "#00b4d8"], d: body("#222b45") + head(S3, 37) + `<path d="M17 33c0-12 6-18 15-18s15 6 15 18c-3-7-9-10-15-10s-12 3-15 10z" fill="#1b1b2b"/>` + `<path d="M14 38v-6c0-11 8-18 18-18s18 7 18 18v6" stroke="#e9ecf5" stroke-width="3.5" fill="none"/><rect x="11" y="33" width="7" height="12" rx="3" fill="#00e0ff"/><rect x="46" y="33" width="7" height="12" rx="3" fill="#00e0ff"/><path d="M15 44q3 7 11 7" stroke="#e9ecf5" stroke-width="2" fill="none"/>` + E(26, 51, 1.8, "#00e0ff") + eyes(36, "#1b1b2b", 6, 2.2) + smile(42, "#3a2414", 4) },
    slime: { n: "Gelée gluante", g: "jv", bg: ["#0b2545", "#13315c"], d: `<path d="M10 54c0-14 9-30 22-30s22 16 22 30c0 4-4 6-22 6s-22-2-22-6z" fill="#4cc9f0"/><path d="M16 46c1-8 6-16 12-18" stroke="#c9f4ff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>` + eyes(44, "#0b2545", 7, 3) + `<path d="M28 51q4 3 8 0" stroke="#0b2545" stroke-width="2.2" fill="none" stroke-linecap="round"/>` + blush(49, "#ff8fab") },
    manette: { n: "Manette", g: "jv", bg: ["#2b2d42", "#ef233c"], d: `<path d="M14 26h36c6 0 10 6 10 14 0 9-4 14-8 14-5 0-6-7-11-7H23c-5 0-6 7-11 7-4 0-8-5-8-14 0-8 4-14 10-14z" fill="#edf2f4"/><path d="M18 33v10M13 38h10" stroke="#2b2d42" stroke-width="3.5" stroke-linecap="round"/>` + E(44, 34, 2.6, "#ef233c") + E(50, 39, 2.6, "#06d6a0") + E(38, 39, 2.6, "#118ab2") + E(44, 44, 2.6, "#ffd166") + `<rect x="28" y="32" width="8" height="3" rx="1.5" fill="#8d99ae"/>` },
    /* Horreur */
    vampire: { n: "Vampire", g: "ho", bg: ["#1a0b14", "#6a040f"], d: `<path d="M8 64c2-14 10-20 24-20s22 6 24 20z" fill="#1b1b2b"/><path d="M14 46l18 6 18-6-6 18H20z" fill="#9d0208"/>` + head("#e9e4f0", 36) + `<path d="M17 32c0-12 6-18 15-18s15 6 15 18c-3-4-6-6-9-6l-6 7-6-7c-3 0-6 2-9 6z" fill="#1b1b2b"/>` + `<path d="M25 36l-4-2M39 36l4-2" stroke="#1b1b2b" stroke-width="1.6" stroke-linecap="round"/>` + E(26, 37, 2, "#c1121f") + E(38, 37, 2, "#c1121f") + `<path d="M26 44q6 3 12 0" stroke="#5a1a2a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M28 45l1.3 3 1.2-2.6M36 45l-1.3 3-1.2-2.6" fill="#fff" stroke="#fff" stroke-width="1"/>` },
    zombie: { n: "Zombie", g: "ho", bg: ["#13200f", "#4f6d2f"], d: body("#5e548e") + head("#9cc58a", 37) + `<path d="M17 30c2-9 8-14 15-14s13 5 15 14l-4-3-3 4-4-5-4 4-4-4-3 4z" fill="#4a3b2a"/><path d="M38 26l6 6M40 30l2-2M42 32l-2 2" stroke="#3a5a2a" stroke-width="1.4"/>` + E(25, 36, 3, "#fff") + E(25, 36, 1.2, "#1b1b2b") + E(39, 37, 2.2, "#fff") + E(39.5, 37.5, 1, "#1b1b2b") + `<path d="M25 45h14" stroke="#2f3f22" stroke-width="2" stroke-linecap="round"/><path d="M28 43v4M32 43v4M36 43v4" stroke="#2f3f22" stroke-width="1.2"/>` },
    fantome: { n: "Fantôme", g: "ho", bg: ["#1b1f3a", "#4b5694"], d: `<path d="M14 58V34c0-12 8-20 18-20s18 8 18 20v24l-5-4-4 4-5-4-4 4-4-4-5 4-4-4z" fill="#f8f9ff"/>` + `<ellipse cx="26" cy="34" rx="3" ry="4.2" fill="#1b1f3a"/><ellipse cx="38" cy="34" rx="3" ry="4.2" fill="#1b1f3a"/><ellipse cx="32" cy="44" rx="3.2" ry="4" fill="#1b1f3a"/>` + blush(39, "#b8c0ff") },
    citrouille: { n: "Citrouille", g: "ho", bg: ["#1d0f2e", "#5a189a"], d: `<path d="M32 18c1-5 4-8 8-9" stroke="#3a7d44" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="38" rx="11" ry="16" fill="#f77f00"/><ellipse cx="42" cy="38" rx="11" ry="16" fill="#f77f00"/><ellipse cx="32" cy="38" rx="10" ry="17" fill="#fc9e3a"/>` + `<path d="m21 33 4-6 4 6zM35 33l4-6 4 6z" fill="#3a1a00"/><path d="M20 42c4 7 20 7 24 0l-3 2-3-2-3 3-3-3-3 3-3-3-3 2z" fill="#3a1a00"/>` },
    /* Aventure */
    pirate: { n: "Pirate", g: "av", bg: ["#0b3954", "#087e8b"], d: body("#f1f1f1") + `<path d="M22 50h20l-2 14H24z" fill="#c0392b" opacity=".0"/>` + head(S2, 38) + `<path d="M16 32c0-11 7-16 16-16s16 5 16 16z" fill="#c0392b"/><path d="M47 30l7 3-6 4z" fill="#c0392b"/>` + E(24, 25, 1.3, "#fff") + E(30, 22, 1.3, "#fff") + E(37, 24, 1.3, "#fff") + `<path d="M17 33l26 6" stroke="#1b1b2b" stroke-width="1.5"/><ellipse cx="38" cy="38" rx="4.2" ry="3.6" fill="#1b1b2b"/>` + E(26, 38, 2.2, "#1b1b2b") + `<path d="M24 46q8 4 16-1" stroke="#5a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M22 48c3 6 17 6 20 0" fill="#4a2c1a" opacity=".85"/>` },
    detective: { n: "Détective", g: "av", bg: ["#2b2118", "#7f5539"], d: body("#9c6644") + head(S1, 38, 14, 15) + `<path d="M15 30c1-10 8-15 17-15s16 5 17 15z" fill="#b08968"/><path d="M12 31h40" stroke="#7f5539" stroke-width="4" stroke-linecap="round"/><path d="M24 17l-4-5M40 17l4-5" stroke="#7f5539" stroke-width="2.5" stroke-linecap="round"/>` + eyes(38, "#2b2440", 6, 2) + `<path d="M28 45q4 2 8 0" stroke="#8a4b3a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="47" cy="49" r="6" fill="#bde0fe" fill-opacity=".5" stroke="#3a2a1a" stroke-width="2.4"/><path d="M51.5 53.5 57 59" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>` },
    cowboy: { n: "Cow-boy", g: "av", bg: ["#5f0f40", "#e36414"], d: body("#2a6f97") + `<path d="M26 50l6 5 6-5" fill="#e63946"/>` + head(S2, 38) + `<path d="M9 28c6 4 40 4 46 0-2 5-8 7-23 7s-21-2-23-7z" fill="#8b5a2b"/><path d="M19 29c0-10 5-17 13-17s13 7 13 17c-8 2-18 2-26 0z" fill="#a47148"/><path d="M19 26c8 2 18 2 26 0" stroke="#5a3a1a" stroke-width="2.5"/>` + eyes(39, "#2b2440", 6, 2) + `<path d="M26 46q6 3 12 0" stroke="#5a3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>` },
    explo: { n: "Exploratrice", g: "av", bg: ["#283618", "#606c38"], d: body("#bc6c25") + `<path d="M16 46c-2-8 0-14 3-16M48 46c2-8 0-14-3-16" stroke="#6b3e26" stroke-width="5" stroke-linecap="round"/>` + head(S3, 38, 14, 15) + `<path d="M12 31c6 3 34 3 40 0-2 4-7 6-20 6s-18-2-20-6z" fill="#dda15e"/><path d="M18 31c0-10 6-16 14-16s14 6 14 16c-8 2-20 2-28 0z" fill="#fefae0"/><path d="M18 28c8 2 20 2 28 0" stroke="#bc6c25" stroke-width="2.5"/>` + eyes(39, "#2b2440", 6, 2) + smile(45, "#4a2a1a", 4) },
    /* Mèmes et animaux */
    chat: { n: "Chat", g: "an", bg: ["#3a2e5c", "#7c6cf0"], d: `<path d="M14 30 12 10l14 10zM50 30l2-20-14 10z" fill="#f4a261"/><path d="M15 28 14 15l8 7zM49 28l1-13-8 7z" fill="#ffcdb2"/><ellipse cx="32" cy="40" rx="20" ry="18" fill="#f4a261"/><path d="M24 26l2 5M32 24v6M40 26l-2 5" stroke="#e07a2f" stroke-width="2.4" stroke-linecap="round"/>` + `<ellipse cx="24" cy="39" rx="3" ry="4" fill="#2b2440"/><ellipse cx="40" cy="39" rx="3" ry="4" fill="#2b2440"/>` + E(25, 37.5, 1.1, "#fff") + E(41, 37.5, 1.1, "#fff") + `<path d="m30 45 2 2 2-2z" fill="#e5627a"/><path d="M32 47q-3 3-5 1M32 47q3 3 5 1M20 46l-9-1M20 49l-8 2M44 46l9-1M44 49l8 2" stroke="#7a4a2a" stroke-width="1.3" fill="none" stroke-linecap="round"/>` },
    panda: { n: "Panda", g: "an", bg: ["#1f4e3d", "#52b788"], d: E(16, 22, 7, "#1b1b2b") + E(48, 22, 7, "#1b1b2b") + `<ellipse cx="32" cy="38" rx="20" ry="18" fill="#fdfdfd"/><ellipse cx="24" cy="37" rx="5.5" ry="7" transform="rotate(25 24 37)" fill="#1b1b2b"/><ellipse cx="40" cy="37" rx="5.5" ry="7" transform="rotate(-25 40 37)" fill="#1b1b2b"/>` + E(25, 36, 2, "#fff") + E(39, 36, 2, "#fff") + E(25.5, 36.3, 1, "#1b1b2b") + E(38.5, 36.3, 1, "#1b1b2b") + `<ellipse cx="32" cy="44" rx="3" ry="2" fill="#1b1b2b"/><path d="M29 48q3 2 6 0" stroke="#1b1b2b" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M50 50c-6-2-8-10-4-14" stroke="#74c69d" stroke-width="3" fill="none"/><path d="M47 40l5-3M48 45l5-1" stroke="#40916c" stroke-width="2" stroke-linecap="round"/>` },
    renard: { n: "Renard", g: "an", bg: ["#3d1e0f", "#e76f51"], d: `<path d="M13 32 15 8l12 12zM51 32 49 8 37 20z" fill="#e76f51"/><path d="M16 27l1-13 6 7zM48 27l-1-13-6 7z" fill="#2b2440"/><path d="M12 34c0-11 9-18 20-18s20 7 20 18c0 9-10 20-20 20S12 43 12 34z" fill="#e76f51"/><path d="M12 36c6 0 12 4 15 10 2 4 3 8 5 8s3-4 5-8c3-6 9-10 15-10-2 10-11 18-20 18s-18-8-20-18z" fill="#fff4ea"/>` + eyes(35, "#2b2440", 8, 2.4) + E(32, 48, 2.6, "#2b2440") },
    hibou: { n: "Hibou studieux", g: "an", bg: ["#1d2d44", "#3e5c76"], d: `<path d="M14 24l4-10 6 7zM50 24l-4-10-6 7z" fill="#8d6346"/><ellipse cx="32" cy="38" rx="19" ry="20" fill="#a9785a"/><ellipse cx="32" cy="46" rx="11" ry="10" fill="#e9d5c0"/>` + E(24, 34, 7.5, "#fff") + E(40, 34, 7.5, "#fff") + `<circle cx="24" cy="34" r="8" fill="none" stroke="#2b2440" stroke-width="2"/><circle cx="40" cy="34" r="8" fill="none" stroke="#2b2440" stroke-width="2"/><path d="M32 34h0" stroke="#2b2440" stroke-width="2"/><path d="M30.5 34h3" stroke="#2b2440" stroke-width="2"/>` + E(24, 34, 3, "#2b2440") + E(40, 34, 3, "#2b2440") + `<path d="m29 41 3 4 3-4z" fill="#f4a261"/><path d="M27 49l2 2M32 50v2M37 49l-2 2" stroke="#a9785a" stroke-width="1.4" stroke-linecap="round"/><path d="M16 12h32l-16-6z" fill="#1b1b2b"/><path d="M44 12v6" stroke="#ffd166" stroke-width="1.5"/>` + E(44, 19, 1.5, "#ffd166") },
    capy: { n: "Capybara zen", g: "an", bg: ["#344e41", "#a3b18a"], d: `<path d="M8 64c2-16 12-22 24-22s22 6 24 22z" fill="#9c6b3f"/><path d="M12 38c0-14 9-22 20-22s20 8 20 22c0 8-8 14-20 14S12 46 12 38z" fill="#b5835a"/>` + E(17, 21, 3.5, "#9c6b3f") + E(47, 21, 3.5, "#9c6b3f") + `<path d="M23 33q3-2 6 0M35 33q3-2 6 0" stroke="#3a2414" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="32" cy="44" rx="8" ry="5" fill="#8a5a33"/>` + E(29, 43, 1.1, "#3a2414") + E(35, 43, 1.1, "#3a2414") + `<ellipse cx="32" cy="15" rx="7" ry="5" fill="#ff9f1c"/><path d="M32 10v-3" stroke="#3a7d44" stroke-width="2" stroke-linecap="round"/><path d="M33 8q3-2 4 0" stroke="#3a7d44" stroke-width="1.6" fill="none"/>` },
    axolotl: { n: "Axolotl", g: "an", bg: ["#023e8a", "#48cae4"], d: `<path d="M14 26 4 20M13 32 3 31M14 38l-9 4M50 26l10-6M51 32l10-1M50 38l9 4" stroke="#ff8fab" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="32" cy="36" rx="19" ry="16" fill="#ffc8dd"/>` + eyes(35, "#2b2440", 9, 2.6) + `<path d="M27 42q5 4 10 0" stroke="#c9184a" stroke-width="2" fill="none" stroke-linecap="round"/>` + blush(41, "#ff5d8f") + `<path d="M14 64c3-8 9-12 18-12s15 4 18 12z" fill="#ffafcc"/>` }
  };
  return A;
})();
const AVG = { sf: "Science-fiction", fa: "Fantasy", ma: "Manga et animé", sh: "Super-héros", jv: "Jeux vidéo", ho: "Horreur", av: "Aventure", an: "Animaux et mèmes" };
function avSvg(id) {
  const a = AVK[id]; if (!a) return "";
  return `<svg viewBox="0 0 64 64" class="av-svg" aria-hidden="true"><defs><radialGradient id="avg-${id}" cx="35%" cy="25%" r="80%"><stop offset="0" stop-color="${a.bg[1]}"/><stop offset="1" stop-color="${a.bg[0]}"/></radialGradient><clipPath id="avc-${id}"><circle cx="32" cy="32" r="32"/></clipPath></defs><g clip-path="url(#avc-${id})"><rect width="64" height="64" fill="url(#avg-${id})"/>${a.d}</g></svg>`;
}

/* Avatars des autres élèves : prénom affiché → avatar (envoyé par le serveur) */
const AVM = { map: {}, at: 0, sig: "" };
function avMine() { return S.av && AVK[S.av] ? S.av : ""; }
function avOf(n) { const me = [P().name, window.GL_NAME, S.cl && S.cl.p, "Moi"].filter(Boolean); if (me.includes(n) && avMine()) return avMine(); const a = AVM.map[n]; return a && AVK[a] ? a : ""; }
function avLoad(force) {
  if (typeof window.GL_AV !== "function" || Date.now() - AVM.at < (force ? 5000 : 45000)) return;
  AVM.at = Date.now();
  window.GL_AV().then(j => { const m = (j && j.map) || {}, sig = JSON.stringify(m); if (sig === AVM.sig) return; AVM.map = m; AVM.sig = sig; if ((view === "amis" || view === "classe") && !document.querySelector("input:focus")) render(); }).catch(() => {});
}
function avSheet() {
  closeSheet();
  const cur = avMine(), el = document.createElement("div"); el.className = "wk-sheet"; el.id = "wkSheet";
  const groups = Object.keys(AVG).map(g => `<div class="av-grp"><h3>${h(AVG[g])}</h3><div class="av-grid">${Object.keys(AVK).filter(k => AVK[k].g === g).map(k => `<button class="av-pick" data-act="avSet" data-av="${k}" aria-pressed="${cur === k}" title="${h(AVK[k].n)}">${avSvg(k)}<small>${h(AVK[k].n)}</small></button>`).join("")}</div></div>`).join("");
  el.innerHTML = `<div class="wk-box av-box" role="dialog" aria-modal="true" aria-labelledby="avT"><button class="wk-x" data-act="wkClose" aria-label="Fermer">×</button>
    <h2 id="avT">Choisis ton avatar</h2><p class="muted">Tes amis le verront dans la liste d'amis, le classement, les duels et les salles de révision.</p>
    <div class="av-grp"><div class="av-grid"><button class="av-pick" data-act="avSet" data-av="" aria-pressed="${!cur}"><span class="av-ini">${h(duIni(P().name || window.GL_NAME || "Moi"))}</span><small>Mes initiales</small></button></div></div>
    ${groups}</div>`;
  el.addEventListener("click", e => { if (e.target === el) closeSheet(); });
  document.body.appendChild(el); tone("open");
}
const CXBY = Object.fromEntries(CXG.map(g => [g.id, g]));
const cxNum = v => { const t = String(v || "").replace(/[\s  €%]|jours?/gi, "").replace(",", ".").replace("−", "-"); return t === "" || isNaN(+t) ? null : +t; };
let CX = null, cxFrom = "ex";
function cxStart(cat, only) {
  const st = S.cx || {}, pool = CXG.filter(g => (!cat || g.cat === cat) && !lockedCat(g.cat) && (!only || only.includes(g.id)));
  if (!pool.length) return;
  const w = g => { const r = st[g.id] || [0, 0]; return 1 + (r[0] ? (1 - r[1] / r[0]) * 3 : 1.5); }; // plus de place aux calculs ratés ou jamais faits
  const pick = () => { const tot = pool.reduce((s, g) => s + w(g), 0); let x = Math.random() * tot; for (const g of pool) { x -= w(g); if (x <= 0) return g; } return pool[0]; };
  const list = []; let last = null;
  for (let k = 0; k < 10; k++) { let g = pick(), guard = 0; while (pool.length > 1 && last && g.id === last && guard++ < 8) g = pick(); last = g.id; list.push(Object.assign({ g: g.id, cat: g.cat, t: g.t }, g.make())); }
  CX = { cat, list, i: 0, ok: 0, done: false };
  go("calc");
}
function cxCheck() {
  const it = CX.list[CX.i], el = document.getElementById("cxIn"), v = cxNum(el && el.value); if (v == null) { toast("Tape un nombre (ex. 1 250,50)"); return; }
  const tol = it.tol != null ? (it.tol < .01 ? Math.abs(it.a) * it.tol : it.tol) : (it.u === "€" ? Math.max(1, Math.abs(it.a) * .001) : .05);
  it.user = v; it.ok = Math.abs(v - it.a) <= tol + 1e-9; it.shown = true;
  S.cx = S.cx || {}; const r = S.cx[it.g] = S.cx[it.g] || [0, 0]; r[0]++; if (it.ok) r[1]++; wlog("cx", it.cat);
  if (it.ok) { CX.ok++; S.xp += it.hintUsed ? 2 : 4; } else S.xp += 1;
  tone(it.ok ? "ok" : "ko"); buzz(it.ok ? 15 : [35, 45, 35]); dayLog().e++; bumpStreak(); touch(); renderTop(); render();
  setTimeout(() => { const f = document.querySelector(".cx-corr"); if (f) f.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "nearest" }); }, 30);
}
function cxHome(cat) {
  const st = S.cx || {}, cats = ["p1", "p2", "p3", "p4", "p5", "p6"].filter(c => (!cat || c === cat) && CXG.some(g => g.cat === c));
  const tot = Object.values(st).reduce((a, r) => [a[0] + r[0], a[1] + r[1]], [0, 0]);
  return `<div class="ex-group cx-home"><h2>Calculs express</h2><p class="muted">10 calculs courts, de nouveaux chiffres à chaque fois, sans chrono. Tu tapes ton résultat et la correction détaille chaque étape. Les calculs que tu rates reviennent plus souvent.${tot[0] ? ` <b>${tot[1]}/${tot[0]}</b> justes jusqu'ici.` : ""}</p>
    <div class="ex-grid g3">${cat ? "" : `<button class="ex-card cx-all" data-act="cxGo" data-c=""><span class="mini">P1 à P6</span><b>Tout mélanger</b><span class="muted">${CXG.length} types de calculs</span></button>`}
    ${cats.map(c => { const gs = CXG.filter(g => g.cat === c), d = gs.reduce((a, g) => { const r = st[g.id]; return r ? [a[0] + r[0], a[1] + r[1]] : a; }, [0, 0]);
      return `<button class="ex-card" style="${hueStyle(c)}" data-act="cxGo" data-c="${c}" data-cat="${c}"><span class="mini">${h(CAT[c].code)}</span><b>${h(CAT[c].name)}</b><span class="muted">${gs.length} types · ${d[0] ? Math.round(d[1] / d[0] * 100) + " % de réussite" : "pas encore fait"}</span></button>`; }).join("")}</div></div>`;
}
function cxFocus() { setTimeout(() => { const i = document.getElementById("cxIn"); if (i && !i.disabled && view === "calc") i.focus({ preventScroll: true }); }, 60); }
function vCalc() { cxFocus(); return vCalc2(); }
function vCalc2() {
  if (!CX) return vExHome();
  if (CX.done) {
    const ko = CX.list.filter(x => !x.ok), pc = Math.round(CX.ok / CX.list.length * 100);
    return `<section class="runner ex-runner"><div class="runner-top"><span class="progress-text">Calculs express</span><span class="ep">${CX.cat ? h(CAT[CX.cat].code) : "P1 à P6"}</span></div>
      <div class="qcard cx-end"><span class="eyebrow">Résultat</span><h2 class="cx-score">${CX.ok}/${CX.list.length}</h2><p>${pc === 100 ? "Sans faute, bravo !" : pc >= 70 ? "Bien joué. Refais ceux qui ont coincé pour les ancrer." : "Ces calculs demandent de la pratique : refais ceux qui ont coincé, avec l'indice si besoin."}</p>
      ${ko.length ? `<div class="label">À retravailler</div><ul class="cx-ko">${ko.filter((x, i) => ko.findIndex(y => y.g === x.g) === i).map(x => `<li style="${hueStyle(x.cat)}"><span class="mini">${h(CAT[x.cat].code)}</span>${h(x.t)}</li>`).join("")}</ul>` : ""}</div>
      <div class="row">${ko.length ? `<button class="btn primary" data-act="cxRetry">Refaire ces calculs avec de nouveaux chiffres</button>` : ""}<button class="btn${ko.length ? "" : " primary"}" data-act="cxGo" data-c="${CX.cat || ""}">Nouvelle série</button><button class="btn" data-act="cxBack">Retour</button></div></section>`;
  }
  const it = CX.list[CX.i];
  return `<section class="runner ex-runner cx-run">
    <div class="runner-top"><span class="progress-text">Calcul ${CX.i + 1} sur ${CX.list.length}</span><span class="ep">${h(CAT[it.cat].code)} · ${h(it.t)}</span></div>
    <div class="bar" aria-hidden="true"><i style="width:${CX.i / CX.list.length * 100}%"></i></div>
    <div class="qcard" style="${hueStyle(it.cat)}">
      <p class="qtext">${it.q}</p>
      ${it.hintShown && !it.shown ? `<p class="cx-hint"><b>Indice :</b> ${h(it.hint)}</p>` : ""}
      <form class="cx-form" data-cxf="1" autocomplete="off"><label class="cx-in${it.shown ? (it.ok ? " ok" : " ko") : ""}"><input id="cxIn" inputmode="decimal" enterkeyhint="done" placeholder="Ta réponse" aria-label="Ta réponse" value="${it.shown && it.user != null ? h(fmt(it.user)) : ""}" ${it.shown ? "disabled" : ""}><span>${h(it.u)}</span></label>
      ${it.shown ? "" : `<button class="btn primary" type="submit">Vérifier</button>`}</form>
      ${it.shown ? `<div class="feedback cx-corr"><span class="verdict ${it.ok ? "ok" : "ko"}">${it.ok ? "Juste !" : `Pas tout à fait : ${fmt(it.a)} ${h(it.u)}`}</span>
        <div class="label">Correction pas à pas</div><ol class="cx-steps">${it.steps.map(x => `<li>${x}</li>`).join("")}</ol><p class="muted small">Méthode : ${h(it.hint)}</p></div>` : ""}
    </div>
    <div class="row">${it.shown ? `<button class="btn primary" data-act="cxNext">${CX.i + 1 < CX.list.length ? "Calcul suivant" : "Voir mon résultat"}</button>` : `<button class="btn" data-act="cxHint" ${it.hintShown ? "disabled" : ""}>Un indice</button><button class="btn" data-act="cxSkip">Voir la correction</button>`}<button class="btn" data-act="cxBack">Quitter</button></div>
  </section>`;
}

document.addEventListener("submit", e => { if (e.target.matches && e.target.matches("[data-cxf]")) { e.preventDefault(); cxCheck(); } });
/* ---------- Mon plan : programme de révision semaine par semaine jusqu'aux écrits ---------- */
let PLSET = false;
function plW() { const w = {}; EPREUVES.forEach(e => e.cats.forEach(c => { if (PL_CATS.includes(c)) w[c] = (w[c] || 0) + e.k / e.cats.length; })); return w; }
const dnOf = iso => Math.floor(Date.parse(iso + "T12:00:00Z") / 864e5);
function plCfg() { S.pl = S.pl || {}; const p = S.pl; if (!p.days) p.days = 5; if (!p.min) p.min = 30; p.hist = p.hist || []; return p; }
/* Journal de la semaine : ce que tu as fait, par matière */
function waRoll() { // changement de semaine : on archive le bilan de la semaine passée avant de remettre le journal à zéro
  const w = weekId(); if (S.wa && S.wa.w === w) return S.wa;
  const p = S.pl; if (p && p.cur && !p.cur.arch && p.cur.w < w) { p.hist = p.hist || []; p.hist.unshift({ w: p.cur.w, r: plRateIn(p.cur, S.wa && S.wa.w === p.cur.w ? S.wa : null), f: p.cur.focus }); p.hist = p.hist.slice(0, 12); p.cur.arch = 1; }
  S.wa = { w, d: {}, cd: [] }; return S.wa;
}
function wlog(kind, cat, n) { if (!cat) return; const wa = waRoll(), o = wa.d[cat] || (wa.d[cat] = {}); o[kind] = (o[kind] || 0) + (n || 1); }
function plCardDay() { const wa = waRoll(); wa.cd = wa.cd || []; const d = dayNum(); if (!wa.cd.includes(d)) wa.cd.push(d); }
function plInfo() {
  const b = btsState(), now = dayNum(), ex = dnOf(b.date), wl = Math.max(0, Math.ceil((ex - now) / 7));
  const phase = wl > 10 ? "learn" : wl > 4 ? "conso" : "sprint";
  const learnLeft = Math.max(1, wl - 10);
  return { wl, phase, learnLeft, ex };
}
const PL_PH = { learn: ["Avancer dans les cours", "Tu découvres le programme : leçons, quiz et premiers calculs, matière par matière."], conso: ["Consolider", "Le cours est vu : place aux exercices, aux annales, aux schémas et aux calculs."], sprint: ["Sprint final", "Examens blancs, annales chronométrées, cartes du jour et cahier des erreurs. Plus de nouveau chapitre la dernière semaine."] };
function plProg(c) { const ls = lessonStats(c), m = mastery(c); return { lr: ls.n ? ls.r / ls.n : 1, left: ls.n - ls.r, ma: m.t ? m.m / m.t : 0 }; }
/* Choix des matières de la semaine : poids dans la note × retard × points faibles, sans reprendre les mêmes chaque semaine */
function plPickFocus(prev) {
  const W = plW(), wk = {}; weakChaps(12).forEach(o => { wk[chCat(o.k)] = (wk[chCat(o.k)] || 0) + 1; });
  const cats = PL_CATS.filter(c => !lockedCat(c) && CAT[c] && ((QBY[c] || []).length || coursesOf(c).length));
  const sc = cats.map(c => { const p = plProg(c), def = 1 - (p.lr * .5 + p.ma * .5); return { c, s: (W[c] || .5) * (.3 + def) * (1 + .25 * Math.min(3, wk[c] || 0)) * ((prev || []).includes(c) ? .45 : 1) }; }).sort((a, b) => b.s - a.s);
  return sc.map(x => x.c);
}
/* Les tâches d'une matière pour la semaine, selon la phase et le temps disponible */
function plTasksFor(c, phase, B, info) {
  const T = [], pro = /^p[1-6]$/.test(c), p = plProg(c), cn = CAT[c].name;
  const lessonsN = phase === "learn" && p.left ? Math.max(1, Math.min(p.left, Math.round(B * .5 / 12), Math.ceil(p.left / Math.max(1, info.learnLeft) * 2.2))) : 0;
  if (lessonsN) T.push({ k: "l", c, n: lessonsN, t: `Lire ${lessonsN} leçon${lessonsN > 1 ? "s" : ""} ${/^[AEIOUÉÈÂ]/i.test(cn) ? "d'" : "de "}${cn}`, m: 12 * lessonsN, act: `data-act="plLesson" data-cat="${c}"` });
  const qn = B >= 50 ? 20 : 10;
  T.push({ k: "q", c, n: qn, t: `Répondre à ${qn} questions de quiz en ${cn}`, m: qn / 2, act: `data-act="quickQuiz" data-cat="${c}"` });
  if (pro && CXG.some(g => g.cat === c) && (phase !== "learn" || p.lr > .3)) T.push({ k: "cx", c, n: 10, t: `Faire 10 calculs express ${CAT[c].code}`, m: 12, act: `data-act="cxGo" data-c="${c}"` });
  if (phase !== "learn" && SCH.some(s => s.cat === c)) T.push({ k: "sc", c, n: 1, t: `Reconstruire un schéma ${CAT[c].code} (à trous ou seul)`, m: 8, act: `data-act="plSchema" data-cat="${c}"` });
  if (phase !== "learn" && B >= 40) {
    if (c === "ce" || c === "cg") T.push({ k: "x", c, n: 1, t: `Une rédaction en ${cn}, comparée au corrigé`, m: 45, act: `data-act="plRedac"` });
    else if (c !== "an") T.push({ k: "x", c, n: 1, t: `Un exercice guidé ou une annale en ${cn}`, m: 30, act: `data-act="mat" data-cat="${c}" data-seg="train"` });
  }
  return T;
}
function plBuild(w, prev) {
  const cfg = plCfg(), info = plInfo(), budget = cfg.days * cfg.min, nf = budget >= 200 ? 3 : 2;
  const order = plPickFocus(prev), pro = order.filter(c => /^p/.test(c)), gen = order.filter(c => !/^p/.test(c)); // une matière professionnelle + une générale, puis la meilleure suivante
  const focus = [pro[0], gen[0]].filter(Boolean); for (const c of order) if (focus.length < nf && !focus.includes(c)) focus.push(c);
  const B = (budget - cfg.days * 5) / focus.length;
  let tasks = [{ k: "cd", c: "*", n: Math.min(cfg.days, info.phase === "sprint" ? 7 : cfg.days), t: "Cartes du jour", m: 5, act: `data-act="today"` }];
  if (info.phase === "sprint") {
    tasks.push({ k: "ex", c: "*", n: 1, t: "Un QCM chrono (20 questions en 20 minutes)", m: 20, act: `data-act="goExam"` });
    tasks.push({ k: "err", c: "*", n: 10, t: "Revoir 10 questions du cahier des erreurs", m: 8, act: `data-act="goErr"` });
  }
  focus.forEach(c => { tasks = tasks.concat(plTasksFor(c, info.phase, B, info)); });
  const idx = (dayNum() + 3) % 7, left = 7 - idx, f = Math.min(1, left / cfg.days); // plan commencé en cours de semaine : objectifs réduits d'autant
  if (f < 1) tasks.forEach(t => { t.n = t.k === "cd" ? Math.min(t.n, left) : Math.max(1, Math.round(t.n * f)); t.m = t.m * f; t.t = t.t.replace(/\d+/, String(t.n)).replace(/leçons (de|d')/, t.n > 1 ? "leçons $1" : "leçon $1"); });
  tasks.forEach((t, i) => t.id = i);
  return { w, d0: dayNum(), v: Date.now(), focus, tasks, phase: info.phase, days: cfg.days, min: cfg.min };
}
function plWeek() {
  const cfg = plCfg(), w = weekId(); waRoll();
  if (!cfg.cur || cfg.cur.w !== w) { const pf = cfg.cur ? cfg.cur.focus : []; cfg.cur = Object.assign(plBuild(w, pf), { prevFocus: pf }); saveLocal(); }
  return cfg.cur;
}
function plDoneIn(t, wa) {
  if (!wa) return 0;
  if (t.k === "cd") return (wa.cd || []).length;
  if (t.c === "*") return Object.values(wa.d).reduce((s, o) => s + (o[t.k] || 0), 0);
  return ((wa.d[t.c] || {})[t.k]) || 0;
}
function plDone(t) { return plDoneIn(t, S.wa && S.wa.w === weekId() ? S.wa : null); }
function plRateIn(pw, wa) { const tot = pw.tasks.reduce((s, t) => s + t.n, 0), d = pw.tasks.reduce((s, t) => s + Math.min(t.n, plDoneIn(t, wa)), 0); return tot ? d / tot : 1; }
function plRate(pw) { return plRateIn(pw, S.wa && S.wa.w === weekId() ? S.wa : null); }
function plStatus(pw) {
  const r = plRate(pw), d0 = pw.d0 || dayNum(), span = Math.max(1, Math.min(pw.days, 7 - (d0 + 3) % 7)), exp = Math.min(1, (dayNum() - d0) / span) * .9;
  return r >= 1 ? ["ok", "Semaine bouclée !"] : r >= exp + .1 && r > 0 ? ["ok", "En avance"] : r >= exp - .15 ? ["mid", "À jour"] : ["ko", "Un peu de retard"];
}
/* Séance du jour : deux tâches du plan, figées pour la journée (celles où tu as le plus de retard) */
function plToday() {
  const pw = plWeek(), cfg = plCfg(), d = dayNum();
  if (!cfg.td || cfg.td.d !== d || cfg.td.w !== pw.w || cfg.td.v !== pw.v) {
    const left = pw.tasks.filter(t => t.k !== "cd" && plDone(t) < t.n).sort((a, b) => plDone(a) / a.n - plDone(b) / b.n || a.id - b.id);
    const pick = [], seen = new Set(); left.forEach(t => { if (pick.length < 2 && !seen.has(t.c)) { pick.push(t.id); seen.add(t.c); } }); left.forEach(t => { if (pick.length < 2 && !pick.includes(t.id)) pick.push(t.id); });
    cfg.td = { d, w: pw.w, v: pw.v, pick, base: Object.fromEntries(pw.tasks.map(t => [t.id, plDone(t)])) };
  }
  return cfg.td.pick.map(id => pw.tasks[id]).filter(Boolean).map(t => ({ t, done: plDone(t) >= t.n || plDone(t) > (cfg.td.base[t.id] || 0) }));
}
function plTaskRow(t, small) {
  const d = Math.min(t.n, plDone(t)), ok = d >= t.n, sty = t.c !== "*" ? ` style="${hueStyle(t.c)}"` : "";
  return `<li class="pl-t${ok ? " done" : ""}"${sty}><span class="pl-ck" aria-hidden="true">${ok ? ICON.check : ""}</span><div><b>${h(t.t)}</b><span class="pl-bar"><i style="width:${Math.round(d / t.n * 100)}%"></i></span><small>${t.k === "cd" ? `${d} jour${d > 1 ? "s" : ""} sur ${t.n}` : `${d} sur ${t.n}`} · environ ${Math.round(t.m)} min</small></div>${ok || small ? "" : `<button class="btn small" ${t.act}>Y aller</button>`}</li>`;
}
function plSection() {
  const pw = plWeek(), info = plInfo(), cfg = plCfg(), st = plStatus(pw), r = plRate(pw), ph = PL_PH[pw.phase];
  const wd = new Date(); wd.setDate(wd.getDate() - ((wd.getDay() + 6) % 7)); const we = new Date(wd); we.setDate(wd.getDate() + 6);
  const fd = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const seg = (k, opts) => `<div class="seg-mini" role="group">${opts.map(([v, l]) => `<button data-act="plCfg" data-k="${k}" data-v="${v}" aria-pressed="${cfg[k] === v}">${l}</button>`).join("")}</div>`;
  return `<section class="stack pl" id="monPlan">
    <div class="pl-head"><div><span class="eyebrow">Semaine du ${fd(wd)} au ${fd(we)} · ${info.wl} semaine${info.wl > 1 ? "s" : ""} avant les écrits</span><h2>Mon plan de la semaine</h2></div><span class="pill pl-st ${st[0]}">${st[1]}</span></div>
    <div class="pl-phase"><b>Phase : ${h(ph[0])}</b><span>${h(ph[1])}</span><div class="pl-phases">${["learn", "conso", "sprint"].map(k => `<i class="${k === pw.phase ? "on" : ""}">${h(PL_PH[k][0])}</i>`).join("")}</div></div>
    <div class="pl-prog"><div class="bar"><i style="width:${Math.round(r * 100)}%"></i></div><span><b>${Math.round(r * 100)} %</b> de la semaine fait · matières ciblées : ${pw.focus.map(c => `<span class="tabcode" style="${hueStyle(c)}">${h(CAT[c].code)}</span>`).join(" ")}</span></div>
    <ol class="pl-list">${pw.tasks.map(t => plTaskRow(t)).join("")}</ol>
    <details class="pl-set"${PLSET ? " open" : ""}><summary>Régler mon rythme</summary>
      <div class="pf-row"><div><b>Jours de révision par semaine</b><span>Le plan est recalculé la semaine prochaine, ou tout de suite avec le bouton ci-dessous.</span></div>${seg("days", [[3, "3"], [4, "4"], [5, "5"], [6, "6"]])}</div>
      <div class="pf-row"><div><b>Temps par séance</b><span>Environ ${Math.round(cfg.days * cfg.min / 60 * 10) / 10} h par semaine.</span></div>${seg("min", [[20, "20 min"], [30, "30 min"], [45, "45 min"], [60, "1 h"]])}</div>
      <div class="row"><button class="btn small" data-act="plRebuild">Recalculer le plan de cette semaine</button></div>
    </details>
    ${cfg.hist.length ? `<div class="pl-hist"><span class="muted small">Semaines précédentes</span><div>${cfg.hist.slice(0, 8).reverse().map(x => `<span class="pl-h ${x.r >= .9 ? "ok" : x.r >= .5 ? "mid" : "ko"}" title="${Math.round(x.r * 100)} %"><i style="height:${Math.max(8, Math.round(x.r * 100))}%"></i></span>`).join("")}</div></div>` : ""}
  </section>`;
}
const nk = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
let GLX = null, GLRE = null;
function glBuild() {
  if (GLX) return; GLX = {};
  const GEN = new Set("environnement innovation investissement responsabilite responsabilites coordination construction introduction conclusion performance representation traitement integration proportion plateforme competence competences entrepreneur problematique processus strategie ressources declaration exceptionnel contractuelle independance opportunite paraphrase reintegration regroupement extracontractuelle responsabilite indenombrable".split(" "));
  const put = (term, e, prio) => { term = String(term).replace(/\(.*?\)/g, "").replace(/[()]/g, "").trim(); if (term.length < 2 || term.split(/\s+/).length > 5 || /\d\)?$/.test(term) && !/^[A-Z]/.test(term) || /^\d+$/.test(term)) return;
    if (/^(à|a|de|du|des|en|le|la|les|l'|d'|et|ou|sur|par|pour|au|aux)\s/i.test(term) || /^[a-zéèàç]/.test(term) && term.split(/\s+/).length < 2) return;
    if (!/\s/.test(term) && prio < 3) { const acr = /^[A-Z][A-Z0-9&.-]{1,7}$/.test(term); if (!acr && (!/^[A-ZÉÈ]/.test(term) || term.length < 9 || GEN.has(nk(term)))) return; } const k = nk(term); const cur = GLX[k]; if (!cur || cur.p < prio) GLX[k] = Object.assign({ t: term, p: prio }, e); else if (cur && !cur.f && e.f) Object.assign(cur, { f: e.f, x: e.x }); };
  FS.forEach(x => { const f = String(x.f || ""); if (x.c === "an" || /[:·]/.test(f) || f.length > 40) return; const words = f.split(/\s+/).length, acr = /^[A-Z0-9]{2,6}$/.test(f); if (words === 1 && !acr && f.length < 7) return; f.split(/\s*\/\s*/).forEach(t => put(t, { d: x.b, ch: x.ch, c: x.c }, 1)); });
  CHAP.forEach(c => (c.sections || []).forEach(s => (s.b || []).forEach(b => { if (b[0] !== "d") return; String(b[1]).split(/\s*\/\s*/).forEach(t => put(t, { d: b[2], ch: c.id, c: c.cat }, 2)); })));
  GLF.forEach(([names, f, x]) => names.forEach(n => { const k = nk(n); if (GLX[k]) Object.assign(GLX[k], { f, x }); else GLX[k] = { t: n, p: 3, f, x, d: "" }; }));
  const terms = Object.values(GLX).map(e => e.t).filter(t => t.length >= 2).sort((a, b) => b.length - a.length);
  const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/'/g, "['’]");
  try { GLRE = new RegExp("(?<![\\p{L}\\p{N}])(" + terms.map(esc).join("|") + ")(?![\\p{L}\\p{N}])", "giu"); } catch (e) { GLRE = null; }
}
const GL_ZONES = ".feedback, .qx, .cx-corr, .face-back .back, .more-box, .ex-corr, .sc-key, .review-item .e, .lesson .md p, .lesson .md li, .lesson .md td, .gc-corr, .pl-phase";
function glossify(root) {
  if (S.pref && S.pref.gt === "off") return; glBuild(); if (!GLRE || !root) return;
  root.querySelectorAll(GL_ZONES).forEach(zone => {
    if (zone.dataset.gl || (zone.parentElement && zone.parentElement.closest(GL_ZONES))) return; zone.dataset.gl = "1";
    const seen = new Set(); let n = 0;
    const tw = document.createTreeWalker(zone, NodeFilter.SHOW_TEXT, { acceptNode: t => t.parentElement.closest("a, button, h1, h2, h3, h4, summary, label, code, kbd, input, textarea, .gt, .verdict, .md-label, strong, b") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
    for (const node of nodes) {
      if (n >= 10) break; const txt = node.nodeValue; GLRE.lastIndex = 0; let m, last = 0; const frag = document.createDocumentFragment(); let hit = false;
      while ((m = GLRE.exec(txt)) && n < 10) {
        const raw = m[1], k = nk(raw), e = GLX[k]; if (!e || seen.has(k)) continue;
        if (/^[A-Z0-9]{2,6}$/.test(e.t) && raw !== e.t) continue; // sigles : casse exacte
        seen.add(k); n++; hit = true;
        frag.append(txt.slice(last, m.index)); const bt = document.createElement("button"); bt.className = "gt" + (e.f ? " f" : ""); bt.dataset.act = "gt"; bt.dataset.k = k; bt.type = "button"; bt.textContent = raw; frag.append(bt); last = m.index + raw.length;
      }
      if (hit) { frag.append(txt.slice(last)); node.replaceWith(frag); }
    }
  });
}
function gtClose() { const p = document.getElementById("gtPop"); if (p) p.remove(); document.removeEventListener("keydown", gtKey); }
function gtKey(e) { if (e.key === "Escape") gtClose(); }
function gtShow(b) {
  glBuild(); const e = GLX[b.dataset.k]; if (!e) return; const same = document.getElementById("gtPop"); gtClose(); if (same && same.dataset.k === b.dataset.k) return;
  const p = document.createElement("div"); p.id = "gtPop"; p.className = "gt-pop"; p.dataset.k = b.dataset.k; p.setAttribute("role", "dialog");
  if (e.c && CAT[e.c]) p.setAttribute("style", hueStyle(e.c));
  p.innerHTML = `<div class="gt-h"><b>${h(e.t)}</b>${e.c && CAT[e.c] ? `<span class="tabcode">${h(CAT[e.c].code)}</span>` : ""}<button class="gt-x" data-act="gtClose" aria-label="Fermer">×</button></div>
    ${e.d ? `<p>${h(e.d)}</p>` : ""}
    ${e.f ? `<div class="gt-f"><span>Comment le calculer</span><p>${h(e.f)}</p>${e.x ? `<small>Exemple : ${h(e.x)}</small>` : ""}</div>` : ""}
    ${e.ch && CHID[e.ch] ? `<button class="btn small" data-act="fichePeek" data-id="${h(e.ch)}" data-hint="${h(e.t + " " + (e.d || ""))}">${ICON.book}Voir dans la fiche</button>` : ""}`;
  document.body.appendChild(p);
  const r = b.getBoundingClientRect(), W = Math.min(340, window.innerWidth - 24), H = p.offsetHeight;
  let left = Math.min(Math.max(12, r.left + r.width / 2 - W / 2), window.innerWidth - W - 12), top = r.bottom + 8;
  if (top + H > window.innerHeight - 12) top = Math.max(12, r.top - H - 8);
  p.style.width = W + "px"; p.style.left = left + "px"; p.style.top = top + "px";
  requestAnimationFrame(() => p.classList.add("in")); tone("soft");
  document.addEventListener("keydown", gtKey);
}
document.addEventListener("pointerdown", e => { if (!e.target.closest("#gtPop, .gt")) gtClose(); }, true);
window.addEventListener("scroll", () => gtClose(), { passive: true });

/* Sélection libre : un appui long (ou une sélection à la souris) fait apparaître « Expliquer » */
const SEL_ZONES = ".lesson, .peek-body, .feedback, .qx, .cx-corr, .face-back, .more-box, .ex-corr, .sc-key, .review-item, .gc-corr, .pl-phase, .q-card, .quiz, .card";
let SEL = null, selT = null;
function selBubClose() { const b = document.getElementById("selBub"); if (b) b.remove(); }
function selRead() {
  const sel = window.getSelection(); if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const txt = sel.toString().replace(/\s+/g, " ").trim(); if (txt.length < 2 || txt.length > 400) return null;
  const r = sel.getRangeAt(0), node = r.commonAncestorContainer, el = node.nodeType === 1 ? node : node.parentElement;
  if (!el || el.closest("input, textarea, [contenteditable], .gt-pop, .sel-bub, nav, header")) return null;
  const zone = el.closest(SEL_ZONES); if (!zone) return null;
  const rects = r.getClientRects(), last = rects.length ? rects[rects.length - 1] : r.getBoundingClientRect();
  const box = r.getBoundingClientRect(); if (!box.width && !box.height) return null;
  const ctx = (el.closest("p, li, td, .feedback, .qx, .more-box") || zone).textContent.replace(/\s+/g, " ").trim().slice(0, 700);
  const qEl = document.querySelector(".q-text, .qtext, .quiz h2, .q-card h2, main h2"), q = qEl && !qEl.contains(el) ? qEl.textContent.replace(/\s+/g, " ").trim().slice(0, 300) : "";
  return { txt, box, last, ctx, q };
}
function selUpdate() {
  if (S.pref && S.pref.gt === "off") return selBubClose();
  const d = selRead(); if (!d) { selBubClose(); return; }
  SEL = d; let b = document.getElementById("selBub");
  if (!b) { b = document.createElement("button"); b.id = "selBub"; b.type = "button"; b.className = "sel-bub"; b.dataset.act = "selX"; b.innerHTML = `${ICON.search}Expliquer`;
    b.addEventListener("pointerdown", e => e.preventDefault()); document.body.appendChild(b); requestAnimationFrame(() => b.classList.add("in")); }
  const W = b.offsetWidth || 120, H = b.offsetHeight || 36, coarse = matchMedia("(pointer: coarse)").matches;
  let top = coarse ? d.box.bottom + 14 : d.box.top - H - 8;
  if (top + H > window.innerHeight - 76) top = d.box.top - H - 52; if (top < 8) top = Math.min(window.innerHeight - H - 76, d.box.bottom + 14);
  const left = Math.min(Math.max(8, (coarse ? d.box.left + d.box.width / 2 : d.last.right) - W / 2), window.innerWidth - W - 8);
  b.style.left = left + "px"; b.style.top = Math.max(8, top) + "px";
}
document.addEventListener("selectionchange", () => { clearTimeout(selT); selT = setTimeout(selUpdate, 250); });
window.addEventListener("scroll", () => { if (document.getElementById("selBub")) selUpdate(); }, { passive: true });
function selFind(txt) {
  glBuild(); const out = [], k = nk(txt);
  if (GLX[k]) out.push(GLX[k]);
  if (GLRE) { GLRE.lastIndex = 0; let m; while ((m = GLRE.exec(txt)) && out.length < 3) { const e = GLX[nk(m[1])]; if (e && !out.includes(e)) out.push(e); } }
  if (!out.length && k.length >= 4) { const e = Object.values(GLX).find(e => e.t.length >= 4 && nk(e.t).includes(k)); if (e) out.push(e); }
  return out;
}
function selChap(txt, ctx) {
  const words = nk(txt + " " + (txt.split(/\s+/).length < 3 ? ctx : "")).split(/[^a-z0-9%€]+/).filter(w => w.length >= 4 && !/^(dans|pour|avec|sans|plus|moins|cette|sont|elle|leur|tout|entre|apres|avant|selon|limite)$/.test(w));
  if (!words.length) return null; const main = nk(txt).split(/[^a-z0-9%€]+/).filter(w => w.length >= 4);
  let best = null, bs = 0;
  CHAP.forEach(c => { if (!c._nk) c._nk = nk(c.title + " " + JSON.stringify(c.sections || []));
    let sc = 0; words.forEach(w => { if (c._nk.includes(w)) sc += main.includes(w) ? 3 : 1; }); if (c._nk.includes(nk(txt))) sc += 8;
    if (sc > bs) { bs = sc; best = c; } });
  return bs >= 3 && best && !lockedCat(best.cat) ? best : null;
}
function selExplain() {
  const d = SEL; selBubClose(); if (!d) return; gtClose();
  const found = selFind(d.txt), ch = selChap(d.txt, d.ctx), ai = SAMPLE_STATE === "ok" && SAMPLE;
  const p = document.createElement("div"); p.id = "gtPop"; p.className = "gt-pop"; p.setAttribute("role", "dialog");
  const c0 = found[0] && found[0].c && CAT[found[0].c] ? found[0].c : ch ? ch.cat : null; if (c0) p.setAttribute("style", hueStyle(c0));
  const short = d.txt.length > 90 ? d.txt.slice(0, 87) + "…" : d.txt;
  p.innerHTML = `<div class="gt-h"><b class="gt-q">« ${h(short)} »</b><button class="gt-x" data-act="gtClose" aria-label="Fermer">×</button></div>
    ${found.map((e, i) => `<div${i ? ' class="gt-sep"' : ""}>${found.length > 1 || nk(e.t) !== nk(d.txt) ? `<p><b>${h(e.t)}</b></p>` : ""}${e.d ? `<p>${h(e.d)}</p>` : ""}${e.f ? `<div class="gt-f"><span>Comment le calculer</span><p>${h(e.f)}</p>${e.x ? `<small>Exemple : ${h(e.x)}</small>` : ""}</div>` : ""}</div>`).join("")}
    ${!found.length && !ai ? `<p class="muted">Pas de définition toute prête pour ce passage. Sélectionne un mot ou une expression plus courte${ch ? ", ou ouvre la fiche qui en parle" : ""}.</p>` : ""}
    <div class="gt-ai" id="gtAi">${ai ? `<button class="btn small${found.length ? "" : " primary"}" data-act="selAI">${ICON.talk}Expliquer avec Claude</button>` : ""}</div>
    ${ch ? `<button class="btn small" data-act="fichePeek" data-id="${h(ch.id)}" data-hint="${h(d.txt)}">${ICON.book}Voir dans la fiche : ${h(ch.title.length > 40 ? ch.title.slice(0, 38) + "…" : ch.title)}</button>` : ""}`;
  document.body.appendChild(p);
  const W = Math.min(360, window.innerWidth - 24); p.style.width = W + "px";
  const H = p.offsetHeight; let left = Math.min(Math.max(12, d.box.left + d.box.width / 2 - W / 2), window.innerWidth - W - 12), top = d.box.bottom + 10;
  if (top + H > window.innerHeight - 76) top = Math.max(12, d.box.top - H - 10);
  p.style.left = left + "px"; p.style.top = top + "px";
  requestAnimationFrame(() => p.classList.add("in")); tone("soft"); document.addEventListener("keydown", gtKey);
  if (!found.length && ai) selAI();
}
async function selAI() {
  const d = SEL, box = document.getElementById("gtAi"); if (!d || !box || !SAMPLE) return;
  box.innerHTML = `<p class="muted">Claude rédige une explication…</p>`;
  const prompt = `Tu es professeur en BTS Comptabilité et Gestion. Un élève a sélectionné ce passage et ne le comprend pas : « ${d.txt} ».
${d.q ? `Question en cours : « ${d.q} ».\n` : ""}Contexte autour : « ${d.ctx} ».
Explique-lui ce passage simplement, en tutoyant, en 4 à 6 phrases courtes. Définis les mots techniques. Si c'est un calcul ou une règle chiffrée, donne un petit exemple chiffré. Réponds en texte brut, sans titre, sans markdown, sans liste à puces et sans tiret long.`;
  try {
    const r = await SAMPLE(prompt); let t = String(typeof r === "string" ? r : r && (r.text || r.content) || "").trim().replace(/\*\*/g, "").replace(/ — /g, ", ");
    if (!t) throw 0; if (!document.getElementById("gtAi")) return;
    document.getElementById("gtAi").innerHTML = `<p>${h(t)}</p><span class="muted">Explication générée par Claude. Vérifie avec ta fiche en cas de doute.</span>`;
  } catch (e) {
    const code = e && e.code; const b2 = document.getElementById("gtAi"); if (!b2) return;
    b2.innerHTML = `<p class="muted">${code === "rate_limited" ? "Limite du jour atteinte. Réessaie demain." : "L'explication n'est pas disponible pour le moment."}</p>`;
  }
}

/* Revoir la fiche : on ouvre directement sur le passage qui contient la réponse */
const STOPW = new Set("dans pour avec sans sont elle elles leur leurs mais plus moins comme entre cette celui celle ceux quel quelle quels quelles dont donc tout tous toute toutes faut peut doit être avoir fait sont suis lors chez vers aussi ainsi alors très bien même autre autres selon après avant depuis pendant encore quand".split(" "));
function hintTokens(s) { return nk(s).replace(/[^a-z0-9%,.' -]/g, " ").split(/[\s']+/).map(w => w.replace(/^[.,]+|[.,]+$/g, "")).filter(w => (w.length >= 4 && !STOPW.has(w)) || /^\d{3,}$/.test(w)); }
function peekTarget(body, hint) {
  if (!hint || !body) return;
  const [ans, ...rest] = String(hint).split("\u241E"), ta = new Set(hintTokens(ans)), tq = new Set(hintTokens(rest.join(" ")));
  let best = null, bs = 0;
  body.querySelectorAll(".md p, .md li, .md tr, .md blockquote, .md pre").forEach(el => {
    if (el.querySelector("p, li, tr") && el.tagName !== "TR") return;
    const words = new Set(hintTokens(el.textContent)); let s = 0;
    ta.forEach(w => { if (words.has(w)) s += 3; }); tq.forEach(w => { if (words.has(w)) s += 1; });
    s = s / (1 + el.textContent.length / 600); if (s > bs) { bs = s; best = el; }
  });
  if (!best || bs < 2.5) return;
  const tgt = best.tagName === "TR" ? best.closest("table") || best : best;
  best.classList.add("peek-hit");
  setTimeout(() => { const top = tgt.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 60; body.scrollTo({ top: Math.max(0, top), behavior: RM ? "auto" : "smooth" }); }, 380);
}

/* Flashcards : formuler le recto comme une vraie question */
function cardQ(it) {
  const f = String(it.f || "").replace(/^T\d\s*·\s*/, "").trim(), b = String(it.b || ""), lc = f.charAt(0).toLowerCase() + f.slice(1);
  if (it.c === "an") return { k: "Traduis", q: f };
  let m = f.match(/^(.*?)\s*:\s*(\d+)\s+(.+)$/); if (m) return { k: "Cite", q: `${m[2]} ${m[3]} : ${m[1]}` };
  if (/^(les|la|le)\s+\d+\s/i.test(f) || /^(exemples?|liste|types?|conditions?|étapes?|principes?|sources?|critères?|caractères?|éléments?|missions?|fonctions?|obligations?|droits?)\b/i.test(f)) return { k: "Cite", q: lc };
  if (/^(rédiger|calculer|construire|analyser|présenter|identifier|choisir|réussir|gérer|organiser|comparer|interpréter|lire|faire|traiter|structurer|argumenter|préparer|utiliser|réviser|éviter|distinguer|comptabiliser|déterminer|appliquer|évaluer|mesurer|justifier|répondre|reconnaître|passer|enregistrer|établir|vérifier|contrôler)\b/i.test(f)) return { k: "Méthode", q: `Comment ${lc} ?` };
  if (/^écritures?\b/i.test(f)) return { k: "Écriture", q: `Quelle est l'${lc} ?` };
  if (/^(formule|taux|coût|seuil|calcul|écart|montant)/i.test(f) || /^[A-Za-z*()\s']{1,12}=/.test(b)) return { k: "Formule", q: `Comment calcule-t-on : ${lc} ?` };
  if (/\b\d{3,6}\b[^.]{0,30}(débit|crédit|\/)|au (débit|crédit)/i.test(b) && !/:/.test(f)) return { k: "Écriture", q: `Comment l'enregistre-t-on : ${lc} ?` };
  if (/:/.test(f)) return { k: "Explique", q: f };
  if (/\s\/\s/.test(f)) { const p = f.split(/\s\/\s/); return { k: "Différencie", q: p.length > 2 ? p.slice(0, -1).join(", ") + " et " + p[p.length - 1] : p.join(" et ") }; }
  if (/,/.test(f) && f.split(",").length <= 3 && f.split(",").every(x => x.trim().split(/\s+/).length <= 3)) return { k: "Différencie", q: f.replace(/,\s*([^,]+)$/, " et $1") };
  if (/^[A-Z0-9][A-Z0-9&.-]{1,7}$/.test(f)) return { k: "Que signifie", q: `${f} ? Que faut-il en retenir ?` };
  if ((it.c === "ce" || it.c === "cg") && /^[A-ZÉ][\wé'-]+(\s(&|et)\s[A-ZÉ][\wé'-]+)?$/.test(f)) return { k: "Explique", q: `Qui est ou que désigne « ${f} » ?` };
  if (f.split(/\s+/).length <= 5) return { k: "Définis", q: f };
  return { k: "Explique", q: f };
}

/* Correction détaillée d'une question de calcul */
function qxHTML(it) {
  const x = QX[it.id]; if (!x) return "";
  return `<div class="qx"><span class="qx-t">Détail du calcul</span><p class="qx-f"><span>Formule</span>${h(x.f)}</p><ol>${x.s.map(s => `<li>${h(s)}</li>`).join("")}</ol>${x.w ? `<p class="qx-w"><b>Attention :</b> ${h(x.w)}</p>` : ""}</div>`;
}

/* ---------- Événements ---------- */
document.addEventListener("click", e => {
  { const t0 = tone.n || 0, sh0 = !!document.getElementById("wkSheet"), el = e.target.closest("button, a.btn, [data-act], [data-nav], summary, label");
    if (el && !el.disabled) setTimeout(() => { if ((tone.n || 0) !== t0) return; const sh = document.getElementById("wkSheet"); tone(sh && !sh0 ? "open" : el.closest("[data-nav]") ? "nav" : "tick"); }, 0); }
  const nb = e.target.closest("[data-nav]");
  if (nb) { FROMPACK = null; ORIG = null; const v = nb.dataset.nav; if (v === "cours") coursQuery = ""; if (v === "fiches") ficheQuery = ""; if (view === "annex") annSaveNow(); go(v); return; }
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act, cat = b.dataset.cat;
  try { RUN_T = runTitle(b, a, cat) || null; } catch (x) { RUN_T = null; }
  if (view === "pack" && PK != null && !/^(pkBack|pkEdit|pkDel|pkIcs)$/.test(a)) FROMPACK = PK;
  if (cat && lockedCat(cat) && !/^(toggle|annEp|annTag|pref|orF)/.test(a)) { lockSheet(cat); return; }
  switch (a) {
    case "quizCat": quizSel = [cat]; go("quiz"); break;
    case "cardsCat": cardSel = [cat]; go("cards"); break;
    case "flashCat": { const d = dueCards([cat], true); let l = shuffle(d.reviews).slice(0, 30).concat(shuffle(d.fresh).slice(0, 15)).slice(0, 30); if (!l.length) l = shuffle(FS.filter(x => x.c === cat && chapOk(x))); startCards(l.slice(0, P().clen)); break; }
    case "goEx": go("ex"); break;
    case "exStart": startEx([b.dataset.gid], "single"); break;
    case "rxOpen": go("rx"); break;
    case "reciteHome": RC = { key: b.dataset.cid || reciteKeys()[0], items: null }; go("rchome"); break;
    case "rcHome": go("rchome"); break;
    case "rcGo": reciteStart(b.dataset.key, b.dataset.card != null ? [+b.dataset.card] : null, !!b.dataset.weak); break;
    case "rcShow": if (RC) { RC.shown = true; render(); } break;
    case "memoOpen": go("memo"); break;
    case "memoCat": MEMCAT = b.dataset.c || ""; render(); break;
    case "memoGo": { const l = memQuizItems(QS.filter(x => !lockedCat(x.c) && (view !== "memo" || !MEMCAT || x.c === MEMCAT)), 15); if (l.length) startRun(shuffle(l), "quiz"); else toast("Rien ne s'efface pour l'instant"); break; }
    case "memoCards": { const l = memCardItems(30).filter(x => view !== "memo" || !MEMCAT || x.c === MEMCAT); if (l.length) startCards(l); break; }
    case "memoCh": { const pool = (QCH[b.dataset.k] || []).filter(x => !lockedCat(x.c)), a1 = memQuizItems(pool, 10), rest = shuffle(pool.filter(x => !a1.includes(x))).sort((x, y) => (memQ(x.id, dayNum()) == null ? 0 : 1) - (memQ(y.id, dayNum()) == null ? 0 : 1)); const l = a1.concat(rest).slice(0, 10); if (l.length) startRun(shuffle(l), "quiz"); else { const f = FCH[b.dataset.k] || []; if (f.length) startCards(shuffle(f).slice(0, 20)); } break; }
    case "bbOpen": go("bts"); setTimeout(() => { const e = document.getElementById("bbSec"); if (e) e.scrollIntoView({ block: "start" }); }, 60); break;
    case "bbToSim": { const bt = btsState(); Object.entries(S.bb || {}).forEach(([k, v]) => { if (v && v.n != null && v.n !== "") bt.notes[k] = v.n; }); touch(); render(); toast("Notes reportées dans le simulateur"); break; }
    case "bbPlan": { const e = EPREUVES.find(x => x.c === b.dataset.e); if (!e) break; const pool = QS.filter(x => e.cats.includes(x.c) && !lockedCat(x.c)), wk = memChaps(e.cats).sort((a, c) => (a.m == null ? .4 : a.m) - (c.m == null ? .4 : c.m)).slice(0, 4).map(x => x.k);
      const a1 = memQuizItems(pool, 10), more = shuffle(pool.filter(x => wk.includes(x.ch) && !a1.includes(x))); const l = a1.concat(more).slice(0, 15); if (l.length) startRun(shuffle(l), "quiz"); break; }
    case "fmode": FMODE = b.dataset.m === "full" ? "full" : "recap"; try { localStorage.setItem("gl-fmode", FMODE); } catch (e) {} render(); window.scrollTo(0, 0); break;
    case "auSit": { const r = x => { const q = S.q[x.id]; return !q ? 1 : q[2] === 0 ? 0 : 2; }, y = b.dataset.yr || "all"; const l = AUSIT.filter(x => y === "all" || x.y.includes(y)); if (l.length) startRun(shuffle(l), "quiz"); break; }
    case "auQuiz": { const r = x => { const q = S.q[x.id]; return !q ? 1 : q[2] === 0 ? 0 : 2; }, yr = b.dataset.yr || MDYR, inc = !!b.dataset.inc; const l = shuffle(QS.filter(x => x.t && /^au/.test(x.t) && !inc && (yr === "all" || x.t.includes(yr)))).sort((a, c) => r(a) - r(c)).slice(0, 15);
      if (inc) { const g = {}; QS.filter(x => x.t && x.t.startsWith("ad" + yr + ":")).forEach(x => (g[x.t] = g[x.t] || []).push(x)); const gr = Object.values(g), w = p => Math.min(...p.map(r)); l.length = 0; shuffle(gr).sort((a, c) => w(a) - w(c)).slice(0, 8).forEach(p => l.push(...p)); }
      if (l.length) startRun(l, "quiz"); break; }
    case "mdYr": MDYR = b.dataset.yr; document.querySelectorAll('[data-act="mdYr"]').forEach(c => c.setAttribute("aria-pressed", c.dataset.yr === MDYR)); document.querySelectorAll(".md-yrt tr[data-yr]").forEach(tr => { tr.hidden = MDYR !== "all" && !tr.dataset.yr.split(" ").includes(MDYR); }); break;
    case "rcHint": if (RC) { RC.hint = true; render(); } break;
    case "rcAgain": if (RC) reciteStart(RC.key, RC.cards, false); break;
    case "rcNext": { if (!RC || !RC.items) break; const cur = RC.items[RC.i], ok = b.dataset.ok;
      if (ok === "skip") RC.res[RC.i] = null; else { S.rc = S.rc || {}; const k = RC.key + "|" + cur.ci + "-" + cur.li, r = S.rc[k] || [0, 0, 0]; r[1]++; if (ok === "1") r[0]++; r[2] = ok === "1" ? 1 : 0; S.rc[k] = r; RC.res[RC.i] = ok === "1"; touch(); }
      RC.i++; RC.shown = false; RC.hint = false;
      const nx = RC.items[RC.i]; if (nx && rcNote(COURS_META[RC.key].script[nx.ci][2][nx.li])) RC.shown = true;
      render(); break; }
    case "chsQuiz": { const L = (b.dataset.chs || "").split(","), r = x => { const q = S.q[x.id]; return !q ? 1 : q[2] === 0 ? 0 : 2; }; const l = shuffle(QS.filter(x => L.includes(x.ch))).sort((a, c) => r(a) - r(c)).slice(0, 15); if (l.length) startRun(l, "quiz"); break; }
    case "chsCards": { const L = (b.dataset.chs || "").split(","), l = FS.filter(x => L.includes(x.ch)); if (l.length) startCards(shuffle(l).slice(0, 30)); break; }
    case "rxRead": { RXI = b.dataset.id; S.rx = S.rx || {}; if (!S.rx[RXI]) { S.rx[RXI] = dayNum(); touch(); } go("rxread"); break; }
    case "rxQuiz": { const it = rxItems().find(x => x.id === b.dataset.id); if (it) startRun(rxPick(it), "quiz"); break; }
    case "rxOral": OF.e = b.dataset.e || "E6"; OR = null; oralStart(); break;
    case "rxJump": RXEP = b.dataset.ep || ""; render(); break;
    case "rxCx": { const it = rxItems().find(x => x.id === b.dataset.id); if (it && it.cx) cxStart(it.cat, [it.cx]); break; }
    case "rxCards": { const it = rxItems().find(x => x.id === b.dataset.id); if (it) startCards(shuffle(rxFs(it)).slice(0, 20)); break; }
    case "exCheck": { readUser(); const it = X.list[X.i]; grade(it); recordEx(it); touch(); render(); break; }
    case "exShow": { readUser(); const it = X.list[X.i]; it.user = { f: [], rows: [] }; grade(it); render(); break; }
    case "exAgain": startEx([X.list[X.i].gid], "single"); break;
    case "exHome": go("ex"); break;
    case "exRow": readUser(); X.list[X.i].user.rows.push({}); render(); break;
    case "exE5": { const by = c => shuffle(GENS.filter(g => g.cat === c).map(g => g.id)); startEx([...by("p1").slice(0, 2), ...by("p2").slice(0, 2), by("p3")[0], by("p4")[0]], "e5", 45); break; }
    case "exNextE5": readUser(); X.i++; render(); window.scrollTo({ top: 0 }); break;
    case "exPrev": readUser(); X.i--; render(); window.scrollTo({ top: 0 }); break;
    case "exFinishE5": finishE5(); break;
    case "dosStart": startDos(b.dataset.did); window.scrollTo({ top: 0 }); break;
    case "exam5": startExamE5(); window.scrollTo({ top: 0 }); break;
    case "exam5Resume": e5Resume(); window.scrollTo({ top: 0 }); break;
    case "exam5Drop": e5Drop(); render(); break;
    case "dosGo": readUser(); X.i = +b.dataset.i; render(); window.scrollTo({ top: 0 }); break;
    case "dosCk": { const it = X.list[+b.dataset.m]; if (!it) break; it.ck = it.ck || []; it.ck[+b.dataset.j] = b.checked; grade(it); dosRecord(false); touch();
      const k = +b.dataset.m, t = `${fmtN20(it.pts * it.res.score)} / ${it.pts}`; ["dosPts", "dosEp"].forEach(p => { const e = document.getElementById(p + k); if (e) e.textContent = t; });
      const n = document.getElementById("dosNote"); if (n) n.innerHTML = `${fmtN20(dosNote())}<small> /20</small>`; break; }
    case "exRedac": { const r = REDACBY[b.dataset.rid]; if (r && lockedCat(r.cat)) { lockSheet(r.cat); break; } RD = { id: b.dataset.rid }; go("redac"); break; }
    case "pfTab": PFT.t = b.dataset.t; try { localStorage.setItem("gl-pft", PFT.t); } catch (e) {} render(); break;
    case "pvRestore": { const id = b.dataset.id; askConfirm("Restaurer cette version ?", `Ta progression passera à ${b.dataset.xp} XP, sur tous tes appareils. La version actuelle (${S.xp} XP) est gardée de côté.`, "Restaurer").then(ok => { if (!ok) return; window.GL_PV.restore(id).then(j => { keepCopy(S); S = JSON.parse(JSON.stringify(j.data)); normS(); if (syncUid) S.uid = syncUid; dirty = false; saveLocal(); PV.list = null; renderTop.xp = S.xp; render(); toast("Progression restaurée"); confettiBurst(30); }).catch(e => toast((e && e.message) || "Restauration impossible")); }); break; }
    case "plCfg": { PLSET = true; const p = plCfg(); p[b.dataset.k] = +b.dataset.v; touch(); render(); break; }
    case "plRebuild": { const p = plCfg(), prev = p.cur && p.cur.prevFocus || []; p.cur = Object.assign(plBuild(weekId(), prev), { prevFocus: prev }); touch(); render(); toast("Plan de la semaine recalculé"); break; }
    case "plLesson": { const c = b.dataset.cat; let t = null; for (const cid of coursesOf(c)) { for (let k = 1; k <= nLessons(cid); k++) if (!isRead(cid, k)) { t = { cid, k }; break; } if (t) break; } if (t) openLesson(t.cid, t.k); else toast("Toutes les leçons de cette matière sont lues"); break; }
    case "plSchema": { scFrom = "ex"; setExTab("schemas"); go("ex"); break; }
    case "plRedac": { setExTab("redac"); go("ex"); break; }
    case "plSee": { go("bts"); setTimeout(() => { const el = document.getElementById("monPlan"); if (el) el.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); }, 60); break; }
    case "cxGo": cxFrom = view === "mat" ? "mat" : view === "calc" ? cxFrom : "ex"; cxStart(b.dataset.c || ""); break;
    case "cxHint": { const it = CX.list[CX.i]; it.hintShown = it.hintUsed = true; render(); break; }
    case "cxSkip": { const it = CX.list[CX.i]; it.user = null; it.ok = false; it.shown = true; S.cx = S.cx || {}; const r = S.cx[it.g] = S.cx[it.g] || [0, 0]; r[0]++; wlog("cx", it.cat); touch(); tone("soft"); render(); break; }
    case "cxNext": if (CX.i + 1 < CX.list.length) { CX.i++; render(); window.scrollTo({ top: 0 }); } else { CX.done = true; if (CX.ok === CX.list.length) { confettiBurst(60); tone("lvl"); } else tone("xp"); render(); window.scrollTo({ top: 0 }); } break;
    case "cxRetry": cxStart(CX.cat, [...new Set(CX.list.filter(x => !x.ok).map(x => x.g))]); break;
    case "cxBack": if (cxFrom === "mat") go("mat"); else { setExTab("chiffres"); go("ex"); } break;
    case "avPick": avSheet(); break;
    case "avSet": { const v = b.dataset.av || ""; if (v) S.av = v; else delete S.av; touch(); closeSheet(); render(); renderTop(); tone(v ? "pop" : "soft"); if (v) { toast("Avatar : " + AVK[v].n); confettiBurst(24); } avLoad(true); break; }
    case "scOpen": scFrom = view === "mat" ? "mat" : "ex"; schStart(b.dataset.sid, "voir"); go("schema"); break;
    case "scMode": schStart(SC.id, b.dataset.m); render(); { const f = document.querySelector(".sc-seg"); if (f) f.scrollIntoView({ block: "nearest" }); } break;
    case "scBack": if (scFrom === "mat") go("mat"); else { setExTab("schemas"); go("ex"); } break;
    case "scChip": { const k = +b.dataset.k; if (SC.slot != null) schSet(SC.slot, k); else { SC.pick = SC.pick === k ? null : k; buzz(6); } render(); break; }
    case "scSlot": { const i = +b.dataset.i; if (SC.place[i] != null && SC.pick == null) { delete SC.place[i]; SC.slot = i; tone("unpop"); } else if (SC.pick != null) schSet(i, SC.pick); else SC.slot = SC.slot === i ? null : i; render(); break; }
    case "scCheck": schCheck(); render(); { const f = document.querySelector(".sc-run .feedback"); if (f) f.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" }); } break;
    case "scReset": SC.place = {}; SC.pick = null; SC.slot = null; render(); break;
    case "scNext": { const l = SCH.filter(x => !lockedCat(x.cat)), i = l.findIndex(x => x.id === SC.id), nx = l[(i + 1) % l.length]; schStart(nx.id, "voir"); go("schema"); break; }
    case "rdShow": RD.text = document.getElementById("rdText").value; RD.shown = true; render(); break;
    case "rdScore": { const r = REDACBY[RD.id]; wlog("x", r.cat); const ck = [...document.querySelectorAll("[data-crit]")].map(e => e.checked); const sc = Math.round(ck.filter(Boolean).length / r.crit.length * 100); S.x = S.x || {}; const o = S.x[r.id] || [0, 0, 0]; S.x[r.id] = [o[0] + 1, Math.max(o[1], sc), sc]; S.xp += Math.round(15 * sc / 100); dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak(); touch(); go("ex"); break; }
    case "coursCat": openMat(cat, "lecons"); break;
    case "fiche": openFiche(b.dataset.id); break;
    case "annOpen": annSaveNow(); openAnn(b.dataset.id); break;
    case "annEp": ANF.ep = b.dataset.ep || ""; ANF.tag = ""; render(); break;
    case "annTag": ANF.tag = ANF.tag === b.dataset.tag ? "" : b.dataset.tag; render(); break;
    case "annNotion": annSaveNow(); gsOpen(b.dataset.q); break;
    case "annCorrect": annCorrect(); break;
    case "annStop": if (annCtl) annCtl.abort(); break;
    case "annTimer": annSaveNow(); annTimerToggle(); break;
    case "annPhotoDel": { annSaveNow(); const k = b.dataset.kind; if (ANP[k]) ANP[k].splice(+b.dataset.i, 1); render(); break; }
    case "agSet": { annSaveNow(); const st = annState(AX.id), x = ANNEXID[AX.id]; st.g = st.g || []; st.g[+b.dataset.i] = +b.dataset.v;
      if (x.w.every((_, i) => st.g[i] != null) && !st.d) { st.d = 1; S.xp += 5; dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak(); toast("Exercice fait : +5 XP"); }
      touch(); const y = window.scrollY; render(); window.scrollTo({ top: y }); break; }
    case "annDone": { annSaveNow(); const st = annState(AX.id); if (!st.d) { st.d = 1; S.xp += 5; try { wlog("x", annCat(ANNEXID[AX.id])); } catch (e) {} dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak(); toast("Exercice fait : +5 XP"); } else st.d = 0; touch(); render(); break; }
    case "gsOpen": gsOpen(); break;
    case "gsClose": gsClose(); break;
    case "gsCat": { GS.cat = b.dataset.cat || ""; GS.act = -1; gsRender(); const gi = document.getElementById("gsInput"); if (gi) gi.focus(); break; }
    case "gsSugg": { GS.q = b.dataset.q; GS.act = -1; const gi = document.getElementById("gsInput"); if (gi) { gi.value = GS.q; gi.focus(); } gsRender(); break; }
    case "gsGo": gsGo(+b.dataset.i); break;
    case "sub": matSub = b.dataset.sub; render(); break;
    case "chQuiz": { const l = QCH[b.dataset.ch] || [], ex = ctlExtra(b.dataset.ch, 4); if (l.length) startRun(shuffle(shuffle(l).slice(0, 15 - ex.length).concat(ex)), "quiz"); else toast("Pas encore de quiz pour cette fiche"); break; }
    case "chCards": { const l = FCH[b.dataset.ch] || []; if (l.length) startCards(shuffle(l)); else toast("Pas encore de cartes pour cette fiche"); break; }
    case "gcase": openCase(b.dataset.id); break;
    case "gSelf": { const st = caseState(GC.id); st.ok[+b.dataset.i] = b.dataset.v === "1"; { const k = GCASES.find(x => x.id === GC.id), wa = waRoll(); wa.gx = wa.gx || []; if (k && Object.keys(st.ok).length >= k.steps.length && !wa.gx.includes(k.id)) { wa.gx.push(k.id); wlog("x", k.cat); } } touch(); render(); break; }
    case "gReveal": { const st = caseState(GC.id), k = GCID[GC.id], i = +b.dataset.i; const was = st.step; { const ck = stepCheck(k.id + "|" + k.steps[i].name, st.notes[i]); if (ck) st.ok[i] = ck.ok; } st.step = Math.max(st.step, i + 1); if (st.step >= k.steps.length && was < k.steps.length) { S.xp += 10; dayLog().e++, dayLog().x = (dayLog().x || 0) + 1; bumpStreak(); toast("Exercice terminé : +10 XP"); } touch(); render(); requestAnimationFrame(() => { const t = document.getElementById("gs" + (i + 1)); if (t) t.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" }); }); break; }
    case "gReset": { S.gc[GC.id] = { step: 0, notes: {}, ok: {} }; touch(); render(); window.scrollTo({ top: 0 }); break; }
    case "defi": startDefi(cat ? [cat] : (DF && DF.cats) || null); break;
    case "dPick": defiPick(+b.dataset.pos); break;
    case "genQuiz": genQuiz(b.dataset.ch); break;
    case "mat": openMat(cat, b.dataset.seg); break;
    case "seg": matSeg = b.dataset.seg; matFicheQuery = ""; render(); break;
    case "lesson": openLesson(b.dataset.cid, +b.dataset.k); break;
    case "lessonNext": { const nx = nextOf(LS.cid, LS.k); markRead(LS.cid, LS.k); if (nx) openLesson(nx.cid, nx.k); else { touch(); render(); } break; }
    case "lessonPrev": { const pv = prevOf(LS.cid, LS.k); if (pv) openLesson(pv.cid, pv.k); break; }
    case "lessonDone": { markRead(LS.cid, LS.k); touch(); const lc = CMETA(LS.cid).cat; startRun(shuffle(QBY[lc]).slice(0, 10), "quiz"); break; }
    case "quickQuiz": startRun(shuffle(QBY[cat].filter(chapOk)).slice(0, quizLen), "quiz"); break;
    case "dueCat": { const d = dueCards([cat]); startCards(shuffle(d.reviews).slice(0, 30).concat(shuffle(d.fresh).slice(0, 15)).slice(0, 30)); break; }
    case "hit": { const k = +b.dataset.k; coursQuery = ""; if (k) openLesson(b.dataset.cid, k); else openMat(CMETA(b.dataset.cid).cat, "lecons"); break; }
    case "toggleQuiz": quizSel = quizSel.includes(cat) ? quizSel.filter(x => x !== cat) : quizSel.concat(cat); render(); break;
    case "toggleCards": cardSel = cardSel.includes(cat) ? cardSel.filter(x => x !== cat) : cardSel.concat(cat); render(); break;
    case "clearQuiz": quizSel = []; render(); break;
    case "clearCards": cardSel = []; render(); break;
    case "len": quizLen = +b.dataset.n; render(); break;
    case "startQuiz": { const pool = QS.filter(x => (!quizSel.length || quizSel.includes(x.c)) && chapOk(x)); startRun(shuffle(pool).slice(0, quizLen), "quiz"); break; }
    case "startWrong": { const w = QS.filter(x => S.q[x.id] && S.q[x.id][2] === 0); startRun(shuffle(w).slice(0, 40), "quiz"); break; }
    case "redoErrors": { const w = R.list.filter(x => !(x.pick !== null && x.order[x.pick] === 0)).map(x => x.it); startRun(shuffle(w), "quiz"); break; }
    case "pick": pick(+b.dataset.pos); break;
    case "tw1": tw1(+b.dataset.i); break;
    case "tw2": tw2(+b.dataset.pos); break;
    case "pkDw": { const p = S.packs[PK], L = dwFor(p.cat, p.chs, 10, p.kw); if (L.length) startRun(L, "quiz"); break; }
    case "dwMix": { const L = shuffle([].concat(...Object.keys(DWFX).filter(k => CTLX[k] && CHID[k] && !lockedCat(CHID[k].cat)).map(k => CTLX[k](3)))).slice(0, 15); if (L.length) startRun(L, "quiz"); break; }
    case "dwRun": { const L = (CTLX[b.dataset.ch] ? CTLX[b.dataset.ch](10) : []); peekClose(true); if (L.length) startRun(shuffle(L), "quiz"); break; }
    case "next": next(); break;
    case "prev": if (R.i > 0) { R.i--; render(); } break;
    case "finishExam": finishExam(); break;
    case "goHome": go("home"); break;
    case "goQuiz": go("quiz"); break;
    case "goCards": go("cards"); break;
    case "goExam": go("exam"); break;
    case "startExam": startExam(); break;
    case "today": { const d = dueCards(), n = P().clen; startCards(shuffle(d.reviews).slice(0, n).concat(shuffle(d.fresh).slice(0, Math.ceil(n / 2))).slice(0, n)); break; }
    case "startDue": { const d = dueCards(cardSel.length ? cardSel : null, true); startCards(shuffle(d.reviews).slice(0, 30).concat(shuffle(d.fresh).slice(0, 15)).slice(0, 30)); break; }
    case "startAllCards": startCards(shuffle(FS.filter(x => (!cardSel.length || cardSel.includes(x.c)) && chapOk(x)))); break;
    case "chapToggle": { const k = b.dataset.k; chapSel = chapSel.includes(k) ? chapSel.filter(x => x !== k) : chapSel.concat(k); S.chap = chapSel.slice(); touch(); render(); break; }
    case "pref": { const pp = P(), k = b.dataset.k; let val = b.dataset.v; if (k === "qlen" || k === "clen") val = +val; pp[k] = val; if (k === "qlen") { quizLen = val; prefSeenQ = val; } touch(); render(); if (k === "snd" && val === "on") tone("ok"); break; }
    case "weakPick": weakSheet(b.dataset.k); break;
    case "pkNew": PB = { cat: "", chs: [], secs: [], ex: [], kw: "", name: "", date: "", i: null }; render(); setTimeout(() => { const e = document.getElementById("pkBuild"); if (e) e.scrollIntoView({ block: "start" }); }, 30); break;
    case "pbCat": PB.cat = b.dataset.c; PB.chs = []; PB.secs = []; PB.ex = []; render(); break;
    case "pbSec": { const k = b.dataset.k; PB.secs = PB.secs || []; PB.secs = PB.secs.includes(k) ? PB.secs.filter(x => x !== k) : PB.secs.concat(k); render(); break; }
    case "pbCancel": PB = null; render(); break;
    case "pbSave": { const p = { cat: PB.cat, chs: PB.chs.slice(), secs: (PB.secs || []).filter(x => PB.chs.includes(x.split("|")[0])), ex: (PB.ex || []).slice(), kw: PB.kw.trim(), name: PB.name.trim(), date: PB.date, hist: PB.i != null && S.packs[PB.i] ? S.packs[PB.i].hist || [] : [] }; S.packs = S.packs || []; if (PB.i != null) S.packs[PB.i] = p; else S.packs.push(p); PK = PB.i != null ? PB.i : S.packs.length - 1; PB = null; touch(); go("pack"); break; }
    case "cxOne": peekClose(true); cxFrom = view === "mat" ? "mat" : "ex"; cxStart(b.dataset.cat, [b.dataset.g]); break;
    case "pkCx": cxFrom = "ex"; cxStart(S.packs[PK].cat, [b.dataset.g]); break;
    case "pkResume": { const i = FROMPACK; if (i == null) break; PK = i; go("pack"); setTimeout(() => { const n = document.querySelector(".pk-next"); if (n) { n.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" }); n.classList.add("pk-pulse"); } }, 60); break; }
    case "pkOpen": PK = +b.dataset.i; go("pack"); break;
    case "pkBack": FROMPACK = null; PK = null; setExTab("ctl"); go("ex"); break;
    case "pkEdit": { const p = S.packs[PK]; PB = { cat: p.cat, chs: (p.chs || []).slice(), secs: (p.secs || []).slice(), ex: (p.ex || []).slice(), kw: p.kw || "", name: p.name || "", date: p.date || "", i: PK }; setExTab("ctl"); go("ex"); setTimeout(() => { const e = document.getElementById("pkBuild"); if (e) e.scrollIntoView({ block: "start" }); }, 30); break; }
    case "pkDel": { S.packs.splice(PK, 1); PK = null; touch(); setExTab("ctl"); go("ex"); break; }
    case "pkQuiz": { const p = S.packs[PK], d = packData(p), n = +b.dataset.n, wr = shuffle(d.qs.filter(x => S.q[x.id] && S.q[x.id][2] === 0)), rest = shuffle(d.qs.filter(x => !wr.includes(x))), dw = dwFor(p.cat, p.chs, Math.round(n / 4), p.kw); startRun(shuffle(wr.concat(rest).slice(0, n - dw.length).concat(dw)), "quiz"); break; }
    case "pkWrong": { const d = packData(S.packs[PK]); startRun(shuffle(d.qs.filter(x => S.q[x.id] && S.q[x.id][2] === 0)), "quiz"); break; }
    case "pkCards": { const d = packData(S.packs[PK]); startCards(shuffle(d.fs).slice(0, Math.max(10, (P().clen || 30)))); break; }
    case "pkExam": { const p = S.packs[PK], d = packData(p), dw = dwFor(p.cat, p.chs, 4, p.kw), n = Math.min(15, d.qs.length + dw.length); startRun(shuffle(shuffle(d.qs).slice(0, n - dw.length).concat(dw)), "exam"); if (R) { R.pack = PK; R.end = Date.now() + n * 60 * 1000; render(); } break; }
    case "pkOral": { const d = packData(S.packs[PK]); OR = { list: shuffle(d.oral).slice(0, 5).map(q => ({ q, ck: {}, done: false })), i: 0, end: Date.now() + OF.t * 1000, t: OF.t, e: "Contrôle" }; go("oral"); break; }
    case "goClasse": AMT = "classement"; go("amis"); break;
    case "clJoin": { const v = (document.getElementById("clPseudo").value || "").replace(/[<>]/g, "").trim().slice(0, 24); if (v.length < 2) { toast("Choisis un pseudo d'au moins 2 caractères"); break; } S.cl = { on: true, p: v }; CL.at = 0; touch(); render(); loadClass(true); break; }
    case "clLeave": S.cl = { on: false, p: (S.cl || {}).p || "" }; CL.data = null; touch(); render(); break;
    case "clTab": CL.tab = b.dataset.v; render(); break;
    case "clRefresh": loadClass(true); render(); break;
    case "clDefi": startDefiWeek(); break;
    case "orF": { const k = b.dataset.k; OF[k] = k === "e" ? b.dataset.v : +b.dataset.v; render(); break; }
    case "orStart": oralStart(); break;
    case "orDone": { const cur = OR.list[OR.i]; cur.done = true; render(); break; }
    case "orNext": { OR.i++; OR.end = Date.now() + OR.t * 1000; render(); window.scrollTo({ top: 0 }); break; }
    case "orQuit": clearInterval(orTick); OR = null; setExTab("oraux"); go("ex"); break;
    case "orAgain": OR = null; oralStart(); break;
    case "orRedo": { const sc = OR.list.map(x => Object.values(x.ck).filter(Boolean).length / x.q.pts.length); const l = OR.list.filter((x, i) => sc[i] < .5).map(x => ({ q: x.q, ck: {}, done: false })); OR = { list: l, i: 0, end: Date.now() + OF.t * 1000, t: OF.t, e: OR.e }; go("oral"); break; }
    case "orBack": OR = null; setExTab("oraux"); go("ex"); break;
    case "sitNew": { S.sit = S.sit || []; S.sit.push({ t: "", p: "", f: {} }); OSIT = S.sit.length - 1; touch(); render(); setTimeout(() => { const f = document.getElementById("sitForm"); if (f) f.scrollIntoView({ block: "start" }); }, 30); break; }
    case "sitOpen": OSIT = +b.dataset.i; render(); setTimeout(() => { const f = document.getElementById("sitForm"); if (f) f.scrollIntoView({ block: "start" }); }, 30); break;
    case "sitClose": OSIT = null; render(); break;
    case "sitDel": { S.sit.splice(+b.dataset.i, 1); OSIT = null; touch(); render(); break; }
    case "sitTrain": { const x = S.sit[+b.dataset.i], p = (x.p || "").toLowerCase(); if (!p) { toast("Choisis d'abord le processus de la situation"); break; } OF.n = Math.max(OF.n, 3); oralStart(p); break; }
    case "feedback": reportSheet("i", "avis:" + view, "Avis sur le Grand Livre"); break;
    case "report": reportSheet(b.dataset.t, b.dataset.id, b.dataset.l || ""); break;
    case "repCopy": { const t = (S.rp || []).map(r => `- ${REP_KIND[r.t] || r.t} ${r.id} : ${r.ch}${r.cm ? " : " + r.cm : ""}\n  « ${r.l} »`).join("\n"); (navigator.clipboard ? navigator.clipboard.writeText("Mes signalements Grand Livre :\n" + t) : Promise.reject()).then(() => toast("Signalements copiés")).catch(() => toast("Copie impossible")); break; }
    case "repClear": S.rp = []; touch(); render(); break;
    case "bkExport": { (async () => { let dl = null; try { dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null; } catch (e) {}
      if (dl) { try { await dl.save({ filename: "grand-livre-progression-" + new Date().toISOString().slice(0, 10) + ".json", data: bkData() }); toast("Sauvegarde téléchargée"); } catch (e) { if (e && e.code !== "declined") toast("Téléchargement impossible ici : utilise « Copier »."); } return; }
      try { const blob = new Blob([bkData()], { type: "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "grand-livre-progression-" + new Date().toISOString().slice(0, 10) + ".json"; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast("Sauvegarde téléchargée"); } catch (e) { toast("Téléchargement impossible ici : utilise « Copier »."); } })(); break; }
    case "bkCopy": { const t = bkData(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => toast("Sauvegarde copiée : colle-la dans une note ou un mail")).catch(() => toast("Copie impossible sur cet appareil")); break; }
    case "bkCancel": BK = { pending: null, when: "", err: "" }; render(); break;
    case "bkApply": { const d = BK.pending; BK = { pending: null, when: "", err: "" }; if (d) { bkApply(d); toast("Progression restaurée"); } break; }
    case "bkUndo": { try { const p = JSON.parse(localStorage.getItem("gl-backup-prev") || "null"); if (p && p.v === 1) { localStorage.removeItem("gl-backup-prev"); S = p; normS(); S.u = Date.now(); renderTop.xp = S.xp; dirty = true; touch(); render(); toast("Progression d'avant l'import remise"); } } catch (e) {} break; }
    case "lvlClose": document.querySelectorAll(".fx-lvl").forEach(x => x.remove()); break;
    case "tourNext": tourI++; if (tourI >= TOUR.length) tourEnd(); else tourShow(); break;
    case "tourEnd": tourEnd(); break;
    case "tourAgain": S.tour = 0; go("home"); setTimeout(tourStart, 400); break;
    case "planGo": { const nb = document.querySelector(".steps .step:not(.done) .btn:not([disabled])"); if (nb) nb.click(); break; }
    case "planNext": { go("home"); setTimeout(() => { const nb = document.querySelector(".steps .step:not(.done) .btn:not([disabled])"); if (nb) nb.click(); }, 30); break; }
    case "exTab": { setExTab(b.dataset.t); if (view !== "ex") go("ex"); else { render(); const n = document.querySelector(".ex-tabs"), y = n ? n.getBoundingClientRect().top + window.scrollY - 70 : 0; if (window.scrollY > y) window.scrollTo({ top: Math.max(0, y) }); } break; }
    case "wkClose": closeSheet(); break;
    case "wkFiche": closeSheet(); fichePeek(b.dataset.id); break;
    case "fichePeek": gtClose(); fichePeek(b.dataset.id, b.dataset.hint); break;
    case "gt": gtShow(b); break;
    case "selX": selExplain(); break;
    case "selAI": selAI(); break;
    case "gtClose": gtClose(); break;
    case "peekClose": peekClose(); break;
    case "amGo": AMT = b.dataset.t; if (view !== "amis") go("amis"); else render(); if (AMT === "amis") loadFriends(true); if (AMT === "duels") loadDuels(true); break;
    case "frOpen": FRX = FRX === b.dataset.k ? null : b.dataset.k; render(); break;
    case "frCopy": try { navigator.clipboard.writeText(FR.data.code); toast("Code ami copié"); } catch (e) {} break;
    case "frShare": navigator.share({ title: "Grand Livre", text: "Ajoute-moi en ami sur le Grand Livre ! Mon code : " + FR.data.code, url: location.origin + "/?amis=1" }).catch(() => {}); break;
    case "frAdd": { const N = FRN(), v = (document.getElementById("frCode") || {}).value || ""; if (!N) break; N.add(v).then(j => { toast(j.already ? "Vous êtes déjà amis" : j.accepted ? "Vous êtes maintenant amis !" : "Demande envoyée à " + (j.name || "ton camarade")); if (j.accepted) confettiBurst(40); loadFriends(true); }).catch(e => toast((e && e.message) || "Code introuvable.")); break; }
    case "frYes": case "frNo": { const N = FRN(); if (N) N.respond(b.dataset.k, a === "frYes").then(() => { if (a === "frYes") { toast("Nouvel ami !"); confettiBurst(40); tone("ok"); } loadFriends(true); }).catch(() => {}); break; }
    case "frDel": { const nm = b.dataset.name || "cet ami", k = b.dataset.k; askConfirm("Retirer " + nm + " de tes amis ?", "Vous ne verrez plus vos progrès respectifs. Tu pourras le rajouter plus tard avec son code ami.", "Retirer", { danger: true, name: nm }).then(ok => { if (!ok) return; const N = FRN(); if (N) N.remove(k).then(() => { FRX = null; toast(nm + " a été retiré de tes amis"); loadFriends(true); }).catch(() => {}); }); break; }
    case "rmNew": case "rmWith": { const N = ROOMN(); if (!N) break; N.create().then(j => { roomEnter(j.room); if (a === "rmWith") toast("Donne le code " + j.room.id + " à " + (b.dataset.name || "ton ami")); }).catch(e => toast((e && e.message) || "Impossible d'ouvrir une salle.")); break; }
    case "rmJoin": { const N = ROOMN(), v = String((document.getElementById("rmCode") || {}).value || "").trim().toUpperCase(); if (!N || v.length < 4) { toast("Tape le code de la salle."); break; } N.join(v).then(j => roomEnter(j.room)).catch(e => toast((e && e.message) || "Salle introuvable.")); break; }
    case "rmCat": { const c = roomCfg(), k = b.dataset.c; c.cats = c.cats.includes(k) ? c.cats.filter(x => x !== k) : c.cats.concat(k); if (!c.cats.length) c.cats = [k]; touch(); render(); break; }
    case "rmN": roomCfg().n = +b.dataset.n; touch(); render(); break;
    case "rmStart": { const N = ROOMN(), c = roomCfg(), ids = duelPick(c.cats, c.n); if (!N || !RO) break; RO.local = {}; N.start(RO.srv.id, ids, c.cats).then(j => roomApply(j.room)).catch(e => toast((e && e.message) || "Lancement impossible.")); break; }
    case "rmPick": roomPick(+b.dataset.pos); break;
    case "rmNext": { const N = ROOMN(); if (!N || !RO) break; if (RO.srv.phase === "end") RO.local = {}; N.next(RO.srv.id).then(j => { roomApply(j.room); if (j.room.phase === "end") { confettiBurst(50); tone("lvl"); } }).catch(e => toast((e && e.message) || "Action impossible.")); break; }
    case "rmShare": navigator.share({ title: "Réviser ensemble", text: "Rejoins ma salle de révision sur le Grand Livre : code " + RO.srv.id, url: location.origin + "/" }).catch(() => {}); break;
    case "rmCopy": try { navigator.clipboard.writeText(RO.srv.id); toast("Code copié"); } catch (e) {} break;
    case "rmQuit": { const N = ROOMN(); if (N && RO) N.leave(RO.srv.id).catch(() => {}); RO = null; roomStop(); AMT = "salle"; go("amis"); break; }
    case "clFil": CL.fil = b.dataset.v; render(); break;
    case "duCat": { const c = duelCfg(), k = b.dataset.c; c.cats = c.cats.includes(k) ? c.cats.filter(x => x !== k) : c.cats.concat(k); if (!c.cats.length) c.cats = [k]; touch(); render(); break; }
    case "duN": duelCfg().n = +b.dataset.n; touch(); render(); break;
    case "duNew": duelCreate(); break;
    case "duMate": duelCreate(b.dataset.k); break;
    case "duBot": { const c = duelCfg(), ids = duelPick(c.cats, c.n); if (ids.length < 5) { toast("Choisis plus de matières."); break; } duelBegin({ id: "bot", bot: true, ids, seed: Math.floor(Math.random() * 4e9) }); break; }
    case "duJoin": duelJoinCode((document.getElementById("duCode") || {}).value); break;
    case "duOpen": { const d = (DH.list || []).find(x => x.id === b.dataset.id); if (d && d.me === "b" && !d.you.started) duelJoinCode(d.id); else if (d) { DU = null; duelFromSrv(d); if (DUEL_NET()) DUEL_NET().get(d.id).then(j => duelSync(j.duel)).catch(() => {}); } else duelJoinCode(b.dataset.id); break; }
    case "duDecline": { const N = DUEL_NET(); if (N) N.decline(b.dataset.id).then(() => loadDuels(true)).catch(() => {}); DH.list = (DH.list || []).filter(x => x.id !== b.dataset.id); render(); break; }
    case "duPick": duelAnswer(+b.dataset.pos); break;
    case "duSolo": { const N = DUEL_NET(); if (N && DU) N.start(DU.id).then(j => { DU.srv = j.duel; }).catch(() => {}); if (DU) { DU.stage = "count"; DU.startAt = Date.now() + 3000; render(); } break; }
    case "duShare": navigator.share({ title: "Duel Grand Livre", text: "Je te défie en duel sur le Grand Livre ! Code : " + DU.id, url: location.origin + "/?duel=" + DU.id }).catch(() => {}); break;
    case "duCopy": try { navigator.clipboard.writeText(DU.id); toast("Code copié"); } catch (e) {} break;
    case "duQuit": { const leave = () => { duelStop(); DU = null; AMT = "duels"; go("amis"); loadDuels(true); }; if (DU && DU.stage === "play") askConfirm("Quitter le duel ?", "Les questions restantes compteront comme fausses si tu ne reviens pas.", "Quitter", { danger: true, cancel: "Continuer le duel" }).then(ok => { if (ok) leave(); }); else leave(); break; }
    case "duBack": duelStop(); DU = null; AMT = "duels"; go("amis"); loadDuels(true); break;
    case "duAgain": { const was = DU; duelStop(); DU = null; if (!was || was.bot) { const c = duelCfg(), ids = duelPick(c.cats, c.n); duelBegin({ id: "bot", bot: true, ids, seed: Math.floor(Math.random() * 4e9) }); } else { const N = DUEL_NET(), c = { cats: was.srv && was.srv.cats && was.srv.cats.length ? was.srv.cats : duelCfg().cats }, ids = duelPick(c.cats, was.items.length); if (N && N.rematch) N.rematch(was.id, ids).then(j => { duelFromSrv(j.duel); toast("Revanche proposée !"); }).catch(e => { toast((e && e.message) || "Revanche impossible pour l'instant."); AMT = "duels"; go("amis"); }); else { AMT = "duels"; go("amis"); } } break; }
    case "tts": ttsToggle(b); break;
    case "ttsRate": { S.pref = S.pref || {}; const r = TTS_RATES[(TTS_RATES.indexOf(ttsRate()) + 1) % TTS_RATES.length]; S.pref.ttsr = r; touch(); b.textContent = String(r).replace(".", ",") + "×"; if (ttsRun) { const bt = ttsRun.btn; ttsStop(); ttsToggle(bt); } break; }
    case "pkIcs": icsSheet(PK); break;
    case "icsFile": icsFile(+b.dataset.i); break;
    case "peekFull": { const id = b.dataset.id; peekClose(true); openFiche(id); break; }
    case "wkErr": { const k = b.dataset.k; EF = { cat: "", ks: k === "*" ? weakChaps(5).map(o => o.k) : [k], st: "all" }; closeSheet(); go("erreurs"); break; }
    case "wkTrain": { const k = b.dataset.k, ks = k === "*" ? weakChaps(5).map(o => o.k) : [k], wrong = QS.filter(x => ks.includes(chKey(x)) && S.q[x.id] && S.q[x.id][2] === 0), rest = QS.filter(x => ks.includes(chKey(x)) && !wrong.includes(x)); closeSheet(); startRun(shuffle(wrong).concat(shuffle(rest)).slice(0, quizLen), "quiz"); if (R) R.wk = true; break; }
    case "goErr": EF = { cat: "", ks: null, st: "todo" }; go("erreurs"); break;
    case "ebCat": EF.cat = b.dataset.cat; EF.ks = null; render(); break;
    case "ebSt": EF.st = b.dataset.v; render(); break;
    case "ebCh": EF.ks = [b.dataset.k]; EF.cat = ""; EF.st = "all"; render(); window.scrollTo({ top: 0 }); break;
    case "ebClear": EF.ks = null; render(); break;
    case "ebTrain": { const l = errFiltered().map(e => e.x); startRun(l.slice(0, 20), "quiz"); break; }
    case "weakQuiz": { const k = b.dataset.k; startRun(shuffle(QS.filter(x => chKey(x) === k)).slice(0, quizLen), "quiz"); break; }
    case "weakMix": { const ks = weakChaps(5).map(o => o.k), wrong = QS.filter(x => ks.includes(chKey(x)) && S.q[x.id] && S.q[x.id][2] === 0), rest = QS.filter(x => ks.includes(chKey(x)) && !wrong.includes(x)); startRun(shuffle(wrong).concat(shuffle(rest)).slice(0, quizLen), "quiz"); break; }
    case "quitRun": if (R && R.list.some(x => x.pick !== null)) go("result"); else backOrig("ex"); break;
    case "backOrig": backOrig(); break;
    case "quitCards": if (C && (C.knew + C.again) > 0) go("cardsEnd"); else backOrig("ex"); break;
    case "ctlStart": startCtl(b.dataset.k); break;
    case "dueQuiz": { const d = shuffle(dueQs()); if (d.length) startRun(d.slice(0, quizLen), "quiz"); break; }
    case "chapYear": { const ids = (CHBY[cat] || []).filter(x => chapYr(x) === +b.dataset.y).map(x => x.id); chapSel = chapSel.filter(k => chCat(k) !== cat).concat(ids); S.chap = chapSel.slice(); touch(); render(); break; }
    case "chapAll": chapSel = chapSel.filter(k => chCat(k) !== cat); S.chap = chapSel.slice(); touch(); render(); break;
    case "pickChap": cibleCat = cat; go("cible"); break;
    case "cibleQuiz": startRun(shuffle(QS.filter(x => x.c === cibleCat && chapOk(x))).slice(0, quizLen), "quiz"); break;
    case "cibleCards": { const pool = FS.filter(x => x.c === cibleCat && chapOk(x)), d = dayNum(), due = shuffle(pool.filter(x => S.c[x.id] && S.c[x.id][1] <= d)), fresh = shuffle(pool.filter(x => !S.c[x.id])), rest = shuffle(pool.filter(x => S.c[x.id] && S.c[x.id][1] > d)); startCards(due.concat(fresh, rest).slice(0, P().clen)); break; }
    case "flip": flipCard(); break;
    case "again": answerCard(false); break;
    case "knew": answerCard(true); break;
    case "hard": answerCard("hard"); break;
  }
});
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "k" || e.key === "K")) { e.preventDefault(); if (GS.open) gsClose(); else gsOpen(); return; }
  if (GS.open) { if (e.key === "Escape") gsClose(); return; }
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); gsOpen(); return; }
  if (view === "run" && R) {
    const cur = R.list[R.i];
    if (["1", "2", "3", "4"].includes(e.key) && (R.mode === "exam" || cur.pick === null)) { e.preventDefault(); if (cur.it.two) { if (cur.p1 == null) tw1(+e.key - 1); else tw2(+e.key - 1); } else pick(+e.key - 1); }
    else if (e.key === "Enter" && (R.mode === "exam" ? cur.pick !== null : cur.pick !== null)) { e.preventDefault(); if (R.mode === "exam" && R.i === R.list.length - 1) finishExam(); else next(); }
  } else if (view === "card" && C) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flipCard(); }
    else if (C.flip && e.key === "1") answerCard(false);
    else if (C.flip && e.key === "2") answerCard("hard");
    else if (C.flip && e.key === "3") answerCard(true);
  } else if (view === "defi" && DF && !DF.done && ["1", "2", "3", "4"].includes(e.key)) {
    e.preventDefault(); defiPick(+e.key - 1);
  } else if (view === "fiche" && FC && !e.altKey && !e.metaKey && !e.ctrlKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
    const bt = document.querySelector(e.key === "ArrowRight" ? "[data-fnext]" : "[data-fprev]"); if (bt) bt.click();
  } else if (view === "lesson" && LS && !e.altKey && !e.metaKey && !e.ctrlKey) {
    if (e.key === "ArrowRight") { const nx = nextOf(LS.cid, LS.k); if (nx) { markRead(LS.cid, LS.k); openLesson(nx.cid, nx.k); } }
    else if (e.key === "ArrowLeft") { const pv = prevOf(LS.cid, LS.k); if (pv) openLesson(pv.cid, pv.k); }
  }
});
window.addEventListener("pagehide", () => { if (dirty) flush(); });

/* ---------- Démarrage ---------- */
const local = loadLocal(); if (local) S = local;
normS();
render();
initSync();
duelDeepLink();
amisDeepLink();
/* Lien d'un rappel (« /?go=memo ») ou clic sur une notification quand l'appli est déjà ouverte */
(function () {
  const OK = { memo: 1, home: 1, ex: 1, bts: 1 };
  try { const u = new URL(location.href), v = u.searchParams.get("go"); if (v && OK[v]) { u.searchParams.delete("go"); history.replaceState(null, "", u.pathname + u.search + u.hash); setTimeout(() => go(v), 300); } } catch (e) {}
  try { if (navigator.serviceWorker) navigator.serviceWorker.addEventListener("message", e => { if (e.data && e.data.type === "gl-go" && OK[e.data.view]) go(e.data.view); }); } catch (e) {}
})();
setTimeout(() => { loadFriends(); loadDuels(); inboxPoll(); }, 1500);

/* ---------- Glisser entre les onglets (carrousel : l'onglet voisin suit le doigt) ---------- */
(() => {
  const TABS = ["home", "cours", "fiches", "ex", "amis", "bts"];
  const VIEWS = () => ({ home: vHome, cours: vCoursList, fiches: vFiches, ex: vExHome, amis: vAmis, bts: vBts });
  const view$ = () => document.getElementById("view");
  let sx = 0, sy = 0, st = 0, dx = 0, lock = null, active = false, busy = false, peek = null, peekDir = 0, topY = 0, keepY = 0;
  const calm = () => document.documentElement.classList.contains("no-motion") || RM;
  function canSwipe(t) {
    if (busy || !TABS.includes(view)) return false;
    if (document.querySelector(".gs.open, dialog[open], .gl-pop:not([hidden])")) return false;
    const f = t.closest("input, textarea, select, [contenteditable]");
    if (f && (f === document.activeElement || f.type === "range")) return false;
    if (t.closest(".no-swipe, .shelf, #shelf3d, .shelf-canvas")) return false;
    for (let e = t; e && e !== document.body; e = e.parentElement) {
      if (e.scrollWidth > e.clientWidth + 2) { const o = getComputedStyle(e).overflowX; if (o === "auto" || o === "scroll") return false; }
    }
    return true;
  }
  function edge(dir) { const i = TABS.indexOf(view) + dir; return i < 0 || i >= TABS.length; }
  function dropPeek() { if (peek) { peek.remove(); peek = null; peekDir = 0; } }
  function makePeek(dir) {
    if (peekDir === dir && peek) return; dropPeek();
    const name = TABS[TABS.indexOf(view) + dir], fn = VIEWS()[name]; if (!fn) return;
    let html = ""; try { html = fn(); } catch (e) { return; }
    const v = view$(), r = v.getBoundingClientRect();
    keepY = Math.min(scrollY, v.offsetTop); topY = v.offsetTop - keepY;
    peek = document.createElement("div"); peek.className = "wrap swipe-peek"; peek.setAttribute("aria-hidden", "true"); peek.innerHTML = html;
    Object.assign(peek.style, { position: "fixed", top: topY + "px", left: r.left + "px", width: r.width + "px", height: (innerHeight - topY) + "px", overflow: "hidden", margin: "0", zIndex: "1", pointerEvents: "none", background: "var(--paper)" });
    document.body.appendChild(peek); peekDir = dir;
  }
  function paint(x, ease) {
    const v = view$(), tr = ease ? "transform .3s cubic-bezier(.2,.8,.2,1)" : "none";
    v.style.transition = tr; v.style.transform = x ? `translate3d(${x}px,0,0)` : "";
    if (peek) { peek.style.transition = tr; peek.style.transform = `translate3d(${x + peekDir * innerWidth}px,0,0)`; }
  }
  document.addEventListener("touchstart", e => {
    if (e.touches.length !== 1 || !canSwipe(e.target)) { active = false; return; }
    const t = e.touches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); dx = 0; lock = null; active = true;
  }, { passive: true });
  document.addEventListener("touchmove", e => {
    if (!active) return;
    const t = e.touches[0], mx = t.clientX - sx, my = t.clientY - sy;
    if (lock === null) { if (Math.abs(mx) < 10 && Math.abs(my) < 10) return; lock = Math.abs(mx) > Math.abs(my) * 1.3 ? "x" : "y"; }
    if (lock !== "x") { active = false; return; }
    if (calm()) { dx = mx; return; }
    const dir = mx < 0 ? 1 : -1;
    if (edge(dir)) { dropPeek(); dx = Math.sign(mx) * Math.min(70, Math.abs(mx) * .28); }
    else { makePeek(dir); dx = mx; }
    paint(dx, false);
  }, { passive: true });
  function settle() { const v = view$(); v.style.transition = ""; v.style.transform = ""; dropPeek(); busy = false; }
  function end() {
    if (!active || lock !== "x") { active = false; return; }
    active = false;
    const dir = dx < 0 ? 1 : -1, fast = Math.abs(dx) / Math.max(1, Date.now() - st) > .3 && Math.abs(dx) > 35;
    if (edge(dir) || (Math.abs(dx) < innerWidth * .2 && !fast)) { paint(0, true); busy = true; setTimeout(settle, 310); return; }
    const next = TABS[TABS.indexOf(view) + dir];
    if (calm() || !peek) { settle(); go(next); return; }
    busy = true; paint(-dir * innerWidth, true);
    setTimeout(() => {
      const v = view$(); v.style.transition = "none"; v.style.transform = ""; v.style.visibility = "hidden";
      go(next); v.classList.remove("fx-rise", "fx-page", "fx-card");
      window.scrollTo({ top: keepY, behavior: "instant" });
      v.style.visibility = ""; dropPeek(); busy = false;
    }, 300);
  }
  document.addEventListener("touchend", end, { passive: true });
  document.addEventListener("touchcancel", () => { if (active) { active = false; paint(0, true); busy = true; setTimeout(settle, 310); } }, { passive: true });
})();

/* ---------- Flashcards : glisser la carte retournée (doigt ou souris) ---------- */
(() => {
  let el = null, sx = 0, sy = 0, st = 0, dx = 0, dy = 0, lock = null, moved = false, pid = null;
  const W = () => Math.min(innerWidth, 560), H = () => Math.min(innerHeight, 700);
  function stamps(x, y) {
    if (!el) return;
    const ok = el.querySelector(".stamp.ok"), ko = el.querySelector(".stamp.ko"), hd = el.querySelector(".stamp.hd");
    const kx = Math.min(1, Math.abs(x) / (W() * .3)), ky = Math.min(1, Math.abs(y) / (H() * .2));
    if (ok) ok.style.opacity = x > 0 ? kx : 0; if (ko) ko.style.opacity = x < 0 ? kx : 0; if (hd) hd.style.opacity = y < 0 ? ky : 0;
  }
  function paint(x, y, ease) {
    if (!el) return;
    el.style.transition = ease ? "transform .28s cubic-bezier(.2,.8,.2,1)" : "none";
    el.style.transform = x || y ? `translate(${x}px, ${y}px) rotate(${x / 18}deg) rotateY(180deg)` : "";
    stamps(x, y);
  }
  document.addEventListener("pointerdown", e => {
    const c = e.target.closest && e.target.closest(".card-runner.flipped .card3d");
    if (!c || view !== "card" || (e.pointerType === "mouse" && e.button !== 0)) { el = null; return; }
    el = c; pid = e.pointerId; sx = e.clientX; sy = e.clientY; st = Date.now(); dx = dy = 0; lock = null; moved = false;
  });
  document.addEventListener("pointermove", e => {
    if (!el || e.pointerId !== pid) return;
    const mx = e.clientX - sx, my = e.clientY - sy;
    if (lock === null) { if (Math.abs(mx) < 8 && Math.abs(my) < 8) return; lock = Math.abs(mx) > Math.abs(my) ? "x" : my < 0 ? "u" : "y"; }
    if (lock === "y") { paint(0, 0, true); el = null; return; }
    moved = true;
    if (lock === "x") { dx = mx; dy = 0; } else { dy = Math.min(0, my); dx = mx * .2; }
    paint(dx, dy, false);
  });
  function end(e) {
    if (!el || (e && e.pointerId !== pid)) return;
    if (moved) setTimeout(() => { moved = false; }, 350);
    const c = el, dt = Math.max(1, Date.now() - st);
    const fx = lock === "x" && (Math.abs(dx) > W() * .3 || (Math.abs(dx) / dt > .5 && Math.abs(dx) > 50));
    const fu = lock === "u" && (-dy > H() * .2 || (-dy / dt > .5 && -dy > 50));
    if (fx || fu) {
      const knew = fu ? "hard" : dx > 0;
      c.style.transition = "transform .25s ease-in, opacity .25s";
      c.style.transform = fu ? `translate(0, ${-innerHeight}px) rotateY(180deg)` : `translateX(${(dx > 0 ? 1 : -1) * innerWidth}px) rotate(${dx > 0 ? 18 : -18}deg) rotateY(180deg)`;
      c.style.opacity = "0"; el = null; setTimeout(() => answerCard(knew), 200);
    } else { paint(0, 0, true); el = null; }
  }
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", () => { if (el) { paint(0, 0, true); el = null; } });
  /* pas de retournement après un glissé */
  document.addEventListener("click", e => { if (moved && e.target.closest && e.target.closest(".card3d")) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
})();

/* ---------- Confettis au bilan et glisser pour la question suivante ---------- */
(() => {
  let shown = null;
  new MutationObserver(() => {
    const r = document.querySelector(".res-hero .ring");
    if (!r) { document.querySelectorAll(".confetti").forEach(x => x.remove()); return; }
    if (shown === R) return; shown = R;
    const pc = +getComputedStyle(r).getPropertyValue("--pc");
    if (pc < 80 || document.documentElement.classList.contains("no-motion") || RM) return;
    const box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
    const cols = ["#ffd66b", "#2c43c6", "#1d8a4e", "#e0a31f", "#c23a46", "#5b6cff"];
    for (let i = 0; i < 70; i++) { const c = document.createElement("i"); c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % cols.length]; c.style.animationDelay = Math.random() * .5 + "s"; c.style.animationDuration = 1.6 + Math.random() * 1.4 + "s"; c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px"); c.style.setProperty("--r", (Math.random() * 720) + "deg"); box.appendChild(c); }
    document.body.appendChild(box); setTimeout(() => box.remove(), 3500);
    buzz([20, 60, 20]);
  }).observe(document.getElementById("view"), { childList: true });

  let sx = 0, sy = 0, dx = 0, on = false, lock = null;
  const card = () => document.querySelector(".runner .qcard");
  const ready = () => view === "run" && R && R.mode === "quiz" && R.list[R.i].pick !== null;
  document.addEventListener("touchstart", e => { if (!ready() || e.touches.length !== 1) { on = false; return; } const t = e.touches[0]; sx = t.clientX; sy = t.clientY; dx = 0; lock = null; on = true; }, { passive: true });
  document.addEventListener("touchmove", e => {
    if (!on) return; const t = e.touches[0], mx = t.clientX - sx, my = t.clientY - sy;
    if (lock === null) { if (Math.abs(mx) < 10 && Math.abs(my) < 10) return; lock = Math.abs(mx) > Math.abs(my) * 1.3 && mx < 0 ? "x" : "y"; }
    if (lock !== "x") { on = false; return; }
    dx = Math.min(0, mx); const c = card(); if (c) { c.style.transition = "none"; c.style.transform = `translateX(${dx}px)`; c.style.opacity = String(1 + dx / innerWidth); }
  }, { passive: true });
  document.addEventListener("touchend", () => {
    if (!on) return; on = false; const c = card(); if (!c || lock !== "x") return;
    if (dx < -innerWidth * .25) { c.style.transition = "transform .18s ease-in, opacity .18s"; c.style.transform = `translateX(${-innerWidth}px)`; c.style.opacity = "0"; setTimeout(() => { next(); const n = card(); if (n && !RM) { n.style.transition = "none"; n.style.transform = "translateX(40%)"; n.style.opacity = "0"; requestAnimationFrame(() => requestAnimationFrame(() => { n.style.transition = "transform .25s cubic-bezier(.2,.8,.2,1), opacity .25s"; n.style.transform = ""; n.style.opacity = ""; })); } }, 170); }
    else { c.style.transition = "transform .2s"; c.style.transform = ""; c.style.opacity = ""; }
  }, { passive: true });
})();
