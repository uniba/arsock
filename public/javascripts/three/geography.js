
/*!
 * geography.js
 *
 * @dependency Three.js
 */

;(function(exports) {

  function Geography() {
    THREE.Object3D.call(this);

    var that = this,
        loader = new THREE.JSONLoader(),
        scale = 720;

    this.position.x = 80;
    this.position.z = -80;
    this.position.y = 10;
    
    loader.load('assets/models/linz/json/arselectronicacenter.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0x009900, wireframe: true}),
          mesh = new THREE.Mesh(geometry, material);

      mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;
      that.add(mesh);
    });
    
    loader.load('assets/models/linz/json/donau.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = line.scale.y = line.scale.z = scale;
      that.add(line);
    }); 
    
    loader.load('assets/models/linz/json/routes.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = line.scale.y = line.scale.z = scale;
      that.add(line);
    });    

    loader.load('assets/models/linz/json/measurement_200m.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 600;
      line.scale.y = 600;
      line.scale.z = 600;
      
      that.add(line);
    });
  };
 
  Geography.prototype = new THREE.Object3D();

  exports.Geography = Geography;

})(this);