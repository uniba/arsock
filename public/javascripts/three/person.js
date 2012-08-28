
;(function(exports) {

  function Person(stream) {
    var that = this;
    this.color = util.randColor();

    THREE.Object3D.call(this);

    stream.on('latest', function(data) {
      if (data.type === 'location') {
        that.addToken(data);
      }
    }); 

    stream.on('past', function(data) {
    });
  }

  Person.prototype = new THREE.Object3D();
  
  Person.prototype.addToken = function(data) {    
    var sphere,
        sphereMaterial = new THREE.MeshLambertMaterial({ color: this.color });
    sphere = new THREE.Mesh(new THREE.CylinderGeometry(4, 8, 20), sphereMaterial);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    sphere.visible = this.visible;
    this.add(sphere);
  };

  Person.prototype.show = function() {
    this.visible = true;
    this.children.forEach(function(item) {
      item.visible = true;
    });
  };
  
  Person.prototype.hide = function() {
    this.visible = false;
    this.children.forEach(function(item) {
      item.visible = false;
    });
  };

  // 標準のループ
  Person.prototype.update = function() {
  };

  exports.Person = Person;

})(this);