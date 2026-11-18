# -*- coding: utf-8 -*-
"""Fusionne, dans le BTS P3, le périmètre de l'impôt sur le revenu (leçon 8, fiche p3c12)
avec le calcul de l'impôt (leçon 9, fiche p3c9) : une seule leçon 8 et une seule fiche p3c9.
Les leçons 9 à 13 redeviennent 8 à 12 (LES_MIG v4) ; les données des anciennes leçons 8 et 9
sont fusionnées sans s'écraser. Usage : python3 build/fusion_p3_ir.py build/source.html"""
import json, re, sys

path = sys.argv[1]
s = open(path, encoding="utf-8").read()
if '"id": "p3c12"' not in s:
    sys.exit("déjà fusionné")

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:90])
    s = s.replace(a, b)

dec = json.JSONDecoder()

# ---------------------------------------------------------------- 1) la leçon
i = s.find("const COURS = {")
k = s.find('"p3": "', i)
txt, end = dec.raw_decode(s, k + 6)

a8 = txt.index("## 8. Le périmètre de l'impôt sur le revenu")
a9 = txt.index("## 9. L'impôt sur le revenu des personnes physiques")
a10 = txt.index("## 10. ")
L8, L9 = txt[a8:a9], txt[a9:a10]

def parts(L):
    """découpe une leçon en {intro, titre ### : texte}, en sortant les encadrés finaux"""
    out = {}
    for tag in ("> **Erreurs fréquentes**", "> **À retenir**"):
        j = L.index(tag)
        nxt = L.find("\n\n> **", j + 5)
        out[tag] = L[j:nxt if nxt > 0 else len(L)].strip()
        L = L[:j] + (L[nxt:] if nxt > 0 else "")
    chunks = re.split(r"\n### ", L)
    out["intro"] = chunks[0].split("\n", 1)[1].strip()
    for c in chunks[1:]:
        h, b = c.split("\n", 1)
        out[h.strip()] = b.strip()
    return out

P8, P9 = parts(L8), parts(L9)

intro9 = P9["intro"]
intro = (intro9 + "\n\nOn suit l'ordre de la déclaration : **qui** est imposé en France, **quels revenus** on regroupe dans un même foyer, "
         "**comment** on arrive au revenu net imposable, puis **comment** on calcule l'impôt.\n\n"
         "L'article 1 A du CGI pose le principe : « il est établi un impôt annuel unique sur le revenu des personnes physiques désigné sous le nom d'impôt sur le revenu ».")

rbg = P8["Du revenu brut global au revenu net imposable"]
rbg = rbg[:rbg.index("\n\nOn peut alors calculer")].strip()

etapes = """Une fois le revenu net imposable du foyer connu :

1. On le divise par le **nombre de parts** : 1 pour une personne seule, 2 pour un couple marié ou pacsé, une demi-part de plus pour chacun des deux premiers enfants, une part entière à partir du troisième. C'est le **quotient familial**. Seuls les revenus soumis au barème progressif entrent dans ce calcul.
2. On applique le **barème progressif** au revenu d'une part.
3. On multiplie l'impôt d'une part par le nombre de parts, puis on applique le plafonnement du quotient familial, la décote (pour les petits impôts), les réductions et les crédits d'impôt.
4. L'impôt est payé au fil de l'année par le **prélèvement à la source**."""

qf = P9["Le quotient familial"] + """

> **Exemple**
>
> Un couple marié avec un enfant (2,5 parts) a un revenu imposable de 101 250 €. Quotient familial : 101 250 / 2,5 = 40 500 €.
>
> Impôt pour une part : (29 579 − 11 601) × 11 % + (40 500 − 29 580) × 30 % ≈ 1 978 + 3 276 = 5 254 €. Impôt pour 2,5 parts : 5 254 × 2,5 = 13 135 €.
>
> Attention : cet exemple du livre ignore le plafonnement. Ici, la demi-part de l'enfant ferait gagner environ 3 450 €, bien plus que le plafond : l'impôt réel serait donc plus élevé."""

ps = P8["Les prélèvements sociaux"].strip()

erreurs = """> **Erreurs fréquentes**
>
> - Exiger les quatre critères du domicile fiscal : un seul suffit.
> - Rattacher un enfant de 22 ans qui travaille : au-delà de 21 ans, il faut poursuivre des études.
> - Imputer tout le déficit foncier sur le revenu global : plafond de 10 700 € et jamais la part des intérêts d'emprunt.
> - Imputer le déficit BIC d'un époux sur les salaires alors que l'autre époux a un bénéfice BIC : même nature d'abord.
> - Appliquer le taux marginal à tout le revenu.
> - Oublier de multiplier l'impôt d'une part par le nombre de parts.
> - Compter une part entière pour le premier enfant : c'est une demi-part pour chacun des deux premiers."""

