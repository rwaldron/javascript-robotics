// =======================
// Derived from the work done by @makenai on the SumoBot Jr
// =======================

var five = require("johnny-five");
var keypress = require('keypress');

var opts = {};
opts.port = process.argv[2] || "";

keypress(process.stdin);

var board = new five.Board(opts);

board.on("ready", function() {

    console.log("Control the bot with the arrow keys, SPACE to stop, Q to exit.")

    var left_wheel  = new five.Servo({ pin:  9, type: 'continuous' });
    var right_wheel = new five.Servo({ pin: 8, type: 'continuous'  });

    process.stdin.resume(); 
    process.stdin.setEncoding('utf8'); 
    process.stdin.setRawMode(true); 

    process.stdin.on('keypress', function (ch, key) {

        if ( !key ) return;

        if ( key.name == 'q' ) {
            console.log('Quitting');
            process.exit();
        } else if ( key.name == 'up' ) {

            console.log('Forward');
            left_wheel.ccw();
            right_wheel.cw();

        } else if ( key.name == 'down' ) {

            console.log('Backward');
            left_wheel.cw();
            right_wheel.ccw();      

        } else if ( key.name == 'left' ) {

            console.log('Left');
            left_wheel.ccw();
            right_wheel.ccw();      

        } else if ( key.name == 'right' ) {

            console.log('Right');
            left_wheel.cw();
            right_wheel.cw();

        } else if ( key.name == 'space' ) {

            console.log('Stopping');
            left_wheel.to(90);
            right_wheel.to(90);
        }
    });
});
