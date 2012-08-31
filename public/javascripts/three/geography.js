
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

      mesh.rotation.y = - Math.PI * 0.55;
      mesh.scale.x = 720;
      mesh.scale.y = 720;
      mesh.scale.z = 720;
      
      that.add(mesh);
    });
    
    loader.load('assets/models/linz/json/donau.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.rotation.y = - Math.PI * 0.55;
      line.scale.x = 720;
      line.scale.y = 720;
      line.scale.z = 720;
      
      that.add(line);
    });    

    loader.load('assets/models/linz/json/measurement_200m.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 600;
      line.scale.y = 600;
      line.scale.z = 600;
      
      //that.add(line);
    });
  };
 
  Geography.prototype = new THREE.Object3D();

  exports.Geography = Geography;

})(this);