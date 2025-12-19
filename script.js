const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeBtn = document.getElementById("modeBtn");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let vsAI = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* ===== Initialize Board ===== */
function createBoard() {
  boardEl.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => handleMove(i));
    boardEl.appendChild(cell);
  });
}

/* ===== Handle Move ===== */
function handleMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  render();

  const winPattern = getWinningPattern();
  if (winPattern) {
    highlightWin(winPattern);
    statusEl.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(Boolean)) {
    statusEl.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusEl.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 300);
  }
}

/* ===== Render Board ===== */
function render() {
  [...boardEl.children].forEach((cell, i) => {
    cell.textContent = board[i] || "";
    cell.classList.remove("x", "o", "win-x", "win-o");
    if (board[i]) cell.classList.add(board[i].toLowerCase());
  });
}

/* ===== Win Detection ===== */
function getWinningPattern() {
  return winPatterns.find(pattern =>
    pattern.every(i => board[i] === currentPlayer)
  );
}

function highlightWin(pattern) {
  pattern.forEach(i => {
    const cell = boardEl.children[i];
    cell.classList.add(
      currentPlayer === "X" ? "win-x" : "win-o"
    );
  });
}

/* ===== AI (Minimax) ===== */
function aiMove() {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  handleMove(move);
}

function minimax(state, depth, isMax) {
  if (checkWinner(state, "O")) return 10 - depth;
  if (checkWinner(state, "X")) return depth - 10;
  if (state.every(Boolean)) return 0;

  if (isMax) {
    let best = -Infinity;
    state.forEach((cell, i) => {
      if (!cell) {
        state[i] = "O";
        best = Math.max(best, minimax(state, depth + 1, false));
        state[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    state.forEach((cell, i) => {
      if (!cell) {
        state[i] = "X";
        best = Math.min(best, minimax(state, depth + 1, true));
        state[i] = null;
      }
    });
    return best;
  }
}

function checkWinner(state, player) {
  return winPatterns.some(p => p.every(i => state[i] === player));
}

/* ===== Controls ===== */
resetBtn.addEventListener("click", resetGame);

modeBtn.addEventListener("click", () => {
  vsAI = !vsAI;
  modeBtn.textContent = `Vs AI: ${vsAI ? "On" : "Off"}`;
  resetGame();
});

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  statusEl.textContent = "Player X's turn";
  render();
}

/* ===== Start ===== */
createBoard();
render();
