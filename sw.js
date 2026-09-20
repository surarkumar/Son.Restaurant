const CACHE_NAME = 'sone-billing-v2';

// Install event
self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    // Take control of all open pages immediately
    event.waitUntil(clients.claim());
});

// Fetch event with Network-First strategy for Auto-Updates
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Agar internet chal raha hai (GitHub se fresh code mila), toh usko naye cache me save karlo
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Agar offline hai, toh purana save kiya hua cache dikhao
                return caches.match(event.request);
            })
    );
});
