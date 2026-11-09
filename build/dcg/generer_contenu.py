# Génère build/dcg_overlay.js : le contenu DCG, appliqué par-dessus le bloc de contenu BTS (mêmes noms, vidés puis remplis)
import json, re, random, sys
F = json.load(open("/tmp/claude-0/dcg/fiches.json"))
OUT = "/home/claude/grand-livre-bts-cg/build/dcg_overlay.js"
FIX_T = {(5, 9): "Les externalités et leur régulation", (5, 11): "Les agents à capacité de financement et l’épargne des ménages"}

UE = {
 1: ("Fondamentaux du droit", "droit", "Sources du droit, justice, personnes, contrats, responsabilité, commerçant, entreprise"),
 2: ("Droit des sociétés et des groupements d'affaires", "droit", "Contrat de société, SARL, SA, SAS, dirigeants, associés, groupes, difficultés"),
 3: ("Droit social", "droit", "Contrat de travail, durée du travail, rémunération, représentants du personnel, rupture, protection sociale"),
 4: ("Droit fiscal", "droit", "TVA, impôt sur le revenu, impôt sur les sociétés, résultat fiscal, enregistrement, contrôle"),
 5: ("Économie contemporaine", "eco", "Croissance, marchés, financement de l'économie, emploi, politiques économiques, mondialisation"),
 6: ("Finance d'entreprise", "chiffre", "Diagnostic financier, rentabilité, investissement, financement, trésorerie, valeur"),
 7: ("Management", "eco", "Organisations, décision, stratégie, structures, ressources humaines, gouvernance"),
 8: ("Systèmes d'information de gestion", "outils", "SI, bases de données, SQL, processus, PGI, sécurité, gestion de projet"),
 9: ("Comptabilité", "chiffre", "Cadre comptable, opérations courantes, TVA, paie, inventaire, comptes annuels"),
 10: ("Comptabilité approfondie", "chiffre", "Normes, actifs et passifs, opérations complexes, capitaux propres, fusions, consolidation"),
 11: ("Contrôle de gestion", "chiffre", "Coûts, budgets, écarts, tableaux de bord, pilotage de la performance"),
 12: ("Anglais appliqué aux affaires", "outils", "Grammaire, vocabulaire des affaires et de la comptabilité, écrit et oral"),
 13: ("Communication professionnelle", "outils", "Stage, recherche d'information, veille, écrits et oraux professionnels, soutenance"),
}
HUES = {1: [220, 64], 2: [250, 52], 3: [335, 58], 4: [265, 50], 5: [194, 70], 6: [132, 46], 7: [28, 78], 8: [228, 20], 9: [170, 62], 10: [150, 55], 11: [5, 62], 12: [42, 78], 13: [300, 38]}
cats = [dict(id="d%d" % u, code="UE %d" % u, name=n, ep="UE %d" % u, grp=g, desc=d) for u, (n, g, d) in UE.items()]
groups = [["droit", "Droit", "UE 1 à 4 : fondamentaux du droit, sociétés, droit social, droit fiscal."],
          ["chiffre", "Comptabilité, finance et contrôle", "UE 6, 9, 10 et 11 : le cœur du métier."],
          ["eco", "Économie et management", "UE 5 et 7."],
          ["outils", "Systèmes d'information, anglais et communication", "UE 8, 12 et 13."]]
CREDIT = "Fiche : Les Geeks des Chiffres"

