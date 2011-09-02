var _ = underscore = require('underscore'),
	net = require('net'),
	crypto = require('crypto'),
	EventEmitter = require('events').EventEmitter;

function Client(stream) {
	if (!(this instanceof Client)) {
		return new Client(platformId, stream);
	}
	var self = this;
	EventEmitter.call(self);
	self.platformId = null;
	self.clientId = null;
	self.buffer = '';
	
	self.response = function(type, data) {
		data = data || {};
		data.timestamp = new Date() / 1000;
		stream.write(JSON.stringify({ id: self.clientId, type: type, data: data }));
	};
	
	self.on('bye', function(data) {
		stream.destroy();
	});
	
	stream.setEncoding("utf8");
	
	stream.on('connect', function() {
		var shasum = crypto.createHash('sha1');
		shasum.update(stream.remoteAddress + '-' + stream.remotePort);
		self.clientId = shasum.digest('hex');
		self.response('hello', { clientId: self.clientId });
	});
	
	stream.on('data', function(data) {
		var requests = data.split("\0");
		requests = _.reject(requests, function(val) {
			return val.length < 1;
		});		
		
		requests.forEach(function(request) {
			var request = JSON.parse(request),
				serverTimestamp = new Date().getTime() / 1000,
				clientTimestamp = parseFloat(request.data._timestamp),
				latency = (serverTimestamp - clientTimestamp);

			_.extend(request.data, { _clientId: self.clientId, _timestamp: serverTimestamp, _latency: latency });
			
			self.emit('broadcast', request);
			self.emit(request.type, request.data);
		});
	});
	
	stream.on('end', function() {
		self.emit('end');
	});
	
	stream.on('error', function() {
		self.emit('error');
	});
	
	stream.on('timeout', function() {
		self.emit('timeout');
	});	
}

Client.prototype = new EventEmitter();
Client.prototype.constructor = Client;

exports.Client = Client;
