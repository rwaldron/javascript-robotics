## Cheerful J5

Monitors the [@Cheerlights](http://www.cheerlights.com/) service and updates an RGB LED using Johnny-Five. 

Change the color by tweeting to @cheerlights and mentioning a color.

Assumes wiring as in the [Johnny-Five RGB LED example](https://github.com/rwaldron/johnny-five/blob/master/docs/led-rgb.md).


### cheerful.js

Queries the CheerLights Thingspeak channel and updates an RGB LED using Johnny-Five.
Uses pins [3, 5, 6] for RGB respectively.


### cheerful-twit.js

Listens to the Twitter stream for commands sent to @Cheerlights or #cheerlights.
Uses pins [3, 5, 6] for RGB respectively.


### cheerful-spark.js

Same as cheerful-twit.js but uses a Spark Core to go wireless.

Assumes SPARK_DEVICE_ID and SPARK_TOKEN environment variables are set for passing Spark access credentials.
Uses pins ["A5", "A6", "A7"] for RGB respectively.

 


