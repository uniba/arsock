
/**
 * Module dependencies.
 */

var schema = require('../schema')
  , mongoose = schema.mongoose
  , Log = mongoose.model('Log', schema.Log);


/**
 * Connect to MongoDB server.
 */

// mongoose.connect(process.env.ARSOCK_MONGODB_URI || 'mongodb://localhost/arsock');

/**
 * Routes.
 */

exports.index = function(req, res) {
  res.render('index', { title : 'Express' });
};

exports.tv = function(req, res) {
  res.render('tv');
};

exports.log = function(req, res) {
  var query = Log.find({})
    , min = parseFloat(req.query.min || 0)
    , max = parseFloat(req.query.max || new Date().getTime() / 1000)
    , limit = parseInt(req.query.limit || 1000);
  
  if (req.params.type) {
    query.where('type', req.params.type);
  }
  
  query.where('timestamp').gte(min).lte(max);
  query.limit(limit);
  query.sort('timestamp', -1);
  query.exec(function(err, logs) {
    if (err) {
      return res.send(500);
    }
    res.send({ total: null, result: logs });
  });
};

/**
 * Expose api.
 */

exports.api = require('./api');
