// This name is for the "cache" - the folder where files are stored on your phone
const CACHE_NAME = 'darts-app-v1';

// This is the list of files to save (FIX: Absolute Paths)
const ASSETS_TO_CACHE = [
  '/Darts-Practice-App/index.html',
  '/Darts-Practice-App/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://placehold.co/192x192/facc15/111827?text=🎯',
  'https://placehold.co/512x512/facc15/111827?text=🎯'
];

// 1. When the app is "installed", save all the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. When the app makes a request (e.g., for a file or data),
//    try to get it from the cache first.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If we have it in the cache, send that.
      // If not, try to get it from the internet (and save it for next time).
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

// 3. Clean up old caches if we update the version
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
