
;(function(exports) {

  function Map(lat, lon, zoom) {
    THREE.Object3D.call(this);

    var that = this,
        tmp;

    console.log(lat, lon, zoom);
    this.map = {};
    this.set(0, 0, lat, lon);

    for (var i = 1; i < 10; i++) {
      lat = util.latitudeSouthTo(lat, lon, zoom, 650);
      this.set(0, i, lat, lon);
    }

    Object.keys(this.map).forEach(function(x) {      
      Object.keys(that.map[x]).forEach(function(y) {
        console.log(x, y);
        that.load(that.get(x, y), function(map) {
          map.scale.x = 10;
          map.scale.y = 10;
          map.rotation.x = - Math.PI / 2;
          map.rotation.z = - Math.PI / 2;
          map.position.x = - 6400 * parseInt(y, 10);
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
    var path = '/map/' + location.latitude.toString() + ',' + location.longitude.toString();
    THREE.ImageUtils.loadTexture(path, {}, function(texture) {
      var material = new THREE.MeshBasicMaterial({ map: texture }),
          geometry = new THREE.PlaneGeometry(640, 640),
          map = new THREE.Mesh(geometry, material);
      callback(map);
    });
  };

  exports.Map = Map;

})(this);