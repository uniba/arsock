/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express.createServer()
  , config = require('./config')(app)
  , io = require('./websocket')(app)
  , es = require('event-stream')
  , colors = require('colors')
  , util = require('util')
  , socket = require('./socket')
  , schema = require('./schema')
  , walker = require('./walker')
  , mongoose = schema.mongoose
  , Log = mongoose.model('Log', schema.Log)
  , http = require('http');
    
/**
 * Error handler.
 */

process.on('uncaughtException', function (err) {
  console.error(err);
});

/**
 * Configuration.
 */

app.configure(config.all);
app.configure('development', config.development);
app.configure('production', config.production);

/**
 * Broadcasting.
 */
io.sockets.on('connection', function(socket) {
  Log
    .where('data.timestamp')
    .lt(new Date().getTime())
    .sort('-data.timestamp')
    .exec(function(err, doc) {
      if (err) return;
      var el = doc.shift();
      function loop() {
        if (el) {
          io.sockets.emit('past', el);
          el = doc.shift();
          setInterval(function() {
            loop();
          }, 100);
        }
      };
      loop();
    });
});


socket.on('broadcast', function(data) {
  var head;
  switch (data.type) {    
  case 'location':
    head = data.type.red;
    break;
  case 'heading':
    head = data.type.yellow;
    break;
  case 'acceleration':
    head = data.type.green;
  default:      
  }
  console.log(head + ' from ' + data.name + ' (' + data.udid + ')'); 
  console.log(util.inspect(data.data) + "\n");
  io.sockets.emit('latest', data);
});

socket.on('broadcast', function(data) {
  var log = new Log(data);
  log.set('created', new Date().getTime());
  log.save(function(err) {
    if (err) {
      console.error(err);
    }
  });
});

/**
 * Boot.
 */

socket.listen(9337, function() {
  app.listen(process.env.PORT || 3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  mongoose.connect(process.env.ARSOCK_MONGODB_URI || 'mongodb://localhost/linz2012');
});

// in the development environment, create dummy TCP client.
if (!process.env.NODE_ENV) {
  walker({ name: 'sleepwalker', udid: Math.floor(Math.random() * 1000000) })
    .interval(100)
    .use(walker.builder('location', 48.3096, 14.2842), 0.2)
    .use(walker.builder('heading'), 0.8)
    .walk(9337);
}

// proxy google static map API
app.get('/map/:zoom/:l', function(req, res){  
  /*
  console.log(req.params['l'].split(','));
  var path = '/maps/api/staticmap';
  var params = {
    zoom: '21',
    size: '640x640',
    maptype: 'roadmap',
    sensor: 'false'
  };
  params['center'] = req.params['l'];
  var tmp = [];
  for (var key in params) {
    tmp.push(key + '=' + params[key]);
  }
  path = path + '?' + tmp.join('&');
  http.get({
    host: 'maps.google.com',
    path: path
  }, function(response) {
    response.on('data', function(chunk) {
      res.write(chunk);
    });
    response.on('end', function() {
      res.end();
    });
  });
  */
});
