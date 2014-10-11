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
        if (this.cm < 15 && state == "DRIVING") {
            state = "AVOID_COLLISION";
            temporal.queue([ //<3>
                {
                    // stop dead
                    delay: 10,
                    task: stop,
                },
                {
                    // back up
                    delay: 3000,
                    task: backward,
                },
                {
                    // stop
                    delay: 1500,
                    task: stop,
                },
                {
                    // spin
                    delay: 3000,
                    task: spin, 
                },
                {
                    // stop
                    delay: 1000,
                    task: stop,
                },
                {
                    // fwd
                    delay: 3000,
                    task: forward, //<4>
                },
            ])
        }
    });

    // helper functions for driving.
    function forward() {
        console.log("forward");
        state = "DRIVING";
        left_wheel.cw();
        right_wheel.ccw();
    }

    function backward() {
        console.log("back");
        left_wheel.ccw();
        right_wheel.cw();
    }

    function stop() {
        console.log("stop");
        left_wheel.to(92);
        right_wheel.to(94);
    }

    function spin() {
        console.log("spin");
        left_wheel.cw();
        right_wheel.cw();
    }
});
