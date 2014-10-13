// Modify the below constants to match your keyboard and arm

// The wrist and finger length are the distance between the servo arm center
// and the opposite side's servo axis.
var WRIST_LENGTH = 5.5;
var FINGER_LENGTH = 5.5;

// The y and z offset is the offset from the shoulder servo's axis and the
// "B" key on the keyboard
var Y_OFFSET = 4.5;
var Z_OFFSET = -3.5;

// The x and y key distance are the distances between keys on the keyboard
var X_KEY_DISTANCE = 0.743;
var Y_KEY_DISTANCE = 0.75;

// The row offsets are the x axis offsets between each row and the previous row.
// In other words, the second row offset is the x distance between the center of
// the "B" key and the center of the "G" key. The third row offset is the x distance
// between the "G" and "T" keys.
var SECOND_ROW_OFFSET = -1.1875;
var THIRD_ROW_OFFSET = -0.375;

// Only edit this object if you are not using a standard US keyboard.
// The x/y values are relative to the "B" key on a standard US keyboard. Units
// are in "keys". For example, the "V" key is one key to the left of "B", so
// its x value is -1, and it's y value is 0. The "G" and "T" keys are considered
// to have an x value of 0, even though they are slightly offset from the "B" key.
var KEYS = {
  a: {
    x: -4,
    y: 1
  },
  b: {
    x: 0,
    y: 0
  },
  c: {
    x: -2,
    y: 0
  },
  d: {
    x: -2,
    y: 1
  },
  e: {
    x: -2,
    y: 2
  },
  f: {
    x: -1,
    y: 1
  },
  g: {
    x: 0,
    y: 1
  },
  h: {
    x: 1,
    y: 1
  },
  i: {
    x: 3,
    y: 2
  },
  j: {
    x: 2,
    y: 1
  },
  k: {
    x: 3,
    y: 1
  },
  l: {
    x: 4,
    y: 1
  },
  m: {
    x: 2,
    y: 0
  },
  n: {
    x: 1,
    y: 0
  },
  o: {
    x: 4,
    y: 2
  },
  p: {
    x: 5,
    y: 2
  },
  q: {
    x: -4,
    y: 2
  },
  r: {
    x: -1,
    y: 2
  },
  s: {
    x: -3,
    y: 1
  },
  t: {
    x: 0,
    y: 2
  },
  u: {
    x: 2,
    y: 2
  },
  v: {
    x: -1,
    y: 0
  },
  w: {
    x: -3,
    y: 2
  },
  x: {
    x: -3,
    y: 0
  },
  y: {
    x: 1,
    y: 2
  },
  z: {
    x: -4,
    y: 0
  }
};

function calculateAngles(x, y, z) {
  var cos = Math.cos;
  var sin = Math.sin;
  var sqrt = Math.sqrt;
  var arctan = Math.atan;
  function radians(degrees) {
    return degrees * Math.PI / 180;
  }
  var theta_s = arctan(y / Math.abs(x));
  theta_s = theta_s * 180 / Math.PI;
  if (x < 0) {
    theta_s = 180 - theta_s;
  }
  theta_s = Math.round(theta_s);
  var yp = sqrt(x * x + y * y);
  var theta_e;
  var theta_w;
  var diff = Infinity;
  for(var theta_elbow = 0; theta_elbow < 180; theta_elbow++) {
    for(var theta_wrist = 0; theta_wrist < 180; theta_wrist++) {
      var yhat = WRIST_LENGTH * cos(radians(theta_elbow)) - FINGER_LENGTH * cos(radians(theta_elbow) + radians(theta_wrist));
      var zhat = WRIST_LENGTH * sin(radians(theta_elbow)) - FINGER_LENGTH * sin(radians(theta_elbow) + radians(theta_wrist));
      var diffhat = Math.abs(yp - yhat) + Math.abs(z - zhat);
      if (diffhat < diff) {
        diff = diffhat;
        theta_e = theta_elbow;
        theta_w = theta_wrist;
      }
    }
  }
  return {
    shoulder: theta_s,
    elbow: theta_e,
    wrist: theta_w
  };
}

function calculatePosition(key) {
  var x = key.x;
  var y = key.y;
  x = x * X_KEY_DISTANCE;
  if (y > 0) {
    x += SECOND_ROW_OFFSET;
  }
  if (y > 1) {
    x += THIRD_ROW_OFFSET;
  }
  return calculateAngles(x, y * Y_KEY_DISTANCE + Y_OFFSET, Z_OFFSET);
}

var results = {};
for (var key in KEYS) {
  results[key] = calculatePosition(KEYS[key]);
}
console.log(results);
