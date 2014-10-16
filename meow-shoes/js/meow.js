// playback object, will contain all sequenced sounds
var playback = [];

// set up the defaults
var freestyle    = false,
    currentVoice = 'meow',
    context      = new webkitAudioContext(),
    browWidth    = $(window).width(),
    browHeight   = $(window).height(),
    source,
    sequencer;

var bar = 16,                 // 16 beats in the bar
    tempo = 120,              // bpm
    beat = 60 / tempo * 1000, // beat duration
    curBeat = 0;

// load all of the sounds and then when ready kick off the meow shoes setup and bindings
var assets = new AbbeyLoad([voiceSet], function (buffers) {
  setupMeowShoes(buffers)
});

// this will push a short sound for each beat to the playback object to help the user time their foot taps
function createMetronome() {
  for (i = 0; i < bar; i++) {
    playback.push({position: i, sensor: 'm'});
  }
}

// play that sound
function playSound(buffer, time) {
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(time);
}

// pretty pictures appearing in random places
function playVisual(image) {
  // create node string
  var picture = $('<img class="vish" src="/imgs/' + image + '"/>');
  // add the image node in the body
  $('body').append(picture);

  // place it on the page at random, animate in and out
  picture.css({
            'top': Math.floor((Math.random() * browHeight) + 1 ) + 'px', 
            'left': Math.floor((Math.random() * browWidth) + 1 ) + 'px' 
      })
      .animate({'opacity':1}, 500)
      .animate({'opacity':0}, 500, function() {
        picture.remove();
      });
}

function bindClicks() {
  // stop button
  $('#stopMusic').click(function(e) {
      e.preventDefault();
      clearInterval(sequencer);
  });

  // let's go freestyle! This button is a toggle
  $('#freeStyle').click(function(e) {
      e.preventDefault();
      freestyle ? false : true;
  });

  // change voices
  $('.changeMode').click(function(e) {
    e.preventDefault();
    // should I change this to current target?
    var newMode = e.target.id.substr(0, e.target.id.length - 4);
    currentVoice = newMode;
  });
};

// set up the shoes
function setupMeowShoes(buffers) {

  // add metronome to bopper
  createMetronome();
  // Loop every n milliseconds, executing a task each time
  // the most primitive form of a loop sequencer as a simple example
  sequencer = setInterval(function() {

    playback.forEach(function(note){

      if (note.position === curBeat) {
        // play the sound
        playSound(buffers[note.sensor], 0);
        // play a visual
        playVisual(visualSet[note.sensor]);
      }

    });

    console.log(curBeat);
    // reset beat back to 0
    curBeat = (curBeat === bar - 1) ? 0 : curBeat += 1;

  }, beat);

  // set up the socket connection
  socket = io('http://localhost');

  socket.on('tap', function (data) {
    // sensorNum is no longer an accurately descriptive variable name
    var sensorNum = data,
        sound = currentVoice + '_' + sensorNum;

    // testing...
    console.log(sound);
    console.log(data);

    // play matching sound immediately to confirm to user
    playSound(buffers[sound], 0);
    // play a visual also
    playVisual(visualSet[sound]);

    // if it's not freestyle queue the sound up
    if (!freestyle) {
      // push the note to the queue, the temporal way
      playback.push({'position': curBeat, 'sensor': sound})
    }

  }); // end socket.on

  bindClicks();

}; // end setupMeowShoes