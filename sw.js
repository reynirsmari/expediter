// Service worker: keeps the app working offline once installed.
// The page itself is fetched from the network first, so a new version shows
// up as soon as the app is opened with internet; the cached copy is only used
// offline. Other files are served from the cache and refreshed in the background.
// Bump CACHE when the list of files changes.
const CACHE = "expediter-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./react.min.js",
  "./react-dom.min.js",
  "./babel.min.js",
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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isPage =
    req.mode === "navigate" ||
    (url.origin === self.location.origin && /\/(index\.html)?$/.test(url.pathname));

  if (isPage) {
    // Network first, cached copy when offline
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        fetchFresh(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() =>
            cache.match(req, { ignoreSearch: true })
              .then((cached) => cached || cache.match("./index.html"))
          )
      )
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
