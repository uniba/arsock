
/*!
 * util.js
 */

;(function(exports) {

  var util = {

    OFFSET: 268435456,

    RADIUS: 85445659.4471,

    randColor: function() {
      var str = '';
      for (var i = 0; i < 6; i++) {
        str += Math.floor(Math.random() * 16).toString(16);
      }
      return parseInt(str, 16);
    },

    deg2rad: function(deg) {
      return (deg / 180) * Math.PI;
    },

    formatTime: function(date) {
      var day = [date.getMonth() + 1, date.getDate()].join('/'),
          time = [date.getHours(), date.getMinutes(), date.getSeconds()].map(function(item) {
            return util.formatDigit(item, 2);
          }).join(':');

      return day + ' ' + time;
    },

    formatDigit: function(num, n) {
      var str = num.toString();
      for (var i = 0; str.length - n; i++) {
        str = '0' + str;
      }
      return str;
    },

    lonToX: function(lon) {
      return util.OFFSET + util.RADIUS * lon * Math.PI / 180;        
    },

    latToY: function(lat) {
      return util.OFFSET - util.RADIUS * Math.log((1 + Math.sin(lat * Math.PI / 180)) / (1 - Math.sin(lat * Math.PI / 180))) / 2;
    },

    xToLon: function(x) {
      return ((x - util.OFFSET) * 180) / util.RADIUS / Math.PI;
    },

    yToLat: function(y) {
      var n = Math.pow(Math.E, (util.OFFSET - y) * 2 / util.RADIUS);
      return Math.asin((n - 1) / (n + 1)) * 180 / Math.PI;
    },

    pixelDistance: function(lat1, lon1, lat2, lon2, zoom) {
      var x1 = util.lonToX(lon1),
      y1 = util.latToY(lat1),
      x2 = util.lonToX(lon2),
      y2 = util.latToY(lat2);        
      return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)) / Math.pow(2, 21 - zoom);
    },

    latitudeNorthTo: function(lat, lon, zoom, distance) {
      var x1 = util.lonToX(lon),
          y1 = util.latToY(lat),
          y2 = y1;
      return util.yToLat(distance * Math.pow(2, 21 - zoom) - y1);
    },

    latitudeSouthTo: function(lat, lon, zoom, distance) {
      var x1 = util.lonToX(lon),
          y1 = util.latToY(lat),
          y2 = y1;
      return util.yToLat(y1 + distance * Math.pow(2, 21 - zoom));
    }
  };

  exports.util = util;


})(this);