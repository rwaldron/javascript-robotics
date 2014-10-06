# SimpleBot Examples

There are several folders here you can use for the simplebot project.

## JavaScript

In the examples folder you'll find several code examples present in the book
that you can play with.

* servo-test.js will test that the servos are wired correctly
* simplebot.js allows you to drive your bot using the keys
* collision-avoid.js allows your bot to drive more autonomously avoiding collisions

To run any of these, install the dependencies using npm

```
npm install
```

Then just run the examples passing in the serial port required (will vary 
depending on your OS). Use /dev/tty* for Linux / Mac or COM* for Windows where
the * is the relevant port number / name required. 

EG on Linux:

```
node examples/simplebot.js /dev/ttyUSB0
```

## Design files

In the physical folder are a set of design files for the SimpleBot.

* simplebot.svg is a vector file that can be printed as a template to stick
on cardboard or corflute and cut out your simplebot
* skid.stl is an object you can print on a 3D printer that will take a 30mm M3 
bolt and allows your SimpleBot to balance and not drag on the floor.

## SimpleBot Firmata (Arduino)

In the arduino folder is the SimpleBotFirmata sketch. This is a custom version
of Firmata that has a couple of newer firmata features included, in particular
the ability to use ultrasonic sensors using the pulseIn API.
