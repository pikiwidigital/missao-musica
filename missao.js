const missionLoading =
  document.getElementById("mission-loading");

const missionCard =
  document.getElementById("mission-card");

const missionCategorySymbol =
  document.getElementById("mission-category-symbol");

const missionChallenge =
  document.getElementById("mission-challenge");

const missionImage =
  document.getElementById("mission-image");


/*
  Áudio da missão.
*/

const missionAudioContainer =
  document.getElementById("mission-audio-container");

const missionAudioButton =
  document.getElementById("mission-audio-button");

const missionAudioIcon =
  document.getElementById("mission-audio-icon");

const missionAudio =
  document.getElementById("mission-audio");


/*
  Ajuda.
*/

const helpButton =
  document.getElementById("help-button");

const helpPanel =
  document.getElementById("help-panel");

const helpText =
  document.getElementById("help-text");

const helpImage =
  document.getElementById("help-image");

const helpAudio =
  document.getElementById("help-audio");

const helpVideo =
  document.getElementById("help-video");

const closeHelpButton =
  document.getElementById("close-help-button");


/*
  Botões e mensagens.
*/

const completeButton =
  document.getElementById("complete-button");

const newMissionButton =
  document.getElementById("new-mission-button");

const missionMessage =
  document.getElementById("mission-message");

const currentPlayerMessage =
  document.getElementById("current-player-message");


/*
  Símbolos das categorias.
*/

const categorySymbols = {
  notas: "♫",
  ritmo: "👏",
  instrumentos: "🎻",
  audicao: "👂",
  movimento: "🕺"
};


/*
  Jogadores.
*/

const players =
  JSON.parse(localStorage.getItem("players")) || [];

let currentPlayerIndex =
  Number(localStorage.getItem("currentPlayerIndex")) || 0;


/*
  Garante que o índice do jogador é válido.
*/

if (
  players.length > 0 &&
  currentPlayerIndex >= players.length
) {
  currentPlayerIndex = 0;

  localStorage.setItem(
    "currentPlayerIndex",
    "0"
  );
}


const currentPlayer =
  players[currentPlayerIndex];


/*
  Mostra o nome do jogador atual.
*/

if (currentPlayerMessage) {
  if (currentPlayer) {
    currentPlayerMessage.textContent =
      `Missão de ${currentPlayer.name}`;
  } else {
    currentPlayerMessage.textContent =
      "A tua missão";
  }
}


let allMissions = [];
let availableMissions = [];
let currentMission = null;


/*
  Mostra uma imagem apenas quando existe.
*/

function showImageIfAvailable(
  imageElement,
  imagePath,
  altText
) {
  if (!imagePath) {
    imageElement.hidden = true;
    imageElement.removeAttribute("src");
    imageElement.alt = "";
    return;
  }

  imageElement.onload = function () {
    imageElement.hidden = false;
  };

  imageElement.onerror = function () {
    imageElement.hidden = true;
    imageElement.removeAttribute("src");
  };

  imageElement.src = imagePath;
  imageElement.alt = altText;
}


/*
  Prepara áudio ou vídeo da ajuda.
*/

function prepareMedia(
  mediaElement,
  mediaPath
) {
  mediaElement.pause();

  if (!mediaPath) {
    mediaElement.hidden = true;
    mediaElement.removeAttribute("src");
    mediaElement.load();
    return;
  }

  mediaElement.src = mediaPath;
  mediaElement.hidden = false;
  mediaElement.load();
}


/*
  Prepara o áudio principal da missão.

  O botão só aparece quando existe um ficheiro
  indicado em missionAudio.
*/

function prepareMissionAudio(audioPath) {
  missionAudio.pause();
  missionAudio.currentTime = 0;

  missionAudioButton.classList.remove("playing");
  missionAudioIcon.textContent = "🔊";

  if (!audioPath) {
    missionAudioContainer.hidden = true;
    missionAudio.removeAttribute("src");
    missionAudio.load();
    return;
  }

  missionAudio.src = audioPath;
  missionAudioContainer.hidden = false;
  missionAudio.load();

  missionAudioButton.setAttribute(
    "aria-label",
    "Ouvir som da missão"
  );
}


/*
  Escolhe uma missão aleatória.
*/

function chooseRandomMission() {
  if (availableMissions.length === 0) {
    missionLoading.hidden = false;

    missionLoading.textContent =
      "Ainda não existem missões nesta categoria.";

    missionCard.hidden = true;
    return;
  }

  const randomIndex =
    Math.floor(
      Math.random() * availableMissions.length
    );

  currentMission =
    availableMissions[randomIndex];

  displayMission(currentMission);
}


/*
  Mostra a missão no ecrã.
*/

