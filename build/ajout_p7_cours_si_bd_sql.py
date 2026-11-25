# -*- coding: utf-8 -*-
"""P7 : intègre les trois cours fournis par Quentin (SI et flux, initiation aux bases de données, SQL).
- Leçon 1 : SI comptable et sous-systèmes.
- Leçon 2 : base de données, SGBD, client-serveur, clés, avantages des relations.
- Leçon 3 : opérations de base du SQL, opérateurs, fonctions statistiques, GROUP BY / HAVING, requêtes imbriquées.
- Leçon 7 devient « Les processus : diagramme des flux, DER et BPMN » ; la veille et l'archivage passent en
  leçon 8 ; les anciennes leçons 8 et 9 deviennent 9 et 10 (LES_MIG v2).
- Fiches p7c1, p7c2, p7c6 enrichies ; p7c7 devient la fiche processus ; nouvelle fiche p7c9 (veille, archivage).
- Questions, cartes et 8 exercices de l'atelier SQL.
Usage : python3 build/ajout_p7_cours_si_bd_sql.py build/source.html"""
import json, re, sys

path = sys.argv[1]
s = open(path, encoding="utf-8").read()
if '"id": "p7c9"' in s:
    sys.exit("déjà appliqué")

def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:100])
    s = s.replace(a, b)

dec = json.JSONDecoder()
js = lambda o: json.dumps(o, ensure_ascii=False)

# =====================================================================  LEÇONS
L1_ADD = """### Les sous-systèmes et le SI comptable

Le SI d'une organisation est souvent découpé en **sous-systèmes** centrés sur ses grandes finalités, c'est-à-dire ses services : le SI commercial, le SI de production, le SI du personnel, le SI comptable et financier. Chacun produit et consomme de l'information, et tous échangent entre eux.

Le **système d'information comptable** (SIC) a un double objectif : répondre aux nombreuses **obligations** de l'entreprise (comptabilité, déclarations fiscales et sociales, comptes annuels) et fournir les **instruments de gestion** nécessaires au pilotage et au management stratégique (tableaux de bord, coûts, prévisions). Il est de plus en plus automatisé grâce au PGI : un serveur, une base de données unique et des modules interconnectés permettent d'exploiter la même information dans tous les rouages de la gestion.

"""

L2_ADD_TOP = """### Base de données, fichier et SGBD

Une **base de données** est un outil qui permet de collecter et d'organiser des informations : sur des personnes, des produits, des commandes… Tant que les données tiennent dans un fichier de tableur, tout va bien. Mais quand le fichier grossit, que plusieurs personnes doivent le modifier en même temps, que les mêmes informations sont recopiées à plusieurs endroits (avec le risque qu'elles ne concordent plus), il est temps de passer à une base de données gérée par un **SGBD** relationnel, comme Access.

Un **SGBD** (système de gestion de base de données) est le logiciel qui stocke, manipule, organise et sécurise de grandes quantités d'informations. Ses quatre rôles :

| Rôle | Ce qu'il fait |
| --- | --- |
| Définition des données | Créer la structure : les tables, les champs et les liens entre eux |
| Manipulation des données | Ajouter, modifier, supprimer, rechercher (en général avec le langage SQL) |
| Sécurité et intégrité | Contrôler qui a le droit de voir quoi, empêcher que les données soient corrompues |
| Gestion des accès simultanés | Laisser plusieurs personnes ou applications travailler en même temps sans conflit |

Un **SGBDR** (R pour relationnel) est le type le plus utilisé en entreprise : les données sont rangées dans des **tables reliées entre elles**. Exemples : MySQL, PostgreSQL, Oracle, Microsoft SQL Server, Access.

### Comment ça marche : l'architecture client-serveur

Les données sont stockées dans des fichiers gérés par un **logiciel serveur**, installé sur un poste central. L'utilisateur passe par un **programme client** qui envoie ses demandes (ses requêtes) au serveur et reçoit les réponses. Quand tu consultes ton compte bancaire depuis ton ordinateur, ton navigateur (le client) interroge un serveur de la banque, qui interroge lui-même le serveur de base de données, puis le solde redescend jusqu'à ton écran.

Pour se connecter à une base, il existe trois familles de logiciels clients : une **interface en ligne de commande**, une **interface graphique** installée sur le poste (client lourd), ou un simple **navigateur internet** (client léger).

"""

L2_ADD_KEYS = """### Bien choisir une clé primaire

Une bonne clé primaire réunit trois qualités : elle **identifie chaque ligne de façon unique**, elle n'est **jamais vide** (jamais NULL), et ses valeurs **ne changent que rarement**, de préférence jamais.

| Mauvaise clé pour une table Contacts | Pourquoi |
| --- | --- |
| Le nom | Pas forcément unique, et il peut changer |
| Le numéro de téléphone | Susceptible de changer |
| L'adresse e-mail | Susceptible de changer |

Si aucun champ ne convient, on crée un champ **NuméroAuto** (dans Access) : la base génère toute seule un numéro à la première sauvegarde de chaque enregistrement.

Quand une table relie deux autres tables, sa clé primaire est souvent **concaténée** (composée de plusieurs champs). Dans COMPRENDRE (#NumCom, #RefProd, Quantite), c'est le couple commande + produit qui identifie chaque ligne, et chacun des deux est aussi une clé étrangère.

### Pourquoi plusieurs tables reliées ?

Prises isolément, les tables ressemblent à des feuilles Excel. Tout l'intérêt d'un SGBDR est de les **relier** par les clés. Au lieu de réécrire le nom et l'adresse du client sur chaque commande, la table des commandes contient seulement le numéro du client, et le SGBDR fait le lien. Trois avantages :

- **Cohérence** : chaque donnée n'est enregistrée qu'une seule fois, il y a moins de risque d'ambiguïté ou d'incohérence ;
- **Efficacité** : moins d'espace disque, des traitements plus rapides, pas de redondance ni de cases vides inutiles ;
- **Facilité de compréhension** : une structure où chaque sujet a sa table est plus simple à lire.

L'**intégrité référentielle** garantit que les liens restent logiques : une nouvelle facture est impossible si elle n'est pas liée à un client existant, et un client ne peut pas être supprimé s'il possède encore des factures.

"""

