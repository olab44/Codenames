const { getAllData } = require('./connect_database.js');


class GameState {
    constructor() {
        this.gameBoard = [];
        this.isBlueTurn = true;
        this.blueCards = 9;
        this.redCards = 8;
        this.moveCounter = 0;
    }

    async initializeGame() {
        try {
            let gboard = new Board();
            await gboard.initializeBoard();
            const cards = await gboard.tiles;
            this.gameBoard = gboard.tiles;
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }

    displayGameBoard() {
        if (this.gameBoard.length === 0) {
            console.log('Game board not initialized. Call initializeGame first.');
        } else {
            console.log('Game Board:');
            this.gameBoard.forEach((tile, index) => {
                console.log(`Tile ${index + 1}:`, tile.word, tile.color);
            });
        }
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

class Board {
    constructor() {
        this.tiles = [];
    }
    async initializeBoard() {
        try {
          const { codenamesData } = await getAllData();
          let i;
          const randomWords = getRandomWords(codenamesData, 25);
          for (i = 0; i < 9; i++) { this.tiles.push(new Card(randomWords[i].word_text, 'blue'));}
          for (i = 0; i < 8; i++) { this.tiles.push(new Card(randomWords[i+9].word_text, 'red'));}
          for (i = 0; i < 7; i++) { this.tiles.push(new Card(randomWords[i+17].word_text, 'yellow'));}
          this.tiles.push(new Card(randomWords[24].word_text, 'black'));
          shuffle(this.tiles);;
        } 
        catch (error) {
          console.error('Error initializing board:', error);
        }
    }

    displayBoard() {
        console.log('Board:');
        this.tiles.forEach((tile, index) => {
        console.log(`Tile ${index + 1}:`, tile, tile.color);
    });
  }

}

function getRandomWords(words, count) {
    random_words = [];
    let i;
    for (i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const chosenElement = words.splice(randomIndex, 1)[0];
        random_words.push(chosenElement);
    }
    return random_words;
}


module.exports = { GameState };

// const gameState = new GameState();
// gameState.initializeGame()
//     .then(() => {
//         gameState.displayGameBoard();
//         console.log(gameState);
//         process.exit();
//     })



// const gameBoard = new Board();
// gameBoard.initializeBoard()
//     .then(() => {console.log(gameBoard.tiles);
//         process.exit();
//     })
//   .then(() => {
//     gameBoard.displayBoard();
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   })
//   .finally(() => {
//     process.exit();
//   });





