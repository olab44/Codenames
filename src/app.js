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
gameState.initializeGame();

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/menu.html"))
});

app.post("/redirect", (req, res) => {
  const gameID = req.body.gameID;
  res.redirect(`/${gameID}`);
});

app.get("/:name", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/page.html"));
});

io.on("connection", (socket) => {
  console.log("Welcome to the game!");

  socket.on("update", () => {
    io.emit("update", gameState);
  });

  socket.on("turnPassed", () => {
    changeTurn();
    io.emit("update", gameState);
  });

  socket.on("clueSubmit", (newClue, clueNumber) => {
    gameState.currentClue = newClue;
    gameState.moveCounter = clueNumber;
    if (gameState.isBlueTurn) { gameState.blueHistory.push(newClue + " " + clueNumber); }
    else { gameState.redHistory.push(newClue + " " + clueNumber); }
    io.emit("update", gameState);
  });

  socket.on("newGame", () => {
    gameState = new GameState();
    gameState.initializeGame();
    io.emit("update", gameState);
  });

  socket.on("revealBoard", ()=> {
    revealAllCards();
    io.emit("update", gameState);
  })

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
        console.log("END GAME");
        gameEnded = true;
        gameState.moveCounter = 1;
        io.emit("gameEnded", gameState);
        break;
    }

    if (shouldChangeTurn || --gameState.moveCounter == 0 || gameState.blueCards === 0 || gameState.redCards === 0) {
      changeTurn();
    }

    if (gameState.blueCards === 0) {
      gameEnded = true;
      console.log("BLUE WIN");
      gameState.moveCounter = 1;
      io.emit("gameEnded", gameState);
    }

    if (gameState.redCards === 0) {
      gameEnded = true;
      console.log("RED WIN");
      gameState.moveCounter = 1;
      io.emit("gameEnded", gameState);
    }

    io.emit("update", gameState);
  });

});

function changeTurn() {
  gameState.isBlueTurn = !gameState.isBlueTurn;
  gameState.currentClue = "";
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