L3_ADD = """### Les opérations de base : projection, sélection, tri

Ces opérations, qu'on appelle opérations relationnelles, extraient des données de la base ; le résultat s'affiche toujours sous forme d'une table.

La **projection** ne garde que certaines colonnes : c'est le rôle de SELECT. SELECT * affiche toutes les colonnes ; SELECT DISTINCT supprime les doublons du résultat. Le point-virgule termine la requête.

La **sélection** (ou restriction) ne garde que certaines lignes : c'est le rôle de WHERE, avec ces opérateurs :

| Opérateur | Sens | Exemple |
| --- | --- | --- |
| =, <>, !=, <, <=, >, >= | Comparaison (<> et != veulent dire « différent ») | WHERE Delai > 20 |
| AND, OR, NOT | Combiner des conditions | WHERE Delai > 25 AND NumFrs > 73 |
| IN | Appartenir à une liste | WHERE Ville IN ('Paris', 'Lyon') |
| BETWEEN … AND … | Dans un intervalle, bornes comprises (nombres, dates, textes) | WHERE EnCde BETWEEN 100 AND 200 |
| NOT BETWEEN | En dehors de l'intervalle | WHERE PrixUnitHT NOT BETWEEN 40 AND 100 |
| LIKE | Ressembler à un modèle | WHERE ville LIKE 'N%' |
| IS NULL, IS NOT NULL | Valeur vide, ou renseignée | WHERE AdrFrs IS NULL |

Dans un modèle LIKE, le caractère **%** remplace n'importe quelle suite de caractères et **_** remplace exactement un caractère :

- LIKE 'a%' : commence par a ; LIKE '%a' : se termine par a ; LIKE '%a%' : contient un a ;
- LIKE 'pa%on' : commence par pa et finit par on (pantalon, pardon) ;
- LIKE 'a_c' : aac, abc, azc…

Dans Access, le joker s'écrit * au lieu de % : LIKE "STE*" donne les fournisseurs dont le nom commence par STE.

Les textes et les dates s'écrivent entre apostrophes (ou entre guillemets dans Access). Un code postal est un texte, pas un nombre : WHERE tie_cp = '75005'. Et une table sensible à la casse distingue 'Paris' de 'paris'.

Quand on mélange AND et OR, les **parenthèses** évitent les erreurs :

```sql
-- Les produits informatiques presque en rupture (stock < 20)
-- ou les fournitures dont le stock est inférieur à 200
SELECT * FROM produit
WHERE (categorie = 'informatique' AND stock < 20)
   OR (categorie = 'fourniture' AND stock < 200);
```

Le **tri** se fait avec ORDER BY, en ordre croissant par défaut (ASC) ou décroissant (DESC), sur une ou plusieurs colonnes : ORDER BY NomFrs ASC.

### Les fonctions statistiques

| Fonction | Ce qu'elle calcule |
| --- | --- |
| COUNT(*) | Le nombre de lignes |
| COUNT(colonne) | Le nombre de valeurs renseignées de la colonne (les NULL sont ignorés) |
| COUNT(DISTINCT colonne) | Le nombre de valeurs différentes |
| SUM(colonne) | La somme, en ignorant les valeurs nulles |
| AVG(colonne) | La moyenne, en ignorant les valeurs nulles |
| MIN(colonne), MAX(colonne) | La plus petite et la plus grande valeur |

Le mot **AS** donne un nom (un alias) à la colonne calculée : SELECT AVG(PrixAchat) AS [Moyenne des prix d'achat] FROM ACHAT. Les crochets permettent, dans Access, un nom avec des espaces. On peut aussi calculer : SELECT 2*AVG(PrixAchat).

```sql
-- Montant des mouvements débiteurs du compte 44566 en décembre 2020
SELECT SUM(enr_montant) AS [Total débit 44566]
FROM ENREGISTREMENTS
WHERE enr_com = '44566' AND enr_mois = 12 AND enr_annee = 2020;
```

### Regrouper : GROUP BY et HAVING

GROUP BY forme des groupes de lignes qui ont une valeur commune, et applique les fonctions statistiques à chaque groupe. La règle à retenir : **chaque colonne du SELECT qui n'est pas dans une fonction statistique doit figurer dans le GROUP BY**.

```sql
-- Moyenne des prix d'achat par fournisseur, pour les quantités commandées > 200
SELECT NumFrs, AVG(PrixAchat) AS [Moyenne des prix d'achat]
FROM ACHAT
WHERE EnCde > 200
GROUP BY NumFrs;
```

HAVING filtre ensuite les **groupes** :

```sql
-- Les articles qui font l'objet de plus de deux commandes
SELECT NumArt, COUNT(*) AS NbCommandes
FROM ACHAT
GROUP BY NumArt
HAVING COUNT(*) > 2;
```

> **Attention**
>
> Certains supports écrivent SELECT NumArt, NumFrs, AVG(PrixAchat) … GROUP BY NumFrs. Access et la plupart des SGBD refusent cette requête : NumArt n'est ni groupé ni dans une fonction. À l'examen, mets dans le GROUP BY toutes les colonnes non calculées du SELECT.

### Les requêtes imbriquées

Une requête peut en contenir une autre, entre parenthèses. La sous-requête est évaluée **d'abord**, et son résultat sert de valeur de comparaison :

```sql
-- La (ou les) facture(s) au montant le plus élevé
SELECT NumFacture, MontantHT
FROM FACTURE
WHERE MontantHT = (SELECT MAX(MontantHT) FROM FACTURE);
```

Dans Access, on peut aussi enregistrer une première requête (par exemple « Somme des débits par fournisseur ») et l'utiliser ensuite comme une table dans une autre requête.

"""

