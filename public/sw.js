/**
 * KriblaSemsar — Service Worker (PWA Cache & Offline Strategy)
 * 
 * Strict Security Directive:
 * NEVER cache sensitive authentication tokens, private phone reveal responses,
 * verification documents, or OTP endpoints.
 */

const CACHE_NAME = 'kriblasemsar-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/logo.svg',
];

// Sensitive endpoint patterns that MUST NEVER be cached
const SENSITIVE_URL_PATTERNS = [
  '/auth/',
  'reveal_contact_info',
  'verification-documents',
  '/verify',
  '/otp',
  '/rest/v1/profiles',
  '/rest/v1/phone_verifications',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // 2. Strict Security: Never cache sensitive authentication, phone reveals, or verification APIs
  const isSensitive = SENSITIVE_URL_PATTERNS.some((pattern) => url.pathname.includes(pattern) || url.search.includes(pattern));
  if (isSensitive) {
    return; // Pass straight to network without caching
  }

  // 3. HTML Navigation requests: Network-first with offline.html fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match('/offline.html');
          return cachedResponse || new Response('Hors-ligne', { status: 503, headers: { 'Content-Type': 'text/plain' } });
        })
    );
    return;
  }

  // 4. Map Tiles (CARTO Voyager / OSM): Cache-first with network refresh
  if (url.hostname.includes('cartocdn.com') || url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedTile) => {
        if (cachedTile) {
          // Asynchronously refresh in background
          fetch(request).then((liveTile) => {
            if (liveTile.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, liveTile));
            }
          }).catch(() => {});
          return cachedTile;
        }

        return fetch(request).then((liveTile) => {
          if (liveTile.status === 200) {
            const clone = liveTile.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return liveTile;
        });
      })
    );
    return;
  }

  // 5. Static Assets (CSS, JS, Fonts): Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
