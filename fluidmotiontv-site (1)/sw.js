/* FluidMotion TV service worker — offline-first app shell.
   Pages: network-first (fresh content when online, cache when not).
   Same-origin assets & CDN libs: cache-first with background fill. */

const VERSION = "fluidmotion-v1";
const SHELL = [
  "./",
  "./index.html",
  "./shop.html",
  "./demos.html",
  "./hub.html",
  "./about.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/js/waves.js",
  "./assets/js/audio.js",
  "./assets/js/demos.js",
  "./assets/js/main.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/favicon-32.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // never cache payment flows or cross-origin non-CDN requests
  const isCDN =
    url.hostname === "cdnjs.cloudflare.com" ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !isCDN) return;

  // page navigations: network-first, fall back to cache, then offline shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match("./offline.html"))
        )
    );
    return;
  }

  // assets & CDN: cache-first, then network (and fill cache)
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(request, copy));
            }
            return res;
          })
          .catch(() => hit)
    )
  );
});
