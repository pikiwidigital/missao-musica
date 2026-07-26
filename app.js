const startButton = document.getElementById("start-button");

startButton.addEventListener("click", function () {
  window.location.href = "jogador.html";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(function () {
        console.log("Service worker registado com sucesso.");
      })
      .catch(function (error) {
        console.error(
          "Não foi possível registar o service worker:",
          error
        );
      });
  });
}