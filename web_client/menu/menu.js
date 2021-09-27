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

function loadSongs(data) {
  const songsList = document.getElementById('songs');
  (data.songlist).forEach((song) => {
    const songItem = document.createElement('li');
    songItem.value = song.id;
    songItem.textContent = `${song.name}`;
    songsList.appendChild(songItem);
  });
}

// eslint-disable-next-line no-unused-vars
function selectSong(e) {
  const event = e || window.event;
  const target = event.target || event.srcElement;
  console.log(target.value);
}
