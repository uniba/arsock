
/*!
 * person.js
 *
 * @dependency Three.js
 */

;(function(exports) {

  function Person(stream) {  
    THREE.Object3D.call(this);
    
    var that = this,
        token = new Token(util.randColor()),
        particles = new THREE.Geometry(),
        route  = new THREE.ParticleSystem(particles, new THREE.ParticleBasicMaterial({ color: 0xff6600, size: 40 }));

    stream.on('latest', function(data) {
      if (data.type === 'location') {
        that.counter++;
        // location data is already converted to the relative position.
        // see app.js, where Logstream#addFilter() is called.
        that.updateLocation(data.data.latitude, 0, data.data.longitude);
      } else if (data.type === 'heading') {
        token.updateDirection(util.deg2rad(data.data.trueHeading));
      } else if (data.type === 'acceleration') {
        // do something!
      }
    }); 

    stream.on('past', function(data) {
    });

    this.add(token);
    this.add(route);
        
    for (var i = 0, il = 50000; i<il; i++) {
      var p = new THREE.Vector3(0, 0, 0);
      p.y = 1000000;      
      route.geometry.vertices.push(p);
    }

    this.token = token;
    this.route = route;
    this.particles = particles;
    this.counter = 0;

    // plot initial location
    this.updateLocation(0, 0, 0);
  }

  Person.prototype = new THREE.Object3D();
  
  Person.prototype.show = function() {
    this.forAllChildren(function(child) {
      child.visible = true;
    });
  };
  
  Person.prototype.hide = function() {
    this.forAllChildren(function(child) {
      child.visible = false;
    });
  };

  Person.prototype.forAllChildren = function(callback) {
    function iter(obj) {
      callback(obj);
      obj.children.forEach(function(child) {
        iter(child);
      });
    };
    iter(this);
  };

  Person.prototype.updateLocation = function(x, y, z) {
    this.token.updateLocation(x, 0, z);
    this.addTokenAt(x, 0, z);
  };

  Person.prototype.addTokenAt = function(x, y, z) {
    this.route.geometry.vertices[this.counter].set(x, 0, z);
  };

  // 標準のループ
  Person.prototype.update = function() {
    this.route.geometry.verticesNeedUpdate = true;
    
    // creating dummy data
    /*
    var p = new THREE.Vector3();

    p.x = this.px;
    p.z = this.pz;
    
    this.px += this.direction.x * this.speed;
    this.pz += this.direction.z * this.speed;

    this.speed += Math.random() * 0.2 - 0.1;
    this.direction.x += Math.random() * 0.2 - 0.1;
    this.direction.z += Math.random() * 0.2 - 0.1;
    this.direction.normalize();
    
    //this.particles.vertices.push(p);    
    this.route.geometry.vertices[this.counter].set(p);
    
    if (this.counter < this.route.geometry.vertices.length) {
      this.counter ++;
    }
    */
  };

  exports.Person = Person;

})(this);