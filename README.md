# Grand Livre BTS CG

Classeur de révision du BTS Comptabilité et Gestion, en ligne, avec un compte par élève (nom + mot de passe) et la progression sauvegardée.

## Mise en ligne sur Railway
1. Nouveau projet → **Deploy from GitHub repo** → ce dépôt.
2. Dans le projet : **+ New → Database → PostgreSQL** (la variable `DATABASE_URL` est reliée automatiquement au service ; sinon, ajoute dans les variables du service `DATABASE_URL = ${{Postgres.DATABASE_URL}}`).
3. Variables du service :
   - `SESSION_SECRET` : une longue phrase secrète (obligatoire).
   - `ADMIN_KEY` : mot de passe de la page `/admin` (réinitialiser le mot de passe d'un élève, voir les inscrits).
   - `REGISTRATION=code` et `SIGNUP_CODE=…` : facultatif, pour que seuls ceux qui ont le code puissent créer un compte.
   - `ANTHROPIC_API_KEY` : facultatif, active la correction des annales par Claude (payant à l'usage). `AI_DAILY_LIMIT` (10 par défaut) limite le nombre de corrections par élève et par jour.
4. **Settings → Networking → Generate Domain** pour obtenir l'adresse du site.

Chaque envoi sur la branche `main` redéploie le site automatiquement.

## Mettre à jour le contenu
`python3 build/build_public.py "Grand Livre BTS CG.html"` (fichier source gardé hors du dépôt : il contient des éléments personnels) régénère `public/app.html` à partir de la version Claude du Grand Livre (retire les contenus personnels, ajoute la connexion).
