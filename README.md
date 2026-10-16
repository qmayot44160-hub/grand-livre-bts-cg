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

## Sauvegardes et tâche planifiée
Le serveur fait lui-même une copie complète de la base chaque jour (table `backups`, 7 dernières gardées), visible et téléchargeable dans `/admin` › « Sauvegardes de la base ».

Pour que les rappels et la sauvegarde tournent même quand le site est en veille, ajoute un service planifié :
1. Variables du service du site : `CRON_KEY` = une longue chaîne au hasard.
2. Dans le projet : **+ New → Empty Service**, nomme-le `cron`.
3. Variables du service `cron` (remplace `grand-livre-bts-cg` par le nom exact du service du site) :
   - `CRON_KEY = ${{grand-livre-bts-cg.CRON_KEY}}`
   - `SITE = ${{grand-livre-bts-cg.RAILWAY_PUBLIC_DOMAIN}}`
4. Dans ses **Settings** :
   - **Source → Connect Image** : `curlimages/curl:8.10.1`
   - **Deploy → Custom Start Command** :
     `sh -c 'curl -fsS -X POST -H "x-cron-key: $CRON_KEY" "https://$SITE/api/cron/tick"'`
   - **Deploy → Cron Schedule** : `*/30 * * * *` (toutes les 30 minutes, heure UTC)
5. **Deploy**. Dans `/admin`, la section Sauvegardes affiche « Tâche planifiée Railway branchée ».

Pense aussi à activer les sauvegardes de la base PostgreSQL : service Postgres › **Backups** (si ton offre Railway le propose).

## Statistiques
`/admin` › « Statistiques de la classe » : élèves actifs, réussite par matière et questions les plus ratées. `build/build_public.py` génère `src/qmap.json` (texte des questions) avec Playwright.

## Mettre à jour le contenu
`python3 build/build_public.py "Grand Livre BTS CG.html"` (fichier source gardé hors du dépôt : il contient des éléments personnels) régénère `public/app.html` à partir de la version Claude du Grand Livre (retire les contenus personnels, ajoute la connexion).
