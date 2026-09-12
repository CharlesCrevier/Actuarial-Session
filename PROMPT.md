# Prompt de production

Transforme la présentation PowerPoint fournie, intitulée « Travail actuariel dans le domaine de la sécurité sociale », en une présentation web interactive, spectaculaire et sobre, destinée à une projection sur un écran de 10 mètres de large sur 5 mètres de haut, soit un format natif 2:1.

## Objectif

Créer une expérience scénique qui renforce le discours oral. Préserver fidèlement les idées et la terminologie technique de la présentation, mais remplacer les diapositives textuelles par des compositions visuelles immédiatement lisibles depuis le fond d’une grande salle. Chaque diapositive doit porter une seule idée forte.

## Direction artistique

- Univers visuel contemporain inspiré de la donnée, de la projection à long terme et de la gouvernance financière.
- Fond bleu nuit profond, contrastes très élevés, accents cyan, turquoise et couleurs chaudes pour matérialiser les tensions.
- Évoquer les parapluies colorés de l’Académie 2026 comme signature d’ouverture, au moyen d’une composition abstraite originale avec un traitement cinématographique et un mouvement lent.
- Typographie massive, nette et lisible. Titres visibles à 10 mètres. Aucun paragraphe dense.
- Mettre les cinq dualités en scène comme des tensions visuelles distinctes : split screen, ligne du temps, balance, lentille, orbite.
- Transformer les listes en trajectoires, cycles, radar, étapes ou pipeline. Ne jamais créer une simple succession de cartes identiques.
- Utiliser des animations CSS fluides et élégantes, sans effet gadget : apparitions progressives, zoom subtil, parallaxe douce, pulsation, tracés et transitions cinématographiques.

## Interaction et fonctionnement

- Navigation entièrement pilotable avec un clicker standard : flèche droite, Page Down, espace et clic avancent; flèche gauche et Page Up reviennent.
- Chaque clic révèle d’abord le prochain élément de la diapositive, puis passe à la diapositive suivante.
- Aucun défilement automatique et aucune animation qui bloque l’orateur.
- La touche F active le plein écran. La touche O affiche une vue d’ensemble cliquable.
- Afficher une progression discrète et le numéro de diapositive.
- Assurer un fonctionnement hors connexion, sans CDN ni dépendance externe.
- Respecter `prefers-reduced-motion` et conserver un contraste accessible.

## Contraintes techniques

- Livrer un site statique en HTML, CSS et JavaScript pur.
- Format de scène fixe 2:1, centré et redimensionné proportionnellement sur tout écran.
- Aucun texte important à moins de 6 % des bords.
- Aucun corps de texte inférieur à l’équivalent de 28 px sur une scène de 2000 × 1000 px.
- Tester Chrome/Edge en plein écran, les touches d’un clicker et la navigation arrière.
- Structurer le code pour permettre la modification simple des textes et des couleurs.

## Contenu attendu

Conserver les 13 moments narratifs : ouverture; cinq dualités; objectifs; définition de l’étude actuarielle; nécessité des études; cinq lignes directrices; cycle de planification; gestion de projet; conclusion. Reformuler uniquement pour raccourcir et clarifier, sans modifier le sens technique.

Le résultat doit évoquer une keynote internationale haut de gamme, tout en restant institutionnel, crédible et centré sur la pédagogie.
