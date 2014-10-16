var Five = require('johnny-five');
var BeagleBone = require('beaglebone-io');
var board = new Five.Board({
  io: new BeagleBone()
});

var opc_client = require('open-pixel-control');

var client = new opc_client({
  address: '127.0.0.1',
  port: 7890
});


board.on('ready', function () {
  this.digitalWrite(5, this.HIGH);
  var light = new Five.Sensor('P9_40'); //A1 in Arduino Mapping
  var accelerometer = new Five.Accelerometer('P9_37', 'P9_38', 'P9_35');
  this.repl.inject({
    light: light
  });

  client.on('connected', function(){
    var strip = client.add_strip({
      length: 25
    });

    var pixels = [];
    var maxValue = 0;

    light.scale([0, 255]).on('data', function(){
      maxValue = this.value;
    });

    accelerometer.scale([-1, 1]).on('data', function(){
      pixels = [];

      var xValue = Math.abs(this.x.value),
          yValue = Math.abs(this.y.value),
          xValue = Math.abs(this.z.value),
          red = xValue * maxValue,
          green = yValue * maxValue,
          blue = zValue * maxValue;

      for(var i = 0; i < strip.length; i++){
        pixels.push([red, green, blue]);
      }

      client.put_pixels(strip.id, pixels)
    });
  });
});
