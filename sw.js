const CACHE_NAME = "penalty-shootout-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./icon-192.png",
    "./icon-512.png"
];


// ================================
// INSTALL
// ================================
self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))

    );

    self.skipWaiting();
});


// ================================
// ACTIVATE
// ================================
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});


// ================================
// FETCH
// INTERNET FIRST
// ================================
self.addEventListener("fetch", event => {

    event.respondWith(

        fetch(event.request)

            .then(response => {

                // Simpan response terbaru ke cache
                if (response && response.status === 200) {

                    const responseClone = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });

                }

                return response;

            })

            .catch(() => {

                // Kalau internet gagal,
                // ambil dari cache
                return caches.match(event.request);

            })

    );

});