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
  , routes = require('./routes')
  , socket = require('./socket')
  , schema = require('./schema')
  , mongoose = schema.mongoose
  , Log = mongoose.model('Log', schema.Log)
  , walker = require('node-sleepwalker');

/**
 * Stream archive data.
 */

function stream() {
  var limit = 25000;
  
  Log.find().count(function(err, num) {
    var offset = Math.floor(Math.random() * (num - limit));
    
    Log.find()
      .sort('timestamp', 1)
      .limit(limit)
      .skip(offset)
      .exec(function(err, doc) {
        doc.forEach(function(el, n) {
          setTimeout(function() {
            io.sockets.emit(el.get('type'), el.get('data'));
          }, n * 50);
        });
        setTimeout(function() {
          stream();
        }, doc.length * 50);
      });
  });
}

/**
 * Error handler.
 */

process.on('uncaughtException', function (err) {
  //console.err(err);
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
  io.sockets.emit('data', data);
});

/**
 * Boot.
 */

socket.listen(9337, function() {
  app.listen(process.env.PORT || 3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  mongoose.connect(process.env.ARSOCK_MONGODB_URI || 'mongodb://localhost/arsock');
  stream();
});

// in the development environment, create dummy TCP client.
if (!process.env.NODE_ENV) {
  walker({ name: 'sleepwalker', udid: Math.floor(Math.random() * 1000000) })
    .interval(100)
    .use(walker.builder('location', 35.663411, 139.70502), 0.2)
    .use(walker.builder('heading'), 0.8)
    .walk(9337);
}