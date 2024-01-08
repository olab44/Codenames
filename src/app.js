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

// menu page

    socket.on("checkGameState", () => {
        socket.emit("checkedState", gameState.gameRunning);
    });

    socket.on("startGame", () => {
        gameState.initializeGame();
        gameState.gameRunning = true;
        socket.emit("checkedState", gameState.gameRunning);
    })

// game page

    socket.on("newGame", () => {
        gameState.clearState();
        gameState.initializeGame();
        io.emit("joinGame", gameState);
        io.emit("newGame");
    });

    socket.on("joinGame", () => {
        io.emit("joinGame", gameState);
    });

    socket.on("update", () => {
        socket.emit("joinGame", gameState);
    });

    socket.on("turnPassed", () => {
        changeTurn();
        io.emit("update", gameState);
    });

    socket.on("clueSubmit", (newClue, clueNumber) => {
        gameState.currentClue[0] = newClue;
        gameState.currentClue[1] = clueNumber;
        if (gameState.isBlueTurn) { gameState.blueHistory.push(newClue + " " + clueNumber); }
        else { gameState.redHistory.push(newClue + " " + clueNumber); }
        gameState.moveCounter = clueNumber + 1;
        io.emit("update", gameState);
    });

    socket.on("revealBoard", ()=> {
        revealAllCards();
        io.emit("update", gameState);
    });

    socket.on("revealCard", (index) => {
        const card = gameState.gameBoard[index];
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
            console.log(winner + " WIN");
            gameRunning = false;
            gameState.moveCounter = 1;
            io.emit("gameEnded", winner);
            break;
        }

        if (shouldChangeTurn || --gameState.moveCounter == 0) {
        changeTurn();
        }

        if (gameState.blueCards === 0) {
            gameRunning = false;
            console.log("BLUE WIN");
            gameState.moveCounter = 1;
            io.emit("gameEnded", "BLUE");
        }

        if (gameState.redCards === 0) {
            gameRunning = false;
            console.log("RED WIN");
            gameState.moveCounter = 1;
            io.emit("gameEnded", "RED");
        }

        io.emit("update", gameState);
    });

});

function changeTurn() {
  gameState.isBlueTurn = !gameState.isBlueTurn;
  gameState.currentClue = [null, null];
  gameState.moveCounter = null;
}

function revealAllCards() {
  for (let i = 0; i < 25; i++) {
    gameState.gameBoard[i].revealed = true;
  }
}


const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
