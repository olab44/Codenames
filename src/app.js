const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/menu.html'))
});

app.get('/:name', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/page.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('buttonClick', (data) => {
    const color = getRandomColor()
    io.to(data.id).emit('updateColor', color);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('joinRoom', (data) => {
    socket.room = data.id;
    socket.join(data.id)
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}