chap, themes, Q = [], [], []
rnd = random.Random(2027)
MD = json.load(open("/tmp/claude-0/dcg/md.json"))
cours, cmeta, lesch = {}, {}, {}
for u in UE:
    L = [d for d in F if d["ue"] == u and d["pages"]]
    norm = lambda st: (st[0], re.sub(r"\s*\(suite\)\s*$", "", st[1], flags=re.I).strip()) if st else (0, "")
    steps = []
    for d in L:
        st = norm(d["step"])
        if st[0] not in [x[0] for x in steps]: steps.append(st)
    for d in L:
        st = norm(d["step"])
        k = [x[0] for x in steps].index(st[0]) + 1
        title = FIX_T.get((u, d["n"]), d["title"])
        title = re.sub(r"^[☐□]\s*", "", title).strip() or "Fiche %d" % d["n"]
        txt = d["txt"]
        idee = txt[:200].rsplit(" ", 1)[0] + "…" if len(txt) > 200 else txt
        fid = "d%df%d" % (u, d["n"])
        chap.append(dict(id=fid, cat="d%d" % u, src="geeks", th="d%d:%d" % (u, k), n=d["n"], title=title, idee=idee,
                         sections=[], points=[],
                         imgs=["/dcg/u%d/f%d-%d.webp" % (u, d["n"], i + 1) for i in range(len(d["pages"]))], credit=CREDIT))
        for q in d["quiz"]:
            o = q["opts"]; good = o[q["a"]]; bad = [v for kk, v in o.items() if kk != q["a"]]
            if not good or not bad: continue
            Q.append(["d%d" % u, q["q"], [good] + bad, "D'après la fiche n°%d « %s » (Les Geeks des Chiffres)." % (d["n"], title), fid])
    for k, st in enumerate(steps):
        t = st[1].strip().rstrip(".").strip() or "Fiches"
        t = t[:1] + t[1:].lower() if t.upper() == t else t
        t = re.sub(r"(?i)\bue ?(\d+)", r"UE \1", t).replace("(tva)", "(TVA)").replace(" ess", " ESS").replace("& ", "et ").replace("Si et ", "SI et ")
        themes.append(dict(key="d%d:%d" % (u, k + 1), cat="d%d" % u, n=k + 1, title=t))

for u in UE:
    L = [c for c in chap if c["cat"] == "d%d" % u]
    parts = ["Le cours de l'UE %d du DCG, fiche par fiche, d'après les fiches de révision des Geeks des Chiffres (intégrées avec leur accord pour la classe). Chaque leçon renvoie à sa fiche illustrée et à son quiz." % u]
    for c in L:
        md = MD.get("%d:%d" % (u, c["n"]), "").strip() or "Cette fiche est surtout faite de schémas : ouvre la fiche illustrée."
        md = re.sub(r"(?m)^## ", "### ", md)
        parts.append("## %d. %s\n\n%s" % (c["n"], c["title"], md))
    cours["d%d" % u] = "\n\n".join(parts)
    cmeta["d%d" % u] = dict(id="d%d" % u, cat="d%d" % u, code="UE %d" % u, name=UE[u][0], short=UE[u][0])
    lesch["d%d" % u] = [[c["id"]] for c in L]
# Lexique (build/dcg/lexique.py) : cartes terme / définition, et questions inversées (la définition, trouver le terme)
LX = json.load(open("/tmp/claude-0/dcg/lexique.json"))
FL, QI = [], []
num = {c["id"]: c["n"] for c in chap}
for x in LX:
    FL.append([x["c"], x["f"], x["b"], x["m"], x["ch"]])
    words = [w for w in re.findall(r"[a-zà-ÿ]{4,}", x["f"].lower())]
    if any(w in x["b"].lower() for w in words): continue
    same = [y["f"] for y in LX if y["c"] == x["c"] and y["f"] != x["f"]]
    if len(same) < 3: continue
    same.sort(key=lambda t: abs(len(t) - len(x["f"])) + rnd.random() * 12)
    QI.append([x["c"], "Quel terme correspond à cette définition ? « %s »" % x["b"].rstrip("."), [x["f"]] + same[:3],
               "« %s » : %s (lexique de la fiche n°%d, Les Geeks des Chiffres)." % (x["f"], x["b"][:1].lower() + x["b"][1:], num.get(x["ch"], 0)), x["ch"]])
Q += QI
print("lexique : cartes", len(FL), "questions inversées", len(QI))
# Axe théorique : auteurs (REFS + questions « quel auteur ? »), pièges (cartes), quiz à plusieurs réponses, mini-cas, schémas
AP = json.load(open("/tmp/claude-0/dcg/auteurs_pieges.json"))
TH = json.load(open("/tmp/claude-0/dcg/theorique.json"))
DROP = {("d5", "Joseph Schumpeter"), ("d5", "Richard Musgrave"), ("d5", "Nicholas Kaldor"), ("d7", "Wilson"), ("d11", "Wilson")}
refs = []
for name, cat, ch, theme, idea, pat in AP["refs"]:
    if (cat, name) in DROP: continue
    idea = re.sub(r"^\d+(\.\d+)+\s+", "", idea); idea = re.sub(r"^Hayek : l’information est dispersée ", "", idea)
    refs.append([name, cat, ch, theme, idea, pat])
