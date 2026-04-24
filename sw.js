const CACHE_NAME = 'finanzas-pro-v12';
const ASSETS = [
    './',
    './index.html',
    './styles.css?v=12',
    './app.js?v=12',
    './chatbot_knowledge.js',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    // Network First strategy
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
