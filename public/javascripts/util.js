
/*!
 * util.js
 */

;(function(exports) {

  var util = {
    
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

    locationFromUniba: function(lang, long) {
      return { latitude: lang - 35.663411, longitude: long - 139.70502 };
    }
  };

  exports.util = util;


})(this);