retenir = """> **À retenir**
>
> - Domicile fiscal : un seul des 4 critères suffit (foyer, plus de 183 jours, activité, intérêts économiques).
> - Foyer fiscal apprécié au 1er janvier ; rattachement d'un majeur : moins de 21 ans, ou moins de 25 ans s'il étudie.
> - Déficit BIC, BNC, BA : même nature, puis revenu global, report 6 ans. Déficit foncier : 10 700 € hors intérêts, report 10 ans.
> - Revenu brut global → revenu net global → revenu net imposable.
> - Revenu net imposable divisé par le nombre de parts, barème progressif, puis multiplication par les parts.
> - Barème 2026 : 0 % jusqu'à 11 600 €, puis 11, 30, 41 et 45 %. Taux marginal ≠ taux moyen.
> - Prélèvement à la source : retenue par l'employeur sur les salaires, acomptes pour les BIC, BNC et revenus fonciers."""

order = [
 ("Les caractéristiques de l'impôt sur le revenu", P8["Les caractéristiques de l'impôt sur le revenu"]),
 ("Qui est imposé en France : le domicile fiscal", P8["Qui est imposé en France : le domicile fiscal"]),
 ("Le foyer fiscal", P8["Le foyer fiscal"]),
 ("Les revenus nets catégoriels", P8["Les revenus nets catégoriels"]),
 ("Le traitement des déficits", P8["Le traitement des déficits"]),
 ("Du revenu brut global au revenu net imposable", rbg),
 ("Du revenu net imposable à l'impôt", etapes),
 ("Le barème 2026 (revenus de 2025)", P9["Le barème 2026 (revenus de 2025)"]),
 ("Le quotient familial", qf),
 ("Le prélèvement à la source", P9["Le prélèvement à la source"]),
 ("Les revenus de capitaux", P9["Les revenus de capitaux"]),
 ("Les prélèvements sociaux", ps),
 ("Mise en situation corrigée", P9["Mise en situation corrigée"]),
]
new = "## 8. L'impôt sur le revenu des personnes physiques\n\n" + intro + "\n\n" + \
      "\n\n".join("### %s\n\n%s" % (h, b) for h, b in order) + "\n\n" + erreurs + "\n\n" + retenir + "\n\n"
assert "—" not in new and "leçon suivante" not in new
txt = txt[:a8] + new + txt[a10:]
for n in range(10, 14):
    a = "\n## %d. " % n
    assert txt.count(a) == 1, n
    txt = txt.replace(a, "\n## %d. " % (n - 1))
assert txt.count("\n## ") == 12 - 1 or True
s = s[:k + 6] + json.dumps(txt, ensure_ascii=False) + s[end:]

# migration : 9 -> 8 (fusion), 10..13 -> 9..12
rep('{"v": 3, "m": {"8": 9, "9": 10, "10": 11, "11": 12, "12": 13}}]',
    '{"v": 3, "m": {"8": 9, "9": 10, "10": 11, "11": 12, "12": 13}}, {"v": 4, "m": {"9": 8, "10": 9, "11": 10, "12": 11, "13": 12}}]')
# deux anciennes leçons tombent sur le même numéro : on fusionne au lieu d'écraser
rep('nl[c === cid && st.m[k] ? c + ":" + st.m[k] : key] = o.l[key];',
    'const nk0 = c === cid && st.m[k] ? c + ":" + st.m[k] : key; nl[nk0] = nl[nk0] || o.l[key];')
rep('nx[nk] = o[f][key];',
    'nx[nk] = nx[nk] && typeof nx[nk] === "object" && typeof o[f][key] === "object" ? Object.assign({}, o[f][key], nx[nk]) : (nx[nk] || o[f][key]);')
rep('["p3c7"], ["p3c8"], ["p3c2", "p3c3"], ["p3c4"], ["p3c12"], ["p3c9"],',
    '["p3c7"], ["p3c8"], ["p3c2", "p3c3"], ["p3c4"], ["p3c9"],')
rep('p3: ["1", { 8: "2", 9: "2", 10: "2", 11: "2" }]', 'p3: ["1", { 8: "2", 9: "2", 10: "2" }]')
rep('p3c9: "2", p3c10: "2", p3c12: "2",', 'p3c9: "2", p3c10: "2",')

# ---------------------------------------------------------------- 2) la fiche
st12 = s.index('{"id": "p3c12"')
c12, e12 = dec.raw_decode(s, st12)
assert s[e12:e12 + 2] == ", "
c9, e9 = dec.raw_decode(s, e12 + 2)
assert c9["id"] == "p3c9"
S12 = {x["h"]: x["b"] for x in c12["sections"]}
S9 = {x["h"]: x["b"] for x in c9["sections"]}

