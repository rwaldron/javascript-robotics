// Tests whether your servos are going the right way and all working
// properly or not. Assumes that the left servo is on pin 9 and the right
// wheel is on pin 8.
//
// call as:
// node examples/test_servos.js PORT
 
var five = require("johnny-five");
var temporal = require("temporal");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);

board.on("ready", function() {

    console.log("This is a servo tester to see if everything is running properly");
    console.log("Servos should run forward for 3s, stop for 3s, reverse 3s and stop");

    var left_wheel  = new five.Servo({ pin:  9, type: 'continuous' });
    var right_wheel = new five.Servo({ pin: 8, type: 'continuous'  });
    left_wheel.stop();
    right_wheel.stop();

    temporal.queue([
        {
            delay: 5000,
            task: function() {
                console.log("going forward");
                left_wheel.cw();
                right_wheel.ccw();
            },
        },
        {
            delay: 3000,
            task: function() {
                console.log("stopping");
                left_wheel.stop();
                right_wheel.stop();
            },
        },
        {        
            delay: 3000,
            task: function() {
                console.log("going backward");
                left_wheel.ccw();
                right_wheel.cw();
            },
        },
        {
            delay: 3000,
            task: function() {
                console.log("stopping");
                left_wheel.stop();
                right_wheel.stop();
            },
        },
        {
            delay: 1500,
            task: function() {
                console.log("Test complete. Exiting.");
                process.exit();
            },
        },
    ]);

});


