var http = require('http'),
    five = require('johnny-five'),
    board = new five.Board(),
    fs = require('fs');

function handler(req, res) {
  var path = __dirname;

  if (req.url === "/") {
    path += "/index.html";
  } else {
    path += req.url;
  }

  fs.readFile(path, function(err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error loading " + path);
    }

    res.writeHead(200);
    res.end(data);
  });
}

var app = http.createServer(handler);
var io = require('socket.io')(app);

app.listen(3000);

var tapTimeoutThresh = 30;
var pressureThresh = 800;

var shoes = {
      left: {
        toe: { val: 0, timeout: 0 },
        heel: { val: 0, timeout: 0 }
      },
      right: {
        toe: { val: 0, timeout: 0 },
        heel: { val: 0, timeout: 0 }
      }
    };

board.on('ready', function() {
  console.log('MAOW!');

  var leftToe = new five.Sensor({
    pin: 'A0',
    freq: 25
  });

  var leftHeel = new five.Sensor({
    pin: 'A1',
    freq: 25
  });

  var rightToe = new five.Sensor({
    pin: 'A2',
    freq: 25
  });

  var rightHeel = new five.Sensor({
    pin: 'A3',
    freq: 25
  });

  rightToe.on('data', function() {
    console.log(this.value);
    shoes.right.toe.val = this.value;
  });

  rightHeel.on('data', function() {
    console.log(this.value);
    shoes.right.heel.val = this.value;
  });

  leftToe.on('data', function() {
    console.log(this.value);
    shoes.left.toe.val = this.value;
  });

  leftHeel.on('data', function() {
   console.log(this.value);
    shoes.left.heel.val = this.value;
  });

  // main loop to calc foot tap logic
  this.loop(10, function() {

    // loop through left and right shoes
    for (var foot in shoes) {

      if (!shoes.hasOwnProperty(foot)) continue;
      // if user is not standing (both sensors down in a foot)
      if (!isStanding(shoes[foot])) {
        // loop through heel and toe
        for (var sensor in shoes[foot]) {

          if (!shoes[foot].hasOwnProperty(sensor)) continue;
          var footSensor = shoes[foot][sensor];
          var timeout = shoes[foot][sensor].timeout;

          if (isPressed(shoes[foot][sensor].val)) {
            shoes[foot][sensor].timeout += 1;
            // if sensor pressed for long enough, it'll become an official tap
            if (timeout > tapTimeoutThresh) {
              console.log('emit', foot + sensor);
              io.emit('tap', foot + sensor);
              shoes[foot][sensor].timeout = 0;
            }

          } else {
            shoes[foot][sensor].timeout = 0;
          }
        }
      // if standing, reset feet sensor timeouts
      } else {
        shoes[foot].toe.timeout = 0;
        shoes[foot].heel.timeout = 0;
      }

    } // end loop  

 }); // end j5 main loop

}); //end board

function isPressed(val) {
  if (val > pressureThresh) {
    return true;
  } else {
    return false;
  } 
}

function isStanding(foot) {
  if (isPressed(foot.toe.val) && isPressed(foot.heel.val)) {
    return true;
  } else {
    return false;
  } 
}