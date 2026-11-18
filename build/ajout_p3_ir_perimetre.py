# -*- coding: utf-8 -*-
"""Ajoute au BTS CG (P3) le chapitre « Le périmètre de l'impôt sur le revenu »
(fiche ressources, chapitre 22, fournie par Quentin), ses quiz, ses cartes
et un exercice chiffré. Usage : python3 build/ajout_p3_ir_perimetre.py build/source.html
Le script refuse de tourner deux fois (vérifie la présence de p3c12)."""
import json, sys

path = sys.argv[1]
s = open(path, encoding="utf-8").read()
if '"id": "p3c12"' in s:
    sys.exit("p3c12 déjà présent : rien à faire")

def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:80])
    s = s.replace(a, b)

CH = {
 "id": "p3c12", "cat": "p3", "src": "p3", "th": "p3:2", "n": 12,
 "title": "Le périmètre de l'impôt sur le revenu",
 "idee": "L'impôt sur le revenu frappe chaque année les revenus d'un foyer fiscal domicilié en France : on calcule un revenu net par catégorie, on impute les déficits selon leurs règles, puis on passe du revenu brut global au revenu net imposable.",
 "sections": [
  {"h": "Les définitions", "b": [
   ["d", "Domicile fiscal en France", "Il suffit de remplir UN des quatre critères de l'article 4 B du CGI : foyer, lieu de séjour principal, activité professionnelle ou centre des intérêts économiques en France."],
   ["d", "Foyer fiscal", "Le contribuable seul (célibataire, veuf, divorcé, séparé) ou le couple marié ou pacsé, avec les enfants mineurs et les personnes invalides qui vivent sous son toit."],
   ["d", "Revenu net catégoriel", "Revenu brut d'une catégorie diminué des dépenses engagées pour l'acquérir et le conserver (au forfait ou au réel)."],
   ["d", "Revenu brut global", "Somme des revenus nets catégoriels, après imputation des déficits catégoriels sur les bénéfices de même nature."],
   ["d", "Revenu net imposable", "Revenu brut global diminué des déficits imputables, des charges déductibles et des abattements spécifiques."]
  ]},
  {"h": "L'essentiel du cours", "b": [
   ["p", "Avant de calculer l'impôt (chapitre « L'impôt sur le revenu des personnes physiques »), il faut savoir trois choses : qui est imposé en France, quels revenus on regroupe dans un même foyer et comment on passe des revenus de chaque catégorie au revenu net imposable. C'est l'objet de ce chapitre."],
   ["p", "L'article 1 A du CGI pose le principe : « il est établi un impôt annuel unique sur le revenu des personnes physiques désigné sous le nom d'impôt sur le revenu »."]
  ]},
  {"h": "Les caractéristiques de l'impôt sur le revenu", "b": [
   ["t", ["Caractère", "Ce que ça veut dire"], [
    ["Annuel", "L'impôt est calculé pour une année civile."],
    ["Direct / indirect", "Il est perçu par voie de rôle (avis d'imposition) ou, pour certains revenus, prélevé par un tiers (prélèvement à la source)."],
    ["Personnel", "Il tient compte de la situation familiale du contribuable."],
    ["Global", "Il porte sur les revenus déclarés par tous les membres du foyer fiscal."],
    ["Progressif", "On applique aux revenus un barème progressif qui tient compte de la situation familiale."]
   ]]
  ]},
  {"h": "La territorialité : le domicile fiscal", "b": [
   ["p", "Pour l'impôt sur le revenu, la France comprend la métropole, la Corse et les DOM. Une personne a son domicile fiscal en France dès qu'elle remplit l'UN des quatre critères suivants (article 4 B du CGI) :"],
   ["t", ["Critère", "Précision"], [
    ["Foyer en France", "Lieu de résidence habituelle du contribuable ou de sa famille, sans tenir compte des séjours temporaires à l'étranger pour raisons professionnelles. Une personne qui travaille à l'étranger reste domiciliée en France si sa famille y demeure."],
    ["Lieu de séjour principal en France", "On retient le lieu où la personne séjourne le plus. Un séjour de plus de 183 jours en France dans l'année suffit."],
    ["Activité professionnelle en France", "Critère professionnel : l'activité peut être salariée ou non."],
    ["Centre des intérêts économiques en France", "Lieu des principaux investissements ou du siège des affaires de la personne."]
   ]],
   ["w", "Les critères ne sont pas cumulatifs : un seul suffit pour être domicilié fiscalement en France."]
  ]},
  {"h": "Les conventions fiscales internationales", "b": [
   ["p", "Elles ont pour but d'éviter qu'un même revenu soit imposé deux fois, dans deux pays. Elles ont une autorité supérieure aux lois nationales. Deux méthodes existent :"],
   ["l", [
    "la méthode de l'exonération : l'un des deux pays exonère le revenu ;",
    "la méthode de l'imputation : l'impôt payé dans un pays est déduit de l'impôt dû dans l'autre."
   ]]
  ]},
  {"h": "Le foyer fiscal et ses exceptions", "b": [
   ["p", "Le foyer fiscal comprend le contribuable seul (célibataire, veuf, divorcé ou séparé) ou les époux mariés ou pacsés, les enfants mineurs et les personnes invalides qui vivent sous le toit du contribuable. La situation du foyer s'apprécie au 1er janvier de l'année d'imposition."],
   ["t", ["Exception", "Conditions"], [
    ["Imposition distincte obligatoire des époux", "Ils sont séparés de biens et ne vivent pas sous le même toit ; ou ils sont en instance de divorce et autorisés par le juge à résider séparément ; ou l'un a abandonné le domicile conjugal et chacun a des revenus propres."],
    ["Imposition distincte facultative des enfants mineurs", "Le parent formule une option expresse et l'enfant célibataire a des revenus tirés de son propre travail."],
    ["Rattachement optionnel des enfants majeurs célibataires", "Moins de 21 ans, ou moins de 25 ans s'ils poursuivent des études."]
   ]],
   ["ex", "la famille Thomas", [
    "Les époux Thomas ont deux enfants : Élodie, 22 ans, coiffeuse, et Jules, 24 ans, étudiant.",
    "Sans option : trois foyers fiscaux (les époux, Élodie, Jules).",
    "Avec option : Élodie a plus de 21 ans et ne fait pas d'études, elle ne peut pas être rattachée. Jules a moins de 25 ans et étudie, il peut l'être. Il reste deux foyers : les époux avec Jules, et Élodie."
   ]]
  ]},
  {"h": "Rattacher un enfant majeur : avantages et inconvénients", "b": [
   ["p", "Le rattachement n'est pas toujours intéressant : une simulation est souvent nécessaire."],
   ["t", ["", "Conséquences"], [
    ["Avantages", "Plus de parts, donc un quotient familial plus faible ; réduction d'impôt pour frais de scolarité (61 € pour un collégien, 153 € pour un lycéen, 183 € pour un étudiant)."],
    ["Inconvénients", "Les pensions alimentaires versées à l'enfant ne sont plus déductibles ; ses revenus s'ajoutent à ceux des parents ; l'économie d'impôt des parts supplémentaires est plafonnée."]
   ]]
  ]},
  {"h": "Les revenus nets catégoriels", "b": [
   ["p", "Fait générateur (article 12 du CGI) : l'impôt est dû chaque année sur les revenus que le contribuable réalise ou dont il dispose au cours de cette année. La référence est l'année civile : le revenu de N est déclaré en N+1 sur la déclaration n° 2042."],
   ["p", "En principe, on impose le revenu encaissé. Les revenus des activités non salariées (BIC, BNC, BA) sont souvent calculés à partir d'une comptabilité d'engagement."],
   ["p", "Les catégories de revenus :"],
   ["l", [
    "traitements et salaires ;",
    "revenus de capitaux mobiliers et gains en capital ;",
    "revenus fonciers ;",
    "revenus des activités professionnelles non salariées : BIC, BNC et BA."
   ]],
   ["p", "Pour chaque catégorie, revenu net = revenu brut − dépenses engagées pour acquérir et conserver ce revenu (frais professionnels, charges d'entretien des immeubles…), évaluées au forfait ou au réel."],
   ["ex", "un cas chiffré", [
    "En N, un contribuable perçoit 40 000 € de salaire (frais professionnels : 10 %) et 18 000 € de loyers (travaux d'entretien 5 000 €, taxe foncière 1 000 €, intérêts d'emprunt 500 €).",
    "Traitements et salaires : 40 000 − 40 000 × 10 % = 36 000 €.",
    "Revenus fonciers : 18 000 − 5 000 − 1 000 − 500 = 11 500 €.",
    "Total des revenus nets catégoriels : 47 500 €."
   ]]
  ]},
  {"h": "Le traitement des déficits", "b": [
   ["p", "Quand le contribuable déduit ses frais au réel, une catégorie peut être en déficit (BIC, BNC, BA, revenus fonciers). En principe, un déficit ne s'impute que sur un bénéfice de même nature ; dans certaines limites, il peut s'imputer sur les autres revenus."],
   ["t", ["Déficit", "Règle d'imputation"], [
    ["BIC, BNC, BA", "D'abord sur les bénéfices de même nature des autres membres du foyer ; le reste sur le revenu global (salaires, capitaux mobiliers, fonciers). Si le revenu global ne suffit pas, le solde se reporte sur le revenu global des 6 années suivantes."],
    ["Foncier", "Sur le revenu global dans la limite de 10 700 €, et hors part due aux intérêts d'emprunt. Le reste et la part liée aux intérêts se reportent sur les revenus fonciers des 10 années suivantes."]
   ]],
   ["w", "Le déficit foncier ne passe pas en entier sur le revenu global : plafond de 10 700 €, et jamais la part qui vient des intérêts d'emprunt."]
  ]},
  {"h": "Du revenu brut global au revenu net imposable", "b": [
   ["l", [
    "Revenu brut global = somme des revenus nets catégoriels, après imputation des déficits catégoriels sur les bénéfices de même nature.",
    "Revenu net global = revenu brut global − déficits imputables sur le revenu global (déficit foncier dans la limite de 10 700 €) − charges déductibles (pensions alimentaires, CSG déductible, cotisations à certains régimes obligatoires…).",
    "Revenu net imposable = revenu net global − abattements spécifiques (personnes âgées, enfant marié rattaché…)."
   ]],
   ["ex", "les époux Durand", [
    "Monsieur, commerçant, dégage un bénéfice BIC de 60 000 €. Madame, artisan, un déficit BIC de 25 000 €. Leur appartement loué rapporte 5 000 € de loyers pour 8 000 € de charges : déficit foncier de 3 000 €. Ils versent 4 300 € de pension alimentaire à leur fille.",
    "Le déficit de Madame s'impute d'abord sur le bénéfice de Monsieur (même nature). Revenu brut global : 60 000 − 25 000 = 35 000 €.",
    "Revenu net global : 35 000 − 3 000 = 32 000 € (déficit foncier sous le plafond de 10 700 €).",
    "Revenu net imposable : 32 000 − 4 300 = 27 700 €."
   ]]
  ]},
  {"h": "Vers le calcul de l'impôt", "b": [
   ["p", "Nombre de parts : 1 pour un célibataire, 2 pour un couple marié ou pacsé, 0,5 pour chacun des deux premiers enfants, 1 à partir du troisième. Quotient familial = revenu net imposable / nombre de parts. Seuls les revenus soumis au barème progressif entrent dans ce revenu."],
   ["ex", "un couple marié avec un enfant", [
    "Revenu imposable 101 250 €, 2,5 parts. Quotient familial : 101 250 / 2,5 = 40 500 €.",
    "Impôt pour une part : (29 579 − 11 601) × 11 % + (40 500 − 29 580) × 30 % ≈ 1 978 + 3 276 = 5 254 €.",
    "Impôt pour 2,5 parts : 5 254 × 2,5 = 13 135 €."
   ]],
   ["w", "Cet exemple du cours ignore le plafonnement du quotient familial. Ici, la demi-part de l'enfant ferait gagner bien plus que le plafond autorisé : l'impôt réel serait donc plus élevé. Le barème, le détail du calcul et le plafonnement sont dans le chapitre « L'impôt sur le revenu des personnes physiques »."]
  ]},
  {"h": "Les prélèvements sociaux", "b": [
   ["p", "Ce sont des impôts qui financent la protection sociale, parfois appelés « contributions sociales ». Leur champ, fixé par le législateur, est large : revenus du travail, BIC, BNC, BA, plus-values professionnelles, revenus et gains en capital, revenus fonciers."],
   ["p", "Ils sont au nombre de cinq : la CSG (contribution sociale généralisée), la CRDS (contribution au remboursement de la dette sociale), le prélèvement social, la contribution additionnelle et le prélèvement de solidarité."],
   ["p", "Recouvrement selon la nature du revenu : prélèvement à la source pour les salaires, BIC, BNC, BA, revenus du capital et plus-values immobilières ; avis d'imposition pour les plus-values mobilières et les revenus fonciers."]
  ]},
  {"h": "Les pièges", "b": [
   ["trap", "Croire qu'il faut remplir les quatre critères du domicile fiscal : un seul suffit."],
   ["trap", "Rattacher un enfant majeur de 22 ans qui travaille : au-delà de 21 ans, il faut poursuivre des études (et avoir moins de 25 ans)."],
   ["trap", "Imputer tout le déficit foncier sur le revenu global : plafond de 10 700 € et jamais la part des intérêts d'emprunt."],
   ["trap", "Imputer le déficit BIC d'un époux directement sur les salaires alors que l'autre époux a un bénéfice BIC : on impute d'abord sur les bénéfices de même nature."],
   ["trap", "Apprécier la composition du foyer au 31 décembre : c'est au 1er janvier de l'année d'imposition."]
  ]}
 ],
 "points": [
  "Domicile fiscal : un seul des 4 critères de l'article 4 B suffit (foyer, séjour principal ou plus de 183 jours, activité, intérêts économiques).",
  "Rattachement d'un enfant majeur célibataire : moins de 21 ans, ou moins de 25 ans s'il étudie.",
  "Déficit BIC, BNC, BA : même nature d'abord, puis revenu global, report sur 6 ans.",
  "Déficit foncier : revenu global dans la limite de 10 700 € hors intérêts d'emprunt, reste reporté 10 ans sur les revenus fonciers.",
  "Revenu brut global → revenu net global (déficits, charges déductibles) → revenu net imposable (abattements)."
 ]
}

