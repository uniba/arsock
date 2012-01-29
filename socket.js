/**
 * Module dependencies.
 */

var net = require('net')
  , Client = require('./lib/client');

/**
 * Socket server.
 */

module.exports = net.createServer(function(stream) {
  this.clients = {};
  this.client = new Client(stream);
  
  this.client.on('hello', function(data) {
    this.clients[data.clientId] = this.client;
  });
  
  this.client.on('bye', function(data) {
    delete this.clients[data.clientId];
  });
  
  this.client.on('broadcast', function(data) {
    this.emit('broadcast', data);
  });
});
