(function($) {

  var COLORS = ['pink','red', 'yellow', 'purple', 'green', 'blue'];

  var generateIcon = (function() {
    var i = 0;
    return function() {
      i = i < COLORS.length - 1 ? i + 1 : 0;
      return 'http://www.google.com/intl/en_us/mapfiles/ms/micons/' + COLORS[i] + '-dot.png';
    };
  })();

  var ARSMap = function(element, params) {
    var that = this;
    var data;

    params = $.extend({}, $.fn.arsmap.defaults, params || {});

    google.maps.event.addDomListener(window, 'load', function() {
      that.map = new google.maps.Map(element, {
        zoom: params.zoom,
	center: new google.maps.LatLng(48.309659, 14.284415),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
	scaleControl: true,
        scrollwheel: false
      });
      while (data = that.buffer.shift()) {
        that.mark(data.data);
      }
    });
    $.ajax(params.url + 'location?limit=' + params.limit, {
      dataType: 'jsonp'
    })
    .success(function(data) {
      for (var i = 0, len = data.result.length; i < len; i++) {
        if (that.map) {
          that.map.mark(data.result[i].data);
        } else {
          that.buffer.push(data.result[i]);
        }
      }
    });
    this.icons = {};
    this.buffer = [];
  };

  ARSMap.prototype.mark = function(data) {
    var that = this;
    if (!this.map) {
      this.buffer.push(data);
      return;
    }
    if (!(data._clientId in this.icons)) {
      this.icons[data._clientId] = generateIcon();
    }
    var icon = this.icons[data._clientId];
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.latitude, data.longitude),
      map: that.map,
      title: data._clientId,
      icon: icon
    });
  };

  $.fn.arsmap = function(options) {
    return this.each(function() {
      var api = new ARSMap(this, options);
      $(this).data('arsmap-api', api);
    });
  };

  $.fn.arsmap.defaults = {
    url: 'http://realtimeweblog.in:3000/log/',
    limit: 100,
    zoom: 15
  };

})(jQuery);