const CACHE_NAME = 'finanzas-pro-v3';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './icon.png',
    './manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force the waiting service worker to become the active service worker
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim()) // Become available to all pages
    );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    // Strategy: Cache First, then Network
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
