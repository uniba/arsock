
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
        io = new Dummy(),
        streams = {};

    io.on('anything', function(data) {
      var name = data.name,
          stream = streams[name];
      if (!stream) {
        stream = streams[name] = new PersonStream(name);
        that.emit('connection', stream);
        stream.emit('latest', data);
        io.on(name, function(data) {
          stream.emit('latest', data);
        });
      }
    });
    
    io.on('data', function(data) {
      var name = data.name,
          stream = streams[name];
      if (!stream) {
        stream = streams[name] = new PersonStream(name);
        that.emit('connection', stream);
      }
      stream.emit('past', data);
    });

    io.connect();
  };

  function PersonStream(id) {
    this.id = id;
    EventEmitter.call(this);
  }

  PersonStream.prototype = new EventEmitter();

  exports.LogStream = LogStream;
  
})(this);