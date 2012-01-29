/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , app = module.exports = express.createServer()
  , config = require('./config')(app)
  , io = require('./websocket')(app)
  , routes = require('./routes')
  , schema = require('./schema')
  , socket = require('./socket')
  , Log = mongoose.model('Log', schema.Log);

/**
 * Error handler.
 */

process.on('uncaughtException', function (err) {
  console.log(err);
});

/**
 * Configuration.
 */

app.configure(config.all);
app.configure('development', config.development);
app.configure('production', config.production);


/**
 * Routes.
 */

app.get('/', routes.index);
app.get('/tv', routes.tv);
app.get('/log/(:type)?', routes.log);

/**
 * Broadcasting.
 */

socket.on('broadcast', function(data) {
  io.sockets.emit(data.type, data.data);
});

socket.on('broadcast', function(data) {
  var log = new Log();
  
  log.set('type', data.type)
    .set('clientId', data.data.clietId)
    .set('data', data.data)
    .set('timestamp', data.data._timestamp)
    .save(function(err) {
      console.log(arguments);
    });
});

/**
 * Boot.
 */

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
socket.listen(9337, function() {});
mongoose.connect(process.env.ARSOCK_MONGODB_URI || 'mongodb://localhost/arsock');