// Only cache versioned public assets. Never persist authenticated routes or API data.
const CACHE_NAME = "zertainity-public-static-v2";
const SHELL = ["/index.html", "/favicon.svg", "/logo.svg"];
const MAX_CACHED_ENTRIES = 90;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(async (cache) => {
    await Promise.allSettled(SHELL.map((path) => cache.add(path)));
    await self.skipWaiting();
  }));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith("zertainity-") && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    // Never cache individual routes: students may be using shared devices.
    event.respondWith(fetch(req).catch(async () => (await caches.match("/index.html")) ?? Response.error()));
    return;
  }
  // Immutable Vite chunks and shipped fonts are safe to reuse; everything else
  // (including robots, sitemap, HTML, service worker and unknown file paths) goes to network.
  const isVersionedChunk = /^\/assets\\/[^/]+\\.[a-f0-9]{8,}\\.(?:js|css|woff2?|png|webp|svg)$/.test(url.pathname) ||
    /^\/assets\\/[^/]+-[a-zA-Z0-9_-]{8,}\\.(?:js|css|woff2?|png|webp|svg)$/.test(url.pathname);
  const isShippedFont = url.pathname.startsWith("/fonts/") && /\\.woff2?$/.test(url.pathname);
  if (!isVersionedChunk && !isShippedFont) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(req);
    if (hit) return hit;
    const response = await fetch(req);
    if (response.ok && response.type === "basic") {
      await cache.put(req, response.clone());
      const keys = await cache.keys();
      if (keys.length > MAX_CACHED_ENTRIES) await cache.delete(keys[0]);
    }
    return response;
  })());
});
