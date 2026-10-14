/* Service worker du Grand Livre : toujours la dernière version en ligne, copie de secours hors connexion. */
const CACHE = "grand-livre-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname === "/admin") return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || new Response("Hors connexion : reconnecte-toi à Internet pour ouvrir le Grand Livre.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })))
  );
});
