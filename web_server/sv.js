const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../web_client`;
app.use(express.static(clientPath));
console.log(`\n\u001b[33m* Serving static from '${clientPath}'`);

const server = http.createServer(app);
const port = 8080;

const io = socketio(server);

io.on('connection', (sock) => {
  console.log(`\n\u001b[37m* New connection: ${sock.id}`);
  sock.emit('msg', 'JELOU CL');
});

server.on('error', (err) => {
  console.log(`Error: ${err.name} - ${err.message}`);
});

server.listen(port, () => {
  console.log(`\u001b[33m* Server started on port: ${port}`);
});
