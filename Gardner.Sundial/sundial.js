/* global console, setTimeout, setInterval, clearTimeout */
'use strict';
var five        = require('johnny-five'),
    sunCalc     = require('suncalc');

var board = new five.Board(),
    servos,
    sundial;

servos = {
  azimuth: {
    pin        : 9,
    range      : [7, 172],
    isInverted : true,
    center     : true
  },
  elevation: {
    pin        : 10,
    range      : [7, 172],
    isInverted : true,
    center     : true
  }
};

sundial = {
  latitude     : 21.307,
  longitude    : -157.859,
  tickInterval : 5000,
  msPerDegree  : 50
};

function sunPositionInDegrees(date, latitude, longitude) {
  var positionNow = sunCalc.getPosition(date, latitude, longitude);
  return {
    azimuth: Math.round((positionNow.azimuth + Math.PI) * 180 / Math.PI),
    elevation: Math.round(positionNow.altitude * 180 / Math.PI)
  };
}

board.on('ready', function() {
  var azimuthServo   = new five.Servo(servos.azimuth),
      elevationServo = new five.Servo(servos.elevation),
      ticker;

  var tick = function tickTock() {
    console.log('tick!');
    var position  = sunPositionInDegrees(new Date(),
          sundial.latitude,
          sundial.longitude
        ),
        isFlipped = (position.azimuth > 180) ? true : false,
        aPos      = (isFlipped) ? position.azimuth - 180 : position.azimuth,
        ePos      = (isFlipped) ? 180 - position.elevation  : position.elevation,
        aChange, eChange, aTime, eTime;

    aChange   = Math.abs(azimuthServo.value - aPos);
    eChange   = Math.abs(elevationServo.value - ePos);
    aTime     = aChange * sundial.msPerDegree;
    eTime     = eChange * sundial.msPerDegree;

    if (ticker) clearTimeout(ticker);

    if (position.elevation < 0) {
      console.log('It is nighttime, silly!');
      ePos = 0;
    }
    if (aChange || eChange) {
      console.log('Sun position', position);
      azimuthServo.to(aPos, aTime);
      elevationServo.to(ePos, eTime);
    }
    ticker = setTimeout(tick, sundial.tickInterval + eTime + aTime);
  };

  tick();

  this.repl.inject({
    aServo: azimuthServo,
    eServo: elevationServo,
    tick   : tick,
    ticker : ticker
  });
});
