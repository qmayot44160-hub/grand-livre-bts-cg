"""Construit public/app.html (version partagée sur Railway) à partir du Grand Livre de Claude.
Usage : python3 build/build_public.py "chemin/vers/Grand Livre BTS CG.html"
- injecte le module de connexion (shim.js) qui remplace les fonctions de Claude par le serveur ;
- retire les contenus personnels (partie « Ton E8 chez … » et prénom de l'auteur) ;
- ajoute de quoi installer le site comme une appli (manifeste, service worker)."""
import sys, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1]
s = open(src, encoding="utf-8").read()

# 1. Contenus personnels
s = re.sub(r'\n?<script id="gl-perso">.*?</script>', "", s, flags=re.S)  # cours personnels : version privée seulement
s = s.replace("Quentin", "Alex")
import json
dec = json.JSONDecoder()
def edit_const(src, name, fn):
    k = "const " + name + " = "
    i = src.index(k) + len(k)
    v, e = dec.raw_decode(src[i:])
    return src[:i] + json.dumps(fn(v), ensure_ascii=False, separators=(",", ":")) + src[i + e:]
perso = lambda x: bool(re.match(r"or-m\d", str(x or "")))
s = edit_const(s, "IMP_THEMES", lambda v: [t for t in v if t.get("key") != "me:3"])
s = edit_const(s, "CHAP", lambda v: [c for c in v if not perso(c.get("id"))])
s = edit_const(s, "GCASES", lambda v: [c for c in v if not perso(c.get("ch"))])
s = edit_const(s, "REFS", lambda v: [r for r in v if not perso(r[2] if len(r) > 2 else "")])
s = edit_const(s, "QIMP", lambda v: [q for q in v if not perso(q[4] if len(q) > 4 else "")])
s = edit_const(s, "FIMP", lambda v: [q for q in v if not perso(q[4] if len(q) > 4 else "")])
leftover = s.count("MAMI")
assert leftover == 0, "mention personnelle restante : MAMI x%d" % leftover
s = s.replace("Elle fonctionne quand l'appli est ouverte depuis Claude, connecté à ton compte.",
              "La correction automatique n'est pas activée sur ce site.")

# Sans correction automatique sur le site : on renvoie vers les corrigés officiels
for a, b in [
    ("puis envoie ta copie à Claude : il te dit ce qui est juste et ce que tu dois revoir.",
     "puis compare ta copie au corrigé officiel (lien sur chaque sujet)."),
    ("Envoie ta copie à Claude pour savoir quoi revoir.", "Compare ta copie au corrigé pour savoir quoi revoir."),
    ("sujets de 2021 à 2026, corrigés par Claude.", "sujets de 2021 à 2026, avec leurs corrigés."),
]:
    s = s.replace(a, b)

# Sur le site, la correction automatique n'est pas présentée sous le nom de l'outil qui la fait
for a, b in [
    ("La correction par Claude n'est pas disponible dans cette vue.", "La correction automatique n'est pas disponible dans cette vue."),
    ("Claude lit ta copie et la compare aux attendus", "Ta copie est comparée aux attendus"),
    ("Correction par Claude indisponible ici.", "Correction automatique indisponible ici."),
    ("Correction de Claude", "Correction automatique"),
    ("Sans l'énoncé ni le corrigé, Claude ne voit pas les annexes : il juge surtout ta méthode.", "Sans l'énoncé ni le corrigé, la correction ne voit pas les annexes : elle juge surtout ta méthode."),
    ("Claude n'a pas pu corriger ce contenu.", "Ce contenu n'a pas pu être corrigé."),
    ("Ta session Claude a expiré", "Ta session a expiré"),
    ("l'appli à utiliser Claude.", "l'appli à utiliser la correction automatique."),
    ("Corriger ma copie avec Claude", "Faire corriger ma copie"),
    ("ou ta limite d'usage Claude est atteinte", "ou la limite d'usage est atteinte"),
]:
    s = s.replace(a, b)

# 2. Tête de page : manifeste et icônes pour l'installation
head_add = ('<meta name="theme-color" content="#1E3A5F"><link rel="manifest" href="/manifest.webmanifest">'
            '<link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png">'
            '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Grand Livre">')
assert "</head>" in s
s = s.replace("</head>", head_add + "</head>", 1)

# 3. Module de connexion, avant tout le code de l'appli
shim = open(os.path.join(HERE, "shim.js"), encoding="utf-8").read()
i = s.index("<body>") + len("<body>")
s = s[:i] + "<script>" + shim + "</script>" + s[i:]

# 4. Service worker (mise à jour automatique + hors ligne)
s = s.replace("</body>", '<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(function(){});</script><script src="/install.js"></script></body>', 1)

out = os.path.join(HERE, "..", "public", "app.html")
open(out, "w", encoding="utf-8").write(s)

# 5. Carte des questions pour les statistiques de l'admin (facultatif : nécessite Playwright)
import subprocess
qm = os.path.join(HERE, "..", "src", "qmap.json")
subprocess.run(["node", os.path.join(os.path.dirname(os.path.abspath(__file__)), "qmap.js"), src, qm], env=dict(os.environ, NODE_PATH=subprocess.run(["npm", "root", "-g"], capture_output=True, text=True).stdout.strip()))
if os.path.exists(qm): assert "MAMI" not in open(qm, encoding="utf-8").read(), "contenu personnel dans qmap.json"
mt = os.path.join(HERE, "..", "src", "meta.json")
if os.path.exists(mt): assert "MAMI" not in open(mt, encoding="utf-8").read(), "contenu personnel dans meta.json"
print("app.html :", len(s), "octets ; mentions personnelles restantes hors partie retirée :", leftover)
