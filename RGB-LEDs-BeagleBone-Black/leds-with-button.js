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
  var button = new Five.Button('P9_39'); //A0 in Arduino Mapping

  client.on('connected', function(){
    var strip = client.add_strip({
      length: 25
    });

    var pixels = [], animationInterval;

    reset_strip();
    start_animation();

    button.on("down", function(){
      reset_strip();
      start_animation();
    })

    function reset_strip(){
      clearInterval(animationInterval);

      pixels = [];
      for(var i = 0; i < strip.length; i++){
        pixels.push([0, 0, 0]);
      }

      client.put_pixels(strip.id, pixels);
    }

    function start_animation(){
      var index = 0;
      animationInterval = setInterval(function(){
        randomColor = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];

        client.put_pixel(strip.id, index, randomColor);

        index++;
        if(index == strip.length){
          index = 0;
        }
      }, 100);
    }


  });
});
