const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.resolve(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

const { GameState } = require('./game');
let gameState = new GameState();

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/menu.html"));
});

app.get("/instruction", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/instruction.html"));
});

app.get("/:name", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/page.html"));
});

io.on("connection", (socket) => {

// MENU PAGE

    socket.on("checkGameState", () => {
        socket.emit("checkedState", gameState.gameRunning, gameState.language);
    });

    socket.on("startGame", (language) => {
        gameState.initializeGame(language);
        io.emit("joinGame", gameState);
        io.emit("checkedState", gameState.gameRunning, gameState.language);
    })

// GAME PAGE

    socket.on("newGame", () => {
        gameState.initializeGame(gameState.language);
        io.emit("newGame");
        io.emit("renderGame", gameState);
    });

    socket.on("joinGame", () => {   io.emit("renderGame", gameState);   });

    socket.on("changeRole", () => { socket.emit("changedRole", gameState);  });

    socket.on("passTurn", () => {
        changeTurn();
        io.emit("turnPassed", gameState);
    });

    socket.on("clueSubmit", (newClue, clueNumber) => {
        gameState.currentClue[0] = newClue;
        gameState.currentClue[1] = clueNumber;
        if (gameState.isBlueTurn) { gameState.blueHistory.push(newClue + " " + clueNumber); }
        else { gameState.redHistory.push(newClue + " " + clueNumber); }
        gameState.moveCounter = clueNumber + 1;
        io.emit("submittedClue", gameState);
    });

    socket.on("revealBoard", ()=> {
        revealAllCards();
        io.emit("boardRevealed", gameState);
    });

    socket.on("revealCard", (index) => {
        const card = gameState.gameBoard.tiles[index];
        card.revealed = true;
        const cardColor = card.color;

        let shouldChangeTurn = false;
        switch (cardColor) {
        case "blue":
            --gameState.blueCards;
            if (!gameState.isBlueTurn) { shouldChangeTurn = true; }
            break;
        case "red":
            --gameState.redCards;
            if (gameState.isBlueTurn) { shouldChangeTurn = true; }
            break;
        case "yellow":
            shouldChangeTurn = true;
            break;
        case "black":
            let winner = (gameState.isBlueTurn === true) ? "RED" : "BLUE";
            io.emit("gameEnded", winner);
            gameState.gameRunning = false;
            break;
        }

        if (shouldChangeTurn || --gameState.moveCounter == 0) {
            changeTurn();
        }

        if (gameState.blueCards === 0) {
            io.emit("gameEnded", "BLUE");
            gameState.gameRunning = false;
        }

        if (gameState.redCards === 0) {
            io.emit("gameEnded", "RED");
            gameState.gameRunning = false;
        }

        io.emit("renderGame", gameState);
    });

});

function changeTurn() {
  gameState.isBlueTurn = !gameState.isBlueTurn;
  gameState.currentClue = [null, null];
  gameState.moveCounter = null;
}

function revealAllCards() {
  for (let i = 0; i < 25; i++) {
    gameState.gameBoard.tiles[i].revealed = true;
  }
}


const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
