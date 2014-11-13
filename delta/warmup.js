/* 
  =========================
  Warming up a delta robot!
  =========================

  Running this code will show you if your delta is put together
  correct and has the right range of motion and enough flexibility
  in its joints.
  
*/

var five = require("johnny-five"),
  temporal = require("temporal"),
  board = new five.Board();

board.on("ready", function() {
    var servo1 = five.Servo({ pin: 9, range: [0,90] }),
      servo2 = five.Servo({ pin: 10, range: [0,90] }),
      servo3 = five.Servo({ pin: 11, range: [0,90] });

    // Initialize position
    servo1.to(20);
    servo2.to(20);
    servo3.to(20);

    // Warmup Routine
    var repeat = function() {
      temporal.queue([
        { delay: 250, task: function() { servo1.to(60); } },
        { delay: 250, task: function() { servo2.to(60); } },
        { delay: 250, task: function() { servo3.to(60); } },
        { delay: 250, task: function() { servo1.to(20); } },
        { delay: 250, task: function() { servo2.to(20); } },
        { delay: 250, task: function() { servo3.to(20); } },
        { delay: 250, task: repeat }
      ]);
    };
    repeat();
});