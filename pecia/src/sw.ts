//These lines enable typescript to recognize that we're in SW scope, not Window scope
//This is needed as SW events are different from window events (eg extendable)
export type {};
declare const self: ServiceWorkerGlobalScope;

// This represents an application version.
// If we change our application we can simply amend this string and the
// application will update the cache to the latest version of the app.
// UI can be added around this, but not needed for the prototype.
const CACHE = 'pecia-v1';

//add the base scripts
self.addEventListener('install', (e) => {
    const urlsToCache = ['/', '/docs'];
    e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(urlsToCache)));
});

//A Service Worker becomes active when all pages depending on the old SW are removed.
//Once our new SW is active we can clear any stale caches.
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            const staleCaches = keys.filter((k) => k !== CACHE);
            return Promise.all(
                staleCaches.map((cache) => caches.delete(cache))
            );
        })
    );
});

//Our main goal, is to use the cache to serve the app if possible.
//Since our paths are /edit/foo we'll cache the scripts we need on demand.
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) return response;
            caches.open(CACHE).then((cache) => cache.add(e.request));
            return fetch(e.request);
        })
    );
});
