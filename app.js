/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express.createServer()
  , config = require('./config')(app)
  , io = require('./websocket')(app)
  , es = require('event-stream')
  , colors = require('colors')
  , qs = require('querystring')
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
  var connectedTime = new Date().getTime();

  socket.on('initialize', function(fn) {
    fn(connectedTime);
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
  //console.log(head + ' from ' + data.name + ' (' + data.udid + ')');
  //console.log(util.inspect(data.data) + "\n");
  io.sockets.emit('latest', data);
});

socket.on('broadcast', function(data) {
  var log = new Log(data);
  log.set('created', new Date().getTime());
  /*
  log.save(function(err) {
    if (err) {
      console.error(err);
    }
  });
  */
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
  /*
  walker({ name: 'person1', udid: 'sleepwalker' + Math.floor(Math.random() * 1000000) })
    .interval(100)
    .use(walker.builder('location', 48.3192, 14.3030), 0.2)
    .use(walker.builder('heading'), 0.8)
    .walk(9337);

  walker({ name: 'person2', udid: 'sleepwalker' + Math.floor(Math.random() * 1000000) })
    .interval(100)
    .use(walker.builder('location', 48.3096, 14.2842), 0.2)
    .use(walker.builder('heading'), 0.8)
    .walk(9337);
   */

}

app.get('/api/logs', function(req, res) {
  var limit = parseInt(req.query.limit) || 1000,
      offset = parseInt(req.query.offset) || 0,
      from = parseInt(req.query.from) || new Date().getTime(),
      until = parseInt(req.query.until) || new Date().getTime();
  
  Log
    .where('data.timestamp')
    .gt(from)
    .lt(until)
    .sort('data.timestamp')
    .limit(limit)
    .skip(offset)
    .exec(function(err, doc) {
      if (err) {
        res.status(500).send(JSON.stringify([]));
        return;
      }
      res.send(JSON.stringify(doc));
    });
});

// proxy google static map API
app.get('/map/:zoom/:l', function(req, res){  
  var path = '/maps/api/staticmap';
  var params = {
    zoom: req.params['zoom'],
    size: '640x640',
    maptype: 'roadmap',
    sensor: 'false'
  };
  params['center'] = req.params['l'];
  path += '?' + qs.unescape(qs.stringify(params));
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
});
