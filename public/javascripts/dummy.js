
(function(exports) {
  
  function Dummy() {
    EventEmitter.call(this);    
    this.logs = [];
  }

  function log(name) {
    var data = { name: name, x: Math.random() * 500 - 500, y: 0, z: Math.random() * 200, timestamp: new Date().getTime() };
    return function() {
      var newData = {};
      for (var key in data) {
        newData.name = name;
        newData.x = data.x + (Math.random() * 100 - 10);
        newData.y = 0;
        newData.z = data.z + (Math.random() * 100 - 50);
        newData.timestamp = new Date().getTime();
      }
      data = newData;
      return data;
    };
  }
  
  Dummy.prototype = new EventEmitter();

  Dummy.prototype.connect = function() {    
    var that = this;
    setInterval(function() {
      that.logs.forEach(function(log) {
        setTimeout(function() {
          var data = log();
          that.emit(data.name, data);
        }, Math.random() * 1000);
      });
    }, 2000);

    setTimeout(function() {
      var data = log('foo');
      that.logs.push(data);
      that.emit('anything', data());
    }, 1500);

    setTimeout(function() {
      var data = log('bar');
      that.logs.push(data);
      that.emit('anything', data());
    }, 3000);

    setTimeout(function() {
      var data = log('baz');
      that.logs.push(data);
      that.emit('anything', data());
    }, 5000);
  };

  exports.Dummy = Dummy;
})(this);