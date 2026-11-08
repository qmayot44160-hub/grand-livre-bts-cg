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
                         sections=[dict(h="Texte de la fiche", b=[["p", txt]])], points=[],
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

data = dict(cats=cats, groups=groups, hue={"d%d" % u: v for u, v in HUES.items()}, chap=chap, themes=themes, q=Q)
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
  Q.push.apply(Q, D.q);
  GUEST_CATS.push("d1", "d9");
  D.cats.forEach(function (c) { PL_CATS.push(c.id); EXAM_PLAN[c.id] = 1; EPTEXT[c.id] = "Épreuve de l'" + c.code + " du DCG."; });
})();
""" % json.dumps(data, ensure_ascii=False, separators=(",", ":"))
open(OUT, "w", encoding="utf-8").write(js)
print("fiches", len(chap), "themes", len(themes), "questions", len(Q), "taille", len(js))
