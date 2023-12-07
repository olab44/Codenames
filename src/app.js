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
    socket.emit("update", gameState);
  });

  socket.on("clueSubmit", (newClue, clueNumber) => {
    gameState.currentClue = newClue;
    gameState.moveCounter = clueNumber;
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
        console.log("END GAME");
        break;
    }
    if (shouldChangeTurn || --gameState.moveCounter == 0) { changeTurn(); }

    if (gameState.blueCards == 0) { console.log("BLUE WIN"); }
    if (gameState.redCards == 0) { console.log("RED WIN"); }

    io.emit("update", gameState);
  });
});

function changeTurn() {
  gameState.isBlueTurn = !gameState.isBlueTurn;
  gameState.currentClue = "";
  gameState.moveCounter = null;
}


const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
