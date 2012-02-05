/**
 * Module dependencies.
 */

var express = require('express');

/**
 * Configuration.
 */

module.exports = function(app) {
  return {
    all: function() {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'jade');
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(express.logger('dev'));
      app.use(express.static(__dirname + '/public'));
      app.enable('jsonp callback');
    }
  , production: function() {
      app.use(express.errorHandler());
    }
  , development: function() {
      app.use(express.errorHandler({ dumpExceptions : true, showStack : true }));
    }
  };
};
