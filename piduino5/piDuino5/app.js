var five = require('johnny-five'),
    board = new five.Board(),
    PORT = 8080,
    WebSocketServer = require('ws').Server,
    localtunnel = require('localtunnel'),
    request = require('request'),
    networkInterfaces = require('os').networkInterfaces(),
    motors = {},
    led = {};

var wss = new WebSocketServer({port: PORT});

// board setup
board.on('ready', function() {
  motors = {
    left: new five.Motor({
      pins: {
        pwm: 3,
        dir: 12
      },
      invertPWM: true
    }),
    right: new five.Motor({
      pins: {
        pwm: 5,
        dir: 8
      },
      invertPWM: true
    })
  };

  led = new five.Led(13);
});

// ws setup
wss.on('connection', function(ws) {
  ws.on('message', function(data, flags) {
    if(data === 'forward') {
      forward(255);
    } else if(data === 'reverse') {
      reverse(255);
    } else if(data === 'turnRight') {
      turnRight(255);
    } else if(data === 'turnLeft') {
      turnLeft(255);
    } else if(data === 'stop') {
      stop();
    } else if(data === 'blink') {
      blink();
    } else if(data === 'noBlink') {
      noBlink();
    }
  });

  ws.on('close', function() {
    console.log('WebSocket connection closed');
  });

  ws.on('error', function(e) {
    console.log('WebSocket error: %s', e.message);
  });

});

// motor functions
var stop = function() {
  motors.left.stop();
  motors.right.stop();
};

var forward = function(speed) {
  motors.left.forward(speed);
  motors.right.forward(speed);
};

var reverse = function(speed) {
  motors.left.reverse(speed);
  motors.right.reverse(speed);
};

var turnRight = function(speed) {
  motors.left.forward(speed);
  motors.right.reverse(speed);
};

var turnLeft = function(speed) {
  motors.left.reverse(speed);
  motors.right.forward(speed);
};

var blink = function() {
  led.strobe(300);
};

var noBlink = function() {
  led.stop();
};

// create localtunnel and send to the webapp
localtunnel(PORT, function(err, tunnel) {
  var webappURL = 'http://localhost:3000',
      localIP;

  console.log('localtunnel address is %s', tunnel.url);

  // local_ip is useful for debugging
  // use en0 if on mac while developing
  if(networkInterfaces.wlan0) {
    localIP = networkInterfaces.wlan0[0].address;
  } else {
    localIP = networkInterfaces.en0[1].address;
  }

  webappURL += '/locate?local_ip=' + localIP;
  webappURL += '&public_url=' + tunnel.url;
  
  request.post(webappURL, function(e, r, body) {
    if (err) {
      return console.error('POST request failed:', err);
    }
  });
});