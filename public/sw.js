// Service Worker for PWA support
const CACHE_NAME = 'fitpulse-cache-v3';

// Resources to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/fallback.html',
  '/icons/icon-72x72.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.svg',
  '/icons/icon-512x512.png',
  '/offline'
];

// Installation - Cache basic assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Error during service worker installation:', err);
      })
  );
  // Force this service worker to activate immediately
  self.skipWaiting();
});

// Show offline page when fetch fails and no cache exists
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle the fetch event
  event.respondWith(
    // Try the cache first
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return from cache if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache responses that aren't successful or are not from our origin
            if (!response || 
                response.status !== 200 || 
                response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response before caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(err => {
                console.error('Error caching response:', err);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed; returning offline page instead.', error);
            
            // If fetch fails (offline), try to show offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline')
                .then(offlineResponse => {
                  if (offlineResponse) {
                    return offlineResponse;
                  }
                  // If offline page isn't cached, try the fallback
                  return caches.match('/fallback.html');
                });
            }
            
            // Return an empty response for other resources
            return new Response('', {
              status: 408, // Request Timeout
              statusText: 'Network connection unavailable'
            });
          });
      })
  );
});

// Clean up old caches when new service worker activates
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting outdated cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated; now ready to handle fetches!');
        // Tell clients to update
        return self.clients.claim();
      })
      .catch(err => {
        console.error('Error during service worker activation:', err);
      })
  );
});
