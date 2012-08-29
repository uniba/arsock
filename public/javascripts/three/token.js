
/*!
 * token.js
 * Object which indicates target's realtime location and direction 
 * 
 * @dependency Three.js
 */

;(function(exports) {

  function Token(color, name) {
    THREE.Object3D.call(this);
    color = color || 0xffff00;

    var body = new THREE.Object3D(),
        status = new THREE.Object3D(),
        name = new THREE.Object3D(),
        loader = new THREE.JSONLoader();

    loader.load('assets/models/person/json/001_body1.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({ color: color, side: 2 }),
          mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(100, 100, 100);
      body.add(mesh);
    });

    loader.load('assets/models/person/json/001_body2.js', function(geometry){
      var material = new THREE.LineBasicMaterial({ color: color, lineWidth: 1.25 }),
          line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      body.add(line);
    });
    
    loader.load('assets/models/person/json/001_body3.js', function(geometry){
      var material = new THREE.LineBasicMaterial({ color: color, lineWidth: 1.25 }),
          line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      body.add(line);
    });
    
    loader.load('assets/models/person/json/001_name.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({ color: color, side: 2 }),
          mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(100, 100, 100);
      name.add(mesh);
    });
        
    loader.load('assets/models/person/json/001_status1.js', function(geometry){
      var material = new THREE.LineBasicMaterial({ color: color, lineWidth: 1.25 }),
          line = new THREE.Line(geometry, material);
      line.scale.set(100, 100, 100);
      status.add(line);
    });   
    
    status.position.y = 100;

    this.add(status);
    this.add(body);
    this.add(name);

    this.status = status;
    this.name = name;
    this.body = body;
  }

  Token.prototype = new THREE.Object3D();

  Token.prototype.updatePosition = function(x, y, z) {    
  };

  Token.prototype.updateDirection = function(rad) {
    this.status.rotation.y = rad;
  };

  Token.prototype.updateNameAngle = function(angle) {    
  };

  exports.Token = Token;

})(this);