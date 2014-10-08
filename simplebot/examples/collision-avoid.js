var five = require("johnny-five");
var temporal = require("temporal");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);

board.on("ready", function() {

    console.log("Bot will drive forward until it senses an obstacle.");
    console.log("It will then back up, change direction and go forward again");

    var left_wheel  = new five.Servo({ pin:  9, type: 'continuous' });
    var right_wheel = new five.Servo({ pin: 8, type: 'continuous'  });
    var ping = new five.Ping({pin: 7}); //<1>
    var state = "DRIVING";
    forward();

    ping.on("change", function() { //<2>
        if (this.cm < 15 && state != "DRIVING") {
            state = "AVOID_COLLISION";

            temporal.queue([ //<3>
                {
                    // stop dead
                    task: function() {
                        left_wheel.stop();
                        right_wheel.stop();
                    },
                },
                {
                    // back up
                    delay: 500
                    task: function() {
                        backward();
                    },
                },
                {
                    // spin
                    delay: 1000
                    task: function() {
                        left_wheel.cw();
                        right_wheel.cw();
                    },
                },
                {
                    // back up
                    delay: 1500
                    task: function() {
                        forward(); //<4>
                        state = "DRIVING";
                    },
                },
            ])
        }
    });


    // helper functions for driving.
    function forward() {
        left_wheel.cw();
        right_wheel.ccw();
    }

    function backward() {
        left_wheel.ccw();
        right_wheel.cw();
    }

});
