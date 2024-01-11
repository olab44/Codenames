// const { getAllData } = require('./connect_database.js');


class GameState {
    constructor() {
        this.gameBoard = new Board();
        this.isBlueTurn = true;
        this.blueCards = 9;
        this.redCards = 8;
        this.moveCounter = null;
        this.currentClue = [null, null];
        this.gameRunning = false;
        this.blueHistory = [];
        this.redHistory = [];
        this.language = null
    }

    // async initializeGame() {
    //     try {
    //         let gboard = new Board();
    //         await gboard.initializeBoard();
    //         const cards = await gboard.tiles;
    //         this.gameBoard = gboard.tiles;
    //     } catch (error) {
    //         console.error('Error initializing game:', error);
    //     }
    // }

    initializeGame(language="ENG") {
        this.clearState();
        this.language = language;
        this.gameRunning = true;

        const blueTurn = Math.floor(Math.random() * 2);
        this.isBlueTurn = (blueTurn === 0) ? true : false;
        this.blueCards = (blueTurn === 0) ? 9 : 8;
        this.redCards = (blueTurn === 0) ? 8 : 9;

        this.gameBoard.createBoard(this.language, this.blueCards, this.redCards);
    }

    displayGameBoard() {
        if (this.gameBoard.tiles.length === 0) {
            console.log('Game board not initialized. Call initializeGame first.');
        } else {
            console.log('Game Board:');
            this.gameBoard.forEach((tile, index) => {
                console.log(`Tile ${index + 1}:`, tile.word, tile.color);
            });
        }
    }

    clearState() {
        this.moveCounter = null;
        this.currentClue = [null, null];
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
    // async initializeBoard(language, blueCards, redCards) {
    //     try {
    //       const { codenamesData } = await getAllData();
    //       let i;
    //       const randomWords = getRandomWords(codenamesData, 25);
    //       for (i = 0; i < blueCards; i++) { this.tiles.push(new Card(randomWords[i].word_text, 'blue'));}
    //       for (i = 0; i < redCards; i++) { this.tiles.push(new Card(randomWords[i+blueCards].word_text, 'red'));}
    //       for (i = 0; i < 7; i++) { this.tiles.push(new Card(randomWords[i+17].word_text, 'yellow'));}
    //       this.tiles.push(new Card(randomWords[24].word_text, 'black'));
    //       shuffle(this.tiles);;
    //     }
    //     catch (error) {
    //       console.error('Error initializing board:', error);
    //     }
    // }

    createBoard(language, blueCards, redCards) {
        const data = fetchWords('src/words.json');
        let i;
        const game_words = getRandomWords(data, 25);
        this.tiles = [];
        for (i = 0; i < blueCards; i++) { this.tiles.push(new Card(game_words[i][language], 'blue'));}
        for (i = 0; i < redCards; i++) { this.tiles.push(new Card(game_words[i+blueCards][language], 'red'));}
        for (i = 0; i < 7; i++) { this.tiles.push(new Card(game_words[i+17][language], 'yellow'));}
        this.tiles.push(new Card(game_words[24][language], 'black'));
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
      return parsedData;
      }
     catch (error) {
      console.error('Error reading JSON file:', error);
    }
}

module.exports = { GameState };




