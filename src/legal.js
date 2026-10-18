// Pages légales du Grand Livre : mentions légales + conditions d'utilisation, et politique de confidentialité.
// Le contact vient de la variable CONTACT_EMAIL (Railway) : rien de personnel n'est écrit dans le code.
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const UPDATED = "17 octobre 2026";

function page(title, body) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Grand Livre BTS CG</title><meta name="theme-color" content="#1E3A5F"><link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&family=Source+Serif+4:opsz,wght@8..60,600&display=swap">
<script>try{var t=localStorage.getItem("gl-theme")||"light";if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>
<style>
:root{--paper:#F5F7FA;--sheet:#FFFFFF;--ink:#18202B;--muted:#59657A;--rule:#D6DCE4;--accent:#1E3A5F;color-scheme:light}
:root[data-theme="dark"]{--paper:#121821;--sheet:#1A2230;--ink:#E6EBF2;--muted:#9AA6B8;--rule:#2B3546;--accent:#9DB8DC;color-scheme:dark}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#121821;--sheet:#1A2230;--ink:#E6EBF2;--muted:#9AA6B8;--rule:#2B3546;--accent:#9DB8DC;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 "Source Sans 3","Segoe UI",system-ui,-apple-system,sans-serif}
main{max-width:760px;margin:0 auto;padding:24px 16px 64px}
a{color:var(--accent)}h1,h2{font-family:"Source Serif 4",Georgia,serif;font-weight:600;line-height:1.2}h1{font-size:1.9375rem;margin:8px 0 4px}h2{font-size:1.25rem;margin:32px 0 8px}
.back{display:inline-flex;align-items:center;gap:6px;font-weight:600;text-decoration:none;padding:8px 0}
.card{background:var(--sheet);border:1px solid var(--rule);border-radius:8px;padding:8px 24px 24px;margin-top:16px}
.muted{color:var(--muted)}ul{padding-left:20px}li{margin:4px 0}
nav.links{display:flex;flex-wrap:wrap;gap:16px;margin-top:20px;font-size:.92rem}
</style></head><body><main>
<a class="back" href="/">Retour au Grand Livre</a>
${body}
<nav class="links" aria-label="Pages légales"><a href="/mentions-legales">Mentions légales et conditions d'utilisation</a><a href="/confidentialite">Confidentialité</a></nav>
</main></body></html>`;
}

function contactLine(contact) {
  return contact
    ? `par e-mail à <a href="mailto:${esc(contact)}">${esc(contact)}</a>`
    : `par l'intermédiaire de la personne qui t'a partagé le Grand Livre`;
}

exports.mentions = ({ contact }) => page("Mentions légales", `
<h1>Mentions légales et conditions d'utilisation</h1>
<p class="muted">Mise à jour : ${UPDATED}</p>
<div class="card">
<h2>Éditeur du site</h2>
<p>Le Grand Livre BTS CG est un site personnel, gratuit et non commercial, édité par un particulier, étudiant en BTS Comptabilité et gestion, pour réviser avec ses camarades. Conformément à l'article 6, III, 2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, l'éditeur non professionnel a choisi de ne pas rendre public son nom : ses coordonnées ont été communiquées à l'hébergeur.</p>
<p>Contact et directeur de la publication : l'éditeur, joignable ${contactLine(contact)}.</p>
<h2>Hébergeur</h2>
<p>Railway Corporation, 548 Market St Suite 68956, San Francisco, CA 94104, États-Unis. Contact : <a href="mailto:team@railway.com">team@railway.com</a>.</p>
<h2>Conditions d'utilisation</h2>
<ul>
<li><b>Objet.</b> Le Grand Livre propose des leçons, fiches, quiz, flashcards et exercices pour préparer le BTS Comptabilité et gestion. Son utilisation est gratuite.</li>
<li><b>Compte.</b> Ton compte est personnel. Choisis un mot de passe que tu n'utilises pas ailleurs et ne le partage pas. Tu peux supprimer ton compte à tout moment depuis « Mon profil ».</li>
<li><b>Contenu.</b> Les contenus sont rédigés à partir de cours d'étudiant et du programme officiel. Ils peuvent contenir des erreurs ou ne plus être à jour (taux, seuils, textes de loi) : ils ne remplacent ni les cours de tes enseignants, ni les textes officiels. Si tu repères une erreur, signale-la à l'éditeur.</li>
<li><b>Sujets d'examen.</b> Les sujets et corrigés officiels restent la propriété de leurs auteurs ; le site renvoie vers les sites qui les publient.</li>
<li><b>Correction automatique.</b> Lorsqu'elle est proposée, la correction de copie par intelligence artificielle donne une indication, qui peut se tromper. Elle ne vaut pas note officielle.</li>
<li><b>Bon usage.</b> Il est interdit de perturber le service (envois automatisés, tentative d'accès aux comptes des autres). L'éditeur peut suspendre un compte qui ne respecte pas ces règles.</li>
<li><b>Disponibilité.</b> Le site est fourni tel quel, sans garantie de disponibilité permanente. L'éditeur peut le faire évoluer ou l'arrêter ; pense à exporter ta progression de temps en temps (« Mon profil » › « Sauvegarde »).</li>
<li><b>Modification.</b> Ces conditions peuvent évoluer ; la date de mise à jour figure en haut de cette page.</li>
</ul>
<p>Données personnelles : voir la <a href="/confidentialite">politique de confidentialité</a>.</p>
</div>`);

exports.privacy = ({ contact, ai }) => page("Confidentialité", `
<h1>Politique de confidentialité</h1>
<p class="muted">Mise à jour : ${UPDATED}</p>
<div class="card">
<h2>En bref</h2>
<p>Le Grand Livre garde seulement ce qu'il faut pour que tu retrouves ta progression : ton nom d'utilisateur, ton mot de passe chiffré et ta progression. Aucune publicité, aucun outil de mesure d'audience, aucune revente de données.</p>
<h2>Responsable du traitement</h2>
<p>L'éditeur du site (voir les <a href="/mentions-legales">mentions légales</a>), joignable ${contactLine(contact)}.</p>
<h2>Données collectées et pourquoi</h2>
<ul>
<li><b>Ton compte</b> : le nom que tu choisis et ton mot de passe, enregistré uniquement sous forme chiffrée (bcrypt) : personne ne peut le lire. But : te connecter. Base légale : l'exécution du service que tu demandes.</li>
<li><b>Ta progression</b> : réponses aux quiz, cartes, leçons lues, exercices, XP et réglages. But : te les rendre sur tous tes appareils. Base légale : l'exécution du service.</li>
<li><b>Le classement de la classe</b>, si tu le rejoins : ton pseudo, le nombre de questions acquises et de jours de révision de la semaine, et ton score au défi sont visibles par les autres participants. Base légale : ton consentement, que tu retires en quittant le classement.</li>
<li><b>Les amis</b>, si tu en ajoutes : chaque ami que tu acceptes voit ton pseudo, ton niveau, tes XP, ta série, tes questions acquises, tes jours de révision et tes matières fortes et faibles, jamais tes réponses ni tes erreurs. Base légale : ton consentement, que tu retires en retirant cet ami. Dans une salle « Réviser ensemble », les participants voient ton pseudo et la réponse que tu as choisie ; la salle n'est gardée qu'en mémoire et disparaît au plus tard 3 heures après la dernière activité.</li>
<li><b>Les demandes d'enseignants</b>, si vous utilisez le formulaire de la page d'accueil : votre nom, votre établissement, votre adresse e-mail et votre message, uniquement pour vous répondre. Ils sont supprimés à votre demande ou au plus tard un an après le dernier échange. Base légale : votre demande.</li>
<li><b>Ta classe</b>, si tu en rejoins une avec un code : le nom de la classe est associé à ton compte, pour que la progression soit suivie par groupe. Base légale : ton consentement, que tu retires en quittant la classe (« Mon profil » › « Compte » › « Ma classe »).</li>
<li><b>Les duels</b>, si tu en joues : ton pseudo du classement (ou à défaut le premier mot de ton nom d'utilisateur), tes réponses justes ou fausses et ton temps sont visibles par ton adversaire. Les duels sont effacés au bout de 30 jours. Base légale : l'exécution du service que tu demandes.</li>
<li><b>Les rappels</b>, si tu les actives : l'adresse technique d'abonnement fournie par ton navigateur et l'heure choisie. But : t'envoyer un rappel par jour. Base légale : ton consentement, que tu retires en désactivant les rappels.</li>
${ai ? `<li><b>La correction de copie</b>, si tu l'utilises : le texte et les photos de ta copie sont envoyés à Anthropic (fournisseur de l'IA Claude, États-Unis) pour être corrigés. Le site ne les conserve pas ; seul le nombre de corrections du jour est compté pour limiter les abus. N'y mets pas d'informations personnelles.</li>` : ""}
<li><b>Sécurité</b> : ton adresse IP est utilisée quelques minutes, en mémoire, pour bloquer les essais de mot de passe en série. Quand l'appli rencontre un bug, un rapport technique (message d'erreur, page, type de navigateur, sans ton nom ni tes réponses) est envoyé au serveur et effacé à son redémarrage. Base légale : l'intérêt légitime d'assurer la sécurité et le bon fonctionnement du site.</li>
</ul>
<h2>Cookies et stockage sur ton appareil</h2>
<p>Le site utilise un seul cookie, <code>gl_s</code>, qui garde ta session ouverte. Il est indispensable au fonctionnement et dispensé de consentement (article 82 de la loi Informatique et Libertés). Le site enregistre aussi ta progression et tes préférences dans le stockage de ton navigateur, pour fonctionner hors connexion. Aucun traceur publicitaire ni de mesure d'audience : c'est pour cela qu'il n'y a pas de bandeau cookies.</p>
<h2>Destinataires et hébergement</h2>
<p>Seul l'éditeur a accès aux données, pour faire fonctionner le site et accompagner la classe : il peut voir ta progression (niveau, réussite par matière, activité) et suspendre un compte qui ne respecte pas les conditions d'utilisation. Elles sont hébergées par Railway Corporation (États-Unis), sur des serveurs situés à Amsterdam (Pays-Bas, Union européenne).${ai ? " Les copies envoyées à la correction passent par Anthropic, comme indiqué plus haut." : ""}</p>
<h2>Durée de conservation</h2>
<p>Tant que ton compte existe. Quand tu supprimes ton compte, ton nom, ton mot de passe chiffré, ta progression et tes rappels sont effacés immédiatement. Ils peuvent subsister au plus 7 jours dans les sauvegardes de sécurité de la base, qui sont ensuite écrasées. Les comptes inactifs depuis plus de deux ans pourront être supprimés.</p>
<h2>Tes droits</h2>
<ul>
<li><b>Accès et portabilité</b> : « Mon profil » › « Mon compte » › « Télécharger mes données ».</li>
<li><b>Effacement</b> : « Mon profil » › « Mon compte » › « Supprimer mon compte ».</li>
<li><b>Rectification</b> : ton prénom affiché se change dans les réglages ; pour le reste, contacte l'éditeur.</li>
<li><b>Opposition et limitation</b> : contacte l'éditeur ${contactLine(contact)}.</li>
</ul>
<p>Si tu estimes que tes droits ne sont pas respectés, tu peux adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>
</div>`);
