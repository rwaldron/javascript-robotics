var request = require("request"),
  five = require("johnny-five"),
  twit = require("node-tweet-stream"),
  colorMap = require("./cheerlights-colors"),
  Spark = require("spark-io")
  board = new five.Board({
    io: new Spark({
      token: process.env.SPARK_TOKEN,
      deviceId: process.env.SPARK_DEVICE_ID
    })
  });

board.on("ready", function() {

  var lastColor = "white",
  var led = new five.Led.RGB({
    pins: {
      red: "A5",
      green: "A6",
      blue: "A7"
    }
  });

  led.color( colorMap[lastColor] );

  t = new twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    token: process.env.TWITTER_TOKEN,
    token_secret: process.env.TWITTER_TOKEN_SECRET
  });

  t.track("@cheerlights");
  t.track("#cheerlights");

  t.on("tweet", function (tweet) {
    // grab first matching supported color in the tweet
    Object.keys(colorMap).some(function(color) {
      if ( tweet.text.indexOf(color) >= 0 ) {
        if ( color != lastColor ) {
          lastColor = color;
          console.log( "Changing to " + color );
          led.color( colorMap[color] );
        }
        return true;
      } else {
        return false;
      }
    });
  });

  t.on("error", function (err) {
    console.log("Error with Twitter stream: %o", err);
  });

});