QA = []
for name, cat, ch, theme, idea, pat in refs:
    masked = re.sub(pat, "…", idea)
    for w in re.findall(r"[A-ZÉ][a-zéèïô]{2,}", name): masked = masked.replace(w, "…")
    masked = re.sub(r"…(?:\s*(?:,|et|&)?\s*…)+", "…", masked)
    if "…" not in masked or re.search(r"[A-Z][a-z]+ (?:et|&) …|… (?:et|&) [A-Z]", masked): continue
    others = [r[0] for r in refs if r[1] == cat and r[0] != name]
    if len(others) < 3: others = [r[0] for r in refs if r[0] != name]
    rnd.shuffle(others)
    QA.append([cat, "Quel auteur ? « %s »" % masked, [name] + others[:3], "%s : %s (fiche n°%d, Les Geeks des Chiffres)." % (name, idea, num.get(ch, 0)), ch])
Q += QA
FL += AP["pieges"]
print("auteurs", len(refs), "questions auteurs", len(QA), "pièges", len(AP["pieges"]), "· théorique", len(TH["mq"]), len(TH["gc"]), len(TH["sch"]))
data = dict(f=FL, refs=[r[:5] for r in refs], mq=TH["mq"], gc=TH["gc"], sch=TH["sch"], cours=cours, cmeta=cmeta, lesch=lesch, cats=cats, groups=groups, hue={"d%d" % u: v for u, v in HUES.items()}, chap=chap, themes=themes, q=Q)
js = """/* =====================================================================
   CONTENU DE LA FORMATION : DCG (diplôme de comptabilité et de gestion)
   Appliqué après le bloc de contenu BTS : on vide les mêmes noms, puis on les remplit.
   Fiches et quiz : Les Geeks des Chiffres, intégrés avec leur accord pour la classe.
   ===================================================================== */
(function () {
  var D = %s;
  var clearA = function (a) { if (Array.isArray(a)) a.splice(0, a.length); };
  var clearO = function (o) { if (o && typeof o === "object") Object.keys(o).forEach(function (k) { delete o[k]; }); };
  var hidden = CATS.splice(0, CATS.length);
  FORMATION.id = "dcg"; FORMATION.nom = "Diplôme de comptabilité et de gestion"; FORMATION.court = "DCG"; FORMATION.niveau = "Bac+3"; FORMATION.examen = "DCG";
  FORMATION.hiddenCats = hidden; FORMATION.groups = D.groups; FORMATION.hue = D.hue;
  [Q, F, CHAP, IMP_THEMES, GCASES, REFS, ORAL, ORAL_TRAME, EPREUVES, BTS_PLAN, BTS_CHECK, ANN, GENS, DOSS, EXAM5, REDAC, SCH, CXG, AUSIT, RX_MORE, GUEST_CATS, PL_CATS].forEach(clearA);
  [COURS, COURS_META, METH, MCFG, NOTIONS, VIG, QX, STEP_EXP, EPTEXT, EXAM_PLAN, EPREUVE_INFO, RX].forEach(clearO);
  if (Array.isArray(GLF)) clearA(GLF); else clearO(GLF);
  CATS.push.apply(CATS, D.cats);
  CHAP.push.apply(CHAP, D.chap);
  IMP_THEMES.push.apply(IMP_THEMES, D.themes);
  Object.assign(COURS, D.cours); Object.assign(COURS_META, D.cmeta);
  FORMATION.lesCh = D.lesch; FORMATION.lessonPath = D.cats.map(function (c) { return c.id; }); FORMATION.coursOrder = FORMATION.lessonPath.slice();
  Q.push.apply(Q, D.q);
  F.push.apply(F, D.f);
  REFS.push.apply(REFS, D.refs); GCASES.push.apply(GCASES, D.gc); SCH.push.apply(SCH, D.sch);
  window.GL_QMUL = D.mq;
  GUEST_CATS.push("d1", "d9");
  D.cats.forEach(function (c) { PL_CATS.push(c.id); EXAM_PLAN[c.id] = 1; EPTEXT[c.id] = "Épreuve de l'" + c.code + " du DCG."; });
})();
""" % json.dumps(data, ensure_ascii=False, separators=(",", ":"))
open(OUT, "w", encoding="utf-8").write(js)
print("fiches", len(chap), "themes", len(themes), "questions", len(Q), "taille", len(js))
