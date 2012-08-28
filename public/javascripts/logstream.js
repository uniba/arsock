
/*!
 * logstream.js
 * 
 * @dependency EventEmitter.js
 */

;(function(exports) {
  
  function LogStream(resource) {
    EventEmitter.call(this);
  }
  
  LogStream.prototype = new EventEmitter;

  LogStream.prototype.connect = function() {
    var that = this,
        socket = io.connect('/'),
        streams = {};
    socket.on('data', function(data) {
      var id = data.udid,
          name = data.name,
          stream = streams[id];
      if (!stream) {
        stream = streams[id] = new PersonStream(id, name);
        that.emit('connection', stream);
      }
      stream.emit('latest', data);
    });
  };

  function PersonStream(id, name) {
    EventEmitter.call(this);
    this.id = id;
    this.name = name;
  }

  PersonStream.prototype = new EventEmitter();

  exports.LogStream = LogStream;
  
})(this);