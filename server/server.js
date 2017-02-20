var fs = require('fs');
var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(8082);  //listen on port 8082

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.use('/static', express.static('../static'))
app.use('/admin', express.static('../client-admin/dist'))
app.use('/screen', express.static('../client-screen/dist'))

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var rules;
fs.readFile('../static/rules.json', (err, data) => {
  if (err) console.log(err);
  rules = JSON.parse(data);
})

io.on('connection', function (socket) {
  socket.on('screen to admin', (data) => {
  	console.log('received screen to admin', data)
  	io.emit('screen to admin', data)
  })
  socket.on('admin to screen', (data) => {
    data.rules = rules;
  	console.log('received admin to screen', data)
  	io.emit('admin to screen', data)
  })
});