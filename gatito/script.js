const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const aiMessage = document.getElementById('ai-message');
const restartBtn = document.getElementById('restart');
let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let isGameOver = false;

// Combinaciones ganadoras
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Dificultad IA: Fácil (aleatoria) o Difícil (estratégica)
const difficulty = "hard";

// Función para iniciar el juego
function startGame() {
    cells.forEach(cell => cell.addEventListener('click', playerMove));
    restartBtn.addEventListener('click', restartGame);
    updateStatus();
}

// Movimiento del jugador
function playerMove() {
    const cellIndex = this.getAttribute('data-index');
    if (boardState[cellIndex] !== "" || isGameOver) return;

    boardState[cellIndex] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add(currentPlayer);

    if (checkWinner(currentPlayer)) {
        endGame(`${currentPlayer} ha ganado!`);
    } else if (boardState.every(cell => cell !== "")) {
        endGame("¡Es un empate!");
    } else {
        currentPlayer = "O"; // Cambia a IA
        updateStatus();
        aiMove();
    }
}

// Movimiento de la IA
function aiMove() {
    if (isGameOver) return;

    let move;
    if (difficulty === "hard") {
        move = findBestMove();
    } else {
        move = findRandomMove();
    }

    boardState[move] = "O";
    cells[move].textContent = "O";
    cells[move].classList.add("O");

    if (checkWinner("O")) {
        endGame("JA TE GANÉ");
        aiMessage.textContent = "JA TE GANÉ";
    } else if (boardState.every(cell => cell !== "")) {
        endGame("¡Es un empate!");
    } else {
        currentPlayer = "X"; // Cambia al jugador
        updateStatus();
    }
}

// Encuentra el mejor movimiento (IA estratégica)
function findBestMove() {
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (boardState[a] === "O" && boardState[b] === "O" && boardState[c] === "") return c;
        if (boardState[a] === "O" && boardState[c] === "O" && boardState[b] === "") return b;
        if (boardState[b] === "O" && boardState[c] === "O" && boardState[a] === "") return a;
    }
    for (let condition of winConditions) {
        let [a, b, c] = condition;
        if (boardState[a] === "X" && boardState[b] === "X" && boardState[c] === "") return c;
        if (boardState[a] === "X" && boardState[c] === "X" && boardState[b] === "") return b;
        if (boardState[b] === "X" && boardState[c] === "X" && boardState[a] === "") return a;
    }
    return findRandomMove();
}

// Encuentra un movimiento aleatorio
function findRandomMove() {
    let emptyCells = boardState.map((val, index) => (val === "" ? index : null)).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Verifica si hay un ganador
function checkWinner(player) {
    return winConditions.some(combination => {
        return combination.every(index => boardState[index] === player);
    });
}

// Termina el juego
function endGame(message) {
    statusText.textContent = message;
    isGameOver = true;
}

// Actualiza el texto del estado
function updateStatus() {
    statusText.textContent = `Turno de: ${currentPlayer}`;
    aiMessage.textContent = ""; // Borra cualquier mensaje previo
}

// Reinicia el juego
function restartGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameOver = false;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("X", "O");
    });
    updateStatus();
}

// Iniciar el juego
startGame();
