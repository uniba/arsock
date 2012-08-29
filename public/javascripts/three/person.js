
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
        route  = new THREE.ParticleSystem(particles, new THREE.ParticleBasicMaterial({ color: 0xff6600, size: 30 }));

    this.add(token);
    this.add(route);

    this.route = route;
    this.particles = particles;
    this.counter = 0;

    // for dummy data of route
    this.direction = new THREE.Vector3(Math.random(), Math.random(), 0);
    this.speed = Math.random() * 100;
    this.px = Math.random() * 1000 - 500;
    this.pz = Math.random() * 1000 - 500;

    this.position.x = this.px;
    this.position.z = this.pz;
    
    // route
    route.geometry.__dirtyVertices = true;
    route.geometry.__dirtyElements = true;
    route.dynamic = true;

    for (var i=0, il=50000; i<il; i++) {
      var p = new THREE.Vector3(0, 0, 0);
      
      p.x = this.px;
      p.z = this.pz;
      
      this.px += this.direction.x * this.speed;
      this.pz += this.direction.z * this.speed;
  
      this.speed += Math.random() * 0.2 - 0.1;
      this.direction.x += Math.random() * 0.2 - 0.1;
      this.direction.z += Math.random() * 0.2 - 0.1;
      this.direction.normalize();
      
      //this.particles.vertices.push(p);    
      this.route.geometry.vertices.push(p);
    }

    stream.on('latest', function(data) {
      if (data.type === 'location') {
        var scale = 1000000;
        var pos = util.locationFromUniba(data.data.latitude, data.data.longitude);
        var z = pos.latitude * scale;
        var x = pos.longitude * scale;
        that.position.z = z;
        that.position.x = x;
        console.log('moved');
      } else if (data.type === 'heading') {
        token.updateDirection(util.deg2rad(data.data.trueHeading));
      }
    }); 

    stream.on('past', function(data) {
    });
  }

  Person.prototype = new THREE.Object3D();
  
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