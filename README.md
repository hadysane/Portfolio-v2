# Hady Sané — After Hours

Portfolio personnel en français, à partir de la maquette Superdesign validée. Décor synthwave Three.js, textes HTML accessibles, typographies hébergées localement et styles Tailwind compilés.

## Développement

Node.js 20.19+ ou 22.12+.

```sh
npm ci --legacy-peer-deps
npm run dev
```

Ouvrir l’adresse locale indiquée par Vite. Ne pas ouvrir `index.html` directement en `file://` : les modules JavaScript nécessitent un serveur HTTP.

## Production

```sh
npm run build
npm run preview
```

Le dossier `dist/` est un site statique prêt à héberger. Aucun compte, secret ou serveur applicatif nécessaire. Le site n’est pas publié automatiquement.

## Modifier le portfolio

- `index.html` : textes, expériences, formations, liens et structure.
- `src/styles.css` : palette, rendu responsive et décor CSS de secours.
- `src/sunset.js` : scène Three.js, soleil, relief, grille et parallaxe.
- `src/main.js` : menu mobile, navigation, contrôle des animations.
- `.superdesign/` : maquette et informations de référence ; jamais incluses dans le build.

Le décor respecte `prefers-reduced-motion`, propose une pause et arrête le rendu hors écran ou dans un onglet masqué. Sans WebGL ou JavaScript, les informations et liens restent accessibles avec un décor CSS fixe. Le menu mobile utilise une boîte de dialogue native avec gestion du focus et fermeture par Échap.

Les expériences présentent des captures des sites publics de Baulders et Appalga, avec leurs liens, dans `public/images/`. Ces aperçus illustrent les entreprises et ne sont pas présentés comme des réalisations intégrales de Hady. Les technologies indiquées dans Cloud Campus décrivent la formation et ne sont pas toutes attribuées au produit Baulders. Le diplôme est présenté comme « niveau bac+4 », conformément aux informations fournies.
