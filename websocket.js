/**
 * Module Dependencies.
 */

var socket = require('socket.io');

/**
 * WebSockets server.
 */

module.exports = function(app) {
  var io = socket.listen(app);
  
  io.sockets.on('connection', function(socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('someevent', function(data) {
      console.log(data);
    });
  });
  
  return io;
}
