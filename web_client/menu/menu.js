document.addEventListener('DOMContentLoaded', () => {
  getSongs();
});

function getSongs() {
  fetch('/songlist')
    .then((response) => response.json())
    .then((data) => {
      loadSongs(data);
    });
}

let songs = [];
let currentSongId = 0;

function loadSongs(data) {
  songs = data.songlist;
  const songsList = document.getElementById('songs');
  (songs).forEach((song, i) => {
    const songItem = document.createElement('li');
    songItem.className = 'songitem';
    songItem.value = song.id;
    songItem.innerHTML = `<span>${song.artist}</span> <b>${song.name}</b>`;
    if (i == 0) songItem.style.backgroundColor = '#4d4d4d';
    songsList.appendChild(songItem);
  });
  loadSongInfo(1);
}

// eslint-disable-next-line no-unused-vars
function selectSong(e) {
  const event = e || window.event;
  let target = event.target || event.srcElement;
  if (target.nodeName != 'LI') {
    target = target.parentNode;
  }
  target.parentElement.childNodes.forEach((songItem) => { songItem.style.backgroundColor = null; });
  target.style.backgroundColor = '#4d4d4d';
  const id = target.value;
  loadSongInfo(id);
}

function loadSongInfo(id) {
  const song = songs.find((s) => s.id == id);
  currentSongId = song.id;
  const imgAlbum = document.getElementById('songinfo-albumimg');
  const album = document.getElementById('songinfo-album');
  const year = document.getElementById('songinfo-year');
  const genre = document.getElementById('songinfo-genre');
  const frets = document.getElementById('songinfo-frets');
  imgAlbum.setAttribute('src', `data:image/png;base64,${song.albumimg}`);
  album.textContent = song.album;
  year.textContent = song.year;
  genre.textContent = song.genre;
  frets.textContent = song.frets;
}

// eslint-disable-next-line no-unused-vars
function playCurrentSong() {
  if (currentSongId != 0) {
    loaderProcess();
    document.getElementById('menu').style.display = 'none';
    const song = songs.find((s) => s.id == currentSongId);
    // eslint-disable-next-line no-undef
    startSong(song.youtubeId, song.id, song.youtubeVideoDelay, song.youtubeNotesDelay);
  }
}

// eslint-disable-next-line no-unused-vars
let loaderTimer;
function loaderProcess() {
  document.getElementById('loader').style.display = 'block';
  const loaderTxt = document.getElementById('loader').firstChild;
  let dotsNum = 1;
  loaderTxt.innerHTML = 'Cargando.';
  loaderTimer = setInterval(() => {
    dotsNum = (dotsNum == 3 ? 1 : (dotsNum + 1));
    let dots = '';
    switch (dotsNum) {
      case 1:
        dots = '.';
        break;
      case 2:
        dots = '..';
        break;
      case 3:
        dots = '...';
        break;
      default:
        break;
    }
    loaderTxt.innerHTML = `Cargando${dots}`;
  }, 500);
}
