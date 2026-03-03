# OnVaPasEnFaireToutUnFromage.github.io

Ce dépôt contient un site statique enrichi de scripts JavaScript qui communiquent avec une base de données Supabase.

## Organisation du projet

- tous les fichiers HTML/CSS/JS sont à la racine
- un serveur Node/Express minimal (`server.js`) sert ces fichiers et expose la configuration Supabase à l'aide d'un petit endpoint `/config.js`
- les clés publiques Supabase ne sont plus codées en dur ; elles sont lues depuis un fichier `.env`

## Installation

```bash
cd /workspaces/rowentax33.github.io
npm install
cp .env.example .env   # ou créez .env manuellement
# remplir SUPABASE_URL et SUPABASE_ANON_KEY
npm run dev            # démarrer en mode développement (avec nodemon)
# ou npm start pour production
```

Ensuite ouvrez `http://localhost:3000/withoutia.html` dans votre navigateur.

## Notes

- La variable d'environnement est explicitement ignorée par Git grâce à `.gitignore`.
- Les scripts côté client référencent `window.SUPABASE_URL` et `window.SUPABASE_ANON_KEY` qui sont définis dynamiquement par `/config.js`.

Bonne continuation !