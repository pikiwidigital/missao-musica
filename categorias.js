const categoryButtons =
  document.querySelectorAll(".category-button");

const categoryMessage =
  document.getElementById("category-message");

const playerGreeting =
  document.getElementById("player-greeting");

const dieButton =
  document.getElementById("die-button");

const dieResult =
  document.getElementById("die-result");


/*
  Vai buscar a lista de jogadores.
*/

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

if (currentPlayer) {
  if (players.length === 1) {
    playerGreeting.textContent =
      `${currentPlayer.name}, onde calhaste?`;
  } else {
    playerGreeting.textContent =
      `É a vez de ${currentPlayer.name}. Onde calhaste?`;
  }
} else {
  playerGreeting.textContent =
    "Escolhe o símbolo da casa onde paraste.";
}


/*
  Faces do dado.
  Os números correspondem às posições dos pontos.
*/

const dieFaces = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9]
};


/*
  Mostra os pontos correspondentes ao resultado.
*/

function showDieFace(number) {
  const pips =
    dieResult.querySelectorAll(".pip");

  pips.forEach(function (pip) {
    pip.classList.remove("visible");
  });

  dieFaces[number].forEach(function (position) {
    const pip =
      dieResult.querySelector(`.pip-${position}`);

    if (pip) {
      pip.classList.add("visible");
    }
  });

  dieResult.setAttribute(
    "aria-label",
    `O resultado do dado foi ${number}.`
  );
}


/*
  Limpa todos os pontos do dado.
*/

function clearDieFace() {
  const pips =
    dieResult.querySelectorAll(".pip");

  pips.forEach(function (pip) {
    pip.classList.remove("visible");
  });

  dieResult.setAttribute(
    "aria-label",
    "Dado ainda não lançado."
  );
}


/*
  Dado digital.
*/

dieButton.addEventListener("click", function () {
  dieButton.disabled = true;

  dieResult.classList.add("rolling");

  let changes = 0;

  const rollingAnimation =
    setInterval(function () {
      const temporaryResult =
        Math.floor(Math.random() * 6) + 1;

      showDieFace(temporaryResult);

      changes += 1;

      if (changes >= 12) {
        clearInterval(rollingAnimation);

        const finalResult =
          Math.floor(Math.random() * 6) + 1;

        showDieFace(finalResult);

        dieResult.classList.remove("rolling");

        dieButton.disabled = false;
      }
    }, 80);
});


/*
  Escolha da categoria.
*/

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedCategory =
      button.dataset.category;

    localStorage.setItem(
      "selectedCategory",
      selectedCategory
    );


    /*
      Casa Estrela:
      o mesmo jogador lança novamente.
    */

    if (selectedCategory === "estrela") {
      if (currentPlayer) {
        categoryMessage.textContent =
          `${currentPlayer.name}, calhaste numa Casa Estrela! Lança novamente o dado.`;
      } else {
        categoryMessage.textContent =
          "Casa Estrela! Lança novamente o dado.";
      }

      clearDieFace();

      return;
    }


    /*
      Categoria normal:
      abre uma missão.
    */

    if (currentPlayer) {
      categoryMessage.textContent =
        `${currentPlayer.name}, vamos descobrir a tua missão!`;
    } else {
      categoryMessage.textContent =
        "Vamos descobrir a tua missão!";
    }

    setTimeout(function () {
      window.location.href = "missao.html";
    }, 500);
  });
});