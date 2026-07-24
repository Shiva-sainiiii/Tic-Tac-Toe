// ============================
// Whisper — Horror Tic Tac Toe
// ============================

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const state = {
  board: Array(9).fill(""),
  current: "O", // O goes first, matches original game
  moves: 0,
  gameOver: false,
};

// ---- DOM refs ----
const cells = document.querySelectorAll(".cell");
const turnSymbolEl = document.getElementById("turn-symbol");
const restartBtn = document.getElementById("restart-btn");
const resultOverlay = document.getElementById("result-overlay");
const resultText = document.getElementById("result-text");

const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const muteToggle = document.getElementById("mute-toggle");

// ---- Sounds ----
const sounds = {
  enter: new Audio("assets/audio/entersound.mp3"),
  tap: new Audio("assets/audio/tap.mp3"),
  win: new Audio("assets/audio/winning.mp3"),
  restart: new Audio("assets/audio/restart.mp3"),
  bg: new Audio("assets/audio/bgmusic.mp3"),
};
sounds.bg.loop = true;

let muted = true; // starts muted, matches original UX

// ============================
// Game logic
// ============================
function handleCellClick(e) {
  const cell = e.currentTarget;
  const index = Number(cell.dataset.index);

  if (state.board[index] !== "" || state.gameOver) return;

  state.board[index] = state.current;
  cell.textContent = state.current;
  cell.classList.add(state.current === "O" ? "mark-o" : "mark-x");
  cell.disabled = true;

  if (!muted) sounds.tap.play();

  state.moves++;
  state.current = state.current === "O" ? "X" : "O";
  turnSymbolEl.textContent = state.current;

  checkResult();
}

function checkResult() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    const { board } = state;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      declareWinner(board[a], combo);
      return;
    }
  }

  if (state.moves === 9) {
    declareDraw();
  }
}

function declareWinner(symbol, combo) {
  state.gameOver = true;
  if (!muted) sounds.win.play();

  combo.forEach((i) => cells[i].classList.add("win-line"));

  resultText.textContent = `${symbol} claims this soul`;
  resultOverlay.classList.add("show");

  setTimeout(resetGame, 3200);
}

function declareDraw() {
  state.gameOver = true;
  resultText.textContent = "The board is silent";
  resultOverlay.classList.add("show");

  setTimeout(resetGame, 2400);
}

function resetGame() {
  state.board = Array(9).fill("");
  state.current = "O";
  state.moves = 0;
  state.gameOver = false;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-o", "mark-x", "win-line");
  });

  turnSymbolEl.textContent = "O";
  resultOverlay.classList.remove("show");
  resultText.textContent = "";
}

// ============================
// Event wiring
// ============================
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));

restartBtn.addEventListener("click", () => {
  if (!muted) sounds.restart.play();
  resetGame();
});

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  if (!muted) sounds.enter.play();
});

muteToggle.addEventListener("click", () => {
  muted = !muted;
  muteToggle.innerHTML = muted
    ? '<i class="fa-solid fa-volume-xmark"></i>'
    : '<i class="fa-solid fa-volume-high"></i>';

  if (muted) {
    sounds.bg.pause();
  } else {
    sounds.bg.play();
  }
});
