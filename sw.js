const CACHE = 'timetrack-pro-v1';
const ASSETS = [
    './', './index.html', './css/style.css',
    './js/i18n.js', './js/data.js', './js/utils.js',
    './js/calculations.js', './js/worker.js', './js/admin.js',
    './js/modals.js', './js/auth.js', './js/tour.js'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
