const cacheName = "appV1";
const cacheFiles = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/O.chunk.js',
  '/static/js/bundle.js',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
