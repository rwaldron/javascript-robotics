var express = require('express');
var router = express.Router();

// clear a single matrix
router.post('/clear/:device', function(req,res) {
  var device = req.params.device;
  var matrices = req.app.get("matrices");
  if (matrices) {
    matrices.device(device).clear();
    res.send("Cleared matrix " + device);
  } else {
    res.status(500);
    res.send("Matrices not ready");
  }
});

// clear all matrixes
router.post('/clear', function(req,res) {
  var matrices = req.app.get("matrices");
  if (matrices) {
    matrices.clear();
    res.send("Cleared all matrices");
  } else {
    res.status(500);
    res.send("Matrices not ready");
  }
});

// draw pattern for a single matrix
router.post('/draw/:device', function(req, res) {
  var device = req.params.device;
  var data = req.body;
  // get johnny-five matrix object from express app
  var matrices = req.app.get("matrices");
  if (matrices) {
    matrices.device(device).draw(data);
    res.send("Updated matrix " + device);
  } else {
    res.status(500);
    res.send("Matrices not ready");
  }
});

module.exports = router;
