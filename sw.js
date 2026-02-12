const CACHE_NAME = 'dbd-v1.2.2';
const ASSETS = [
    './',
    './index.html',
    './lang.js',
    './heroes.js',
    './bonding.js',
    './sound.js',
    './sprites.js',
    './engine.js',
    './blessings.js',
    './weapons.js',
    './systems.js',
    './game.js',
    './renderer.js',
    './postfx.js',
    './hud.js',
    './evolution.js',
    './achievements.js',
    './daily.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch — cache-first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((response) => {
                // Cache new requests dynamically
                if (response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(() => {
                // Offline fallback — return cache or nothing
                return caches.match('./index.html');
            });
        })
    );
});
