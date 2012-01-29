(function($) {

  var COLORS = ['pink','red', 'yellow', 'purple', 'green', 'blue', 'ltblue'];

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
    var $legend = $('<div class="legend"/>');

    params = $.extend({}, $.fn.arsmap.defaults, params || {});

    google.maps.event.addDomListener(window, 'load', function() {
      that.map = new google.maps.Map(element, {
        zoom: params.zoom,
	center: new google.maps.LatLng(48.309659, 14.284415),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
	scaleControl: true,
        scrollwheel: false
      });
      that.legend = $legend.appendTo(element);
      while (data = that.buffer.pop()) {
        that.mark(data.data);
      }
    });
    $.ajax(params.url + 'location?limit=' + params.limit, {
      dataType: 'jsonp'
    })
    .success(function(data) {
      for (var i = 0, len = data.result.length; i < len; i++) {
        if (that.map) {
          that.mark(data.result[i].data);
        } else {
          that.buffer.push(data.result[i]);
        }
      }
    });
    this.clients = {};
    this.buffer = [];
  };

  ARSMap.prototype.mark = function(data) {
    var that = this;
    var client;
    if (!this.map) {
      this.buffer.push(data);
      return;
    }
    if (!(data._clientId in this.clients)) {
      this.clients[data._clientId] = {clientId: data._clientId, nickname: data.nickname, iconURL: generateIcon()};
      this.legend.append(this._generateLegend(data._clientId));
    }
    client = this.clients[data._clientId];
    client.lat = data.latitude;
    client.lng = data.longitude;
    var date = new Date(parseInt(data._timestamp * 1000, 10));
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.latitude, data.longitude),
      map: that.map,
      title: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
      icon: client.iconURL
    });
  };

  ARSMap.prototype._generateLegend = function(clientId) {
    var that = this;
    var client = this.clients[clientId];
    var $elem = $('<p><img width="15" src="' + client.iconURL + '"/>' + (client.nickname || client.clientId.slice(0, 5) + '...') + '</p>');
    $elem.bind('click', function(e) {
      that.map.panTo(new google.maps.LatLng(client.lat, client.lng));
    });
    return $elem;
  };

  $.fn.arsmap = function(options) {
    return this.each(function() {
      var api = new ARSMap(this, options);
      $(this).data('arsmap-api', api);
    });
  };

  $.fn.arsmap.defaults = {
    url: '/log/',
    limit: 1000,
    zoom: 15
  };

})(jQuery);
