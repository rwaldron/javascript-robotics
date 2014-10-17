var express = require('express'),
    app = express(),
    PORT = 3000,
    lastLocation = {
      localip: '127.0.0.1',
      publicurl: 'http://example.com',
      lastUpdate: new Date().toString()
    };

//configure Express
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

var server = app.listen(PORT, function() {
    console.log('Listening on port %d', server.address().port);
});

app.get('/', function(req, res) {
  res.render('index', lastLocation);
});

app.post('/locate', function(req, res) {
  lastLocation = {
    localip: req.param('local_ip'),
    publicurl: req.param('public_url'),
    lastUpdate: new Date().toString()
  };
  console.log('lastLocation updated to %O', lastLocation);
});