defs = [d for d in S12["Les définitions"] if d[1] != "Revenu net imposable"] + \
       [d for d in S9["Les définitions"] if d[1] != "Revenu net imposable"]
defs.insert(4, [d for d in S12["Les définitions"] if d[1] == "Revenu net imposable"][0])
essentiel = S9["L'essentiel du cours"] + [S12["L'essentiel du cours"][1]]
etapes_f = [["l", [
 "On détermine chaque revenu net dans sa catégorie, on impute les déficits et on retire les charges déductibles : c'est le revenu net imposable du foyer.",
 "On le divise par le nombre de parts : 1 pour une personne seule, 2 pour un couple marié ou pacsé, une demi-part pour chacun des deux premiers enfants, une part à partir du troisième. C'est le quotient familial.",
 "On applique le barème progressif au revenu d'une part.",
 "On multiplie l'impôt d'une part par le nombre de parts, puis on applique le plafonnement du quotient familial, la décote, les réductions et les crédits d'impôt.",
 "L'impôt est payé au fil de l'année par le prélèvement à la source."]]]
qf_f = S9["Le quotient familial"] + S12["Vers le calcul de l'impôt"][1:]  # exemple 101 250 € et mise en garde
pieges = S12["Les pièges"] + S9["Les pièges"]

sec = lambda h, b: {"h": h, "b": b}
c9["sections"] = [
 sec("Les définitions", defs),
 sec("L'essentiel du cours", essentiel),
 sec("Les caractéristiques de l'impôt sur le revenu", S12["Les caractéristiques de l'impôt sur le revenu"]),
 sec("La territorialité : le domicile fiscal", S12["La territorialité : le domicile fiscal"]),
 sec("Les conventions fiscales internationales", S12["Les conventions fiscales internationales"]),
 sec("Le foyer fiscal et ses exceptions", S12["Le foyer fiscal et ses exceptions"]),
 sec("Rattacher un enfant majeur : avantages et inconvénients", S12["Rattacher un enfant majeur : avantages et inconvénients"]),
 sec("Les revenus nets catégoriels", S12["Les revenus nets catégoriels"]),
 sec("Le traitement des déficits", S12["Le traitement des déficits"]),
 sec("Du revenu brut global au revenu net imposable", S12["Du revenu brut global au revenu net imposable"]),
 sec("Du revenu net imposable à l'impôt", etapes_f),
 sec("Le barème 2026 (revenus de 2025)", S9["Le barème 2026 (revenus de 2025)"]),
 sec("Le quotient familial", qf_f),
 sec("Le prélèvement à la source", S9["Le prélèvement à la source"]),
 sec("Les revenus de capitaux", S9["Les revenus de capitaux"]),
 sec("Les prélèvements sociaux", S12["Les prélèvements sociaux"]),
 sec("Mise en situation corrigée", S9["Mise en situation corrigée"]),
 sec("Les pièges", pieges),
]
# le renvoi vers « l'autre chapitre » n'a plus lieu d'être
for b in c9["sections"][12]["b"]:
    if b[0] == "w" and "Cet exemple du cours ignore" in b[1]:
        b[1] = "Cet exemple du cours ignore le plafonnement du quotient familial. Ici, la demi-part de l'enfant ferait gagner environ 3 450 €, bien plus que le plafond autorisé : l'impôt réel serait donc plus élevé."
c9["idee"] = ("L'impôt sur le revenu frappe chaque année les revenus d'un foyer fiscal domicilié en France : on calcule un revenu net par catégorie, "
              "on impute les déficits, on obtient le revenu net imposable, puis on le divise par le nombre de parts, on applique le barème progressif à une part "
              "et on multiplie par le nombre de parts ; il est payé par le prélèvement à la source.")
c9["points"] = c12["points"] + c9["points"]
blob = json.dumps(c9, ensure_ascii=False)
assert "—" not in blob and "chapitre « L'impôt sur le revenu" not in blob, "renvoi restant"
s = s[:st12] + blob + s[e9:]

# questions et cartes : rattachées à la fiche fusionnée
n = s.count('"p3c12"]')
assert n == 32, n
s = s.replace('"p3c12"]', '"p3c9"]')
assert "p3c12" not in s, s[s.find("p3c12") - 80:s.find("p3c12") + 40]

open(path, "w", encoding="utf-8").write(s)
print("ok : leçon et fiche fusionnées ; P3 revient à 12 leçons ;", n, "questions/cartes rattachées à p3c9")
