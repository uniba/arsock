
/*!
 * person.js
 *
 * @dependency Three.js
 */

;(function(exports) {

  function Person(stream) {
  
    THREE.Object3D.call(this);
    
    var that = this;

    var color  = util.randColor();

    // three.js
    var body   = new THREE.Object3D()
      , status = new THREE.Object3D()
      , name   = new THREE.Object3D()
      , particles = new THREE.Geometry()
      , route  = new THREE.ParticleSystem(particles, new THREE.ParticleBasicMaterial({color: 0xff6600, size: 10}))
      , jsonLoader = new THREE.JSONLoader();
        
    this.add(body);
    this.add(status);
    this.add(name);
    this.add(route)

    this.body = body;
    this.status = status;
    this.name = name;
    this.route = route;

    this.particles = particles;
    this.counter = 0;

    this.color = color;

    // for dummy data of route
    this.direction = new THREE.Vector3(Math.random(), Math.random(), 0);
    this.speed = Math.random() * 100;
    this.px = Math.random() * 1000 - 500;
    this.pz = Math.random() * 1000 - 500;

    // body
    jsonLoader.load('assets/models/person/json/001_body1.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0xffff00, side: 2})
        , mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(100, 100, 100);
      that.body.add(mesh);
    });

    jsonLoader.load('assets/models/person/json/001_body2.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      that.body.add(line);
    });
    
    jsonLoader.load('assets/models/person/json/001_body3.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      that.body.add(line);
    });
    
    // name
    jsonLoader.load('assets/models/person/json/001_name.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0xffff00, side: 2})
        , mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(100, 100, 100);
      that.name.add(mesh);
    });
    
    // status
    status.position.y = 100;
    
    jsonLoader.load('assets/models/person/json/001_status1.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      that.status.add(line);
    });   
    
    jsonLoader.load('assets/models/person/json/001_body3.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      that.status.add(line);
    });
    
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

    // 
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