// Racer #36 Service Worker
// Enables installability and a basic network-first cache so the app shell loads reliably.

const CACHE = 'racer36-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Only handle GET requests
  if (req.method !== 'GET') return;
  // Never cache Firebase / API / external calls — always go to network for those.
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for the page; fall back to cache when offline.
  event.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
  );
});
