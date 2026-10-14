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

# 2. Tête de page : manifeste et icônes pour l'installation
head_add = ('<meta name="theme-color" content="#2c43c6"><link rel="manifest" href="/manifest.webmanifest">'
            '<link rel="icon" href="/icon-192.png"><link rel="apple-touch-icon" href="/icon-192.png">'
            '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Grand Livre">')
assert "</head>" in s
s = s.replace("</head>", head_add + "</head>", 1)

# 3. Module de connexion, avant tout le code de l'appli
shim = open(os.path.join(HERE, "shim.js"), encoding="utf-8").read()
i = s.index("<body>") + len("<body>")
s = s[:i] + "<script>" + shim + "</script>" + s[i:]

# 4. Service worker (mise à jour automatique + hors ligne)
s = s.replace("</body>", '<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js").catch(function(){});</script></body>', 1)

out = os.path.join(HERE, "..", "public", "app.html")
open(out, "w", encoding="utf-8").write(s)
print("app.html :", len(s), "octets ; mentions personnelles restantes hors partie retirée :", leftover)
