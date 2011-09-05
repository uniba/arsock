var _ = underscore = require('underscore'),
	express = require('express'),
	socketio = require('socket.io'),
	mongoose = require('mongoose'),
	net = require('net'),
	sys = require('sys'),
	crypto = require('crypto'),
	redis = require('redis'),
	// redisClient = redis.createClient()
	client = require('./lib/client.js'),
	clients = {},
	app = module.exports = express.createServer(),
	io = socketio.listen(app),
	dbUrl = process.env.ARSOCK_MONGODB_URL || 'mogndb://localhost/arsock';
	LogModel = mongoose.model('Log', new mongoose.Schema({}));

console.log(dbUrl);
mongoose.connect(dbUrl);

process.on('uncaughtException', function (err) {
 	console.log(err);
});

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

app.get('/tv', function(req, res) {
	res.render('tv', {

	});
});

app.get('/log/(:type)?', function(req, res) {
	var query = LogModel.find({}),
		min = parseFloat(req.query.min || 0),
		max = parseFloat(req.query.max || new Date().getTime() / 1000),
		limit = parseInt(req.query.limit || 1000),
		callback = req.query.callback;

	console.log([min, max, limit]);

	if (req.params.type) {
		query.where('type', req.params.type);
	}

	query.where('timestamp')
		.gte(min)
		.lte(max);

	query.limit(limit);
	query.sort('timestamp', -1);
	query.exec(function(err, logs) {
		var data = {total: null, result: logs};
		res.send(callback ? callback + '(' + JSON.stringify(data) + ')' : data);
	});
});

app.listen(3000);

// socket server
var server = net.createServer(function(stream) {
	var socketClient = new client.Client(stream);
	socketClient.on('hello', function(data) {
		clients[data.clientId] = socketClient;
	});
	socketClient.on('bye', function(data) {
		delete clients[data.clientId];
	});
	socketClient.on('broadcast', function(data) {
		// if (!clients[data._clientId]) {
		// 	socketClient.emit('bye');
		// }
		// else {
			var log = new LogModel();
			io.sockets.emit(data.type, data.data);

			log.set('type', data.type);
			log.set('clientId', data.data.clietId);
			log.set('data', data.data);
			log.set('timestamp', data.data._timestamp);

			log.save(function(err) {
				console.log(err);
			});

			// redisClient.set(socketClient.clientId + ':' + data.type + ':' + data.data._timestamp, data, redis.print);
		// }
	});
});

server.listen(9337, function() { });

// websockets server
io.sockets.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('someevent', function(data) {
		console.log(data);
	});
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
