/**
 * Module dependencies.
 */

var net = require('net'),
    Client = require('./lib/client'),
    es = require('event-stream'),
    util = require('util'),
    server;

/**
 * Socket server.
 */

module.exports = server = net.createServer(function(stream) {
  es.pipeline(stream,
              es.split("\0"),
              es.map(function(i, callback) {
                var parsed = JSON.parse(i);
                callback(null, parsed);
              }),
              es.map(function(data, callback) {
                server.emit('broadcast', data);
                callback();
              }));
});
