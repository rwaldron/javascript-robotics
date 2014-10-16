'use strict';
var five        = require('johnny-five');

var board,
    azimuthServo,
    elevationServo;

board = new five.Board();

board.on('ready', function() {
  azimuthServo = new five.Servo({
    center     : true,
    isInverted : true,
    pin        : 9
  });
  elevationServo = new five.Servo({
    center     : true,
    isInverted : true,
    pin        : 10
  });

  this.repl.inject({
    aServo: azimuthServo,
    eServo: elevationServo
  });
});
