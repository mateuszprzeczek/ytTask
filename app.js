let input = document.querySelector('input');
let submitBtn = document.querySelector('button');
let iframeYT = document.querySelector('iframe');
let count = document.querySelector('.count');
let counter = document.querySelector('.counter');


let initCounter;
let duration;
let startCounter;
let currTime;


function extractVideoID(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var reg2 = /[^"&?\/\s]{11}/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
      return match[7];
    } else if(url.match(reg2)) {
      return url;
    }
     else {
      alert("Nie ma takiego filmu");
    }
  }

  function clear() {
    clearTimeout(initCounter);
}


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.stopVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    duration = player.getDuration();
     initCounter = setTimeout(countDown, Math.floor(duration*1000) - 11000);
    done = true;
  }
  else if(event.data === 2) {
    clearTimeout(initCounter);

} else if(event.data === 1) {
    currTime = Math.floor(player.getCurrentTime()) * 1000;
    initCounter = setTimeout(countDown, Math.floor(duration*1000) - 11000 - currTime);
  }
}

function countDown() {
    let timer = 10;
    let flooredDur = duration - Math.floor(currTime / 1000);
    if(flooredDur < timer) {
            timer = Math.floor(flooredDur);
        }
    startCounter = setInterval(() => {
        
        count.style.display = 'flex';
        counter.style.display = 'block';
        if (timer <= -1) {
            clearInterval(startCounter);
            count.style.display = 'none';
            counter.style.display = 'none';
            return;
        }
        counter.textContent = timer;
        timer-=1;
    }, 1000);
}

function loadVideo(videoID) {
    if(player) { 
        player.loadVideoById(videoID);
      }
  }

const submit = (e) => {
    e.preventDefault();
    count.style.display = 'none';
    counter.style.display = 'none';
    clearTimeout(initCounter);
    clearInterval(startCounter)
    let value = input.value;
    const url = extractVideoID(value);
    loadVideo(url);
    
}

submitBtn.addEventListener('click', submit)