
;(function(exports) {

  var arsock = {};

  arsock.version = '0.0.1';

  arsock.config = {
    scale: 1000000,
    zoom: 21,
    location: {
      arscenter: { latitude: 48.3096, longitude: 14.2842 }
    }
  };
  
  exports.arsock = arsock;

})(this);