L7 = """## 7. Les processus : diagramme des flux, DER et BPMN

Une organisation est souvent découpée en **fonctions** selon la nature des activités : fonction commerciale, comptable, approvisionnement, ressources humaines… Un **processus**, lui, est **transversal** : c'est un ensemble d'activités successives, coordonnées et organisées, qui transforme des éléments d'entrée en éléments de sortie pour atteindre un résultat, en mobilisant plusieurs fonctions. Une vente, par exemple, fait intervenir le commercial, le magasin et la comptabilité.

### Les trois types de processus

| Type | Rôle | Déclenché par |
| --- | --- | --- |
| Processus **métier** | Concourt directement à la réalisation du bien ou du service : c'est le cœur de métier | Un besoin exprimé à l'extérieur de l'organisation ; le résultat est la réponse apportée |
| Processus **support** | Fournit les ressources et les outils nécessaires aux processus métier | Un besoin d'un processus métier |
| Processus de **pilotage** | Assure la cohérence, le contrôle et le pilotage de l'organisation, par la mesure et le suivi des autres processus | La direction, le suivi de la performance |

> **Exemple**
>
> Dans une entreprise industrielle, la gestion des factures (avec leur enregistrement comptable) est un processus **support**. Dans un cabinet d'expertise comptable qui tient la comptabilité de ses clients, la même activité est un processus **métier** : c'est la prestation vendue au client. Le type dépend donc de l'activité de l'organisation étudiée.

L'ensemble des processus d'une entreprise se représente dans une **cartographie des processus**. Pour en étudier un, on le découpe en activités, puis en sous-activités, jusqu'au niveau de détail voulu : le processus « Vendre » se décompose en « Traiter les commandes client », elle-même découpée en « Prendre la commande », « Transmettre la commande »… Le processus (ou la partie) que l'on choisit de modéliser s'appelle le **domaine d'étude**. **Modéliser**, c'est le représenter selon un formalisme, c'est-à-dire avec des règles de dessin communes.

Les acteurs émettent et reçoivent des **flux d'information** au cours de leurs activités ; ces flux font avancer le processus, déclenché par des événements et tourné vers des résultats. Deux représentations principales : le **diagramme des flux** et le **diagramme événement-résultat** (DER). Un logiciel gratuit comme JMOT permet de les dessiner.

### Le diagramme des flux

Il détaille qui échange quoi avec qui au cours d'un processus, et sert à repérer les problèmes. Il n'a pas de règles de dessin très strictes. Il comporte deux éléments : des **acteurs** (internes ou externes) et des **flux**. Un flux va toujours vers **un seul** acteur.

La méthode, en deux étapes :

1. **Construire le tableau d'analyse des tâches** : délimiter l'activité étudiée (l'enregistrement des factures et le suivi des règlements ne font pas forcément partie du même domaine), lister les acteurs internes et externes, repérer et numéroter les flux dans l'ordre chronologique, avec pour chacun l'émetteur, la désignation et le récepteur.
2. **Tracer le diagramme** : chaque acteur est un **cercle** ; un **cadre** regroupe les acteurs internes, les acteurs externes restent à l'extérieur ; chaque flux est une **flèche** numérotée, la désignation figurant sur la flèche ou dans le tableau.

> **Exemple : la gestion d'une commande**
>
> | Émetteur | Flux | Récepteur |
> | --- | --- | --- |
> | Client | 1. Commande d'un produit | Service commercial |
> | Service commercial | 2. Acceptation et déclenchement de la mise à disposition | Service expédition |
> | Service commercial | 3. Bon de commande et copie du déclenchement | Service comptable |
> | Service expédition | 4. Envoi de la commande avec le bon de livraison | Client |
> | Service expédition | 5. Copie du bon de livraison | Service comptable |
> | Service comptable | 6. Rapprochement BC et BL, puis envoi de la facture | Client |
>
> Le client est le seul acteur externe : son cercle est hors du cadre.

Le diagramme sert surtout à **repérer les dysfonctionnements** et à proposer une évolution du SI :

| Problème observé | Évolution préconisée |
| --- | --- |
| Un acteur reçoit beaucoup trop de flux : il est surchargé, d'où des retards | Répartir différemment la charge de travail entre les acteurs |
| Un acteur central est souvent en déplacement et bloque le processus en son absence | Déléguer des responsabilités, développer des outils de travail à distance |
| Le service livraison envoie le BL au client mais rien au comptable, qui doit rapprocher BC et BL avant de facturer : erreurs de facturation | Systématiser l'envoi d'une copie du BL au comptable |
| L'accueil transmet les commandes à l'expédition, qui doit demander l'avis du commercial (solvabilité) : lenteurs | Envoyer les commandes directement au commercial, qui ne transmet à l'expédition que les commandes validées |

### Le diagramme événement-résultat (DER)

Plus détaillé, le DER précise **les tâches réalisées par chaque acteur** et les règles qui déclenchent les activités et produisent les résultats. Son vocabulaire :

- **opération (activité)** : ensemble de tâches élémentaires qui ont une finalité commune, par exemple vérifier la solvabilité d'un client et la disponibilité des articles commandés ;
- **processus** : enchaînement d'opérations qui tend vers un résultat ;
- **domaine** : le point de vue des acteurs internes du processus, souvent le périmètre du service où il se déclenche ; le règlement de la facture relève d'un domaine connexe (le service comptable) ;
- **événement déclencheur** : circonstance d'origine externe qui déclenche le processus, par exemple la réception d'un bon de commande ;
- **événement externe** : flux d'information entrant, venu de l'extérieur du domaine (une hausse des prix d'achat oblige à mettre à jour les tarifs) ;
- **événement interne** : flux généré par le processus ; c'est une « sortie » s'il part vers l'extérieur du domaine (l'édition du bon de livraison et l'expédition).

**La démarche de modélisation**, en six étapes :

1. Repérer les **acteurs** et distinguer ceux qui font partie du processus de ceux qui lui sont externes.
2. Repérer les **flux d'information** entre ces acteurs et les ordonner logiquement.
3. Repérer les **activités**, avec la triple condition d'unicité : une activité a **un seul acteur**, se déroule sur **une seule période** et utilise **un seul type de traitement**.
4. Analyser les **règles de gestion** : ce qui déclenche les activités, ce qui détermine les résultats, la période et le type de traitement (manuel ou automatique).
5. **Représenter** le schéma.
6. **Relire** le schéma avec les règles de validation.

**La représentation.** On trace un tableau dont les colonnes centrales sont les **acteurs** (internes, externes, domaines connexes), placés dans leur ordre d'intervention ; la première colonne indique la **période** (quotidien, fin de mois…), la dernière le **type de traitement** (manuel, automatique). Les **événements** sont des ovales placés dans la colonne de l'acteur qui en est à l'origine ; une flèche les relie à l'activité. S'il y a plusieurs événements, une **règle de synchronisation** (connecteur ET, OU) les réunit au-dessus de l'activité. L'activité est un **rectangle en trois parties** : son numéro et son titre, la liste des tâches, puis les **règles d'émission** (par exemple « Accord » et « Refus »), qui disent quel résultat sort. Les **résultats** sont des ovales placés dans la colonne de l'acteur destinataire.

> **Exemple : une demande d'adhésion**
>
> L'entreprise envoie une demande d'adhésion (événement déclencheur). Le service adhésion examine la demande en vérifiant les données commerciales et institutionnelles : en cas de refus, une notification de refus part à l'entreprise ; en cas d'accord, le dossier validé part à la commission. La commission contrôle la demande et envoie à l'entreprise une notification d'accord ou de refus.

**Les règles de validation**, à vérifier à la relecture :

- toute activité est déclenchée par **au moins un événement** et produit **au moins un résultat** ;
- un acteur **externe ne réalise aucune activité** : seuls les acteurs internes en réalisent ;
- tout acteur représenté émet au moins un événement ou reçoit au moins un résultat.

Le DER est aussi un outil de **simulation** : quand un nouveau besoin apparaît, on corrige le schéma, on intègre les nouvelles étapes, on vérifie la faisabilité, on repère les points de blocage, et on recommence jusqu'à obtenir un processus performant à mettre en place.

| Diagramme des flux | DER |
| --- | --- |
| Centré sur les échanges d'informations entre acteurs | Précise les tâches de chaque acteur |
| Pas de règles de dessin strictes | Règles de synchronisation et d'émission, période, type de traitement |
| Idéal pour une première vue et pour repérer les ruptures | Idéal pour analyser et faire évoluer l'organisation en détail |

"""

L8_INTRO = """## 8. La veille et l'archivage

Deux outils d'organisation qui reviennent dans tous les oraux : se tenir à jour, et conserver correctement les documents.

"""

L7_RETENIR = """> **À retenir**
>
> - Processus : activités transversales qui transforment des entrées en sorties. Trois types : métier, support, pilotage.
> - Diagramme des flux : acteurs (cercles, cadre pour les internes) et flux numérotés ; il sert à repérer surcharges, ruptures et lenteurs.
> - DER : événements, synchronisation (ET, OU), activité en trois parties, règles d'émission, résultats ; un acteur externe ne réalise aucune activité.
> - BPMN : la notation normalisée des processus.

"""

L8_RETENIR = """> **À retenir**
>
> - Veille : besoins, sources fiables, outils, diffusion datée.
> - Pièces comptables : 10 ans ; documents fiscaux : 6 ans.
> - Dématérialisation : GED, signature électronique, facture électronique, archivage à valeur probante.

"""

for t in (L1_ADD, L2_ADD_TOP, L2_ADD_KEYS, L3_ADD, L7, L8_INTRO):
    assert "—" not in t

i = s.find("const COURS = {")
k = s.find('"p7": "', i)
txt, end = dec.raw_decode(s, k + 6)
def tins(before, add):
    global txt
    assert txt.count(before) == 1, before[:60]
    txt = txt.replace(before, add + before)
def trep(a, b):
    global txt
    assert txt.count(a) == 1, a[:60]
    txt = txt.replace(a, b)

# leçon 1
tins("### Le PGI\n", L1_ADD)
trep("> - SI = personnes + données + procédures + outils ; il collecte, mémorise, traite, diffuse.\n",
     "> - SI = personnes + données + procédures + outils ; il collecte, mémorise, traite, diffuse.\n> - SI comptable : répondre aux obligations et fournir les outils de pilotage.\n")
# leçon 2
trep("## 2. Le modèle relationnel\n", "## 2. Les bases de données et le modèle relationnel\n")
a2 = txt.index("## 2. Les bases de données et le modèle relationnel\n")
p2 = txt.index("\n\n", a2 + 60) + 2   # après le paragraphe d'introduction
txt = txt[:p2] + L2_ADD_TOP + "### Tables, clés et liens\n\n" + txt[p2:]
tins("### Du MCD au schéma relationnel\n", L2_ADD_KEYS)
trep("> - Association (x,n) – (x,n) : une nouvelle table avec une clé composée.\n",
     "> - Association (x,n) – (x,n) : une nouvelle table avec une clé composée.\n> - SGBD : définir, manipuler, sécuriser, gérer les accès simultanés. Architecture client-serveur.\n> - Bonne clé primaire : unique, jamais vide, stable ; sinon un NuméroAuto.\n")
