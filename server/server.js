require('babel-register')

var app = require('./app').default
var db = require('./db').default

db.sync().then(function () {
  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
});
