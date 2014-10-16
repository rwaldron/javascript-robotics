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

  this.repl.inject({
    light: light
  });

  client.on('connected', function(){
    var strip = client.add_strip({
      length: 25
    });

    var pixels = [];

    light.scale([0, 255]).on('data', function(){
      pixels = [];
      for(var i = 0; i < 120; i++){
        pixels.push([this.value, this.value, this.value]);
      }
      client.put_pixels(strip.id, pixels);
    });
  });
});