# leçon 3 : après le premier exemple de requête
anchor3 = "ORDER BY nomClient;\n```\n\n"
a3 = txt.index("## 3. SQL : interroger et mettre à jour")
p3 = txt.index(anchor3, a3) + len(anchor3)
txt = txt[:p3] + L3_ADD + "### Joindre, regrouper, modifier : la synthèse\n\n" + txt[p3:]
trep("> - WHERE filtre les lignes, HAVING filtre les groupes.\n",
     "> - WHERE filtre les lignes, HAVING filtre les groupes.\n> - LIKE : % pour une suite de caractères, _ pour un seul (* dans Access).\n> - COUNT(*) compte les lignes ; SUM et AVG ignorent les valeurs nulles ; AS nomme une colonne.\n")
# leçon 7 -> processus ; veille et archivage -> leçon 8 ; 8, 9 -> 9, 10
a7 = txt.index("## 7. Les processus, la veille et l'archivage")
a8 = txt.index("\n## 8. ") + 1
old7 = txt[a7:a8]
def sect(title):
    j = old7.index("### " + title + "\n")
    n = old7.find("\n### ", j + 5)
    n2 = old7.find("\n> **À retenir**", j)
    e = min(x for x in (n, n2) if x > 0)
    return old7[j:e].strip() + "\n\n"
bpmn, veille, archiv = sect("Modéliser un processus en BPMN"), sect("Organiser sa veille"), sect("Conserver et dématérialiser")
txt = txt[:a7] + L7 + bpmn + L7_RETENIR + L8_INTRO + veille + archiv + L8_RETENIR + txt[a8:]
for n in (9, 8):
    pass
# renumérotation des deux dernières leçons (l'ancienne 8 est désormais la 3e occurrence de « ## 8. »)
parts = re.split(r"(?m)^(## \d+\. )", txt)
out, seen8 = [], 0
for piece in parts:
    if piece == "## 9. ":
        piece = "## 10. "
    elif piece == "## 8. ":
        seen8 += 1
        if seen8 == 2:
            piece = "## 9. "
    out.append(piece)
txt = "".join(out)
heads = re.findall(r"(?m)^## (\d+)\. (.*)$", txt)
assert [int(h[0]) for h in heads] == list(range(1, 11)), heads
s = s[:k + 6] + js(txt) + s[end:]

# migration et liens
rep('const LES_MIG = {', 'const LES_MIG = {"p7": [{"v": 2, "m": {"8": 9, "9": 10}}], ')
rep('p7: [["p7c1"], ["p7c6", "p7c2"], ["p7c2"], ["p7c3"], ["p7c4"], ["p7c4"], ["p7c7", "p7c5"], ["p7c2"], ["p7c8"]],',
    'p7: [["p7c1"], ["p7c6", "p7c2"], ["p7c2"], ["p7c3"], ["p7c4"], ["p7c4"], ["p7c7"], ["p7c9", "p7c5"], ["p7c2"], ["p7c8"]],')
rep('p7: ["1", { 5: "2", 6: "2", 7: "2", 9: "2" }]', 'p7: ["1", { 5: "2", 6: "2", 8: "2", 10: "2" }]')

# =====================================================================  FICHES
def get(cid):
    m = re.search(r'\{"id": ?"%s"' % cid, s)
    d, e = dec.raw_decode(s, m.start())
    return d, m.start(), e

def put(cid, d):
    global s
    _, st, e = get(cid)
    s = s[:st] + js(d) + s[e:]

# p7c1
d, _, _ = get("p7c1")
sec = next(x for x in d["sections"] if x["h"] == "Le système d'information")
sec["b"] += [["d", "Sous-systèmes du SI", "Découpage du SI selon les services : commercial, production, personnel, comptable et financier."],
             ["d", "Système d'information comptable (SIC)", "Partie du SI qui répond aux obligations (comptables, fiscales, sociales) et fournit les instruments de gestion nécessaires au pilotage."]]
put("p7c1", d)

# p7c6
d, _, _ = get("p7c6")
d["title"] = "Les bases de données et le modèle relationnel"
d["sections"][0]["b"] += [
 ["d", "Base de données", "Outil qui collecte et organise des informations (personnes, produits, commandes…)."],
 ["d", "SGBD", "Logiciel qui stocke, manipule, organise et sécurise les données d'une base. SGBDR : données en tables reliées (MySQL, PostgreSQL, Oracle, SQL Server, Access)."],
 ["d", "Architecture client-serveur", "Un serveur central gère les données ; les postes clients lui envoient des requêtes et reçoivent les réponses."]]
d["sections"][1:1] = [
 {"h": "Base de données et SGBD", "b": [
  ["p", "Quand un fichier de tableur grossit, que plusieurs personnes doivent le modifier en même temps ou que les mêmes informations sont recopiées à plusieurs endroits, on passe à une base de données gérée par un SGBD relationnel."],
  ["t", ["Rôle du SGBD", "Ce qu'il fait"], [
   ["Définition des données", "Créer les tables, les champs et les liens"],
   ["Manipulation des données", "Ajouter, modifier, supprimer, rechercher (SQL)"],
   ["Sécurité et intégrité", "Contrôler les accès, empêcher la corruption des données"],
   ["Gestion des accès simultanés", "Plusieurs utilisateurs en même temps, sans conflit"]]],
  ["p", "Les données sont gérées par un logiciel serveur ; l'utilisateur passe par un programme client : en ligne de commande, avec une interface graphique installée (client lourd) ou par un navigateur internet (client léger)."]]},
]
d["sections"].append({"h": "Bien choisir une clé primaire", "b": [
  ["p", "Une bonne clé primaire identifie chaque ligne de façon unique, n'est jamais vide et ne change pas (ou rarement). Le nom, le téléphone ou l'e-mail sont de mauvaises clés : pas forcément uniques, ou susceptibles de changer. À défaut, on crée un champ NuméroAuto."],
  ["p", "Une table de liaison a souvent une clé primaire concaténée : COMPRENDRE (#NumCom, #RefProd, Quantite)."]]})
d["sections"].append({"h": "Pourquoi plusieurs tables reliées ?", "b": [
  ["l", ["Cohérence : chaque donnée n'est enregistrée qu'une fois.", "Efficacité : moins d'espace, des traitements plus rapides, pas de redondance.", "Facilité de compréhension : un sujet par table."]],
  ["p", "Intégrité référentielle : pas de facture pour un client inexistant, et pas de suppression d'un client qui a encore des factures."]]})
d["sections"].append({"h": "Les pièges", "b": [
  ["trap", "Prendre le nom ou l'adresse e-mail comme clé primaire : pas unique ou susceptible de changer."],
  ["trap", "Recopier le nom du client dans chaque commande au lieu de mettre sa clé étrangère : redondance et risque d'incohérence."]]})
d["points"] += ["SGBD : définir, manipuler, sécuriser, gérer les accès simultanés.", "Bonne clé primaire : unique, jamais vide, stable ; sinon NuméroAuto."]
put("p7c6", d)

