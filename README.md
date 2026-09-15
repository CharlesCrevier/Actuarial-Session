# Actuarial Session

Présentation web interactive en français, optimisée pour une projection 10 m × 5 m et enrichie par les besoins exprimés par les participants de l’Académie 2026.

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

## Fond naturel animé

La présentation utilise une scène originale générée en temps réel : forêt profonde, cascade, brume, feuilles et lumière mouvante. Elle ne nécessite aucune connexion internet.

Pour produire un fichier HTML unique à copier sur le bureau :

```bash
node build-offline.mjs
```

Le fichier final se trouve dans `dist/Actuarial-Session-OFFLINE.html`.

<!-- GitHub Pages deployment refresh: Session 3, 21 slides, 2026-09-15 -->