C = "p3c12"
QS = [
 ["Pour avoir son domicile fiscal en France, une personne doit remplir…", ["Un seul des quatre critères de l'article 4 B du CGI", "Les quatre critères de l'article 4 B du CGI", "Au moins deux critères sur quatre", "Le seul critère de la nationalité française"], "Les critères (foyer, séjour principal, activité, intérêts économiques) ne sont pas cumulatifs : un seul suffit."],
 ["Une personne est considérée comme domiciliée en France si elle y séjourne, dans l'année, plus de…", ["183 jours", "90 jours", "120 jours", "250 jours"], "Lieu de séjour principal : plus de 183 jours en France au cours d'une même année."],
 ["Un salarié travaille toute l'année à l'étranger, mais sa femme et ses enfants vivent à Toulon. Son domicile fiscal est…", ["En France, car son foyer y est", "À l'étranger, car il y travaille", "Dans les deux pays à la fois", "Nulle part, faute de séjour principal"], "Le foyer est le lieu de résidence habituelle de la famille, sans tenir compte des séjours professionnels à l'étranger."],
 ["Pour l'impôt sur le revenu, la France comprend…", ["La métropole, la Corse et les DOM", "La métropole seulement", "La métropole et la Corse seulement", "La métropole, la Corse, les DOM et les COM"], "Territorialité de l'IR : métropole, Corse et DOM."],
 ["Une convention fiscale internationale a pour objectif principal…", ["D'éviter la double imposition", "D'augmenter les recettes fiscales des deux pays", "De supprimer l'impôt sur le revenu", "D'harmoniser les taux de TVA"], "Les conventions fiscales évitent qu'un même revenu soit imposé dans deux pays ; elles priment sur la loi nationale."],
 ["Dans la méthode de l'imputation, …", ["L'impôt payé dans un pays est déduit de l'impôt dû dans l'autre", "L'un des deux pays exonère le revenu", "Le revenu est imposé deux fois au taux réduit", "Le contribuable choisit le pays le moins taxé"], "Exonération : un pays renonce à imposer. Imputation : l'impôt payé à l'étranger vient en déduction."],
 ["La composition du foyer fiscal s'apprécie…", ["Au 1er janvier de l'année d'imposition", "Au 31 décembre de l'année des revenus", "À la date de la déclaration", "Au 30 juin de l'année des revenus"], "Règle du cours : situation du foyer au 1er janvier de l'année d'imposition."],
 ["Un enfant majeur célibataire peut être rattaché au foyer de ses parents s'il a…", ["Moins de 21 ans, ou moins de 25 ans s'il poursuit des études", "Moins de 18 ans seulement", "Moins de 25 ans, qu'il étudie ou non", "Moins de 30 ans s'il est étudiant"], "Rattachement optionnel : moins de 21 ans, ou moins de 25 ans en cas d'études."],
 ["Élodie, 22 ans, est coiffeuse. Peut-elle être rattachée au foyer de ses parents ?", ["Non, elle a plus de 21 ans et ne poursuit pas d'études", "Oui, car elle a moins de 25 ans", "Oui, sur simple option des parents", "Non, car elle est mineure"], "Au-delà de 21 ans, il faut poursuivre des études (et avoir moins de 25 ans)."],
 ["Les époux sont obligatoirement imposés séparément lorsque…", ["Ils sont séparés de biens et ne vivent pas sous le même toit", "Ils sont mariés sous le régime de la communauté", "L'un des deux ne travaille pas", "Ils ont des revenus très différents"], "Imposition distincte obligatoire : séparés de biens sans vie commune, instance de divorce avec résidence séparée autorisée, ou abandon du domicile conjugal avec revenus propres."],
 ["Un inconvénient du rattachement d'un enfant majeur est que…", ["Les pensions alimentaires qui lui sont versées ne sont plus déductibles", "Le nombre de parts du foyer diminue", "Le foyer perd la réduction pour frais de scolarité", "L'enfant doit payer seul son impôt"], "En rattachant, on gagne des parts mais on ne déduit plus la pension, on ajoute ses revenus et l'avantage est plafonné."],
 ["La réduction d'impôt pour frais de scolarité d'un enfant étudiant rattaché est de…", ["183 €", "61 €", "153 €", "1 000 €"], "61 € pour un collégien, 153 € pour un lycéen, 183 € pour un étudiant."],
 ["Selon l'article 12 du CGI, les revenus de l'année N sont déclarés…", ["En N+1, sur la déclaration n° 2042", "En N, au fil des encaissements", "En N+2, après contrôle", "En N+1, sur la liasse fiscale 2065"], "Année civile : revenu réalisé en N, déclaré en N+1 sur la 2042."],
 ["Un salaire de 40 000 € avec un abattement forfaitaire de 10 % donne un revenu net catégoriel de…", ["36 000 €", "40 000 €", "44 000 €", "4 000 €"], "40 000 − 40 000 × 10 % = 36 000 €."],
 ["Un déficit BIC d'un époux s'impute en priorité…", ["Sur les bénéfices de même nature des autres membres du foyer", "Sur les salaires du foyer", "Sur les revenus fonciers seulement", "Sur l'impôt dû l'année suivante"], "Même nature d'abord, puis le revenu global ; le solde se reporte sur 6 ans."],
 ["La part d'un déficit BIC non absorbée par le revenu global se reporte…", ["Sur le revenu global des 6 années suivantes", "Sur les revenus fonciers des 10 années suivantes", "Sur le revenu global des 10 années suivantes", "Elle est définitivement perdue"], "Déficit BIC, BNC, BA : report sur le revenu global des 6 années suivantes."],
 ["Le déficit foncier s'impute sur le revenu global dans la limite de…", ["10 700 €, hors part liée aux intérêts d'emprunt", "10 700 €, intérêts d'emprunt compris", "15 300 €, hors intérêts d'emprunt", "Sans limite"], "Plafond de 10 700 € ; la part due aux intérêts et l'excédent vont sur les revenus fonciers des 10 années suivantes."],
 ["Bénéfice BIC de Monsieur 60 000 €, déficit BIC de Madame 25 000 €, déficit foncier 3 000 €. Le revenu net global est de…", ["32 000 €", "35 000 €", "38 000 €", "57 000 €"], "Revenu brut global 60 000 − 25 000 = 35 000 €, puis − 3 000 de déficit foncier = 32 000 €."],
 ["Les pensions alimentaires versées se déduisent pour passer…", ["Du revenu brut global au revenu net global", "Du revenu net global au revenu net imposable", "Du revenu catégoriel au revenu brut global", "De l'impôt brut à l'impôt net"], "Charges déductibles (pensions, CSG déductible…) : du revenu brut global au revenu net global. Les abattements spécifiques viennent ensuite."],
 ["Combien existe-t-il de prélèvements sociaux selon le cours ?", ["Cinq", "Deux", "Trois", "Sept"], "CSG, CRDS, prélèvement social, contribution additionnelle et prélèvement de solidarité."],
 ["Les prélèvements sociaux sur les revenus fonciers sont recouvrés…", ["Par avis d'imposition", "Par prélèvement à la source", "Par l'employeur", "Par le notaire"], "Avis d'imposition pour les revenus fonciers et les plus-values mobilières ; prélèvement à la source pour le reste."],
 ["L'impôt sur le revenu est dit « personnel » parce qu'il…", ["Tient compte de la situation familiale", "Est payé par une seule personne", "Est confidentiel", "Ne frappe que les salaires"], "Personnel : situation familiale. Global : tous les revenus du foyer. Annuel : année civile."],
]
FS = [
 ["Domicile fiscal : les 4 critères", "Foyer en France, lieu de séjour principal (plus de 183 jours), activité professionnelle en France, centre des intérêts économiques en France.", "Un seul critère suffit (article 4 B du CGI)."],
 ["Conventions fiscales", "Évitent la double imposition. Méthode de l'exonération (un pays exonère) ou de l'imputation (l'impôt payé dans un pays est déduit dans l'autre).", "Supérieures aux lois nationales."],
 ["Foyer fiscal", "Contribuable seul ou couple marié ou pacsé, enfants mineurs, personnes invalides vivant sous son toit.", "Apprécié au 1er janvier de l'année d'imposition."],
 ["Rattachement d'un enfant majeur", "Célibataire de moins de 21 ans, ou de moins de 25 ans s'il poursuit des études.", "Avantage : plus de parts. Inconvénient : pension non déductible, revenus ajoutés, avantage plafonné."],
 ["Imposition distincte obligatoire des époux", "Séparés de biens sans vie commune ; instance de divorce avec résidence séparée autorisée ; abandon du domicile conjugal avec revenus propres.", ""],
 ["Déficit BIC, BNC, BA", "D'abord sur les bénéfices de même nature du foyer, puis sur le revenu global ; solde reporté sur le revenu global des 6 années suivantes.", ""],
 ["Déficit foncier", "Sur le revenu global dans la limite de 10 700 €, hors intérêts d'emprunt ; le reste sur les revenus fonciers des 10 années suivantes.", ""],
 ["Revenu brut global → net imposable", "RBG = revenus nets catégoriels (déficits de même nature imputés). RNG = RBG − déficits imputables − charges déductibles. RNI = RNG − abattements spécifiques.", ""],
 ["Prélèvements sociaux", "CSG, CRDS, prélèvement social, contribution additionnelle, prélèvement de solidarité.", "À la source pour salaires, BIC, BNC, BA, capitaux ; avis d'imposition pour fonciers et plus-values mobilières."],
 ["Réduction pour frais de scolarité", "61 € par collégien, 153 € par lycéen, 183 € par étudiant.", ""],
]