# p7c2 (SQL)
d, _, _ = get("p7c2")
d["sections"].insert(3, {"h": "Les opérations de base et les fonctions", "b": [
  ["t", ["Opération", "Instruction"], [
   ["Projection (choisir les colonnes)", "SELECT col1, col2 ; SELECT * ; SELECT DISTINCT"],
   ["Sélection ou restriction (choisir les lignes)", "WHERE avec =, <>, <, >, AND, OR, NOT, IN, BETWEEN, LIKE, IS NULL"],
   ["Tri", "ORDER BY col ASC (par défaut) ou DESC"],
   ["Regroupement", "GROUP BY, puis HAVING pour filtrer les groupes"]]],
  ["t", ["Modèle LIKE", "Sens"], [
   ["'a%'", "Commence par a"], ["'%a'", "Se termine par a"], ["'%a%'", "Contient a"], ["'a_c'", "a, un seul caractère, puis c"], ["\"STE*\" (Access)", "Commence par STE ; * est le joker d'Access"]]],
  ["t", ["Fonction", "Calcule"], [
   ["COUNT(*)", "Le nombre de lignes"], ["COUNT(DISTINCT col)", "Le nombre de valeurs différentes"], ["SUM, AVG", "Somme, moyenne (valeurs nulles ignorées)"], ["MIN, MAX", "Plus petite, plus grande valeur"]]],
  ["p", "AS nomme la colonne calculée : SELECT AVG(PrixAchat) AS [Moyenne des prix d'achat]. Une requête imbriquée, entre parenthèses, est évaluée d'abord : WHERE MontantHT = (SELECT MAX(MontantHT) FROM FACTURE)."],
  ["w", "Chaque colonne du SELECT qui n'est pas dans une fonction statistique doit figurer dans le GROUP BY."]]})
d["points"] += ["LIKE : % pour une suite de caractères, _ pour un seul.", "COUNT(*), COUNT(DISTINCT), SUM, AVG, MIN, MAX ; AS pour nommer."]
put("p7c2", d)

# p7c7 -> processus ; p7c9 -> veille et archivage
old, _, _ = get("p7c7")
S = {x["h"]: x["b"] for x in old["sections"]}
defs_old = old["sections"][0]["b"]
c9 = {"id": "p7c9", "cat": "p7", "src": "p7", "th": "p7:1", "n": 9,
      "title": "La veille et l'archivage",
      "idee": "La veille repose sur des besoins, des sources fiables, des outils et une diffusion datée ; les pièces comptables se conservent 10 ans, les documents fiscaux 6 ans, et la dématérialisation doit garder une valeur probante.",
      "sections": [
       {"h": "Les définitions", "b": [x for x in defs_old if x[1] != "Schéma de processus"]},
       {"h": "Organiser sa veille", "b": S["Organiser sa veille"]},
       {"h": "Conserver et dématérialiser", "b": S["Conserver et dématérialiser"]}],
      "points": old["points"][1:] + ["Dématérialisation : GED, signature électronique, facture électronique, archivage à valeur probante."]}

c7 = {"id": "p7c7", "cat": "p7", "src": "p7", "th": "p7:1", "n": 7,
 "title": "Les processus : diagramme des flux, DER et BPMN",
 "idee": "Un processus est un ensemble transversal d'activités qui transforme des entrées en sorties ; on le représente par un diagramme des flux (qui échange quoi avec qui) ou par un diagramme événement-résultat (qui fait quoi, déclenché par quoi, pour quel résultat), pour repérer les dysfonctionnements et faire évoluer le SI.",
 "sections": [
  {"h": "Les définitions", "b": [
   ["d", "Processus", "Ensemble d'activités successives, coordonnées et organisées, qui transforme des éléments d'entrée en éléments de sortie ; il est transversal et mobilise plusieurs fonctions."],
   ["d", "Cartographie des processus", "Représentation de l'ensemble des processus d'une organisation."],
   ["d", "Domaine d'étude", "Le processus, ou la partie de processus, que l'on choisit de modéliser."],
   ["d", "Diagramme des flux", "Représentation des acteurs (cercles) et des flux d'information numérotés qu'ils échangent."],
   ["d", "Diagramme événement-résultat (DER)", "Représentation détaillée des activités de chaque acteur, des événements qui les déclenchent et des résultats qu'elles produisent."],
   ["d", "Règle de synchronisation", "Connecteur (ET, OU) qui indique quels événements doivent survenir pour déclencher une activité."],
   ["d", "Règle d'émission", "Condition qui détermine quel résultat sort d'une activité (accord, refus…)."]]},
  {"h": "L'essentiel du cours", "b": [
   ["p", "Une organisation est découpée en fonctions (commerciale, comptable, approvisionnement, RH…), mais un processus les traverse : une vente mobilise le commercial, le magasin et la comptabilité. On modélise un processus pour comprendre comment le travail circule, repérer les dysfonctionnements et proposer une évolution du SI. Schéma de processus : événement déclencheur, activités, acteurs internes et externes, flux d'information, résultats."]]},
  {"h": "Les trois types de processus", "b": [
   ["t", ["Type", "Rôle", "Déclenché par"], [
    ["Métier", "Réalise le bien ou le service : le cœur de métier", "Un besoin extérieur à l'organisation"],
    ["Support", "Fournit ressources et outils aux processus métier", "Un besoin d'un processus métier"],
    ["Pilotage", "Cohérence, contrôle, mesure et suivi des autres processus", "La direction, le suivi de la performance"]]],
   ["ex", "le même processus, deux types", ["La gestion des factures est un processus support dans une entreprise industrielle.", "C'est un processus métier dans un cabinet d'expertise comptable qui tient la comptabilité de ses clients."]]]},
  {"h": "Le diagramme des flux", "b": [
   ["l", ["Délimiter le domaine étudié.", "Lister les acteurs internes et externes.", "Repérer et numéroter les flux dans l'ordre chronologique : émetteur, flux, récepteur (tableau d'analyse des tâches).", "Tracer : un cercle par acteur, un cadre autour des acteurs internes, une flèche numérotée par flux."]],
   ["w", "Un flux va toujours vers un seul acteur. Les acteurs externes restent hors du cadre."],
   ["t", ["Problème repéré", "Évolution du SI"], [
    ["Un acteur reçoit trop de flux", "Répartir la charge de travail"],
    ["Un acteur central souvent absent bloque le processus", "Déléguer, outils de travail à distance"],
    ["Le comptable ne reçoit pas le BL alors qu'il doit le rapprocher du BC", "Systématiser l'envoi d'une copie du BL"],
    ["L'expédition doit attendre l'avis du commercial sur la solvabilité", "Envoyer la commande directement au commercial, qui transmet les commandes validées"]]]]},
  {"h": "Le diagramme événement-résultat (DER)", "b": [
   ["l", ["Événement déclencheur : circonstance externe qui déclenche le processus (réception d'une commande).", "Événement externe : flux entrant venu de l'extérieur du domaine ; événement interne : flux généré par le processus.", "Activité (opération) : tâches à finalité commune ; une activité a un seul acteur, une seule période, un seul type de traitement."]],
   ["t", ["Élément", "Où et comment"], [
    ["Acteurs", "Colonnes centrales, dans l'ordre d'intervention"],
    ["Période", "Première colonne (quotidien, fin de mois…)"],
    ["Type de traitement", "Dernière colonne (manuel, automatique)"],
    ["Événement", "Ovale dans la colonne de l'acteur qui en est à l'origine"],
    ["Synchronisation", "Connecteur ET, OU au-dessus de l'activité"],
    ["Activité", "Rectangle : titre, tâches, règles d'émission"],
    ["Résultat", "Ovale dans la colonne de l'acteur destinataire"]]],
   ["p", "Démarche : repérer les acteurs, les flux, les activités, analyser les règles de gestion, dessiner, puis relire avec les règles de validation."],
   ["l", ["Toute activité est déclenchée par au moins un événement et produit au moins un résultat.", "Un acteur externe ne réalise aucune activité.", "Tout acteur représenté émet au moins un événement ou reçoit au moins un résultat."]],
   ["p", "Le DER sert aussi à simuler une nouvelle organisation avant de la mettre en place."]]},
  {"h": "Diagramme des flux ou DER ?", "b": [
   ["t", ["Diagramme des flux", "DER"], [
    ["Échanges d'informations entre acteurs", "Tâches de chaque acteur"],
    ["Pas de règles strictes", "Synchronisation, émission, période, type de traitement"]]]]},
  {"h": "Modéliser en BPMN", "b": [
   ["t", ["Symbole", "Forme", "Sens"], [
    ["Événement", "Cercle (fin au début, épais à la fin)", "Déclenche ou termine le processus"],
    ["Activité", "Rectangle aux coins arrondis", "Une tâche"],
    ["Passerelle", "Losange (× choix exclusif, + parallèle)", "Une décision ou un partage du travail"],
    ["Flux de séquence", "Flèche pleine", "L'ordre des tâches"],
    ["Flux de message", "Flèche en pointillés", "Un échange entre deux organisations"],
    ["Piscine et couloirs", "Grand cadre en bandes", "L'organisation et ses acteurs"]]]]},
  {"h": "Les pièges", "b": [
   ["trap", "Faire réaliser une activité par un acteur externe (le client) dans un DER : seuls les acteurs internes réalisent des activités."],
   ["trap", "Placer un résultat dans la colonne de l'acteur qui le produit : il va dans la colonne du destinataire."],
   ["trap", "Classer un processus sans regarder l'activité de l'organisation : la gestion des factures est support dans une industrie, métier dans un cabinet comptable."],
   ["trap", "Dessiner une flèche vers deux acteurs à la fois : un flux a un seul destinataire."]]}],
 "points": ["Processus : transversal ; trois types : métier, support, pilotage.",
            "Diagramme des flux : acteurs en cercles, cadre pour les internes, flux numérotés vers un seul acteur.",
            "DER : événement, synchronisation, activité (titre, tâches, émission), résultat ; un acteur externe ne fait aucune activité.",
            "Les deux diagrammes servent à repérer les dysfonctionnements et à faire évoluer le SI."]}
