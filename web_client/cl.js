// YOUTUBE
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";

var firstScriptTag = document.getElementsByTagName('script')[0];
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
  }
}

// GAME
const sock = io();

sock.on("msg", (text) => {
    console.log(text);
    document.getElementById("test").innerHTML = text;
});
