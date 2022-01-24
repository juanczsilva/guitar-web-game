document.addEventListener('DOMContentLoaded', () => {
  const playId = window.location.href.split('/').pop();
  if (!(Number.isNaN(playId))) {
    fetch(`/song/${playId}`)
      .then((response) => response.json())
      .then((data) => {
        const playSong = data.song;
        startSong(playSong.youtubeId, playSong.id, playSong.youtubeVideoDelay, playSong.youtubeNotesDelay, playSong.youtubeEndDelay, playSong.artist, playSong.name);
      });
  }
});

let videoDelay = 0;
let notesDelay = 0;
let endDelay = 0;
let artistSong = '';
let nameSong = '';
let idSong = 0;

// eslint-disable-next-line no-unused-vars
function startSong(youtubeId, songId, vDelay, nDelay, eDelay, songArtist, songName) {
  videoDelay = vDelay;
  notesDelay = nDelay;
  endDelay = eDelay;
  artistSong = songArtist;
  nameSong = songName;
  idSong = songId;
  const playerEle = document.getElementById('player');
  playerEle.setAttribute('src', 'http://www.youtube.com/embed/'
    + `${youtubeId}`
    + '?enablejsapi=1'
    + `&origin=${window.location.origin}`
    + '&start=1'
    + '&autoplay=0'
    + '&controls=0'
    + '&showinfo=0'
    + '&rel=0');
  loadMidiData(songId, () => {
    // console.log(cb);
    setTimeout(() => {
      const tag = document.createElement('script');
      tag.src = 'http://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }, 3000);
  });
}

// *** YOUTUBE ***
let player;
let playerInit = false;
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  // console.log('onYouTubeIframeAPIReady');
  // document.getElementById('loader').style.display = 'none';
  document.getElementById('loader').remove();
  // eslint-disable-next-line no-undef
  // eslint-disable-next-line no-undef
  player = new YT.Player('player', {
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

let isPaused = false;
let canPause = false;

function onPlayerStateChange(event) {
  // console.log(event);
  // eslint-disable-next-line no-undef
  if (event.data == YT.PlayerState.PLAYING) {
    // player.mute();
    if (!playerInit) {
      playerInit = true;
      player.unMute();
      player.setVolume(100);
      if (videoDelay > 0) {
        player.pauseVideo();
        setTimeout(() => {
          // player.seekTo(1);
          player.playVideo();
          canPause = true;
        }, videoDelay);
      } else {
        canPause = true;
      }
      if (notesDelay > 0) {
        setTimeout(() => {
          iniLoop();
        }, notesDelay);
      } else {
        iniLoop();
      }
    } else {
      if (isPaused) pauseHandler(false);
    }
    document.getElementById('imgneck').focus();
    window.scrollTo({ top: 0 });
    setTimeout(() => {
      document.getElementById('topbot').style.height = '60px';
      document.getElementById('topbot').style.zIndex = '0';
      window.scrollTo({ top: 0 });
    }, 1000);
  // eslint-disable-next-line no-undef
  } else if (event.data == YT.PlayerState.PAUSED) {
    if (canPause) pauseHandler(true);
    document.getElementById('topbot').style.height = '170px';
    document.getElementById('topbot').style.zIndex = '-1';
    window.scrollTo({ top: 0 });
  }
}

// *** GAME ***
// eslint-disable-next-line no-undef
// const sock = io();

// sock.on('msg', (text) => {
// console.log(text);
// });

// let elementsWaitingAnim = [];
// let elementsPausedAnim = [];

function pauseHandler(pause) {
  isPaused = pause;
  const elemsAnim = document.getElementsByClassName('note');
  if (pause) {
    for (let i = 0; i < elemsAnim.length; i += 1) {
      elemsAnim[i].getAnimations().forEach((anim) => anim.pause());
    }
  } else {
    for (let i = 0; i < elemsAnim.length; i += 1) {
      elemsAnim[i].getAnimations().forEach((anim) => anim.play());
    }
    window.requestAnimationFrame(step);
  }
}

function elementAnimate(item, type) {
  let noteLeftStart = '';
  let noteLeftEnd = '';
  switch (type) {
    case 0:
      noteLeftStart = '20%';
      noteLeftEnd = '-50%';
      break;
    case 1:
      noteLeftStart = '32.5%';
      noteLeftEnd = '-7.5%';
      break;
    case 2:
      noteLeftStart = '45%';
      noteLeftEnd = '35%';
      break;
    case 3:
      noteLeftStart = '57.5%';
      noteLeftEnd = '77.5%';
      break;
    case 4:
      noteLeftStart = '70%';
      noteLeftEnd = '120%';
      break;
    default:
      break;
  }
  const anim = item.animate([
    { top: '25%', left: noteLeftStart },
    { top: '125%', left: noteLeftEnd, width: '30%' }
  ], {
    duration: 1500,
    easing: 'linear',
    iterations: 1,
    direction: 'normal',
    fill: 'forwards'
  });
  if (isPaused) {
    anim.pause();
  }
  anim.onfinish = () => {
    if (document.body.contains(item)) {
      item.remove();
      onFail(false);
    }
  };
}

// function isValidNote(name) {
//   return name == 'C7' || name == 'C#7' || name == 'D7' || name == 'D#7' || name == 'E7';
// }

function getNoteIdByName(name) {
  let id = 0;
  switch (name) {
    case 'C7':
      id = 0;
      break;
    case 'C#7':
      id = 1;
      break;
    case 'D7':
      id = 2;
      break;
    case 'D#7':
      id = 3;
      break;
    case 'E7':
      id = 4;
      break;
    default:
      break;
  }
  return id;
}

function generateNote(type) {
  const neck = document.getElementById('neck');
  const note = document.createElement('div');
  switch (type) {
    case 0:
      note.className = 'note note-green';
      break;
    case 1:
      note.className = 'note note-red';
      break;
    case 2:
      note.className = 'note note-yellow';
      break;
    case 3:
      note.className = 'note note-blue';
      break;
    case 4:
      note.className = 'note note-orange';
      break;
    default:
      break;
  }
  neck.appendChild(note);
  elementAnimate(note, type);
}

function isColliding(div1, div2) {
  const d1OffsetTop = div1.offsetTop;
  const d1OffsetLeft = div1.offsetLeft;
  const d1Height = div1.getBoundingClientRect().height;
  const d1Width = div1.getBoundingClientRect().width;
  const d1Top = d1OffsetTop + d1Height;
  const d1Left = d1OffsetLeft + d1Width;
  const d2OffsetTop = div2.offsetTop;
  const d2OffsetLeft = div2.offsetLeft;
  const d2Height = div2.getBoundingClientRect().height;
  const d2Width = div2.getBoundingClientRect().width;
  const d2Top = d2OffsetTop + d2Height;
  const d2Left = d2OffsetLeft + d2Width;
  return !(d1Top < d2OffsetTop || d1OffsetTop > d2Top
    || d1Left < d2OffsetLeft || d1OffsetLeft > d2Left);
}

let score = 0;
let combo = 0;
let notesOk = 0;
let notesFail = 0;
const flameTime = 400;
let flameGreenTimer;
let flameRedTimer;
let flameYellowTimer;
let flameBlueTimer;
let flameOrangeTimer;

function hitNote(note, type) {
  note.remove();
  let flame;
  switch (type) {
    case 0:
      clearTimeout(flameGreenTimer);
      flame = document.getElementById('flame-hit-green');
      flame.style.opacity = 0.5;
      flameGreenTimer = setTimeout(() => { flame.style.opacity = 0; }, flameTime);
      break;
    case 1:
      clearTimeout(flameRedTimer);
      flame = document.getElementById('flame-hit-red');
      flame.style.opacity = 0.5;
      flameRedTimer = setTimeout(() => { flame.style.opacity = 0; }, flameTime);
      break;
    case 2:
      clearTimeout(flameYellowTimer);
      flame = document.getElementById('flame-hit-yellow');
      flame.style.opacity = 0.5;
      flameYellowTimer = setTimeout(() => { flame.style.opacity = 0; }, flameTime);
      break;
    case 3:
      clearTimeout(flameBlueTimer);
      flame = document.getElementById('flame-hit-blue');
      flame.style.opacity = 0.5;
      flameBlueTimer = setTimeout(() => { flame.style.opacity = 0; }, flameTime);
      break;
    case 4:
      clearTimeout(flameOrangeTimer);
      flame = document.getElementById('flame-hit-orange');
      flame.style.opacity = 0.5;
      flameOrangeTimer = setTimeout(() => { flame.style.opacity = 0; }, flameTime);
      break;
    default:
      break;
  }
  onScore();
}

function onScore() {
  let scorePlus = 0;
  notesOk += 1;
  combo += 1;
  onCombo();
  if (combo < 10) {
    scorePlus = 100;
    document.getElementById('multi').innerHTML = 'x1';
    document.getElementById('multi').style.color = '#ff0000';
  } else if (combo < 20) {
    scorePlus = 200;
    document.getElementById('multi').innerHTML = 'x2';
    document.getElementById('multi').style.color = '#ffffff';
  } else if (combo < 30) {
    scorePlus = 300;
    document.getElementById('multi').innerHTML = 'x3';
    document.getElementById('multi').style.color = '#ffff00';
  } else if (combo >= (40 - 10)) {
    scorePlus = 400;
    document.getElementById('multi').innerHTML = 'x4';
    document.getElementById('multi').style.color = '#00ff00';
  }
  score += scorePlus;
  document.getElementById('score').innerHTML = score;
}

let comboTimer;
function onCombo() {
  if (Number.isInteger(combo / 5)) {
    document.getElementById('combo').innerHTML = `${combo}!`;
    document.getElementById('combo').parentElement.style.display = 'block';
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { document.getElementById('combo').parentElement.style.display = 'none'; }, 2000);
  }
}

function onFail(failNote) {
  if (combo >= 5 || failNote) failSound();
  combo = 0;
  document.getElementById('multi').innerHTML = 'x1';
  document.getElementById('multi').style.color = '#ff0000';
  if (!failNote) notesFail += 1;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function failSound() {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = 0.25;
  oscillator.frequency.value = (30 + (Math.floor(Math.random() * 21)));
  oscillator.type = 'sawtooth';
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 120);
}

function calcScore() {
  const totalNotes = (notesOk + notesFail);
  const notesPercent = Math.round((notesOk * 100) / totalNotes);
  const starList = document.getElementById('scorestarlist').children;
  let stars = 5;
  document.getElementById('scoresong').innerHTML = `${artistSong}<br />${nameSong}`;
  document.getElementById('scorefinalscore').innerHTML = score;
  if (notesPercent <= 20) {
    stars = 1;
    starList[1].classList.add('star-empty');
    starList[2].classList.add('star-empty');
    starList[3].classList.add('star-empty');
    starList[4].classList.add('star-empty');
  } else if (notesPercent <= 40) {
    stars = 2;
    starList[2].classList.add('star-empty');
    starList[3].classList.add('star-empty');
    starList[4].classList.add('star-empty');
  } else if (notesPercent <= 60) {
    stars = 3;
    starList[3].classList.add('star-empty');
    starList[4].classList.add('star-empty');
  } else if (notesPercent <= 80) {
    stars = 4;
    starList[4].classList.add('star-empty');
  }
  document.getElementById('scorenotes').innerHTML = `${notesOk}/${totalNotes}`;
  document.getElementById('scorepercent').innerHTML = `${notesPercent}%`;
  window.localStorage.setItem(`song${idSong}percent`, `${notesPercent}%`);
  window.localStorage.setItem(`song${idSong}stars`, stars);
  document.getElementById('scorescreen').style.display = 'block';
}

let greenPressed = false;
let redPressed = false;
let yellowPressed = false;
let bluePressed = false;
let orangePressed = false;

document.addEventListener('keydown', (event) => {
  if (!greenPressed && event.key == 'a') {
    // console.log(event.key);
    greenPressed = true;
    const btnGreen = document.getElementById('hitnotegreen');
    btnGreen.classList.add('hitnote-pressed');
    const greenNotes = document.getElementsByClassName('note-green');
    const greenNote = greenNotes[0];
    const greenNoteNext = greenNotes[1];
    let fail = true;
    if (greenNote) {
      if (isColliding(btnGreen, greenNote)) {
        hitNote(greenNote, 0);
        fail = false;
      } else if (greenNoteNext) {
        if (isColliding(btnGreen, greenNoteNext)) {
          hitNote(greenNoteNext, 0);
          fail = false;
        }
      }
    }
    if (fail) {
      onFail(true);
    }
  } else if (!redPressed && event.key == 's') {
    // console.log(event.key);
    redPressed = true;
    const btnRed = document.getElementById('hitnotered');
    btnRed.classList.add('hitnote-pressed');
    const redNotes = document.getElementsByClassName('note-red');
    const redNote = redNotes[0];
    const redNoteNext = redNotes[1];
    let fail = true;
    if (redNote) {
      if (isColliding(btnRed, redNote)) {
        hitNote(redNote, 1);
        fail = false;
      } else if (redNoteNext) {
        if (isColliding(btnRed, redNoteNext)) {
          hitNote(redNoteNext, 1);
          fail = false;
        }
      }
    }
    if (fail) {
      onFail(true);
    }
  } else if (!yellowPressed && event.key == 'j') {
    // console.log(event.key);
    yellowPressed = true;
    const btnYellow = document.getElementById('hitnoteyellow');
    btnYellow.classList.add('hitnote-pressed');
    const yellowNotes = document.getElementsByClassName('note-yellow');
    const yellowNote = yellowNotes[0];
    const yellowNoteNext = yellowNotes[1];
    let fail = true;
    if (yellowNote) {
      if (isColliding(btnYellow, yellowNote)) {
        hitNote(yellowNote, 2);
        fail = false;
      } else if (yellowNoteNext) {
        if (isColliding(btnYellow, yellowNoteNext)) {
          hitNote(yellowNoteNext, 2);
          fail = false;
        }
      }
    }
    if (fail) {
      onFail(true);
    }
  } else if (!bluePressed && event.key == 'k') {
    // console.log(event.key);
    bluePressed = true;
    const btnBlue = document.getElementById('hitnoteblue');
    btnBlue.classList.add('hitnote-pressed');
    const blueNotes = document.getElementsByClassName('note-blue');
    const blueNote = blueNotes[0];
    const blueNoteNext = blueNotes[1];
    let fail = true;
    if (blueNote) {
      if (isColliding(btnBlue, blueNote)) {
        hitNote(blueNote, 3);
        fail = false;
      } else if (blueNoteNext) {
        if (isColliding(btnBlue, blueNoteNext)) {
          hitNote(blueNoteNext, 3);
          fail = false;
        }
      }
    }
    if (fail) {
      onFail(true);
    }
  } else if (!orangePressed && event.key == 'l') {
    // console.log(event.key);
    orangePressed = true;
    const btnOrange = document.getElementById('hitnoteorange');
    btnOrange.classList.add('hitnote-pressed');
    const orangeNotes = document.getElementsByClassName('note-orange');
    const orangeNote = orangeNotes[0];
    const orangeNoteNext = orangeNotes[1];
    let fail = true;
    if (orangeNote) {
      if (isColliding(btnOrange, orangeNote)) {
        hitNote(orangeNote, 4);
        fail = false;
      } else if (orangeNoteNext) {
        if (isColliding(btnOrange, orangeNoteNext)) {
          hitNote(orangeNoteNext, 4);
          fail = false;
        }
      }
    }
    if (fail) {
      onFail(true);
    }
  } else if (event.key == 'p' || event.key === 'Escape' || event.key === 'Esc') {
    if (isPaused) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key == 'a') {
    // console.log(event.key);
    const btnGreen = document.getElementById('hitnotegreen');
    btnGreen.classList.remove('hitnote-pressed');
    greenPressed = false;
  } else if (event.key == 's') {
    // console.log(event.key);
    const btnRed = document.getElementById('hitnotered');
    btnRed.classList.remove('hitnote-pressed');
    redPressed = false;
  } else if (event.key == 'j') {
    // console.log(event.key);
    const btnYellow = document.getElementById('hitnoteyellow');
    btnYellow.classList.remove('hitnote-pressed');
    yellowPressed = false;
  } else if (event.key == 'k') {
    // console.log(event.key);
    const btnBlue = document.getElementById('hitnoteblue');
    btnBlue.classList.remove('hitnote-pressed');
    bluePressed = false;
  } else if (event.key == 'l') {
    // console.log(event.key);
    const btnOrange = document.getElementById('hitnoteorange');
    btnOrange.classList.remove('hitnote-pressed');
    orangePressed = false;
  }
});

let start = null;
let midiSec = 0;
let ticksPerSec = 0;
let ticks = 0;
let endOfTrackTicks = 0;
let notes = [];
let notePos = 0;
let tempos = [];
let tempoPos = 1;
let bpm = 0;
let ppq = 0;

function loadMidiData(id, cb) {
  fetch(`/midi/${id}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      setupLoop(data, cb);
    });
}

function setupLoop(midiData, cb) {
  bpm = midiData.header.tempos[0].bpm;
  ppq = midiData.header.ppq;
  midiSec = ((60000 / (bpm * ppq)) / 60);
  ticksPerSec = (((bpm * ppq) / 60) / 60);
  const track = (midiData.tracks).find((t) => (t.name).toUpperCase().includes('GUITAR'));
  endOfTrackTicks = track.endOfTrackTicks;
  notes = track.notes.filter((n) => n.name == 'C7' || n.name == 'C#7' || n.name == 'D7' || n.name == 'D#7' || n.name == 'E7');
  tempos = midiData.header.tempos;
  cb('loaded');
}

function iniLoop() {
  // console.log('iniLoop');
  const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  window.requestAnimationFrame(step);
}

function step(timestamp) {
  if (!start) start = timestamp;
  const progress = (timestamp - start);
  // console.log(progress);
  if (progress >= midiSec) {
    ticks += ticksPerSec;
    // console.log(`TICK Nº: ${ticks}`);
    if (tempos[tempoPos] && ticks >= tempos[tempoPos].ticks) {
      bpm = tempos[tempoPos].bpm;
      midiSec = ((60000 / (bpm * ppq)) / 60);
      ticksPerSec = (((bpm * ppq) / 60) / 60);
      tempoPos += 1;
    }
    start = timestamp;
    if (ticks >= endOfTrackTicks) {
      setTimeout(() => {
        calcScore();
        player.stopVideo();
      }, endDelay);
    } else {
      if (notes[notePos] && ticks >= notes[notePos].ticks) {
        let moreNotes = 0;
        if (notes[notePos + 1] && notes[notePos].ticks == notes[notePos + 1].ticks) {
          generateNote(getNoteIdByName(notes[notePos + 1].name));
          moreNotes += 1;
        }
        if (notes[notePos + 2] && notes[notePos].ticks == notes[notePos + 2].ticks) {
          generateNote(getNoteIdByName(notes[notePos + 2].name));
          moreNotes += 1;
        }
        if (notes[notePos + 3] && notes[notePos].ticks == notes[notePos + 3].ticks) {
          generateNote(getNoteIdByName(notes[notePos + 3].name));
          moreNotes += 1;
        }
        if (notes[notePos + 4] && notes[notePos].ticks == notes[notePos + 4].ticks) {
          generateNote(getNoteIdByName(notes[notePos + 4].name));
          moreNotes += 1;
        }
        generateNote(getNoteIdByName(notes[notePos].name));
        notePos += (1 + moreNotes);
        if (!isPaused) window.requestAnimationFrame(step);
      } else {
        if (!isPaused) window.requestAnimationFrame(step);
      }
    }
  } else {
    if (!isPaused) window.requestAnimationFrame(step);
  }
}
