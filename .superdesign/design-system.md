# Hady Sané — Sunset Portfolio

## Brief
Portfolio personnel en français, inspiré des expériences créatives présentées sur Awwwards et de l'esthétique sunset des années 1980. L'objectif est de présenter le parcours et les prestations de Hady Sané et de permettre aux prospects de prendre contact sur Malt. Le site final doit utiliser Three.js.

## Sources vérifiées
Profil consulté dans le navigateur le 17 octobre 2026 : https://www.malt.fr/profile/hadysane1
- Nom : Hady Sané.
- Intitulé public : Développeuse WordPress, Divi & React Django.
- Développement React / TypeScript, Python / Django, WordPress / Divi.
- Melun, France ; travail à distance uniquement, principalement en soirée ; suivi par messagerie.
- Clients visés : entrepreneurs, artisans, restaurants, salons de coiffure et petites entreprises.
- DIGIFIELD Technologies, depuis janvier 2021 : développement et maintenance de Baulders, application d'évaluation et d'audit de projets. Interfaces React / TypeScript, fonctionnalités Python / Django, API REST, composants, rapports, tests et maintenance.
- Appalga, octobre 2019 à octobre 2020 : sites et solutions web sur mesure avec AppDrag, HTML, CSS, JavaScript, jQuery, SQL et API REST ; support et maintenance.
- Formations (précisées par Hady et sa capture LinkedIn) : Cloud Campus, développement full stack, niveau bac+4, 2020–2022 ; Web@cadémie by Epitech, Intégrateur – développeur web, 2018–2020 ; Lycée Antonin Carême à Savigny-le-Temple, bac pro Commerce, 2013–2015.
- Cloud Campus remplace le nom IT Academy renseigné par erreur sur LinkedIn. Conserver la formulation « niveau bac+4 », sans affirmer un diplôme obtenu ni un intitulé RNCP non fourni. Les dates 2013–2015 du bac pro remplacent l'année 2020 indiquée sur Malt.
- Formation Cloud Campus réalisée en alternance chez DIGIFIELD Technologies (précision directe de Hady). Technologies pratiquées pendant la formation : backend Python/Django, PHP/Symfony/Laravel, JavaScript/Node.js ; bases de données SQL, MySQL, MongoDB ; frontend HTML, CSS, JavaScript, React, Vue.js. Présenter ces éléments dans le cursus sans attribuer l'ensemble de cette stack au produit Baulders ni modifier les dates d'emploi.
- GitHub : https://github.com/hadysane
- Contact : https://www.malt.fr/profile/hadysane1
Ne pas inventer de projets, résultats chiffrés, témoignages, clients, adresse email ou disponibilité immédiate. Les visuels de projets doivent être explicitement des interprétations graphiques, pas de fausses captures produit. Ne pas utiliser les autres profils homonymes trouvés dans les moteurs de recherche.

## Direction visuelle
Nom de direction : AFTER HOURS / code under the sunset.
Fond presque noir aubergine #100b18 ; surfaces #1c1326 ; traits #3d2a49.
Texte ivoire #fff3e5 ; secondaire #beafc9.
Soleil : dégradé #ffdd86 → #ff9864 → #f8598d. Accent orange #ffac79 et magenta #ec6aaf ; violet #8270ba pour le paysage.
Typographie titres : Space Grotesk, sans-serif, grande échelle 80–144px sur desktop, 48–72px sur mobile ; texte courant 16–18px ; annotations IBM Plex Mono 11–13px. Titres peu espacés, annotations espacées et en capitales.
Composition éditoriale, grands espaces, grille 12 colonnes, marges 56px desktop / 22px mobile, largeur maximale 1440px. Espacements 8, 16, 24, 32, 48, 64, 96, 128px.
Éviter les cartes génériques à coins très arrondis et les halos sur le texte. Boutons contours fins, rayon 2px, contraste fort ; liens avec flèche diagonale.

## Architecture et contenu
1. Navigation discrète : signature textuelle Hady Sané ; Expertises, Parcours, À propos, Parlons de votre projet.
2. Hero immersif pleine hauteur : grand soleil strié, horizon montagneux sombre et grille en perspective. Nom Hady Sané dominant, titre « Du code. Du caractère. » et sous-titre « Développeuse web · React, Django & WordPress ». Boutons « Découvrir mon univers » et « Parlons de votre projet ». Annotations « Basée à Melun · À distance » et « Portfolio — After hours ». Garder le texte accessible et lisible au premier plan.
3. Expertises : 01 Sites WordPress & Divi ; 02 Interfaces React & TypeScript ; 03 Applications Python & Django. Descriptions concises basées sur le profil, listes de technologies.
4. Parcours : deux grandes entrées éditoriales DIGIFIELD / Baulders et Appalga, avec dates et détails factuels. Ne pas fabriquer de galerie de projets clients.
5. À propos : une présence en ligne à votre image ; accompagnement de la conception à la mise en ligne ; formation Epitech ; distant / soirée / messagerie clairement indiqués.
6. Contact avec grand titre « Et si on créait la suite ? », bouton vers Malt, lien GitHub, retour en haut.

## Interactions et livraison future
Three.js : soleil avec shader de bandes horizontales et dégradé, terrain filaire et mouvement lent vers l'horizon, parallaxe très légère au pointeur. Pas de son automatique. Contrôle de pause des animations, respect de prefers-reduced-motion, fallback CSS quand WebGL est absent. Arrêter le rendu hors écran et limiter la densité de pixels. Les textes, navigation et CTA restent en HTML sémantique.
Transitions sobres de 200–500ms ; navigation par ancres avec focus visible ; menu mobile accessible. Responsive à partir de 360px, titres sans débordement. Pas de chargement bloquant, pas de curseur personnalisé qui remplace le curseur natif.

## Référence
https://www.awwwards.com/websites est une galerie de références, pas une mise en page à recopier. Retenir la qualité de composition, le rythme et l'interaction ; conserver l'identité sunset explicitement demandée.
