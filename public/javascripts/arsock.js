
;(function(exports) {

  var arsock = {};

  arsock.version = '0.0.1';

  arsock.config = {
    startDate: new Date(2012, 8, 26, 16),
    gmap: {
      zoom: 15,
      scale: 8
    },
    location: {
      arscenter: { latitude: 48.3096, longitude: 14.2842 }
    }
  };
  
  exports.arsock = arsock;

})(this);
