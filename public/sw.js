/* Service worker du Grand Livre : la dernière version en ligne quand le réseau répond vite,
   sinon la copie gardée sur l'appareil (réseau lent ou hors connexion). */
const CACHE = "grand-livre-v5"; // sw 2026-10-30 : manifeste toujours relu en ligne (icône de l'appli à jour)
const SHELL = ["/manifest.webmanifest", "/icon-b-192.png", "/icon-b-512.png", "/install.js"];
const SLOW_MS = 3500;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

/* La page de l'appli désigne ses fichiers de contenu (/c/…) : on les met de côté avec elle, et on oublie les anciens. */
async function keepAssets(res) {
  try {
    const html = await res.text(), want = [...new Set(html.match(/\/c\/[a-z]+-[0-9a-f]{12}\.js/g) || [])]; if (!want.length) return;
    const c = await caches.open(CACHE);
    for (const u of want) { if (!(await c.match(u))) { const r = await fetch(u); if (r.ok) await c.put(u, r); } }
    for (const k of await c.keys()) { const p = new URL(k.url).pathname; if (p.startsWith("/c/") && !want.includes(p)) await c.delete(k); }
  } catch (e) {}
}
function save(req, res) {
  if (res && res.ok && res.type === "basic" && !/no-store/.test(res.headers.get("Cache-Control") || "")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
  return res;
}
const offline = () => new Response(
  "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Hors connexion</title>" +
  "<body style='font-family:system-ui;padding:32px;line-height:1.5;color:#1d2340'><h1>Hors connexion</h1><p>Le Grand Livre n'a pas encore été ouvert sur cet appareil avec Internet. Reconnecte-toi une fois : ensuite il marchera aussi hors connexion.</p>",
  { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;

  if (req.mode === "navigate") {
    /* Page de l'appli : réseau d'abord, mais pas plus de 3,5 s d'attente si une copie existe. */
    const key = new Request(url.origin + url.pathname);
    e.respondWith((async () => {
      const cached = await caches.match(key);
      const net = fetch(req).then(res => { save(key, res); if (res && res.ok && res.type === "basic") e.waitUntil(keepAssets(res.clone())); return res; });
      if (!cached) return net.catch(() => offline());
      const timer = new Promise(r => setTimeout(() => r(null), SLOW_MS));
      try { const res = await Promise.race([net, timer]); if (res) return res; } catch (err) { return cached; }
      /* Copie locale servie : si la version en ligne est plus récente, on prévient la page pour qu'elle propose de recharger. */
      e.waitUntil(net.then(res => {
        if (!res || !res.ok || res.headers.get("ETag") === cached.headers.get("ETag")) return;
        return new Promise(r => setTimeout(r, 1500)).then(() => self.clients.matchAll({ type: "window" })).then(list => list.forEach(c => c.postMessage({ type: "gl-update" })));
      }).catch(() => {}));
      return cached;
    })());
    return;
  }

  /* Manifeste : toujours la version en ligne quand le réseau répond, pour que le téléphone voie la nouvelle icône. */
  if (url.pathname === "/manifest.webmanifest") { e.respondWith(fetch(req).then(res => save(req, res)).catch(() => caches.match(req))); return; }

  /* Icônes et fichiers fixes : la copie locale tout de suite, mise à jour en arrière-plan. */
  e.respondWith(caches.match(req).then(cached => {
    const net = fetch(req).then(res => save(req, res));
    if (cached) { e.waitUntil(net.catch(() => {})); return cached; }
    return net.catch(() => new Response("", { status: 504 }));
  }));
});

/* Rappels quotidiens */
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Grand Livre", {
    body: d.body || "Ta séance du jour t'attend.", tag: d.tag || "gl-daily", renotify: false,
    icon: "/icon-b-192.png", badge: "/icon-b-192.png", data: { url: d.url || "/" }, lang: "fr"
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) if (new URL(c.url).origin === location.origin && "focus" in c) { const q = new URL(url, location.origin).searchParams.get("go"); if (q) c.postMessage({ type: "gl-go", view: q }); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
