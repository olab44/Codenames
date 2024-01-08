// const { getAllData } = require('./connect_database.js');


class GameState {
    constructor() {
        this.gameBoard = [];
        this.isBlueTurn = true;
        this.blueCards = 9;
        this.redCards = 8;
        this.moveCounter = null;
        this.currentClue = [null, null];
        this.gameRunning = false;
        this.blueHistory = [];
        this.redHistory = [];
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

    initializeGame() {
        let gboard2 = new Board();
        gboard2.createBoard();
        this.gameBoard = gboard2.tiles;
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

    clearState() {
        this.gameBoard = [];
        this.isBlueTurn = true;
        this.blueCards = 9;
        this.redCards = 8;
        this.moveCounter = null;
        this.currentClue = [null, null];
        this.gameRunning = false;
        this.blueHistory = [];
        this.redHistory = [];
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

    createBoard() {
        const data = fetchWords('src/words.json');
        let i;
        const game_words = getRandomWords(data, 25);
        for (i = 0; i < 9; i++) { this.tiles.push(new Card(game_words[i].word, 'blue'));}
        for (i = 0; i < 8; i++) { this.tiles.push(new Card(game_words[i+9].word, 'red'));}
        for (i = 0; i < 7; i++) { this.tiles.push(new Card(game_words[i+17].word, 'yellow'));}
        this.tiles.push(new Card(game_words[24].word, 'black'));
        shuffle(this.tiles);
        return this.tiles;
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

function fetchWords(filePath) {
    const fs = require('fs');
    try {
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      const parsedData = JSON.parse(jsonData);
    //   console.log(parsedData);
      return parsedData;
      }
     catch (error) {
      console.error('Error reading JSON file:', error);
    }
}



module.exports = { GameState };

// const gameState = new GameState();
// gameState.initializeGame();
// gameState.displayGameBoard();
// process.exit();
//     .then(() => {
//         gameState.displayGameBoard();
//         console.log(gameState);
//         process.exit();
//     })

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



