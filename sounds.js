const buttonClickSound =
  new Audio("audio/button-click.mp3");

buttonClickSound.preload = "auto";

document.addEventListener("click", function (event) {
  const button =
    event.target.closest("button");

  if (!button || button.disabled) {
    return;
  }

  buttonClickSound.pause();
  buttonClickSound.currentTime = 0;

  buttonClickSound.play().catch(function () {
    // Ignora bloqueios temporários do navegador.
  });
});