
;(function(exports) {

  var arsock = {};

  arsock.version = '0.0.1';

  arsock.config = {
    scale: 100000,
    location: {
      uniba: { latitude: 35.663411, longitude: 139.70502 },
      arscenter: { latitude: 48.3096, longitude: 14.2842 }
    }
  };
  
  exports.arsock = arsock;

})(this);
