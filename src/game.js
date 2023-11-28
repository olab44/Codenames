class GameState {
    constructor() {
        this.gameBoard = [];
        this.isBlueTurn = true;
        this.blueCards = 9;
        this.redCards = 8;
        this.moveCounter = 0;
    }
}

class Card {
    constructor(word, color) {
        this.word = word;
        this.color = color;
        this.revealed = false;
    }
}

function shuffle(array) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function generateBoard() {
    let board = [];
    let i;
    for ( i = 0; i < 9; i++) { board.push(new Card("BLA", "blue")); }
    for ( i = 0; i < 8; i++) { board.push(new Card("BLA", "red")); }
    for ( i = 0; i < 7; i++) { board.push(new Card("BLA", "yellow")); }
    board.push(new Card("BLA", "black"));
    shuffle(board);
    return board;
  }

function generateGame() {
    let gameState = new GameState();
    gameState.gameBoard = generateBoard();
    return gameState;
}

module.exports = {
    generateGame,
};