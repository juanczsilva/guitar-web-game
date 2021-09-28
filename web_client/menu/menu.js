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
  (songs).forEach((song) => {
    const songItem = document.createElement('li');
    songItem.className = 'songitem';
    songItem.value = song.id;
    songItem.innerHTML = `<span>${song.artist}</span> <b>${song.name}</b>`;
    songsList.appendChild(songItem);
  });
}

// eslint-disable-next-line no-unused-vars
function selectSong(e) {
  const event = e || window.event;
  const target = event.target || event.srcElement;
  const id = target.value;
  loadSongInfo(id);
}

function loadSongInfo(id) {
  const imgAlbum = document.getElementById('songinfo-album');
  const song = songs.find((s) => s.id == id);
  imgAlbum.setAttribute('src', `data:image/png;base64,${song.album}`);
}