for o in (c7, c9):
    assert "—" not in js(o)
_, st7, e7 = get("p7c7")
s = s[:st7] + js(c7) + ", " + js(c9) + s[e7:]
rep('p7c7: "2"', 'p7c7: "1", p7c9: "2"')

# anciennes questions et cartes « veille, archivage, IA » : vers la nouvelle fiche
for q in ["Les livres et pièces comptables se conservent…", "Les documents fiscaux se conservent…",
          "Laquelle de ces sources est fiable pour la veille fiscale ?", "Utiliser l'IA au cabinet suppose notamment de…",
          "Veille informationnelle"]:
    pat = re.compile(r'\["p7", ' + re.escape(js(q)) + r'(?:[^\[\]]|\[[^\[\]]*\])*?"p7c7"\]')
    ms = list(pat.finditer(s))
    assert len(ms) == 1, (q, len(ms))
    m = ms[0]
    s = s[:m.end() - 7] + '"p7c9"]' + s[m.end():]

# =====================================================================  QUIZ ET CARTES
Q = {
 "p7c7": [
  ["Contrairement à une fonction de l'entreprise, un processus…", ["Traverse plusieurs fonctions de l'organisation", "Ne concerne qu'un seul service", "Ne comporte qu'une seule tâche", "Est toujours informatisé"], "Un processus est transversal : une vente mobilise le commercial, le magasin et la comptabilité."],
  ["Un processus déclenché par un besoin exprimé à l'extérieur de l'organisation, et qui réalise son cœur de métier, est un processus…", ["Métier", "Support", "De pilotage", "Connexe"], "Processus métier : il concourt directement au bien ou au service produit ; son résultat est la réponse apportée à l'extérieur."],
  ["Un processus support est déclenché par…", ["Un besoin d'un processus métier", "Un besoin d'un client", "Une décision de l'État", "Un fournisseur"], "Le processus support fournit ressources et outils aux processus métier."],
  ["Le processus qui assure la cohérence, le contrôle et le suivi des autres processus est le processus…", ["De pilotage", "Métier", "Support", "D'émission"], "Le pilotage mesure et suit les processus de l'organisation."],
  ["Dans un cabinet d'expertise comptable qui tient la comptabilité de ses clients, la gestion de leurs factures est un processus…", ["Métier", "Support", "De pilotage", "Externe"], "C'est la prestation vendue au client. Dans une entreprise industrielle, la même activité serait un processus support."],
  ["La représentation de l'ensemble des processus d'une organisation s'appelle…", ["Une cartographie des processus", "Un diagramme des flux", "Un DER", "Un schéma relationnel"], "Cartographie : la vue d'ensemble. Le processus étudié en détail est le domaine d'étude."],
  ["Le processus, ou la partie de processus, que l'on choisit de modéliser s'appelle…", ["Le domaine d'étude", "La cartographie", "L'événement déclencheur", "Le flux"], "On délimite d'abord le domaine d'étude avant de modéliser."],
  ["Dans un diagramme des flux, les acteurs internes sont représentés par…", ["Des cercles regroupés dans un cadre", "Des rectangles hors du cadre", "Des losanges", "Des flèches en pointillés"], "Acteurs en cercles ; un cadre regroupe les internes, les externes restent à l'extérieur."],
  ["Dans un diagramme des flux, un flux est toujours dirigé vers…", ["Un seul acteur", "Tous les acteurs internes", "Deux acteurs au minimum", "Le client"], "Chaque flèche a un émetteur et un seul récepteur."],
  ["Sur un diagramme des flux, un acteur reçoit beaucoup plus de flux que les autres et le processus prend du retard. Que préconiser ?", ["Répartir différemment la charge de travail", "Supprimer cet acteur", "Ajouter un acteur externe", "Passer à un DER"], "Un acteur surchargé ralentit le processus : on répartit la charge."],
  ["Les clients se plaignent d'erreurs de facturation : le service livraison envoie le BL au client mais rien au comptable. Que préconiser ?", ["Systématiser l'envoi d'une copie du BL au comptable", "Supprimer le bon de livraison", "Faire facturer par le client", "Envoyer le BC à l'expédition"], "Le comptable doit rapprocher BC et BL avant de facturer."],
  ["Dans un DER, un événement est placé dans la colonne…", ["De l'acteur qui en est à l'origine", "De l'acteur qui le reçoit", "Du type de traitement", "De la période"], "Les événements vont chez leur émetteur, les résultats chez leur destinataire."],
  ["Dans un DER, un résultat est placé dans la colonne…", ["De l'acteur qui en est le destinataire", "De l'acteur qui réalise l'activité", "De la période", "Du type de traitement"], "Résultat : colonne du destinataire."],
  ["Selon les règles de validation du DER, un acteur externe…", ["Ne réalise aucune activité", "Réalise au moins une activité", "N'émet jamais d'événement", "Ne reçoit jamais de résultat"], "Seuls les acteurs internes réalisent des activités."],
  ["Toute activité d'un DER doit…", ["Être déclenchée par au moins un événement et produire au moins un résultat", "Être réalisée par un acteur externe", "Avoir deux règles d'émission", "Durer une journée"], "C'est la première règle de validation."],
  ["Pour identifier une activité dans un DER, on applique la triple condition d'unicité…", ["D'acteur, de période et de type de traitement", "De lieu, de date et de montant", "D'événement, de résultat et de flux", "De service, de logiciel et de document"], "Une activité : un seul acteur, une seule période, un seul type de traitement."],
  ["Le connecteur « ET » placé au-dessus d'une activité représente…", ["Une règle de synchronisation", "Une règle d'émission", "Un résultat", "Un acteur"], "Il indique que plusieurs événements doivent survenir pour déclencher l'activité."],
  ["Les mentions « Accord » et « Refus » en bas du rectangle d'une activité sont…", ["Des règles d'émission", "Des règles de synchronisation", "Des événements déclencheurs", "Des acteurs"], "Elles déterminent quel résultat sort de l'activité."],
  ["Par rapport au diagramme des flux, le DER…", ["Précise les tâches de chaque acteur et les règles de synchronisation et d'émission", "Ne montre que les échanges entre acteurs", "N'a aucune règle de dessin", "Ne concerne que les acteurs externes"], "Le diagramme des flux est centré sur les échanges ; le DER est plus détaillé."],
  ["Dans un DER, l'édition du bon de livraison et l'expédition de la marchandise au client constituent…", ["Un événement interne (une sortie)", "Un événement déclencheur", "Un événement externe", "Une règle de synchronisation"], "Événement interne : généré par le processus ; c'est une sortie quand il part vers l'extérieur du domaine."],
 ],
 "p7c6": [
  ["Permettre à plusieurs utilisateurs de travailler en même temps sur la base sans conflit relève de…", ["La gestion des accès simultanés du SGBD", "La définition des données", "La clé primaire", "Le tableur"], "Les quatre rôles du SGBD : définition, manipulation, sécurité et intégrité, accès simultanés."],
  ["Créer les tables, les champs et les liens entre eux, c'est le rôle du SGBD appelé…", ["Définition des données", "Manipulation des données", "Gestion des accès simultanés", "Sécurité"], "La manipulation, elle, consiste à ajouter, modifier, supprimer et rechercher."],
  ["La particularité d'un SGBDR est d'organiser les données…", ["En tables reliées entre elles par des relations", "Dans un seul fichier texte", "En feuilles de calcul indépendantes", "En dossiers et sous-dossiers"], "R pour relationnel : des tables reliées par les clés."],
  ["Dans une architecture client-serveur, …", ["Un serveur central gère les données et répond aux requêtes des postes clients", "Chaque poste garde sa propre copie de la base", "Le client stocke les données du serveur", "Il n'y a pas de réseau"], "Le programme client envoie ses requêtes au logiciel serveur qui gère la base."],
  ["Un navigateur internet utilisé pour accéder à une base de données est un…", ["Client léger", "Client lourd", "Serveur", "SGBD"], "Client lourd : interface graphique installée sur le poste ; client léger : navigateur."],
  ["Laquelle de ces qualités n'est PAS exigée d'une bonne clé primaire ?", ["Être lisible par le client", "Identifier chaque ligne de façon unique", "Ne jamais être vide", "Ne changer que rarement"], "Unique, jamais vide, stable : ce sont les trois qualités."],
  ["Pour une table Contacts, quel champ ferait la meilleure clé primaire ?", ["Un numéro automatique (NuméroAuto)", "L'adresse e-mail", "Le nom", "Le numéro de téléphone"], "Le nom n'est pas unique ; e-mail et téléphone peuvent changer."],
  ["Un client possède des factures. Avec l'intégrité référentielle, sa suppression de la table CLIENT est…", ["Refusée", "Acceptée, et les factures restent", "Acceptée, et les factures deviennent anonymes", "Acceptée sans condition"], "On ne peut pas supprimer un client qui a encore des factures."],
  ["Dans COMPRENDRE (#NumCom, #RefProd, Quantite), la clé primaire est…", ["Concaténée : NumCom et RefProd", "Quantite", "NumCom seul", "RefProd seul"], "C'est le couple commande + produit qui identifie la ligne ; chacun est aussi clé étrangère."],
  ["Mettre le numéro du client dans la table COMMANDES plutôt que son nom et son adresse apporte surtout…", ["De la cohérence : chaque donnée n'est enregistrée qu'une fois", "Plus de saisie", "Un fichier plus gros", "Moins de sécurité"], "Cohérence, efficacité et facilité de compréhension."],
 ],
 "p7c2": [
  ["L'opération qui ne retient que certaines colonnes d'une table s'appelle…", ["La projection (SELECT)", "La sélection (WHERE)", "La jointure", "Le tri"], "Projection = colonnes (SELECT) ; sélection ou restriction = lignes (WHERE)."],
  ["La sélection (ou restriction) consiste à…", ["N'afficher que certaines lignes, avec WHERE", "N'afficher que certaines colonnes", "Trier le résultat", "Relier deux tables"], "WHERE garde les lignes qui respectent la condition."],
  ["SELECT DISTINCT NumFrs, NomFrs FROM FOURNISSEUR affiche…", ["Les fournisseurs sans les doublons", "Uniquement le premier fournisseur", "Le nombre de fournisseurs", "Les fournisseurs triés"], "DISTINCT supprime les doublons du résultat."],
  ["Le modèle LIKE 'a_c' renvoie…", ["aac, abc, azc… : un seul caractère entre a et c", "Tout ce qui commence par a", "Tout ce qui contient ac", "Tout ce qui finit par c"], "_ remplace exactement un caractère ; % remplace une suite de caractères."],
  ["Pour obtenir les clients dont la ville se termine par « e », on écrit…", ["WHERE ville LIKE '%e'", "WHERE ville LIKE 'e%'", "WHERE ville = 'e'", "WHERE ville LIKE '_e_'"], "'%e' : n'importe quoi puis e à la fin."],
  ["Dans Access, la requête WHERE NomFrs LIKE \"STE*\" renvoie les fournisseurs dont le nom…", ["Commence par STE", "Se termine par STE", "Contient exactement STE*", "Ne contient pas STE"], "Dans Access, * joue le rôle du % du SQL standard."],
  ["WHERE PrixUnitHT NOT BETWEEN 40 AND 100 garde les articles dont le prix est…", ["Inférieur à 40 ou supérieur à 100", "Compris entre 40 et 100", "Égal à 40 ou à 100", "Supérieur à 40"], "NOT BETWEEN : en dehors de l'intervalle, bornes exclues du résultat."],
  ["Pour lister les fournisseurs dont l'adresse est renseignée, on écrit…", ["WHERE AdrFrs IS NOT NULL", "WHERE AdrFrs <> NULL", "WHERE AdrFrs = NULL", "WHERE AdrFrs NOT ''"], "On teste une valeur vide avec IS NULL ou IS NOT NULL, jamais avec = ou <>."],
  ["COUNT(DISTINCT Ville) renvoie…", ["Le nombre de villes différentes", "Le nombre de lignes de la table", "La liste des villes", "La ville la plus fréquente"], "COUNT(*) compte les lignes ; COUNT(DISTINCT col) compte les valeurs différentes."],
  ["La fonction AVG(PrixAchat)…", ["Calcule la moyenne en ignorant les valeurs nulles", "Compte les valeurs nulles comme des zéros", "Renvoie le prix le plus élevé", "Additionne les prix"], "SUM et AVG ignorent les valeurs nulles."],
  ["Dans SELECT AVG(PrixAchat) AS [Moyenne des prix d'achat], le mot AS sert à…", ["Donner un nom à la colonne calculée", "Filtrer les lignes", "Trier le résultat", "Joindre une table"], "AS crée un alias ; les crochets permettent des espaces dans Access."],
  ["Sans précision, ORDER BY trie…", ["En ordre croissant (ASC)", "En ordre décroissant (DESC)", "Au hasard", "Par clé primaire"], "ASC est l'ordre par défaut ; DESC inverse."],
  ["Table produit : ordinateur (informatique, stock 5), clavier (informatique, 32), souris (informatique, 16), crayon (fourniture, 147). WHERE categorie = 'informatique' AND stock < 20 renvoie…", ["Ordinateur et souris", "Ordinateur, clavier et souris", "Crayon", "Ordinateur seulement"], "Les deux conditions doivent être vraies : informatique ET stock inférieur à 20."],
  ["Dans une requête avec GROUP BY, chaque colonne du SELECT qui n'est pas dans une fonction statistique…", ["Doit figurer dans le GROUP BY", "Doit figurer dans le HAVING", "Est interdite", "Doit être triée"], "Sinon le SGBD ne sait pas quelle valeur afficher pour le groupe."],
  ["SELECT NumArt FROM ACHAT GROUP BY NumArt HAVING COUNT(*) > 2 affiche…", ["Les articles qui font l'objet de plus de deux commandes", "Les deux premiers articles", "Les articles commandés en plus de deux exemplaires", "Le nombre total d'articles"], "HAVING filtre les groupes après le GROUP BY."],
  ["Dans WHERE MontantHT = (SELECT MAX(MontantHT) FROM FACTURE), la requête entre parenthèses…", ["Est évaluée d'abord, et son résultat sert de comparaison", "Est évaluée en dernier", "Est ignorée", "Trie les factures"], "C'est une requête imbriquée."],
 ],
 "p7c1": [
  ["Le système d'information comptable a pour objectif…", ["De répondre aux obligations de l'entreprise et de fournir les instruments de gestion du pilotage", "De remplacer le service commercial", "De produire les biens vendus", "De gérer uniquement la paie"], "Obligations comptables, fiscales, sociales, et outils de pilotage."],
  ["Le SI est souvent décomposé en sous-systèmes centrés sur…", ["Les services (commercial, production, personnel, comptable et financier)", "Les logiciels installés", "Les ordinateurs", "Les clients"], "Chaque service a son sous-système d'information, et tous échangent entre eux."],
 ],
}
F = {
 "p7c7": [
  ["Les 3 types de processus", "Métier (besoin extérieur, cœur de métier), support (besoin d'un processus métier), pilotage (cohérence, contrôle, suivi).", "La gestion des factures : support dans une industrie, métier dans un cabinet comptable."],
  ["Diagramme des flux", "Acteurs en cercles, cadre autour des internes, flux numérotés vers un seul acteur.", "Sert à repérer surcharges, ruptures et lenteurs."],
  ["DER : où placer quoi", "Événements chez l'émetteur, résultats chez le destinataire ; période en 1re colonne, type de traitement en dernière.", ""],
  ["Activité d'un DER", "Rectangle en trois parties : titre, tâches, règles d'émission ; un seul acteur, une seule période, un seul type de traitement.", ""],
  ["Règles de validation du DER", "Toute activité a au moins un événement et un résultat ; un acteur externe ne fait aucune activité ; tout acteur émet ou reçoit quelque chose.", ""],
  ["Synchronisation et émission", "Synchronisation : connecteur ET, OU qui déclenche l'activité. Émission : condition qui choisit le résultat (accord, refus).", ""],
 ],
 "p7c6": [
  ["Les 4 rôles d'un SGBD", "Définition des données, manipulation, sécurité et intégrité, gestion des accès simultanés.", "SGBDR : tables reliées (MySQL, PostgreSQL, Oracle, SQL Server, Access)."],
  ["Bonne clé primaire", "Unique, jamais vide, stable. Sinon un champ NuméroAuto.", "Mauvaises clés : nom, téléphone, e-mail."],
  ["Client-serveur", "Le serveur gère les données ; le client envoie des requêtes. Client lourd : logiciel installé ; client léger : navigateur.", ""],
 ],
 "p7c2": [
  ["Projection et sélection", "Projection : choisir les colonnes (SELECT, DISTINCT). Sélection ou restriction : choisir les lignes (WHERE).", ""],
  ["Jokers de LIKE", "% : une suite de caractères ; _ : un seul caractère ; * dans Access.", "'a%' commence par a, '%a' finit par a, '%a%' contient a."],
  ["Fonctions statistiques", "COUNT(*), COUNT(DISTINCT col), SUM, AVG, MIN, MAX ; AS pour nommer la colonne.", "SUM et AVG ignorent les valeurs nulles."],
 ],
}
qlines = []
for ch, lst in Q.items():
    for q in lst:
        assert len(q[1]) == 4 and "—" not in js(q), q[0]
        qlines.append(js(["p7", q[0], q[1], q[2], ch]))
