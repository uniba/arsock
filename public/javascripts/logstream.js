
/*!
 * logstream.js
 * 
 * @dependency EventEmitter.js
 */

;(function(exports) {
  
  function LogStream(startDate) {
    EventEmitter.call(this);
    this.filters = [];
    this.startDate = startDate;
  }
  
  LogStream.prototype = new EventEmitter;

  LogStream.prototype.connect = function() {
    var that = this,
        socket = io.connect('/'),
        ajaxStream,
        streams = {};
    
    socket.emit('initialize', function(until) {
      ajaxStream = new AjaxStream('/api/logs', { from: that.startDate.getTime(), until: until }).open();
      ajaxStream.on('data', function(data) {
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
    });
    
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