var _ = underscore = require('underscore'),
	express = require('express'),
	socketio = require("socket.io"),
	net = require("net"),
	sys = require('sys'),
	crypto = require('crypto'),
	clients = {},
	app = module.exports = express.createServer(),
	io = socketio.listen(app);

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

var server = net.createServer(function(stream) {
	console.log("tcp client: " + stream.remoteAddress);
	stream.setEncoding("utf8");
	
	stream.on("connect", function() {
		console.log('connect');
		var shasum = crypto.createHash('sha1'), sha1;
		shasum.update(stream.remoteAddress + '-' + stream.remotePort);
		sha1 = shasum.digest('hex');
		console.log(sha1);
		stream.write(JSON.stringify({ id: sha1, command: 'hello' }));
	});
	stream.on("data", function(data) {
		console.log('data');
		var serverTimestamp = new Date().getTime() / 1000;
		var requests = data.split("\0");
		requests = _.reject(requests, function(val) {
			return val.length < 1;
		});
		console.log(requests);
		requests.forEach(function(request) {
			var request = JSON.parse(request);
			var clientTimestamp = parseFloat(request.timestamp);
			console.log([clientTimestamp, serverTimestamp]);
			console.log('laytency -> ' + (serverTimestamp - clientTimestamp));
			 
			if (clients[request.id]) {
				
			}
			io.sockets.emit(request.command, request);
		});
	});
	stream.on("end", function() {
		console.log('end');
		console.log(arguments);
	});
	stream.on("error", function() {
		console.log('error');
		console.log(arguments);
		sys.log('ignoring exception on stream');
	});
	stream.on('timeout', function() {
		console.log('timeout');
	});
});

server.listen(9337, function() {
	
});

io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('someevent', function(data) {
		console.log(data);
	})
});

process.on('uncaughtException', function (err) {
	console.log(err);
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
