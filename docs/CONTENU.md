# Format du contenu d'une formation

L'appli est séparée en deux blocs dans `Grand Livre BTS CG.html` :

1. **`<script id="gl-content" data-formation="…">`** : tout ce qui est propre à une formation (matières, épreuves, cours, quiz, cartes, exercices…).
2. **Le script suivant : le moteur** (affichage, répétition espacée, contrôles, plan, duels, sons, synchronisation…). Il ne contient plus de contenu de cours et ne fait que lire les données ci-dessous.

Pour ajouter une formation, on écrit un nouveau bloc de contenu qui définit **les mêmes noms**. Le moteur n'a pas à changer.
Le bloc de contenu doit pouvoir s'exécuter seul : il ne doit appeler aucune fonction du moteur au chargement. En revanche, les fonctions qu'il contient (générateurs `make`) peuvent utiliser les outils du moteur (`ri`, `r2`, `pk`, `L`, `fmt`…), car elles ne sont appelées qu'ensuite.

## Carte d'identité

| Nom | Forme | Rôle |
|---|---|---|
| `FORMATION` | `{ id, nom, court, niveau, examen, version }` | Identité de la formation (ex. `bts-cg`, « BTS CG ») |

## Matières et épreuves

| Nom | Forme | Rôle |
|---|---|---|
| `CATS` | `[{ id, code, name, ep, grp, desc, … }]` | Les matières (« catégories ») : `id` court (`p1`, `ce`…) utilisé partout ailleurs |
| `COURS_META` | `{ id: { id, cat, code, name, short } }` | Les cours affichés dans la bibliothèque |
| `EPREUVES` | `[{ c, t, k, f, cats, ex }]` | Épreuves de l'examen : code, titre, coefficient, forme, matières |
| `EPREUVE_INFO` | `{ E5: { name, old, dur, total, cat } }` | Détails des épreuves écrites simulées |
| `EPTEXT` | `{ cat: "texte" }` | Phrase « évalué en … » par matière |
| `EXAM_PLAN`, `PL_CATS` | `{ cat: poids }`, `[cat]` | Pondération pour le plan de révision |
| `GUEST_CATS` | `[cat]` | Matières ouvertes en mode essai |
| `BTS_PLAN`, `BTS_CHECK` | `[[mois, libellé, [tâches]]]`, `[texte]` | Calendrier de l'année et check-list |

## Cours

| Nom | Forme | Rôle |
|---|---|---|
| `COURS` | `{ cat: "texte du cours (markdown léger)" }` | Cours par matière |
| `CHAP` | `[{ id, cat, src, th, n, title, idee, sections: [{ h, b: [[type, titre, texte]] }] }]` | Chapitres détaillés (leçons) |
| `IMP_THEMES` | `[{ key, cat, n, title }]` | Thèmes qui regroupent les chapitres |
| `METH`, `MCFG` | objets par source | Méthodes (cas pratique, dissertation…) et réglages d'affichage |
| `REFS` | `[[auteur, cat, chapitre, idée, résumé]]` | Auteurs et références à citer |
| `NOTIONS`, `VIG`, `GLF` | objets / listes | Notions clés, points de vigilance, formulaire (glossaire des calculs) |

## Entraînement

| Nom | Forme | Rôle |
|---|---|---|
| `Q` | `[[cat, question, [bonne, fausse, fausse, fausse], explication, chapitre?]]` | Quiz (la **première** réponse est la bonne ; l'appli mélange) |
| `F` | `[[cat, recto, verso, détail?, chapitre?]]` | Cartes mémoire |
| `QX` | `{ idQuestion: { f, s: [étapes], w } }` | Corrections détaillées des questions de calcul |
| `GCASES` | `[{ id, cat, ch, title, enonce, question, steps: [{ k, name, tip, corr }] }]` | Cas pratiques guidés pas à pas |
| `GENS` | `[{ id, cat, title, make() }]` | Exercices générés (chiffres différents à chaque fois) |
| `CXG` | `[{ id, cat, t, make() }]` | Calculs express |
| `SCH` | `[{ id, cat, title, idee, rows }]` | Schémas (à voir, à trous, à construire) |
| `REDAC` | `[{ id, cat, title, enonce, model, crit }]` | Rédactions (syllogisme…) avec modèle et critères |
| `ORAL`, `ORAL_TRAME` | `[{ e, c, q, pts, piege }]` | Questions d'oral et trame de réponse |
| `DOSS`, `EXAM5` | `[{ id, cats, title, ent, minutes, make() }]` | Dossiers type épreuve écrite, et ceux de l'examen blanc |
| `ANN` | `[{ id, ep, year, place, cas, ex: […] }]` | Annales (sujets officiels et liens vers les corrigés) |
| `ACC_LIST`, `ACC_HINT`, `STEP_EXP` | listes / objets | Plan de comptes, aides sur les comptes, réponses attendues des étapes |
| `MATHS` | `{ GENERATORS: { … } }` | Générateurs et simulateurs de maths |

Les tableaux d'ajouts (`Q2`, `Q3`, `QIMP`, `FIMP`, `OPT_FIX`, `QFIX_IMP`…) sont fusionnés dans `Q` et `F` à l'intérieur du bloc de contenu.

## Vérifier un bloc de contenu

Le bloc doit s'exécuter seul sans erreur (test : l'extraire et le lancer avec `node`), puis l'appli doit s'ouvrir sans erreur sur toutes les vues.
