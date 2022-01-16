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
    const songIdPercent = window.localStorage.getItem(`song${song.id}percent`) || '0%';
    const songIdStars = calcStars(window.localStorage.getItem(`song${song.id}stars`) || 0);
    songItem.innerHTML = `
      <span>${song.artist}</span><b>${song.name}</b>
      <div style="margin-left: auto; display: flex; gap: 10px;">
        ${songIdStars}
        <span style="min-width: 40px; text-align: right;">${songIdPercent}</span>
      </div>
    `;
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
    document.getElementById('loader').style.display = 'block';
    document.getElementById('menu').style.display = 'none';
    const song = songs.find((s) => s.id == currentSongId);
    // eslint-disable-next-line no-undef
    startSong(song.youtubeId, song.id, song.youtubeVideoDelay, song.youtubeNotesDelay, song.youtubeEndDelay);
  }
}

function calcStars(stars) {
  let starsElems = '';
  switch (stars) {
    case '1':
      starsElems = `
        <i class="star"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
      `;
      break;
    case '2':
      starsElems = `
        <i class="star"></i>
        <i class="star"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
      `;
      break;
    case '3':
      starsElems = `
        <i class="star"></i>
        <i class="star"></i>
        <i class="star"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
      `;
      break;
    case '4':
      starsElems = `
        <i class="star"></i>
        <i class="star"></i>
        <i class="star"></i>
        <i class="star"></i>
        <i class="star star-empty"></i>
      `;
      break;
    case '5':
      starsElems = `
        <i class="star"></i>
        <i class="star"></i>
        <i class="star"></i>
        <i class="star"></i>
        <i class="star"></i>
      `;
      break;
    default:
      starsElems = `
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
        <i class="star star-empty"></i>
      `;
      break;
  }
  return starsElems;
}
