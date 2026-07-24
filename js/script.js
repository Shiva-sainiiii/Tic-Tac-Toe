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
  mode: "pvp",       // "pvp" | "ai"
  difficulty: "hard", // "easy" | "hard"
  humanSymbol: "O",
  aiSymbol: "X",
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

const modeScreen = document.getElementById("mode-screen");
const modeButtons = document.querySelectorAll(".mode-btn");
const difficultyRow = document.getElementById("difficulty-row");
const difficultyButtons = document.querySelectorAll(".diff-btn");

const gameScreen = document.getElementById("game-screen");
const changeModeBtn = document.getElementById("change-mode-btn");

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
  // In AI mode, block clicks when it's not the human's turn
  if (state.mode === "ai" && state.current !== state.humanSymbol) return;

  playMove(index);

  if (state.gameOver) return;

  if (state.mode === "ai" && state.current === state.aiSymbol) {
    queueAiMove();
  }
}

function playMove(index) {
  const cell = cells[index];
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

function queueAiMove() {
  gameScreen.classList.add("thinking");
  const delay = 500 + Math.random() * 500; // feels like something is "deciding"
  setTimeout(() => {
    if (state.gameOver) {
      gameScreen.classList.remove("thinking");
      return;
    }
    const index = getAiMove();
    gameScreen.classList.remove("thinking");
    if (index !== -1) playMove(index);
  }, delay);
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

// ============================
// AI logic
// ============================
function getAiMove() {
  const empty = state.board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  if (empty.length === 0) return -1;

  if (state.difficulty === "easy") {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // Hard: minimax, unbeatable
  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const i of empty) {
    state.board[i] = state.aiSymbol;
    const score = minimax(state.board, 0, false);
    state.board[i] = "";
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  const winner = getBoardWinner(board);
  if (winner === state.aiSymbol) return 10 - depth;
  if (winner === state.humanSymbol) return depth - 10;
  if (board.every((c) => c !== "")) return 0;

  const empty = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null);

  if (isMaximizing) {
    let best = -Infinity;
    for (const i of empty) {
      board[i] = state.aiSymbol;
      best = Math.max(best, minimax(board, depth + 1, false));
      board[i] = "";
    }
    return best;
  } else {
    let best = Infinity;
    for (const i of empty) {
      board[i] = state.humanSymbol;
      best = Math.min(best, minimax(board, depth + 1, true));
      board[i] = "";
    }
    return best;
  }
}

function getBoardWinner(board) {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
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
  gameScreen.classList.remove("thinking");
}

// ============================
// Event wiring
// ============================
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));

restartBtn.addEventListener("click", () => {
  if (!muted) sounds.restart.play();
  resetGame();
});

changeModeBtn.addEventListener("click", () => {
  resetGame();
  gameScreen.classList.add("hidden");
  difficultyRow.classList.add("hidden");
  modeScreen.classList.remove("hidden");
});

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  modeScreen.classList.remove("hidden");
  if (!muted) sounds.enter.play();
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;

    if (state.mode === "ai") {
      difficultyRow.classList.remove("hidden");
      return; // wait for difficulty pick before starting
    }

    beginGame();
  });
});

difficultyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.difficulty = btn.dataset.difficulty;
    beginGame();
  });
});

function beginGame() {
  modeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetGame();
}

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
