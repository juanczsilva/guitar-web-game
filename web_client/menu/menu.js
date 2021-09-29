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
  const target = event.target || event.srcElement;
  target.parentElement.childNodes.forEach((songItem) => { songItem.style.backgroundColor = null; });
  target.style.backgroundColor = '#4d4d4d';
  const id = target.value;
  loadSongInfo(id);
}

function loadSongInfo(id) {
  const song = songs.find((s) => s.id == id);
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
