var net = require('net');

var Walker = module.exports = function(params) {
  if (!(this instanceof Walker)) return new Walker(params);
  this.params = params;
  this._interval = 1000;
  this.slept = false;
  this.builders = [];
  this.cumProb = 0;
  return this;
};

Walker.builder = function(name) {
  var args = Array.prototype.slice.call(arguments, 1);
  if (!builder[name]) {
    throw new Error('cannot find builder ' + name);
  }
  return builder[name].apply(null, args);
};

Walker.prototype.walk = function(port, host) {
  var that = this,
      socket = new net.Socket();
  if (this.slept) {
    return this;
  }
  this.slept = true;
  socket.on('connect', function() {    
    setInterval(function() {
      var builder = that.selectBuilder();
      if (!builder) return;
      socket.write(JSON.stringify(builder(that)) + "\0");
    }, that._interval);
  });
  socket.on('error', function() {
    console.log('error');
  });
  socket.connect(port, host || 'localhost');
  return this;
};

Walker.prototype.interval = function(n) {
  this._interval = n;
  return this;
};

Walker.prototype.use = function(builder, prob) {
  var sum = this.cumProb + prob;
  if (sum > 1) {
    throw new Error('error: sum of probability should not exceed 1.');
  }
  this.builders.push({ range: [this.cumProb, sum], builder: builder });
  this.cumProb = sum;
  return this;
};

Walker.prototype.selectBuilder = function() {
  var rand = Math.random(),
      builderToUse;
  this.builders.some(function(builder) {
    var match = rand < builder.range[1];
    if (match) {
      builderToUse = builder.builder;
    }
    return match;
  });
  return builderToUse;
};

Walker.prototype.after = function(lat, lon) {
  return this;
};

var builder = {};

builder.location = function() {
  var latitude = arguments[0] || 0,
      longitude = arguments[1] || 0;
  return function(walker) {
    var data = {};
    for (var key in walker.params) {
      data[key] = walker.params[key];
    }
    data.type = 'location';
    latitude = latitude += rand(0.00005);
    longitude = longitude += rand(0.00005);
    data.data = {
      latitude: latitude,
      longitude: longitude,
      timestamp: new Date().getTime()
    };
    return data;
  };
};

builder.heading = function() {
  var heading = 0;
  return function(walker) {
    var data = {},
        val = rand(10);
    heading += val;
    if (heading > 360) {
      heading -= 360;
    }
    for (var key in walker.params) {
      data[key] = walker.params[key];
    }
    data.type = 'heading'; 
    data.data = {
      trueHeading: heading, 
      timestamp: new Date().getTime()
    };
    return data;
  };
};

function rand(width, mean) {
  mean = mean || 0;
  return Math.random() * width * 2 - width + mean;
}
