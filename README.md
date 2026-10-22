# Grand Livre BTS CG

Classeur de révision du BTS Comptabilité et Gestion, en ligne, avec un compte par élève (nom + mot de passe) et la progression sauvegardée.

## Mise en ligne sur Railway
1. Nouveau projet → **Deploy from GitHub repo** → ce dépôt.
2. Dans le projet : **+ New → Database → PostgreSQL** (la variable `DATABASE_URL` est reliée automatiquement au service ; sinon, ajoute dans les variables du service `DATABASE_URL = ${{Postgres.DATABASE_URL}}`).
3. Variables du service :
   - `SESSION_SECRET` : une longue phrase secrète (obligatoire).
   - `ADMIN_USERS` : nom(s) des comptes administrateurs, séparés par des virgules. Pour tous les autres, `/admin` répond « page introuvable ».
   - `ADMIN_KEY` : mot de passe de la page `/admin` (réinitialiser le mot de passe d'un élève, voir les inscrits).
   - `REGISTRATION=code` et `SIGNUP_CODE=…` : facultatif, pour que seuls ceux qui ont le code puissent créer un compte.
   - `ANTHROPIC_API_KEY` : facultatif, active la correction des annales par Claude (payant à l'usage). `AI_DAILY_LIMIT` (10 par défaut) limite le nombre de corrections par élève et par jour.
4. **Settings → Networking → Generate Domain** pour obtenir l'adresse du site.

Chaque envoi sur la branche `main` redéploie le site automatiquement.

## Sauvegardes et tâche planifiée
Le serveur fait lui-même une copie complète de la base chaque jour (table `backups`, 7 dernières gardées), visible et téléchargeable dans `/admin` › « Sauvegardes de la base ».

Une tâche planifiée Railway appelle aussi le site toutes les 30 minutes (rappels + sauvegarde, même si le site était en veille) :
- service `cron` : une *Railway Function* (Bun) qui fait `POST https://$SITE/api/cron/tick` avec l'en-tête `x-cron-key: $CRON_KEY` ;
- variables du service `cron` : `CRON_KEY = ${{grand-livre-bts-cg.CRON_KEY}}`, `SITE = ${{grand-livre-bts-cg.RAILWAY_PUBLIC_DOMAIN}}` ;
- variable du site : `CRON_KEY` (longue chaîne au hasard) ;
- Cron Schedule `*/30 * * * *`, redémarrage : jamais.

Pense aussi à activer les sauvegardes de la base PostgreSQL : service Postgres › **Backups** (si ton offre Railway le propose).

## Statistiques
`/admin` › « Statistiques de la classe » : élèves actifs, réussite par matière et questions les plus ratées. `build/build_public.py` génère `src/qmap.json` (texte des questions) avec Playwright.

## Mettre à jour le contenu
`python3 build/build_public.py "Grand Livre BTS CG.html"` (fichier source gardé hors du dépôt : il contient des éléments personnels) régénère `public/app.html` à partir de la version Claude du Grand Livre (retire les contenus personnels, ajoute la connexion).

## Tests

`npm test` lance les tests automatiques (dossier `test/`). Chaque fichier démarre un vrai serveur avec un stockage fichier temporaire : pas besoin de PostgreSQL ni de variables d'environnement. Ils vérifient les comptes (inscription, connexion, mot de passe, suppression), la progression (refus d'une copie plus pauvre, restauration), les duels et les amis, GL Admin et la tâche planifiée. GitHub lance aussi ces tests à chaque envoi.
