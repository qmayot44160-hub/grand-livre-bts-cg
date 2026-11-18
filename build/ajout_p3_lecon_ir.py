# -*- coding: utf-8 -*-
"""Insère dans le cours P3 (onglet Cours) la leçon 8 « Le périmètre de l'impôt sur le revenu »
(fiche ressources chapitre 22 fournie par Quentin). Les leçons 8 à 12 deviennent 9 à 13.
Les leçons lues, en cours, surlignages et notes suivent leur nouveau numéro (LES_MIG v3).
Usage : python3 build/ajout_p3_lecon_ir.py build/source.html"""
import json, re, sys

path = sys.argv[1]
s = open(path, encoding="utf-8").read()
if "## 8. Le périmètre de l'impôt sur le revenu" in s:
    sys.exit("leçon déjà présente")

def rep(a, b):
    global s
    assert s.count(a) == 1, (s.count(a), a[:90])
    s = s.replace(a, b)

LECON = """## 8. Le périmètre de l'impôt sur le revenu

Avant de calculer l'impôt d'un foyer (leçon suivante), il faut répondre à trois questions : **qui** est imposé en France, **quels revenus** on regroupe dans un même foyer, et **comment** on passe des revenus de chaque catégorie au revenu net imposable. En cabinet, c'est exactement l'ordre dans lequel tu prépares la déclaration du dirigeant.

L'article 1 A du CGI pose le principe : « il est établi un impôt annuel unique sur le revenu des personnes physiques désigné sous le nom d'impôt sur le revenu ».

### Les caractéristiques de l'impôt sur le revenu

| Caractère | Ce que ça veut dire |
| --- | --- |
| Annuel | L'impôt est calculé pour une **année civile**. |
| Direct / indirect | Il est perçu par voie de rôle (avis d'imposition) ou, pour certains revenus, prélevé par un tiers (**prélèvement à la source**). |
| Personnel | Il tient compte de la **situation familiale** du contribuable. |
| Global | Il porte sur les revenus de tous les membres du **foyer fiscal**. |
| Progressif | On applique un **barème progressif** qui tient compte de la situation familiale. |

### Qui est imposé en France : le domicile fiscal

Pour l'impôt sur le revenu, la France comprend la métropole, la Corse et les DOM. Une personne a son **domicile fiscal en France** dès qu'elle remplit **l'un** des quatre critères de l'article 4 B du CGI :

- **son foyer est en France** : c'est le lieu de résidence habituelle du contribuable ou de sa famille, sans tenir compte des séjours temporaires à l'étranger pour le travail. Un salarié qui travaille à l'étranger reste domicilié en France si sa famille y vit ;
- **son lieu de séjour principal est en France** : une personne qui séjourne **plus de 183 jours** en France dans l'année y est domiciliée ;
- **elle exerce son activité professionnelle en France**, salariée ou non ;
- **le centre de ses intérêts économiques est en France** : ses principaux investissements, le siège de ses affaires.

> **Attention**
>
> Les critères ne sont **pas cumulatifs** : un seul suffit.

Quand deux pays veulent imposer le même revenu, les **conventions fiscales internationales** évitent la double imposition. Elles priment sur la loi nationale et utilisent deux méthodes : l'**exonération** (l'un des deux pays renonce à imposer le revenu) ou l'**imputation** (l'impôt payé dans un pays est déduit de l'impôt dû dans l'autre).

### Le foyer fiscal

L'impôt est calculé par foyer. Le foyer fiscal comprend le contribuable seul (célibataire, veuf, divorcé ou séparé) ou les époux **mariés ou pacsés**, les **enfants mineurs** et les **personnes invalides** qui vivent sous son toit. La situation du foyer s'apprécie au **1er janvier** de l'année d'imposition.

Trois exceptions à connaître :

| Exception | Conditions |
| --- | --- |
| Imposition distincte **obligatoire** des époux | Séparés de biens et ne vivant pas sous le même toit ; en instance de divorce et autorisés à résider séparément ; ou abandon du domicile conjugal, chacun ayant des revenus propres. |
| Imposition distincte **facultative** des enfants mineurs | Option expresse du parent, et l'enfant célibataire a des revenus tirés de son propre travail. |
| **Rattachement** optionnel des enfants majeurs célibataires | Moins de **21 ans**, ou moins de **25 ans** s'ils poursuivent des études. |

> **Exemple**
>
> Les époux Thomas ont deux enfants : Élodie, 22 ans, coiffeuse, et Jules, 24 ans, étudiant à Sciences Po.
>
> Sans option, il y a trois foyers fiscaux : les époux, Élodie et Jules.
>
> Avec option, Élodie ne peut pas être rattachée (plus de 21 ans, pas d'études), mais Jules peut l'être (moins de 25 ans, étudiant). Il reste deux foyers : les époux avec Jules, et Élodie.

Rattacher un enfant majeur n'est pas toujours intéressant, une simulation est souvent nécessaire :

- **avantages** : plus de parts, donc un quotient familial plus faible ; réduction d'impôt pour frais de scolarité (61 € par collégien, 153 € par lycéen, 183 € par étudiant) ;
- **inconvénients** : les pensions alimentaires versées à l'enfant ne sont plus déductibles, ses revenus s'ajoutent à ceux des parents, et l'économie d'impôt des parts supplémentaires est plafonnée.

### Les revenus nets catégoriels

L'impôt est dû chaque année sur les revenus que le contribuable **réalise** ou dont il **dispose** au cours de l'année (article 12 du CGI). Le revenu de l'année N est déclaré en N+1 sur la déclaration n° 2042. En principe, on impose le revenu **encaissé** ; les revenus des activités non salariées (BIC, BNC, BA) sont souvent calculés en comptabilité d'engagement.

Les revenus sont classés en catégories : traitements et salaires ; revenus de capitaux mobiliers et gains en capital ; revenus fonciers ; revenus des activités professionnelles non salariées (BIC, BNC et BA). Pour chacune, on calcule un **revenu net** : revenu brut moins les dépenses engagées pour acquérir et conserver ce revenu (frais professionnels, charges d'entretien des immeubles…), retenues **au forfait ou au réel**.

> **Exemple**
>
> En N, un contribuable perçoit 40 000 € de salaire (frais professionnels : 10 %) et 18 000 € de loyers (travaux d'entretien 5 000 €, taxe foncière 1 000 €, intérêts d'emprunt 500 €).
>
> Traitements et salaires : 40 000 − 40 000 × 10 % = 36 000 €.
>
> Revenus fonciers : 18 000 − 5 000 − 1 000 − 500 = 11 500 €.
>
> Total des revenus nets catégoriels : 47 500 €.

### Le traitement des déficits

Quand les frais sont déduits au réel, une catégorie peut être en **déficit** (BIC, BNC, BA, revenus fonciers). En principe, un déficit ne s'impute que sur un bénéfice **de même nature** ; dans certaines limites, il peut passer sur les autres revenus.

| Déficit | Règle |
| --- | --- |
| BIC, BNC, BA | D'abord sur les bénéfices de même nature des autres membres du foyer, puis sur le revenu global. Ce qui n'est pas absorbé se reporte sur le revenu global des **6 années suivantes**. |
| Foncier | Sur le revenu global dans la limite de **10 700 €**, hors part due aux intérêts d'emprunt. Le reste et la part des intérêts se reportent sur les revenus fonciers des **10 années suivantes**. |

### Du revenu brut global au revenu net imposable

1. **Revenu brut global** : somme des revenus nets catégoriels, après imputation des déficits sur les bénéfices de même nature.
2. **Revenu net global** : revenu brut global − déficits imputables sur le revenu global (déficit foncier dans la limite de 10 700 €) − charges déductibles (pensions alimentaires, CSG déductible, cotisations à certains régimes obligatoires…).
3. **Revenu net imposable** : revenu net global − abattements spécifiques (personnes âgées, enfant marié rattaché…).

> **Exemple**
>
> Monsieur Durand, commerçant, a un bénéfice BIC de 60 000 €. Madame Durand, artisan, un déficit BIC de 25 000 €. Leur appartement loué rapporte 5 000 € de loyers pour 8 000 € de charges : déficit foncier de 3 000 €. Ils versent 4 300 € de pension alimentaire à leur fille.
>
> Le déficit de Madame s'impute d'abord sur le bénéfice de Monsieur. Revenu brut global : 60 000 − 25 000 = 35 000 €.
>
> Revenu net global : 35 000 − 3 000 = 32 000 €. Revenu net imposable : 32 000 − 4 300 = 27 700 €.

On peut alors calculer l'impôt avec le quotient familial et le barème : c'est l'objet de la leçon suivante. Dans le livre, un couple marié avec un enfant (2,5 parts) et 101 250 € de revenu imposable arrive à 13 135 € d'impôt ; attention, ce calcul simplifié ignore le plafonnement du quotient familial, qui augmenterait ici l'impôt.

### Les prélèvements sociaux

Ce sont des impôts qui financent la **protection sociale**, parfois appelés « contributions sociales ». Ils frappent la plupart des revenus : revenus du travail, BIC, BNC, BA, plus-values professionnelles, revenus et gains en capital, revenus fonciers. Ils sont au nombre de cinq : la **CSG**, la **CRDS**, le prélèvement social, la contribution additionnelle et le prélèvement de solidarité.

Ils sont prélevés **à la source** sur les salaires, BIC, BNC, BA, revenus du capital et plus-values immobilières, et réclamés par **avis d'imposition** sur les plus-values mobilières et les revenus fonciers.

> **Erreurs fréquentes**
>
> - Exiger les quatre critères du domicile fiscal : un seul suffit.
> - Rattacher un enfant de 22 ans qui travaille : au-delà de 21 ans, il faut poursuivre des études.
> - Imputer tout le déficit foncier sur le revenu global : plafond de 10 700 € et jamais la part des intérêts d'emprunt.
> - Imputer le déficit BIC d'un époux sur les salaires alors que l'autre époux a un bénéfice BIC : même nature d'abord.

> **À retenir**
>
> - Domicile fiscal : un seul des 4 critères suffit (foyer, plus de 183 jours, activité, intérêts économiques).
> - Foyer fiscal apprécié au 1er janvier ; rattachement d'un majeur : moins de 21 ans, ou moins de 25 ans s'il étudie.
> - Déficit BIC, BNC, BA : même nature, puis revenu global, report 6 ans. Déficit foncier : 10 700 € hors intérêts, report 10 ans.
> - Revenu brut global → revenu net global → revenu net imposable.

"""
assert "—" not in LECON

