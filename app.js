var _ = underscore = require('underscore'),
	express = require('express'),
	socketio = require("socket.io"),
	net = require("net"),
	sys = require('sys'),
	crypto = require('crypto'),
	client = require('./lib/client.js'),
	clients = {},
	app = module.exports = express.createServer(),
	io = socketio.listen(app);


// process.on('uncaughtException', function (err) {
// 	console.log(err);
// });

// Configuration
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
	res.render('index', {
		title : 'Express'
	});
});

app.listen(3001);

// socket server
var server = net.createServer(function(stream) {
	var socketClient = new client.Client(stream);
	socketClient.on('hello', function(data) {
		clients[data.clientId] = client;
	});
	socketClient.on('bye', function(data) {
		delete clients[data.clientId];
	});
	socketClient.on('broadcast', function(data) {
		io.sockets.emit(data.type, data.data);
	});
});

server.listen(9337, function() { });

// websockets server
io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('someevent', function(data) {
		console.log(data);
	})
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);