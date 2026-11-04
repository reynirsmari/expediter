// Service worker: keeps the app working offline once installed.
// The app's own files are fetched from the network first, so a new version
// shows up as soon as the app is opened with internet; cached copies are only
// used offline. Fonts (other sites) are served from the cache and refreshed in
// the background. Bump CACHE when the list of files changes.
const CACHE = "expediter-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./react.min.js",
  "./react-dom.min.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Skip the browser's HTTP cache (GitHub Pages lets it keep files for 10 min)
const fetchFresh = (req) => fetch(req, { cache: "no-cache" });
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isPage = req.mode === "navigate";
  const isOwnFile = url.origin === self.location.origin;

  if (isPage || isOwnFile) {
    // Network first; the cached copy when offline, or when the network takes
    // longer than NETWORK_TIMEOUT_MS (weak restaurant Wi-Fi)
    event.respondWith(
      caches.open(CACHE).then((cache) => {
        const cachedCopy = () =>
          cache.match(req, { ignoreSearch: true })
            .then((cached) => cached || (isPage ? cache.match("./index.html") : undefined));
        const network = fetchFresh(req).then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        });
        event.waitUntil(network.catch(() => {}));
        const timeout = new Promise((resolve) =>
          setTimeout(() => cachedCopy().then((c) => c && resolve(c)), NETWORK_TIMEOUT_MS)
        );
        return Promise.race([network.catch(cachedCopy), timeout]);
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(req, { ignoreSearch: true }).then((cached) => {
        const network = fetchFresh(req)
          .then((res) => {
            if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        if (cached) {
          event.waitUntil(network);
          return cached;
        }
        return network;
      })
    )
  );
});
