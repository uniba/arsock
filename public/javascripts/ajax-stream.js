
;(function(exports) {
  
  function AjaxStream(url, params, options) {
    EventEmitter.call(this);
    options = options || {};
    this.url = url;
    this.offset = 0;
    this.offsetName = options.offsetName || 'offset';
    this.params = params || {};
  }

  AjaxStream.prototype = new EventEmitter();

  AjaxStream.prototype.open = function() {
    this.loop();
    return this;
  };
  
  AjaxStream.prototype.send = function(callback) {

    var req = new XMLHttpRequest(),
        params = {};
    
    params[this.offsetName] = this.offset;
    for (var key in this.params) {
      params[key] = this.params[key];
    }
    
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {        
        callback(null, JSON.parse(req.responseText));
      }
    };

    req.open('GET', this.url + '?' + this.queryString(params), true);
    req.send();
  };

  AjaxStream.prototype.queryString = function(obj) {
    var tmp = [];
    for (var key in obj) {
      tmp.push(key + '=' + obj[key]);
    }
    return tmp.join('&');
  };

  AjaxStream.prototype.loop = function() {
    var that = this;

    function emit(records, end) {
      var rec = records.shift();
      if (rec) {
        that.emit('data', rec);
        //setTimeout(function() {
          emit(records, end);
        //}, 0);
      } else {
        end();
      }
    };

    this.send(function(err, records) {      
      if (err) {
        setTimeout(function() {
          that.loop();
        }, 5000);
      };
      var len = records.length;
      that.offset += len;
      if (len > 0) {
        emit(records, function() {
          that.loop();
        });
      }
    });
  };

  exports.AjaxStream = AjaxStream;

})(this);
