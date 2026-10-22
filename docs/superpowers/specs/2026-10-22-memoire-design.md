# Ma mémoire : spécification

Date : 22 octobre 2026. Statut : à relire par Quentin.

## 1. But

Aider l'élève à retenir sur la durée : ne plus oublier un chapitre entier, son vocabulaire, ses règles et leur pourquoi, ses calculs.
Pour ça, l'appli estime une **mémoire par chapitre** et propose chaque jour une **séance mémoire** courte qui reprend ce qui s'efface.

Réussite :
- l'élève voit, matière par matière, les chapitres qui s'effacent ;
- la séance du jour dure 10 à 15 minutes et fait remonter ces chapitres ;
- le prof voit dans GL Admin les mêmes états que l'élève (même calcul).

Hors champ : changer la répétition espacée des cartes et des questions, qui reste telle quelle. La mémoire par chapitre s'ajoute par-dessus.

## 2. Ce qui est mesuré

Un **jour de réussite** d'un chapitre est un jour où l'élève a, sur ce chapitre, au moins une de ces réussites :
- carte marquée connue ;
- question de quiz juste ;
- situation « Décider et justifier » juste (décision et raison) ;
- calcul express juste.

Un jour compte une fois, quel que soit le nombre de réussites ce jour-là.
Les jours sont des numéros de jour à l'heure de Paris, le même calendrier que `S.qd` et que `parisNow().dayNum` côté serveur.

En plus, on garde le **bilan quiz** du chapitre : pour chacun des 10 derniers jours où l'élève a répondu à une question du chapitre, le nombre de réponses justes et le nombre total.

## 3. Données : `S.mem`

```js
S.mem = {
  "p1c3": {             // identifiant de chapitre (le même que META.ch et CHAP)
    d: [20380, 20384, 20391],      // jours de réussite, croissants, sans doublon, 60 au plus (les plus récents)
    q: { "20391": [4, 5] }          // bilan quiz : jour -> [justes, total], 10 jours au plus (les plus récents)
  }
}
```

Pourquoi 60 jours et non 12 : la solidité (§4) se recalcule à partir de la liste des jours. Avec 12 jours, un élève qui travaille un chapitre souvent perdrait l'historique ancien et retomberait à une solidité faible. 60 jours couvrent largement le chemin jusqu'à la solidité maximale. Le poids reste faible (environ 15 Ko pour 40 chapitres très travaillés, à comparer aux 2 Mo autorisés pour la progression).

Enregistrement : à chaque réussite, on ajoute le jour du jour dans `d` (s'il n'y est pas) et on met à jour `q` pour les questions. Rien d'autre ne change dans `S`.

### Fusion entre appareils

Lors de la synchronisation, pour chaque chapitre :
- `d` : réunion des deux listes, doublons retirés, tri, on garde les 60 plus récents ;
- `q` : réunion par jour ; si un même jour existe des deux côtés, on garde l'entrée qui a le plus grand total ; on garde les 10 jours les plus récents.

Cette fusion donne le même résultat dans les deux sens et fusionner une copie avec elle-même ne change rien : aucune réussite ne se perd et rien ne se compte deux fois.

### Premier lancement

Si `S.mem` n'existe pas, il est rempli une fois à partir de l'existant :
- `S.qd` : les jours de réussite de chaque question vont au chapitre de la question ;
- `S.c` : une carte de niveau au moins égal au seuil « connue » donne un jour de réussite estimé à partir de son échéance et de son intervalle (formule exacte fixée dans le plan, après lecture du moteur) ;
- `S.dwr` : les situations réussies donnent des jours de réussite s'ils sont enregistrés ; sinon elles ne comptent pas (à vérifier dans la source au moment du plan).
Le bilan quiz démarre vide. Un drapeau `S.memV = 1` marque que l'initialisation est faite.

## 4. Calcul de l'état d'un chapitre

Une seule fonction pure : `memEtat(entree, aujourdhui, aDuContenu)` renvoie `{ etat, retention, revuIlYa }`.

1. **Pas de jour de réussite** : état « Pas encore vu ».
2. **Solidité** (en jours). On parcourt les jours dans l'ordre :
   - solidité de départ 4, au premier jour ;
   - un jour suivant **compte** s'il arrive au moins à la moitié de la solidité du moment après le dernier jour qui a compté ; la solidité double alors (180 au plus) ;
   - sinon il ne change pas la solidité, mais il compte comme dernière révision.
   Exemple : réussir 6 jours de suite donne 4 → 8 (jour 2) → 8 (jour 3, trop tôt) → 16 (jour 6). Réussir aux jours 0, 2, 6, 14, 30 donne 4 → 8 → 16 → 32 → 64.
3. **Rétention** = 2^(−t / solidité), où t = jours écoulés depuis le dernier jour de réussite. Elle vaut 100 % le jour même et 50 % quand t égale la solidité.
4. **État** :
   - Solide : 70 % et plus ;
   - À entretenir : de 40 % à moins de 70 % ;
   - S'efface : moins de 40 %.
5. **Correction par le quiz** : si le bilan quiz compte au moins 5 réponses et moins de 60 % de justes, l'état descend d'un cran (Solide devient À entretenir, À entretenir devient S'efface).

L'écran présente ces états comme une estimation (« d'après tes réponses »).

### Un seul calcul pour l'appli et le serveur

