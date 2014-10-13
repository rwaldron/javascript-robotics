var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
  var shoulder = new five.Servo(3);
  shoulder.to(90);

  var elbow = new five.Servo(6);
  elbow.to(90);

  var wrist = new five.Servo(5);
  wrist.to(90);

  setTimeout(function() {
    process.exit();
  }, 1000);
});
