var five = require('johnny-five'),
    array = require('array-extended'),
    temporal = require('temporal'),
    ds = require('dualshock-controller')({config: 'dualShock3'});

var board, sonarServo, range, leftServo, rightServo;

board = new five.Board();
range = [10, 170];

board.on("ready", function () {
  rightServo = new five.Servo({
    pin: 10,
    type: 'continuous'
  });
  leftServo = new five.Servo({
    pin: 11,
    type: 'continuous'
  });
  sonarServo = new five.Servo({
    pin: 12,
    range: range
  });
  sonar = new five.Sonar({
    pin: 'A2',
    freq: 20
  });

  leftServo.stop();
  rightServo.stop();

  sonarServo.move(15);
  var angle = 15,
      sonarStep = 10,
      moveSpeed = 0.1,
      moveTimeout = 500;

  ds.on('r2:press', function () {
    console.log(sonar.cm);
  });
  ds.on('l2:press', function () {
    angle = (range[0] + range[1]) / 2;
    sonarServo.center();
  });
  ds.on('dPadLeft:press', function () {
    angle = angle < range[0] ? range[0] : angle + sonarStep;
    sonarServo.move(angle);
  });
  ds.on('dpadRight:press', function () {
    angle = angle > range[1] ? range[1] : angle - sonarStep;
    sonarServo.move(angle);
  });
  ds.on('dpadUp:press', function () {
    angle = range[1];
    sonarServo.max();
  });
  ds.on('dpadDown:press', function () {
    angle = range[0];
    sonarServo.min();
  });

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
    turn (false, true, timeout);
  }

  function turnRight (timeout) {
    turn (true, false, timeout);
  }

  function goStraight (timeout) {
    turn (true, true, timeout);
  }

  function goBack (timeout) {
    turn (false, false, timeout);
  }

  ds.on('square:press', function (data) {
    turnLeft();
  });

  ds.on('square:release', function (data) {
    stop();
  });

  ds.on('circle:press', function (data) {
    turnRight();
  });

  ds.on('circle:release', function (data) {
    stop();
  });

  ds.on('triangle:press', function () {
    goStraight();
  });

  ds.on('triangle:release', function (data) {
    stop();
  });

  ds.on('x:press', function () {
    goBack();
  });

  ds.on('x:release', function (data) {
    stop();
  });

  var scanSpot = function (cb) {
    var sonarServoReadings = [];
    var read = setInterval(function () {
      sonarServoReadings.push(sonar.cm);
      if (sonarServoReadings.length === 10) {
        clearInterval(read);
        console.log(array.avg(sonarServoReadings));
        cb(null, array.avg(sonarServoReadings));
      }
    }, 100);
  }

  ds.on('select:press', function () {
    console.log('IN AUTO MODE');
    // scan box
    var minVal = 0;
    var temporalLoop = setInterval(function () {
      ds.on('r1:press', function () {
        clearInterval(temporalLoop);
      });

      var scans = [];
      temporal.queue([
        {
          delay: 0,
          task: function () {
            sonarServo.max();
            scanSpot(function (err, val) {
              scans.push({dir: 'left', val: val})
              // console.log('left: ', val);
            });
          }
        },
        {
          delay: 1500,
          task: function () {
            sonarServo.center();
            scanSpot(function (err, val) {
              scans.push({dir: 'center', val: val})
              // console.log('center: ', val);
            });
          }
        },
        {
          delay: 1500,
          task: function () {
            sonarServo.min();
            scanSpot(function (err, val) {
              scans.push({dir: 'right', val: val})
              // console.log('right: ', val);
            });
          }
        },
        {
          delay: 1500,
          task: function () {
            WALL_THRESHOLD = 15;
            minVal = array.min(scans, 'val').val;
            var maxVal = array.max(scans, 'val');
            console.log(maxVal);
            var direction = maxVal.val > WALL_THRESHOLD ? maxVal.dir : 'right';
            console.log(direction);
            if (direction === 'center') {
              goStraight(1000);
            } else if (direction === 'left') {
              turnLeft(700);
            } else {
              turnRight(700);
            }
          }
        }
      ])
    }, 6000);
  });

});

ds.connect();