js = lambda o: json.dumps(o, ensure_ascii=False)
for q in QS:
    assert len(q[1]) == 4 and "—" not in js(q)
assert "—" not in js(CH) and "—" not in js(FS)

# 1) le chapitre, juste avant le chapitre de calcul p3c9
rep('{"id": "p3c9"', js(CH) + ', {"id": "p3c9"')

# 2) quiz et cartes, rattachés au chapitre
qline = "Q.push(...[" + ", ".join(js(["p3", q[0], q[1], q[2], C]) for q in QS) + "]);\n"
fline = "F.push(...[" + ", ".join(js(["p3", f[0], f[1], f[2], C]) for f in FS) + "]);\n"
anchor = "\nCHAP.push(...[{\"id\": \"p2c7\""
rep(anchor, "\n" + qline + fline + anchor[1:])

# 3) exercice chiffré : déficits et revenu net imposable
GEN = r''' { id: "p3rni", cat: "p3", title: "Déficits et revenu net imposable d'un foyer", make() {
    const B = ri(50, 90) * 1000, D = ri(5, 25) * 1000, L = ri(4, 12) * 1000, I = ri(1, 3) * 500, dF = ri(2, 32) * 500, Ch = L - I + dF, P = ri(0, 5) * 1000;
    const rbg = B - D, imp = Math.min(dF, 10700), rep = dF - imp, rni = rbg - imp - P;
    return { enonce: `<p>Monsieur, commerçant, a réalisé en N un bénéfice BIC de ${fmt(B)} €. Madame, artisan, a dégagé un déficit BIC de ${fmt(D)} €. Le couple loue un appartement : loyers ${fmt(L)} €, charges hors intérêts ${fmt(Ch)} €, intérêts d'emprunt ${fmt(I)} €.${P ? ` Ils versent une pension alimentaire de ${fmt(P)} € à leur fille majeure non rattachée.` : ""} Aucun abattement spécifique.</p><p>Calcule le revenu brut global, la part du déficit foncier imputable sur le revenu global, le revenu net imposable et le déficit foncier reportable.</p>`,
      fields: [{ label: "Revenu brut global", ans: rbg }, { label: "Déficit foncier imputé sur le revenu global", ans: imp }, { label: "Revenu net imposable", ans: rni }, { label: "Déficit foncier reporté sur les revenus fonciers futurs", ans: rep }],
      corr: `<p>Le déficit BIC de Madame s'impute d'abord sur le bénéfice BIC de Monsieur (même nature). Revenu brut global = ${fmt(B)} − ${fmt(D)} = <b>${fmt(rbg)} €</b>.</p><p>Revenus fonciers : ${fmt(L)} − ${fmt(I)} (intérêts) = ${fmt(L - I)} €, absorbés par les autres charges de ${fmt(Ch)} € : déficit de ${fmt(dF)} €, qui ne vient pas des intérêts. Il passe sur le revenu global dans la limite de 10 700 € : <b>${fmt(imp)} €</b>${rep ? `, et les ${fmt(rep)} € restants se reportent sur les revenus fonciers des 10 années suivantes` : ""}.</p><p>Revenu net imposable = ${fmt(rbg)} − ${fmt(imp)}${P ? ` − ${fmt(P)} (pension alimentaire)` : ""} = <b>${fmt(rni)} €</b>.</p><p>Déficit foncier reporté : <b>${fmt(rep)} €</b>.</p>` };
 } },
'''
rep(' { id: "p2stock", cat: "p2",', GEN + ' { id: "p2stock", cat: "p2",')

open(path, "w", encoding="utf-8").write(s)
print("ok :", len(QS), "questions,", len(FS), "cartes, 1 chapitre, 1 exercice")
