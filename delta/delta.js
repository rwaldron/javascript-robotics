five = require("johnny-five"),
  temporal = require("temporal"),
  ik = require("./ik");

board = new five.Board({
  debug: false
});

board.on("ready", function() {
    // Setup
    servo1 = five.Servo({
        pin: 9,
        range: [0,90]
    });
    servo2 = five.Servo({
        pin: 10,
        range: [0,90]
    });
    servo3 = five.Servo({
        pin: 11,
        range: [0, 90]
    });

    servo1.on("error", function() {
      console.log(arguments);
    })
    servo2.on("error", function() {
      console.log(arguments);
    })
    servo3.on("error", function() {
      console.log(arguments);
    })

    board.repl.inject({
      servo1: servo1,
      s1: servo1,
      servo2: servo2,
      s2: servo2,
      servo3: servo3,
      s3: servo3,
    });

    go(0,0,-150);

    var test = function() {
      temporal.queue([
        { delay: 250, task: function() { servo1.to(60); } },
        { delay: 250, task: function() { servo2.to(60); } },
        { delay: 250, task: function() { servo3.to(60); } },
        { delay: 250, task: function() { go(0,0,-150, 1000);  } },
        { delay: 1250, task: function() { go(0,0,-190, 1000);  } },
        { delay: 1250, task: function() { servo1.to(20); } },
        { delay: 250, task: function() { servo2.to(20); } },
        { delay: 250, task: function() { servo3.to(20); } }
      ]);
    }
    test();

});


Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

rotate = function(x,y) {
    var theta = -60;
    x1 = x * cos(theta) - y * sin(theta);
    y1 = y * cos(theta) + x * sin(theta);
    return [x1,y1]
}

reflect = function(x,y) {
    var theta = 0;
    x1 = x;
    y1 = x * sin(2*theta) - y * cos(2*theta);
    return [x1,y1]
}


// A sine function for working with degrees, not radians
sin = function(degree) {
    return Math.sin(Math.PI * (degree/180));
}

// A cosine function for working with degrees, not radians
cos = function(degree) {
    return Math.cos(Math.PI * (degree/180));
}


// TODO: pull out map values to config file or some other solution.
go = function(x, y, z, ms) {
  reflected = reflect(x,y);
  rotated = rotate(reflected[0],reflected[1]);
  
  angles = ik.inverse(rotated[0], rotated[1], z);
  servo1.to((angles[1]).map( 0 , 90 , 8 , 90 ), ms);
  servo2.to((angles[2]).map( 0 , 90 , 8 , 90 ), ms);
  servo3.to((angles[3]).map( 0 , 90 , 8 , 90 ), ms);
  console.log(angles);
}

position = function() {
  return ik.forward(servo1.last.degrees, servo2.last.degrees, servo3.last.degrees);
}

