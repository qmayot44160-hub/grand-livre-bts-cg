# Reconstruit une source éditable à partir de public/app.html et public/c/*.js
import re, os, sys
R = '/home/claude/grand-livre-bts-cg'
s = open(R + '/public/app.html', encoding='utf-8').read()
cd = R + '/public/c/'
# loader -> scripts en ligne
mc = re.search(r'<script id="gl-content"([^>]*) data-src="/c/(contenu-[0-9a-f]{12}\.js)"></script>', s)
ml = re.search(r'<script>\(function\(\)\{var q=\[document.getElementById\("gl-content"\).*?q\.push\("/c/(moteur-[0-9a-f]{12}\.js)"\);.*?</script>', s, re.S)
con = open(cd + mc.group(2), encoding='utf-8').read(); mot = open(cd + ml.group(1), encoding='utf-8').read()
s = s[:ml.start()] + '<script>' + mot + '</script>' + s[ml.end():]
s = s[:mc.start()] + '<script id="gl-content"%s>' % mc.group(1) + con + '</script>' + s[mc.end():]
# preload
s = re.sub(r'<link rel="preload" as="script" href="/c/[^"]+">', '', s)
# head_add
ha = ('<meta name="theme-color" content="#1E3A5F"><link rel="manifest" href="/manifest.webmanifest">'
      '<link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/icon-b-192.png" type="image/png" sizes="192x192"><link rel="apple-touch-icon" href="/apple-touch-icon.png">'
      '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Grand Livre">')
assert s.count(ha) == 1; s = s.replace(ha, '')
# boot + shim
boot = open(R + '/build/boot.html', encoding='utf-8').read().strip(); shim = open(R + '/build/shim.js', encoding='utf-8').read()
x = '<body>' + boot + '<script>' + shim + '</script>'
assert s.count(x) == 1, 'boot/shim'; s = s.replace(x, '<body>')
# SW
i = s.index('<script>if("serviceWorker" in navigator)'); j = s.index('<script src="/install.js"></script></body>') 
s = s[:i] + '</body>' + s[j + len('<script src="/install.js"></script></body>'):]
open(sys.argv[1], 'w', encoding='utf-8').write(s)
print(len(s))
