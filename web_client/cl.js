// YOUTUBE
let tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";

let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  console.log(event);
  if (event.data == YT.PlayerState.PLAYING) {
    player.unMute();
    //document.getElementById("topbot").style.height = "60px";
  } else if (event.data == YT.PlayerState.PAUSED) {
    //document.getElementById("topbot").style.height = "170px";
  }
}

// GAME
const sock = io();

sock.on("msg", (text) => {
  console.log(text);
  document.getElementById("topbot").innerHTML = text;
});

function elementAnimate(item, type) {
  let noteLeftStart = "";
  let noteLeftEnd = "";
  switch (type) {
    case 0:
      noteLeftStart = "20%";
      noteLeftEnd = "-45%";
    break;
    case 1:
      noteLeftStart = "32.5%";
      noteLeftEnd = "-5%";
    break;
    case 2:
      noteLeftStart = "45%";
      noteLeftEnd = "35%";
    break;
    case 3:
      noteLeftStart = "57.5%";
      noteLeftEnd = "75%";
    break;
    case 4:
      noteLeftStart = "70%";
      noteLeftEnd = "115%";
    break;
  }
  item.animate([
    { top: "25%", left: noteLeftStart },
    { top: "125%", left: noteLeftEnd, width: "30%" }
  ], {
    duration: 3000,
    easing: 'linear',
    iterations: 1,
    direction: 'normal',
    fill: 'forwards'
  }).onfinish = function() {
    item.remove();
  };
}

function generateNote(type) {
  let neck = document.getElementById("neck");
  let note = document.createElement("div"); 
  switch (type) {
    case 0:
      note.className = "note note-green";
    break;
    case 1:
      note.className = "note note-red";
    break;
    case 2:
      note.className = "note note-yellow";
    break;
    case 3:
      note.className = "note note-blue";
    break;
    case 4:
      note.className = "note note-orange";
    break;
  }
  neck.appendChild(note);
  elementAnimate(note, type);
}

function isColliding(div1, div2) {
  let d1OffsetTop = div1.offsetTop;
  let d1OffsetLeft = div1.offsetLeft;
  let d1Height = div1.getBoundingClientRect().height;
  let d1Width = div1.getBoundingClientRect().width;
  let d1Top = d1OffsetTop + d1Height;
  let d1Left = d1OffsetLeft + d1Width;
  let d2OffsetTop = div2.offsetTop;
  let d2OffsetLeft = div2.offsetLeft;
  let d2Height = div2.getBoundingClientRect().height;
  let d2Width = div2.getBoundingClientRect().width;
  let d2Top = d2OffsetTop + d2Height;
  let d2Left = d2OffsetLeft + d2Width;
  return !(d1Top < d2OffsetTop || d1OffsetTop > d2Top || d1Left < d2OffsetLeft || d1OffsetLeft > d2Left);
}

let greenPressed = false;
let redPressed = false;
let yellowPressed = false;
let bluePressed = false;
let orangePressed = false;

document.addEventListener("keydown", (event) => {
  if (!greenPressed && event.key == "a") {
    console.log(event.key);
    greenPressed = true;
    let btnGreen = document.getElementById("hitnotegreen");
    btnGreen.classList.add("hitnote-pressed");
    let greenNotes = document.getElementsByClassName("note-green");
    let greenNote = greenNotes[(greenNotes.length - 1)];
    if (greenNote) console.log(isColliding(btnGreen, greenNote));
  } else if (!redPressed && event.key == "s") {
    console.log(event.key);
    redPressed = true;
    let btnRed = document.getElementById("hitnotered");
    btnRed.classList.add("hitnote-pressed");
    let redNotes = document.getElementsByClassName("note-red");
    let redNote = redNotes[(redNotes.length - 1)];
    if (redNote) console.log(isColliding(btnRed, redNote));
  } else if (!yellowPressed && event.key == "j") {
    console.log(event.key);
    yellowPressed = true;
    let btnYellow = document.getElementById("hitnoteyellow");
    btnYellow.classList.add("hitnote-pressed");
    let yellowNotes = document.getElementsByClassName("note-yellow");
    let yellowNote = yellowNotes[(yellowNotes.length - 1)];
    if (yellowNote) console.log(isColliding(btnYellow, yellowNote));
  } else if (!bluePressed && event.key == "k") {
    console.log(event.key);
    bluePressed = true;
    let btnBlue = document.getElementById("hitnoteblue");
    btnBlue.classList.add("hitnote-pressed");
    let blueNotes = document.getElementsByClassName("note-blue");
    let blueNote = blueNotes[(blueNotes.length - 1)];
    if (blueNote) console.log(isColliding(btnBlue, blueNote));
  } else if (!orangePressed && event.key == "l") {
    console.log(event.key);
    orangePressed = true;
    let btnOrange = document.getElementById("hitnoteorange");
    btnOrange.classList.add("hitnote-pressed");
    let orangeNotes = document.getElementsByClassName("note-orange");
    let orangeNote = orangeNotes[(orangeNotes.length - 1)];
    if (orangeNote) console.log(isColliding(btnOrange, orangeNote));
  } else if (event.key == "q") {
    generateNote(0);
  } else if (event.key == "w") {
    generateNote(1);
  } else if (event.key == "u") {
    generateNote(2);
  } else if (event.key == "i") {
    generateNote(3);
  } else if (event.key == "o") {
    generateNote(4);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key == "a") {
    console.log(event.key);
    let btnGreen = document.getElementById("hitnotegreen");
    btnGreen.classList.remove("hitnote-pressed");
    greenPressed = false;
  } else if (event.key == "s") {
    console.log(event.key);
    let btnRed = document.getElementById("hitnotered");
    btnRed.classList.remove("hitnote-pressed");
    redPressed = false;
  } else if (event.key == "j") {
    console.log(event.key);
    let btnYellow = document.getElementById("hitnoteyellow");
    btnYellow.classList.remove("hitnote-pressed");
    yellowPressed = false;
  } else if (event.key == "k") {
    console.log(event.key);
    let btnBlue = document.getElementById("hitnoteblue");
    btnBlue.classList.remove("hitnote-pressed");
    bluePressed = false;
  } else if (event.key == "l") {
    console.log(event.key);
    let btnOrange = document.getElementById("hitnoteorange");
    btnOrange.classList.remove("hitnote-pressed");
    orangePressed = false;
  }
});