# 1) le texte du cours P3
i = s.find("const COURS = {")
k = s.find('"p3": "', i)
assert k > 0 and k < s.find("\n", i)
dec = json.JSONDecoder()
txt, end = dec.raw_decode(s, k + 6)
old = s[k + 6:end]
for n in range(12, 7, -1):
    a = "\n## %d. " % n
    assert txt.count(a) == 1, n
    txt = txt.replace(a, "\n## %d. " % (n + 1))
pos = txt.find("\n## 9. L'impôt sur le revenu des personnes physiques")
assert pos > 0
txt = txt[:pos + 1] + LECON + txt[pos + 1:]
s = s[:k + 6] + json.dumps(txt, ensure_ascii=False) + s[end:]

# 2) migration des numéros de leçon
rep('"p3": [{"v": 2, "m": {"3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9": 11, "10": 12}}]',
    '"p3": [{"v": 2, "m": {"3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9": 11, "10": 12}}, {"v": 3, "m": {"8": 9, "9": 10, "10": 11, "11": 12, "12": 13}}]')

# 3) la migration suit aussi les leçons en cours (lp), les surlignages (hl) et les notes (hn)
rep('o.l = nl; if (o.last && o.last.c === cid',
    'o.l = nl; ["lp", "hl", "hn"].forEach(f => { if (!o[f]) return; const pre = f === "lp" ? "" : "l:", nx = {}; Object.keys(o[f]).forEach(key => { let nk = key; if (key.startsWith(pre + cid + ":")) { const kk = key.slice((pre + cid + ":").length); if (st.m[kk]) nk = pre + cid + ":" + st.m[kk]; } nx[nk] = o[f][key]; }); o[f] = nx; }); if (o.last && o.last.c === cid')

# 4) leçon -> fiche, et année conseillée
rep('p3: [["p3c1"], ["p3c1"], ["p3c6"], ["p3c7"], ["p3c8"], ["p3c2", "p3c3"], ["p3c4"], ["p3c9"],',
    'p3: [["p3c1"], ["p3c1"], ["p3c6"], ["p3c7"], ["p3c8"], ["p3c2", "p3c3"], ["p3c4"], ["p3c12"], ["p3c9"],')
rep('p3: ["1", { 8: "2", 9: "2", 10: "2" }]', 'p3: ["1", { 8: "2", 9: "2", 10: "2", 11: "2" }]')
rep('p3c9: "2", p3c10: "2",', 'p3c9: "2", p3c10: "2", p3c12: "2",')

open(path, "w", encoding="utf-8").write(s)
print("ok : leçon 8 insérée, P3 passe à 13 leçons")
