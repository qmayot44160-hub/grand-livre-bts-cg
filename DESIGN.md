# DESIGN.md · Grand Livre

## Direction
Un registre de comptable bien tenu : encre bleu nuit sur papier clair, colonnes nettes, chiffres alignés. Sobre et sérieux, pour être pris au sérieux par un élève comme par un prof.
Références retenues : le grand livre et le cahier de comptabilité (encre, réglure, colonnes de montants). Aucune référence de site à imiter.

## Couleurs (variables CSS, jamais de couleur écrite en dur dans les composants)

| Rôle | Variable | Clair | Sombre |
|---|---|---|---|
| Principale (boutons, liens, titres forts) | `--ink-blue` | `#1E3A5F` | `#9DB8DC` |
| Texte sur principale | `--on-blue` | `#FFFFFF` | `#121821` |
| Accent, rare (repère, échéance, mise en avant unique) | `--ochre` | `#B7791F` (formes, jamais pour du texte fin) | `#E0A84A` |
| Accent en texte | `--ochre-text` | `#8A5A12` | `#E0A84A` |
| Papier (fond) | `--paper` | `#F5F7FA` | `#121821` |
| Feuille (cartes, champs) | `--sheet` | `#FFFFFF` | `#1A2230` |
| Encre (texte) | `--ink` | `#18202B` | `#E6EBF2` |
| Gris texte (secondaire) | `--muted` | `#59657A` | `#9AA6B8` |
| Gris trait (bordures, réglure) | `--rule` | `#D6DCE4` | `#2B3546` |
| Juste | `--ok` | `#1F7A4D` | `#5CC28F` |
| Faux / erreur | `--bad` | `#B42318` | `#F2867B` |

Contrastes vérifiés : texte ≥ 4,5:1 partout (principale sur blanc 11,5:1, gris texte sur papier 5,5:1).
Pas de dégradé décoratif. Les couleurs de matières (P1 à P7, CEJM…) restent des repères d'information, en teintes sourdes.

## Typographie (2 polices)
- Titres : **Source Serif 4**, graisse 600.
- Texte, boutons, chiffres : **Source Sans 3**, graisses 400 et 600. Chiffres tabulaires (`font-variant-numeric: tabular-nums`) dans les tableaux et compteurs.
- Échelle (rapport 1,25) : légende 13 px · texte 16 px · intertitre 20 px · titre de section 25 px · titre de page 31 px · grand titre 39 px.
- Hauteur de ligne : 1,5 pour le texte, 1,2 pour les titres. Lignes de texte de 75 caractères au plus.
- Pas de capitales pour les étiquettes, pas de mot isolé surligné dans un titre.

## Formes et espacements
- **Un seul rayon d'arrondi : 8 px** (`--radius`), pour boutons, cartes, champs, badges, images. Seules exceptions : les ronds (avatars, pastilles d'état) à 50 %.
- Espacements sur une grille de 4 px : 4 · 8 · 12 · 16 · 24 · 32 · 48.
- Bordure 1 px `--rule` plutôt qu'une ombre. Une seule ombre légère réservée aux feuilles qui se superposent (menus, fenêtres).
- Boutons : un style principal (fond `--ink-blue`, texte `--on-blue`) et un secondaire (fond feuille, bordure `--rule`, texte encre). Hauteur 44 px.

## Icônes
Un seul jeu : **Lucide** (trait 2 px, 20 px, `currentColor`), intégré en SVG. **Aucun emoji dans l'interface.**

## Mouvement
Autorisé seulement :
- retour au survol et au clic : couleur et fond, 150 ms ;
- ouverture et fermeture d'une feuille ou d'un menu : 200 ms ;
- barres de progression qui se remplissent : 300 ms ;
- indicateur de chargement.
Interdit : confettis, parallaxe, éléments qui rebondissent, apparitions au défilement, 3D, curseur personnalisé, animations en boucle décoratives.
Le réglage « réduire les animations » du système coupe tout.
Les sons doux de l'appli restent (désactivables dans les réglages).

## Ton des textes
- Tutoiement pour les élèves, vouvoiement dans le bloc destiné aux profs et établissements.
- Phrases courtes (20 mots au plus), verbes simples, ce que la personne obtient concrètement.
- Boutons : l'action exacte (« Créer mon compte », « Envoyer la demande »), sans flèche.
- Chiffres : seulement des chiffres réels et vérifiables (calculés depuis le contenu).
- Jamais : tiret long (—) comme ponctuation, « boostez », « libérez », « transformez », « révolutionnaire », « tout-en-un », « ultime », « incroyable », « magique », « en quelques clics », listes de trois adjectifs, points d'exclamation en série.
