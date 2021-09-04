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

function elementAnimate(item) {
  item.animate([
    { top: "25%", left: "20%" },
    { top: "115%", left: "-45%", width: "30%", height: "10%" }
  ], {
    duration: 6000,
    easing: 'linear',
    iterations: 1,
    direction: 'normal',
    fill: 'forwards'
  }).onfinish = function() {
    console.log("TERMINO");
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
  }
  neck.appendChild(note);
  elementAnimate(note);
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

setTimeout(() => {
  generateNote(0);
}, 3000);

document.addEventListener("keypress", (event) => {
  console.log(event.key);
  if (event.key == "a") {
    let btnGreen = document.getElementById("hitnotegreen");
    let greenNotes = document.getElementsByClassName("note-green");
    let greenNote = greenNotes[(greenNotes.length - 1)];
    if (greenNote) console.log(isColliding(btnGreen, greenNote));
  } else if (event.key == "q") {
    generateNote(0);
  }
});
