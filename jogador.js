const playerForm =
  document.getElementById("player-form");

const playersList =
  document.getElementById("players-list");

const addPlayerButton =
  document.getElementById("add-player-button");

const formMessage =
  document.getElementById("form-message");

const MAX_PLAYERS = 6;

let playerCount = 0;


/*
  Cria os campos de um novo jogador.
*/

function createPlayerFields() {
  if (playerCount >= MAX_PLAYERS) {
    return;
  }

  playerCount += 1;

  const playerCard =
    document.createElement("section");

  playerCard.className = "player-card";

  playerCard.innerHTML = `
    <div class="player-card-header">
      <h2>Jogador ${playerCount}</h2>

      ${
        playerCount > 1
          ? `
            <button
              class="remove-player-button"
              type="button"
              aria-label="Remover jogador ${playerCount}"
            >
              Remover
            </button>
          `
          : ""
      }
    </div>

    <div class="form-group">
      <label for="player-name-${playerCount}">
        Como te chamas?
      </label>

      <input
        type="text"
        id="player-name-${playerCount}"
        class="player-name-input"
        placeholder="Escreve o teu nome"
        maxlength="30"
        autocomplete="off"
        required
      >
    </div>

    <div class="form-group">
      <label for="player-age-${playerCount}">
        Que idade tens?
      </label>

      <input
        type="number"
        id="player-age-${playerCount}"
        class="player-age-input"
        placeholder="A tua idade"
        min="3"
        max="18"
        inputmode="numeric"
        required
      >
    </div>
  `;

  playersList.appendChild(playerCard);

  const removeButton =
    playerCard.querySelector(".remove-player-button");

  if (removeButton) {
    removeButton.addEventListener("click", function () {
      playerCard.remove();
      updatePlayerNumbers();
    });
  }

  updateAddPlayerButton();
}


/*
  Atualiza os títulos depois de remover um jogador.
*/

function updatePlayerNumbers() {
  const playerCards =
    playersList.querySelectorAll(".player-card");

  playerCount = playerCards.length;

  playerCards.forEach(function (card, index) {
    const number = index + 1;

    card.querySelector("h2").textContent =
      `Jogador ${number}`;

    const removeButton =
      card.querySelector(".remove-player-button");

    if (removeButton) {
      removeButton.setAttribute(
        "aria-label",
        `Remover jogador ${number}`
      );
    }
  });

  updateAddPlayerButton();
}


/*
  Esconde o botão quando já existem 6 jogadores.
*/

function updateAddPlayerButton() {
  addPlayerButton.hidden =
    playerCount >= MAX_PLAYERS;
}


/*
  Adiciona mais um jogador.
*/

addPlayerButton.addEventListener("click", function () {
  createPlayerFields();
});


/*
  Valida e guarda a lista de jogadores.
*/

playerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  formMessage.textContent = "";

  const playerCards =
    playersList.querySelectorAll(".player-card");

  const players = [];

  for (const card of playerCards) {
    const nameInput =
      card.querySelector(".player-name-input");

    const ageInput =
      card.querySelector(".player-age-input");

    const name =
      nameInput.value.trim();

    const age =
      Number(ageInput.value);

    if (name === "") {
      formMessage.textContent =
        "Escreve o nome de todos os jogadores.";

      nameInput.focus();
      return;
    }

    if (!Number.isInteger(age) || age < 3 || age > 18) {
      formMessage.textContent =
        "Indica uma idade válida para todos os jogadores.";

      ageInput.focus();
      return;
    }

    players.push({
      name: name,
      age: age
    });
  }

  localStorage.setItem(
    "players",
    JSON.stringify(players)
  );

  localStorage.setItem(
    "currentPlayerIndex",
    "0"
  );

  /*
    Remove os dados antigos da versão
    que aceitava apenas um jogador.
  */

  localStorage.removeItem("playerName");
  localStorage.removeItem("playerAge");

  if (players.length === 1) {
    formMessage.textContent =
      `Olá, ${players[0].name}!`;
  } else {
    formMessage.textContent =
      `${players.length} jogadores prontos!`;
  }

  setTimeout(function () {
    window.location.href = "regras.html";
  }, 600);
});


/*
  Mostra automaticamente o primeiro jogador.
*/

createPlayerFields();