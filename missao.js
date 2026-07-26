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

const completeButton =
  document.getElementById("complete-button");

const newMissionButton =
  document.getElementById("new-mission-button");

const missionMessage =
  document.getElementById("mission-message");

const currentPlayerMessage =
  document.getElementById("current-player-message");


const categorySymbols = {
  notas: "♫",
  ritmo: "👏",
  instrumentos: "🎻",
  audicao: "👂",
  movimento: "🕺"
};


const players =
  JSON.parse(localStorage.getItem("players")) || [];

let currentPlayerIndex =
  Number(localStorage.getItem("currentPlayerIndex")) || 0;


/*
  Garante que o índice do jogador é válido.
*/

if (currentPlayerIndex >= players.length) {
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
    return;
  }

  imageElement.onload = function () {
    imageElement.hidden = false;
  };

  imageElement.onerror = function () {
    imageElement.hidden = true;
  };

  imageElement.src = imagePath;
  imageElement.alt = altText;
}


/*
  Prepara áudio ou vídeo apenas quando existe.
*/

function prepareMedia(
  mediaElement,
  mediaPath
) {
  if (!mediaPath) {
    mediaElement.hidden = true;
    mediaElement.removeAttribute("src");
    return;
  }

  mediaElement.src = mediaPath;
  mediaElement.hidden = false;
}


/*
  Escolhe uma missão aleatória.
*/

function chooseRandomMission() {
  if (availableMissions.length === 0) {
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
  Com vários jogadores, avança primeiro para o jogador seguinte.
*/

newMissionButton.addEventListener(
  "click",
  function () {

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
      Com vários jogadores, muda para o jogador seguinte.
    */

    if (players.length > 1) {
      currentPlayerIndex =
        (currentPlayerIndex + 1) % players.length;

      localStorage.setItem(
        "currentPlayerIndex",
        String(currentPlayerIndex)
      );
    }


    /*
      Regressa às categorias:
      - 1 jogador: começa uma nova jogada;
      - vários jogadores: começa a jogada seguinte.
    */

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

    missionLoading.textContent =
      "Não foi possível carregar a missão.";
  }
}


loadMissions();