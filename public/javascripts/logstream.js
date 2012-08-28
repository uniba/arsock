
/*!
 * logstream
 * Copyright (c) 2012 hitsujiwool <utatanenohibi@gmail.com>
 * MIT Licensed
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
          stream = streams[id];
      if (!stream) {
        stream = streams[id] = new PersonStream(id);
        that.emit('connection', stream);
      }
      stream.emit('latest', data);
    });
  };

  function PersonStream(id) {
    this.id = id;
    EventEmitter.call(this);
  }

  PersonStream.prototype = new EventEmitter();

  exports.LogStream = LogStream;
  
})(this);