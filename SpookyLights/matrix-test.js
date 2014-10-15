var five = require("johnny-five.js");
var board = new five.Board();

board.on("ready", function() {

  var matrix = new five.Led.Matrix({
    devices: 7,
    controller: "HT16K33",
    isBicolor: true
  });

  var heart = [
    "01100110",
    "10011001",
    "10000001",
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00000000"
  ];

  matrix.draw(heart);

  this.repl.inject({
    m: matrix,
    heart: heart
  });

});