# Actuarial Session

Présentation web interactive en français, optimisée pour une projection 10 m × 5 m.

## Lancer

Ouvrir `index.html` dans Chrome ou Edge. Pour éviter toute restriction locale du navigateur, on peut aussi lancer un serveur local :

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000` et appuyer sur `F` pour le plein écran.

## Commandes

- `→`, `Page Down`, `Espace`, `Entrée` ou clic : révéler l’élément suivant, puis avancer
- `←`, `Page Up` ou `Retour arrière` : revenir
- `F` : plein écran
- `O` : vue d’ensemble

La présentation fonctionne hors connexion et ne dépend d’aucune bibliothèque externe.

## Fond vidéo

La scène d’ouverture utilise un plan lent de nuages, assombri pour préserver la lisibilité sur grand écran. La vidéo en ligne provient de [Pixabay](https://pixabay.com/videos/clouds-cloudscape-sky-air-1154/) et relève de la licence de contenu Pixabay.

Pour une utilisation totalement hors connexion, télécharger la version MP4 dans `assets/nature-background.mp4`. La présentation essaie d’abord ce fichier local, puis la source en ligne. Si aucune vidéo n’est disponible, le fond abstrait animé reste visible automatiquement.
