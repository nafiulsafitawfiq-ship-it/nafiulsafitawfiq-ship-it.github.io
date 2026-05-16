const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const modeEl = document.getElementById('mode');
const resetBtn = document.getElementById('resetBtn');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Cols
    [0,4,8], [2,4,6]           // Diagonals
];

cells.forEach(cell => cell.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (gameActive && modeEl.value === "pve" && currentPlayer === "O") {
        setTimeout(() => {
            const bestMove = minimax(board, "O").index;
            makeMove(bestMove, "O");
        }, 400);
    }
}));

function makeMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());

    if (checkWin(board, player)) {
        statusEl.innerText = `Player ${player} Wins!`;
        gameActive = false;
    } else if (!board.includes("")) {
        statusEl.innerText = "Draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusEl.innerText = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWin(b, p) {
    return winConditions.some(comb => comb.every(i => b[i] === p));
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (checkWin(newBoard, "X")) return {score: -10};
    if (checkWin(newBoard, "O")) return {score: 10};
    if (availSpots.length === 0) return {score: 0};

    const moves = [];
    availSpots.forEach(index => {
        let move = {index};
        newBoard[index] = player;
        move.score = minimax(newBoard, player === "O" ? "X" : "O").score;
        newBoard[index] = "";
        moves.push(move);
    });

    return moves.reduce((best, m) => 
        (player === "O" ? m.score > best.score : m.score < best.score) ? m : best
    );
}

resetBtn.addEventListener('click', () => location.reload());
