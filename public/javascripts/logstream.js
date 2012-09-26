
/*!
 * logstream.js
 * 
 * @dependency EventEmitter.js
 */

;(function(exports) {
  
  function LogStream(time) {
    EventEmitter.call(this);
    this.filters = [];
    this.startTime = time;
  }
  
  LogStream.prototype = new EventEmitter;

  LogStream.prototype.connect = function() {
    var that = this,
        socket = io.connect('/'),
        streams = {};

    socket.emit('initialize', this.startTime);

    socket.on('latest', function(data) {
      var id = data.udid,
          name = data.name,
          stream = streams[id],
          filtered = data;
      
      that.filters.forEach(function(filter) {
        filtered = filter(data);
      });          

      if (!stream) {
        stream = streams[id] = new PersonStream(id, name);
        that.emit('connection', stream);
      }
      stream.emit('latest', filtered);
    });

    socket.on('archive', function(data) {
      var id = data.udid,
          name = data.name,
          stream = streams[id],
          filtered = data;
      
      that.filters.forEach(function(filter) {
        filtered = filter(data);
      });
      
      if (!stream) {
        stream = streams[id] = new PersonStream(id, name);
        that.emit('connection', stream);
      }
      
      stream.emit('past', filtered);
    });
  };

  LogStream.prototype.addFilter = function(filter) {
    this.filters.push(filter);
  };

  function PersonStream(id, name) {
    EventEmitter.call(this);
    this.id = id;
    this.name = name;
  }

  PersonStream.prototype = new EventEmitter();

  exports.LogStream = LogStream;
  
})(this);