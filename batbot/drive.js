
var five = require('johnny-five'),
    dualshock = require('dualshock-controller');

var board, leftServo, rightServo, ds;

ds = dualshock({
  config: 'dualShock3'
});

ds.on('error', function (data) {
  console.log('ruh roh something broke');
});

board = new five.Board();

board.on("ready", function () {
  rightServo = new five.Servo({
    pin: 10,
    type: 'continuous'
  });
  leftServo = new five.Servo({
    pin: 11,
    type: 'continuous'
  });

  leftServo.stop();
  rightServo.stop();

  var moveSpeed = 0.1;

  function stop() {
    leftServo.stop();
    rightServo.stop();
  }

  function turn (rightOn, leftOn, timeout) {
    if (rightOn) {
      rightServo.cw(moveSpeed);
    } else {
      rightServo.ccw(moveSpeed);
    }

    if (leftOn) {
      leftServo.ccw(moveSpeed);
    } else {
      leftServo.cw(moveSpeed);
    }

    if (timeout) {
      setTimeout(stop, timeout);
    }
  }

  function turnLeft (timeout) {
    console.log('turning left!');
    turn (false, true, timeout);
  }

  function turnRight (timeout) {
    console.log('turning right!');
    turn (true, false, timeout);
  }

  function goStraight (timeout) {
    console.log('going straight!');
    turn (true, true, timeout);
  }

  function goBack (timeout) {
    console.log('back it up!');
    turn (false, false, timeout);
  }

  ds.on('square:press', function () {
    turnLeft();
  });

  ds.on('square:release', function () {
    stop();
  });

  ds.on('circle:press', function () {
    turnRight();
  });

  ds.on('circle:release', function () {
    stop();
  });

  ds.on('triangle:press', function () {
    goStraight();
  });

  ds.on('triangle:release', function () {
    stop();
  });

  ds.on('x:press', function () {
    goBack();
  });

  ds.on('x:release', function () {
    stop();
  });

});

ds.connect();
