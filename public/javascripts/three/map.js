
;(function(exports) {

  function Map(lat, lon, zoom, scale) {
    THREE.Object3D.call(this);

    var that = this,
        scale = 8,
        tmp,
        centerLat = lat,
        centerLon = lon;

    this.map = {};
    this.zoom = zoom;
    this.set(0, 0, lat, lon);

    Object.keys(this.map).forEach(function(x) {      
      Object.keys(that.map[x]).forEach(function(y) {
        that.load(that.get(x, y), function(map) {
          map.scale.x = scale;
          map.scale.y = scale;
          map.rotation.x = - Math.PI / 2;
          map.position.z = 640 * scale * parseInt(y, 10);
          map.doubleSided = true;
          that.add(map);
        });
      });
    });
  }

  Map.prototype = new THREE.Object3D();

  Map.prototype.set = function(x, y, lat, lon) {
    var strX = x.toString(),
        strY = y.toString();
    if (!this.map[strX]) {
      this.map[strX] = {};
    }
    this.map[strX][strY] = { latitude: lat, longitude: lon };
    return this;
  };

  Map.prototype.get = function(x, y) {
    var strX = x.toString(),
        strY = y.toString();
    if (!this.map[strX]) {
      return undefined;
    }
    return this.map[strX][strY];
  };
  
  Map.prototype.load = function(location, callback) {
    var path = '/map/' + this.zoom + '/' + location.latitude.toString() + ',' + location.longitude.toString();
    THREE.ImageUtils.loadTexture(path, {}, function(texture) {
      var material = new THREE.MeshBasicMaterial({ map: texture }),
          geometry = new THREE.PlaneGeometry(640, 640),
          map = new THREE.Mesh(geometry, material);
      callback(map);
    });
  };

  exports.Map = Map;

})(this);