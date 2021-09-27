const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Midi } = require('@tonejs/midi');
const fs = require('fs');

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

app.get('/songlist', (req, res) => {
  const songs = [];
  const songsPath = './web_server/songs';
  const songsDir = fs.readdirSync(songsPath);
  console.log(songsDir);
  songsDir.forEach((songPath, i) => {
    console.log(songPath, (fs.lstatSync(`${songsPath}/${songPath}`)).isDirectory());
    const song = { id: 0, name: '' };
    song.id = i + 1;
    song.name = songPath;
    songs.push(song);
  });
  res.send({ songlist: songs });
});

app.get('/midi/:id', (req, res) => {
  const id = req.params.id;
  const midiData = fs.readFileSync(`./web_server/songs/song${id}/notes.mid`);
  const midi = new Midi(midiData);
  res.send(midi);
});
