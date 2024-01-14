//
// buffedCat_JS
//
// By Fer Ysunza, 13/01/24.
//

const board = Array(9).fill(null);
const playerSymbol = 'X';
const computerSymbol = 'O';
const minimaxScores = { 'Player': -10, 'Computer': 10, 'Draw': 0 };
let gameScores = { 'Player': 0, 'Computer': 0, 'Draw': 0 };

document.addEventListener('DOMContentLoaded', () => {
    setupBoard();
    document.getElementById('new-game').addEventListener('click', newGame);
});

function setupBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => playerMove(index));
        boardElement.appendChild(cellElement);
    });
}

function playerMove(index) {
    if (!board[index]) {
        makeMove(index, playerSymbol);
        if (!checkGameEnd(playerSymbol)) {
            computerMove();
        }
    }
}

function computerMove() {
    const bestMove = findBestMove(board);
    makeMove(bestMove, computerSymbol);
    checkGameEnd(computerSymbol);
}

function makeMove(index, symbol) {
    board[index] = symbol;
    drawBoard();
}

function drawBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = computerSymbol;
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return minimaxScores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = computerSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === playerSymbol ? 'Player' : 'Computer';
        }
    }

    if (!board.includes(null)) {
        return 'Draw';
    }

    return null;
}

function checkGameEnd(symbol) {
    const winner = checkWinner();
    if (winner !== null) {
        updateScores(winner);
        let message = winner === 'Draw' ? "It's a Draw!" : winner + ' wins!';
        setTimeout(() => alert(message), 100);
        return true;
    }
    return false;
}

function updateScores(winner) {
    if (winner !== 'Draw') {
        gameScores[winner]++;
    } else {
        gameScores['Draw']++;
    }
    document.getElementById('player-score').textContent = gameScores['Player'];
    document.getElementById('computer-score').textContent = gameScores['Computer'];
    document.getElementById('draw-score').textContent = gameScores['Draw'];
}

function newGame() {
    board.fill(null);
    setupBoard();
}
