var _ = underscore = require('underscore')
	, net = require('net')
	, crypto = require('crypto')
	, EventEmitter = require('events').EventEmitter;

function Client(stream) {
  if (!(this instanceof Client)) {
    return new Client(stream);
  }
  var self = this;
  EventEmitter.call(this);
  
  this.stream = stream;
  this.platformId = null;
  this.clientId = null;
  this.buffer = '';
  
  this.response = function(type, data) {
    data = data || {};
    data.timestamp = new Date() / 1000;
    stream.write(JSON.stringify({ id: self.clientId, type: type, data: data }));
  };
  
  this.on('bye', function(data) {
    stream.destroy();
  });
  
  this.stream.setEncoding("utf8");
  
  this.stream.on('connect', function() {
    var shasum = crypto.createHash('sha1');
    
    shasum.update(stream.remoteAddress + '-' + stream.remotePort);
    self.clientId = shasum.digest('hex');
    self.response('hello', { clientId: self.clientId });
	});
	
  this.stream.on('data', function(data) {
    var requests = data.split("\0");
    
    requests = _.reject(requests, function(val) {
      return val.length < 1;
    });		
    
    requests.forEach(function(request) {
      var request = JSON.parse(request)
        , serverTimestamp = new Date().getTime() / 1000
        , clientTimestamp = parseFloat(request.data._timestamp)
        , latency = (serverTimestamp - clientTimestamp);
      
      _.extend(request.data, { _clientId: self.clientId, _timestamp: serverTimestamp, _latency: latency });
      
      self.emit('broadcast', request);
      self.emit(request.type, request.data);
    });
  });
  
  this.stream.on('end', function() {
    self.emit('end');
  });
  
  this.stream.on('error', function() {
    self.emit('error');
  });
  
  this.stream.on('timeout', function() {
    self.emit('timeout');
  });
}

/**
 * Inherits from EventEmitter.
 */

Client.prototype = new EventEmitter();
Client.prototype.constructor = Client;

/**
 * Expose client.
 */

module.exports = Client;
