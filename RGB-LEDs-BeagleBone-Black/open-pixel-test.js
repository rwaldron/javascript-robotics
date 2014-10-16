var opc_client = require('open-pixel-control');

var client = new opc_client({
  address: '127.0.0.1',
  port: 7890
});

client.on('connected', function(){
  var strip = client.add_strip({
    length: 25
  });

  var pixels = [];
  for(var i = 0; i < strip.length; i++){
      pixels.push([50, 50, 50]);
  }

  client.put_pixels(strip.id, pixels);

  var index = 0,
      randomColor;
  setInterval(function(){
    randomColor = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];

    client.put_pixel(strip.id, index, randomColor);
    
    index++;
    if(index == strip.length){
      index = 0;
    }
  }, 1000)
});
