const CACHE_NAME = "missao-musica-v27";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./jogador.html",
  "./regras.html",
  "./categorias.html",
  "./missao.html",

  "./style.css",

  "./app.js",
  "./jogador.js",
  "./regras.js",
  "./categorias.js",
  "./missao.js",
  "./sounds.js",

  "./manifest.webmanifest",

  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",

  "./audio/button-click.mp3"
];


/*
  Guarda os ficheiros essenciais para utilização offline.
*/

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});


/*
  Remove versões antigas da cache.
*/

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return cacheName !== CACHE_NAME;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );

  self.clients.claim();
});


/*
  MISSIONS.JSON

  Tenta sempre obter primeiro a versão mais recente.
  Se estiver offline, utiliza a versão guardada.
*/

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  const requestURL = new URL(event.request.url);

  if (requestURL.pathname.endsWith("/missions.json")) {
    event.respondWith(
      fetch(event.request)
        .then(function (networkResponse) {

          const responseCopy =
            networkResponse.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(
              event.request,
              responseCopy
            );
          });

          return networkResponse;
        })
        .catch(function () {
          return caches.match(event.request);
        })
    );

    return;
  }


  /*
    RESTANTES FICHEIROS

    Usa primeiro a cache.
  */

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});