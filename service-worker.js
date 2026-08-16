const CACHE_NAME = "missao-musica-v26";

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

  "./missions.json",
  "./manifest.webmanifest",

  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",

  "./audio/button-click.mp3"
];
/*
  Guarda os ficheiros essenciais quando a aplicação
  é aberta pela primeira vez.
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
  Remove versões antigas da cache quando atualizamos a aplicação.
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
  Procura primeiro o ficheiro guardado.
  Se não estiver disponível, tenta obtê-lo através da internet.
*/
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});