flines = [js(["p7", f[0], f[1], f[2], ch]) for ch, lst in F.items() for f in lst]
anchor = "\nCHAP.push(...[{\"id\": \"p2c7\""
rep(anchor, "\nQ.push(...[" + ", ".join(qlines) + "]);\nF.push(...[" + ", ".join(flines) + "]);" + anchor)

# =====================================================================  ATELIER SQL
X1 = '''    ["s10", "En dehors d'un intervalle", "Affiche le libellé et le prix unitaire HT des produits dont le prix n'est pas compris entre 100 et 400 €.", "SELECT LibelleProduit, PrixUnitaireHT FROM PRODUIT WHERE PrixUnitaireHT NOT BETWEEN 100 AND 400;", "NOT BETWEEN x AND y garde ce qui est en dehors de l'intervalle."],
    ["s11", "Un seul caractère", "Affiche le nom et la ville des clients dont la ville commence par L et compte exactement 4 lettres.", "SELECT NomClient, Ville FROM CLIENT WHERE Ville LIKE 'L___';", "_ remplace exactement un caractère : L suivi de trois _."],
    ["s12", "ET, OU et parenthèses", "Affiche le numéro, le client et le montant HT des factures de plus de 2 000 €, ou des factures du client n°1 de plus de 900 €.", "SELECT NumFacture, NumClient, MontantHT FROM FACTURE WHERE MontantHT > 2000 OR (NumClient = 1 AND MontantHT > 900);", "Mets des parenthèses autour du AND pour ne pas mélanger les conditions."],
    ["s13", "Valeur renseignée", "Affiche le nom et l'e-mail des clients dont l'adresse e-mail est renseignée.", "SELECT NomClient, Email FROM CLIENT WHERE Email IS NOT NULL;", "IS NOT NULL, jamais <> NULL."],
'''
X2 = '''    ["a5", "Compter sans doublon", "Affiche le nombre de villes différentes dans lesquelles l'entreprise a des clients.", "SELECT COUNT(DISTINCT Ville) FROM CLIENT;", "COUNT(DISTINCT colonne) compte les valeurs différentes."],
    ["a6", "Minimum et maximum", "Affiche, sur une seule ligne, le plus petit et le plus grand montant HT de facture, dans deux colonnes nommées Minimum et Maximum.", "SELECT MIN(MontantHT) AS Minimum, MAX(MontantHT) AS Maximum FROM FACTURE;", "MIN et MAX dans le même SELECT ; AS pour nommer chaque colonne."],
    ["a7", "Filtrer, grouper, filtrer", "Pour les factures de plus de 1 000 € HT seulement, affiche par client le total HT, en ne gardant que les clients dont ce total dépasse 3 000 €.", "SELECT NumClient, SUM(MontantHT) AS Total FROM FACTURE WHERE MontantHT > 1000 GROUP BY NumClient HAVING SUM(MontantHT) > 3000;", "WHERE filtre les factures avant le regroupement, HAVING filtre les totaux après."],
    ["a8", "Une requête imbriquée", "Affiche le numéro et le montant HT de la facture la plus élevée, en utilisant une requête imbriquée.", "SELECT NumFacture, MontantHT FROM FACTURE WHERE MontantHT = (SELECT MAX(MontantHT) FROM FACTURE);", "La sous-requête (SELECT MAX…) est évaluée d'abord."],
'''
rep('    ["j1", "Une jointure",', X1 + '    ["j1", "Une jointure",')
rep('    ["m1", "Ajouter une ligne",', X2 + '    ["m1", "Ajouter une ligne",')

open(path, "w", encoding="utf-8").write(s)
print("ok :", sum(len(v) for v in Q.values()), "questions,", sum(len(v) for v in F.values()), "cartes, 8 exercices SQL ; P7 passe à 10 leçons")
