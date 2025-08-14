const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Midi } = require('@tonejs/midi');
const fs = require('fs');
const ini = require('ini');
const path = require('path');

const app = express();

const clientPath = `${__dirname}/../web_client`;
app.use(express.static(clientPath));
console.log(`\n\u001b[33m* Serving static from '${clientPath}'`);

const server = http.createServer(app);
const port = (process.env.PORT || 8080);

// @ts-ignore
const io = socketio(server);

io.on('connection', (sock) => {
  console.log(`\n\u001b[37m* New connection: ${sock.id}`);
  sock.emit('msg', 'PING CL');
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
  const songsDir = fs.readdirSync(songsPath).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  // console.log(songsDir);
  songsDir.forEach((songPath, i) => {
    // console.log(songPath, (fs.lstatSync(`${songsPath}/${songPath}`)).isDirectory());
    const songDir = `${songsPath}/${songPath}`;
    const albumimg = fs.readFileSync(`${songDir}/album.png`, { encoding: 'base64' });
    const songini = ini.parse(fs.readFileSync(`${songDir}/song.ini`, 'utf-8'));
    const song = {
      id: (i + 1),
      name: songini.song.name,
      artist: songini.song.artist,
      albumimg,
      album: songini.song.album,
      year: songini.song.year,
      genre: songini.song.genre,
      frets: (songini.song.frets ? songini.song.frets : songini.song.charter),
      phrase: songini.song.loading_phrase,
      youtubeId: songini.song.youtube_id,
      youtubeVideoDelay: songini.song.youtube_video_delay,
      youtubeNotesDelay: songini.song.youtube_notes_delay,
      youtubeEndDelay: songini.song.youtube_end_delay
    };
    songs.push(song);
  });
  res.send({ songlist: songs });
});

app.get('/song/:id', (req, res) => {
  const id = req.params.id;
  const songsPath = './web_server/songs';
  const songDir = `${songsPath}/song${id}`;
  const albumimg = fs.readFileSync(`${songDir}/album.png`, { encoding: 'base64' });
  const songini = ini.parse(fs.readFileSync(`${songDir}/song.ini`, 'utf-8'));
  const song = {
    id,
    name: songini.song.name,
    artist: songini.song.artist,
    albumimg,
    album: songini.song.album,
    year: songini.song.year,
    genre: songini.song.genre,
    frets: (songini.song.frets ? songini.song.frets : songini.song.charter),
    phrase: songini.song.loading_phrase,
    youtubeId: songini.song.youtube_id,
    youtubeVideoDelay: songini.song.youtube_video_delay,
    youtubeNotesDelay: songini.song.youtube_notes_delay,
    youtubeEndDelay: songini.song.youtube_end_delay
  };
  res.send({ song });
});

app.get('/midi/:id', (req, res) => {
  const id = req.params.id;
  const midiData = fs.readFileSync(`./web_server/songs/song${id}/notes.mid`);
  const midi = new Midi(midiData);
  midi.tracks = midi.tracks.filter((t) => (t.name).toUpperCase().includes('GUITAR'));
  midi.tracks[0].notes = midi.tracks[0].notes.filter((n) => (['C7', 'C#7', 'D7', 'D#7', 'E7']).includes(n.name));
  res.send(midi);
});

app.get('/play/:id', (req, res) => {
  // const id = req.params.id;
  res.sendFile(path.resolve(`${clientPath}/game/game.html`));
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${clientPath}/menu/menu.html`));
});
