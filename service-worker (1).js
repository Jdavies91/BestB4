var dataCacheName = "BestB4-d-t20";
var cacheName = "BestB4-c-t20";
var filesToCache = [
  "/",
  "/app.html",
  "/js/app.js",
  "/styles/style.css",
  "/images/best_b4_white.png",
  "/Icons/Carbs.png",
  "/Icons/Dairy.png",
  "/Icons/Fruits.png",
  "/Icons/Proteins.png",
  "/Icons/Sweets.png",
  "/Icons/Veggies.png",
  "/images/notification.png"
];

self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");  
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log("[ServiceWorker] Removing old cache", key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener("fetch", function(e) {
  console.log("[ServiceWorker] Fetch", e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