function displayMission(mission) {
  missionLoading.hidden = true;
  missionCard.hidden = false;

  missionCategorySymbol.textContent =
    categorySymbols[mission.category] || "♪";

  missionChallenge.textContent =
    mission.challenge;

  showImageIfAvailable(
    missionImage,
    mission.missionImage,
    "Imagem necessária para realizar a missão."
  );

  prepareMissionAudio(
    mission.missionAudio
  );

  helpText.textContent =
    mission.helpText ||
    "Esta missão não tem ajuda disponível.";

  showImageIfAvailable(
    helpImage,
    mission.helpImage,
    "Imagem de ajuda para realizar a missão."
  );

  prepareMedia(
    helpAudio,
    mission.helpAudio
  );

  prepareMedia(
    helpVideo,
    mission.helpVideo
  );

  helpPanel.hidden = true;

  helpButton.setAttribute(
    "aria-expanded",
    "false"
  );

  helpButton.disabled = false;
  completeButton.disabled = false;

  missionMessage.textContent = "";

  completeButton.textContent =
    "Missão cumprida";

  newMissionButton.textContent =
    "Escolher outra missão";
}


/*
  Reproduz ou pausa o áudio da missão.
*/

missionAudioButton.addEventListener(
  "click",
  async function () {
    try {
      if (missionAudio.paused) {
        missionAudio.currentTime = 0;

        await missionAudio.play();

        missionAudioButton.classList.add("playing");

        missionAudioIcon.textContent = "⏸";

        missionAudioButton.setAttribute(
          "aria-label",
          "Pausar som da missão"
        );
      } else {
        missionAudio.pause();

        missionAudioButton.classList.remove("playing");

        missionAudioIcon.textContent = "🔊";

        missionAudioButton.setAttribute(
          "aria-label",
          "Ouvir som da missão"
        );
      }
    } catch (error) {
      console.error(
        "Não foi possível reproduzir o áudio:",
        error
      );
    }
  }
);


/*
  Quando o áudio termina, repõe o botão.
*/

missionAudio.addEventListener(
  "ended",
  function () {
    missionAudioButton.classList.remove("playing");

    missionAudioIcon.textContent = "🔊";

    missionAudioButton.setAttribute(
      "aria-label",
      "Ouvir novamente o som da missão"
    );
  }
);


/*
  Abre a ajuda.
*/

helpButton.addEventListener(
  "click",
  function () {
    helpPanel.hidden = false;

    helpButton.setAttribute(
      "aria-expanded",
      "true"
    );
  }
);


/*
  Fecha a ajuda.
*/

closeHelpButton.addEventListener(
  "click",
  function () {
    helpPanel.hidden = true;

    helpButton.setAttribute(
      "aria-expanded",
      "false"
    );

    helpButton.focus();
  }
);


/*
  Confirma que a missão foi cumprida.
*/

completeButton.addEventListener(
  "click",
  function () {
    missionAudio.pause();

    missionAudioButton.classList.remove("playing");

    missionAudioIcon.textContent = "🔊";

    if (currentPlayer) {
      missionMessage.textContent =
        `Muito bem, ${currentPlayer.name}! Missão cumprida!`;
    } else {
      missionMessage.textContent =
        "Muito bem! Missão cumprida!";
    }

    completeButton.disabled = true;
    helpButton.disabled = true;

    if (players.length <= 1) {
      newMissionButton.textContent =
        "Nova missão";
    } else {
      newMissionButton.textContent =
        "Jogador seguinte";
    }
  }
);


/*
  Antes de concluir:
  escolhe outra missão da mesma categoria.

  Depois de concluir:
  regressa às categorias.

  Com vários jogadores:
  avança primeiro para o jogador seguinte.
*/

newMissionButton.addEventListener(
  "click",
  function () {
    missionAudio.pause();

    /*
      A missão ainda não foi concluída.
      Escolhe outra missão da mesma categoria.
    */

    if (!completeButton.disabled) {
      chooseRandomMission();
      return;
    }

    /*
      A missão foi concluída.
      Com vários jogadores, muda o turno.
    */

    if (players.length > 1) {
      currentPlayerIndex =
        (currentPlayerIndex + 1) % players.length;

      localStorage.setItem(
        "currentPlayerIndex",
        String(currentPlayerIndex)
      );
    }

    window.location.href =
      "categorias.html";
  }
);


/*
  Carrega as missões do ficheiro missions.json.
*/

async function loadMissions() {
  try {
    const response =
      await fetch("missions.json");

    if (!response.ok) {
      throw new Error(
        `Erro ao carregar missões: ${response.status}`
      );
    }

    allMissions =
      await response.json();

    const selectedCategory =
      localStorage.getItem("selectedCategory");

    availableMissions =
      allMissions.filter(function (mission) {
        return mission.category === selectedCategory;
      });

    chooseRandomMission();

  } catch (error) {
    console.error(error);

    missionLoading.hidden = false;

    missionLoading.textContent =
      "Não foi possível carregar a missão.";

    missionCard.hidden = true;
  }
}


loadMissions();