La fonction vit dans `src/memoire.js`, écrite pour tourner telle quelle dans le navigateur et dans Node. La même fonction est recopiée dans la source de l'appli entre deux repères `/*MEM:debut*/` et `/*MEM:fin*/`. `build/build_public.py` vérifie que les deux textes sont identiques et s'arrête sinon. La version artifact utilise la source, donc le même calcul.

## 5. Séance mémoire du jour

Composition :
- 3 à 4 chapitres : d'abord ceux qui s'effacent (le plus effacé d'abord), puis un « À entretenir » dont la rétention est la plus basse ; jamais « Pas encore vu » ;
- par chapitre : 2 cartes (cartes dues d'abord), 2 questions (réussies il y a le plus longtemps, puis ratées), 1 situation « Décider et justifier » et 1 calcul express s'il en existe pour ce chapitre ;
- environ 15 éléments ; durée réglable 10 / 15 / 25 minutes (le nombre de chapitres et d'éléments suit le réglage : 3, 4 ou 6 chapitres).

Déroulé en trois temps avec une barre de progression commune : cartes, puis quiz mélangé entre chapitres (questions et situations), puis calculs.
Chaque réussite enregistre le jour dans `S.mem` (§3), comme partout ailleurs.

Bilan final : les chapitres dont l'état a changé pendant la séance (par exemple « TVA sur les opérations courantes : S'efface → Solide »), puis bouton de retour à l'accueil.

Accueil : l'étape « Revoir tes cartes et tes acquis » devient « Séance mémoire ». « Cartes du jour » et « Révision des acquis » restent dans S'entraîner.

## 6. Écran « Ma mémoire »

- **Mon BTS** : un bloc résumé (nombre de chapitres solides, à entretenir, qui s'effacent, sur les chapitres vus) avec un lien vers l'écran complet.
- **Écran complet**, par matière : pour chaque chapitre, une barre de rétention, l'état, « revu il y a N jours », un lien vers la fiche et un bouton « Séance sur ce chapitre ».
- Filtre « Seulement ce qui s'efface ».
- Charte : `DESIGN.md` (couleurs par variables, Source Serif 4 / Source Sans 3, arrondi 8 px, icônes Lucide, aucun emoji). Les états utilisent `--ok` (Solide), `--ochre` (À entretenir, en forme seulement) et `--bad` (S'efface), avec toujours le mot écrit à côté de la couleur.

## 7. GL Admin

- Fiche élève : liste « Chapitres qui s'effacent » (titre du chapitre, revu il y a N jours).
- Tableau de classe (Classe › Analyse) : colonne « Mémoire : solides / vus », reprise dans l'export Excel et le bilan PDF.
- Le serveur lit `S.mem` dans la progression et appelle la même fonction `memEtat` (`require("./src/memoire")`). Les titres viennent de `META.ch`.
- Un élève qui n'a pas encore ouvert la nouvelle version n'a pas de `S.mem` : la colonne affiche « pas encore calculé » plutôt que zéro.

## 8. Cas limites

| Cas | Comportement |
|---|---|
| Chapitre sans cartes, questions ni calculs | Affiché avec son état, sans bouton de séance ; jamais choisi pour la séance du jour |
| Rien qui s'efface ni à entretenir | La séance prend les chapitres Solides de plus basse rétention ; s'il n'y en a pas assez, elle est plus courte |
| Aucun chapitre vu | Pas de séance ; message qui invite à lire une première leçon, avec un lien |
| Mode invité | Seulement les matières ouvertes (`GUEST_CATS`), rien n'est envoyé au serveur |
| Version artifact sans serveur | Même calcul, `S.mem` sauvegardé avec le reste par `window.claude` ; pas de fusion serveur |
| Ancienne version de l'appli sur un autre appareil | Elle renvoie une progression sans `mem` : le serveur garde le `mem` existant au lieu de l'effacer (à faire dans `PUT /api/progress`) |
| Horloge de l'appareil fausse | Les jours dans le futur (plus d'un jour d'avance) sont ignorés au calcul |

## 9. Tests

- **Fonction `memEtat`** (Node, `npm test`) : solidité sur les exemples du §4, seuils 70 % et 40 %, correction par le quiz, jours dans le futur, entrée vide. Les mêmes cas tournent sur la copie extraite de la source pour prouver que les deux sont identiques.
- **Fusion** : symétrie, fusion avec soi-même, limite de 60 jours et de 10 jours de quiz.
- **Serveur** : `PUT /api/progress` sans `mem` garde le `mem` existant ; GL Admin renvoie les bons états pour une progression préparée.
- **Playwright, appli** : initialisation depuis une progression existante ; bascule des états en simulant des jours ; composition et enchaînement de la séance ; bilan ; fusion entre deux appareils ; mode invité.
- **Captures sur téléphone** (360 et 412 px) et ordinateur : bloc Mon BTS, écran Ma mémoire, séance, bilan, colonne GL Admin.

## 10. Ce qui dépend de la source

Le plan de réalisation devra lire le moteur dans `Grand Livre BTS CG.html` pour fixer : la forme exacte de `S.c` et `S.dwr`, l'endroit où enregistrer chaque réussite, le rattachement des cartes, questions, situations et calculs à un identifiant de chapitre, et la fusion actuelle des progressions dans `build/shim.js`.
