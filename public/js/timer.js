var tickAudio = new Audio("http://freesound.org/data/previews/137/137227_1735491-lq.mp3");

var defaults = {}
  , one_second = 1000
  , one_minute = one_second * 60
  , one_hour = one_minute * 60
  , one_day = one_hour * 24
  , startDate = new Date()
  , face = document.getElementById('lazy')
  ;

  //$('input').bootstrapNumber();
var sec;

var imgs = document.querySelectorAll('.handspan');

for ( var i = 0; i < imgs.length; i++ ) {
    imgs[i].onclick = toggleAnimation;
    imgs[i].style.webkitAnimationPlayState = 'running';
}

function toggleAnimation() {
    var style;
    for ( var i = 0; i < imgs.length; i++ ) {
        style = imgs[i].style;
        if ( style.webkitAnimationPlayState === 'running' ) {
            style.webkitAnimationPlayState = 'paused';
            document.body.className = 'paused';
            console.log('toggle paused' + i);

        } else {
            style.webkitAnimationPlayState = 'running';
            document.body.className = '';
            console.log('toggle running' + i);
        }
    }
}

toggleAnimation();

function start() {

  hour = document.getElementById("hour").value;

  if(hour < 10){
    if(hour == ''){
      hour = '00';
    }else{
      hour = '0'+ hour;
    }
  }
  console.log("hours: " + hour);
  sec = document.getElementById("sec").value;

  if(sec < 10){
    if(sec == ''){
      sec = '00';
    }else{
      sec = '0'+ sec;
    }
  }
  console.log("seconds: " + sec);
  toggleAnimation();

  if(timerIsOn) {
    window.clearInterval(theInterval);
    timerIsOn = false;
    thePauseTime = new Date();
  }
  else {
    if(startDate == false) startDate = new Date();
    else {
        startDate = (new Date() - ((new Date() - startDate) - (new Date() - thePauseTime)));
    }
    theInterval = window.setInterval(tick, 250);
    timerIsOn = true;
  }
}

startDate = false;
var thePauseTime = false;
var timerIsOn = false;
var theInterval;
var timerNotify = false;

function tick() {

  var now = new Date()
    , elapsed = now - startDate
    , parts = [];
  parts[0] = '' + Math.floor( elapsed / one_hour );
  parts[1] = '' + Math.floor( (elapsed % one_hour) / one_minute );
  parts[2] = '' + Math.floor( ( (elapsed % one_hour) % one_minute ) / one_second );

  parts[0] = (parts[0].length == 1) ? '0' + parts[0] : parts[0];
  parts[1] = (parts[1].length == 1) ? '0' + parts[1] : parts[1];
  parts[2] = (parts[2].length == 1) ? '0' + parts[2] : parts[2];



  if(parts[1] == hour && parts[2] == sec){
    tickAudio.play();
    start();
    if(timerNotify == false){
      $('#notificationBlock').notification('Timer is done!', {stickMode: true});
      timerNotify = true;
    }
  }

  face.innerText = parts.join(':');
}
