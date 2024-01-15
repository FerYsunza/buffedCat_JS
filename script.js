//
// buffedCat_JS
//
// By Fer Ysunza, 14/01/24.
//

const board = Array(9).fill(null);
const playerSymbol = 'X';
const computerSymbol = 'O';
const minimaxScores = { 'Player': -10, 'Computer': 10, 'Draw': 0 };
let gameScores = { 'Player': 0, 'Computer': 0, 'Draw': 0 };
let gameOver = false;

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
    gameOver = false;
}

function playerMove(index) {
    if (!board[index] && !gameOver) {
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
    let result = checkWinner(false);
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

function checkWinner(highlightWin) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (highlightWin) {
                highlightWinningCombination(combination);
            }
            return board[a] === playerSymbol ? 'Player' : 'Computer';
        }
    }

    if (!board.includes(null)) {
        return 'Draw';
    }

    return null;
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        const cell = document.querySelectorAll('.cell')[index];
        cell.style.color = 'red'; // Change color to red for winning combination
    });
}

function checkGameEnd(symbol) {
    const winner = checkWinner(true);
    if (winner !== null) {
        updateScores(winner);
        let message = winner === 'Draw' ? "It's a Draw!" : winner + ' wins!';
        setTimeout(() => alert(message), 100);
        gameOver = true;
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
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.color = ''; // Reset color when starting a new game
    });
}
