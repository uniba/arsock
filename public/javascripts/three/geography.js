
/*!
 * geography.js
 *
 * @dependency Three.js
 */

;(function(exports) {

  function Geography() {
    THREE.Object3D.call(this);

    var that = this,
        loader = new THREE.JSONLoader();
    
    loader.load('assets/models/linz/json/arselectronicacenter.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0x009900, wireframe: true}),
          mesh = new THREE.Mesh(geometry, material);

      mesh.rotation.y = Math.PI;
      mesh.scale.x = 500;
      mesh.scale.y = 500;
      mesh.scale.z = 500;
      
      that.add(mesh);
    });
    
    loader.load('assets/models/linz/json/donau.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.rotation.y = Math.PI;
      line.scale.x = 500;
      line.scale.y = 500;
      line.scale.z = 500;
      
      that.add(line);
    });    

    loader.load('assets/models/linz/json/measurement_200m.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 500;
      line.scale.y = 500;
      line.scale.z = 500;
      
      //that.add(line);
    });
  };
 
  Geography.prototype = new THREE.Object3D();

  exports.Geography = Geography;

})(this);