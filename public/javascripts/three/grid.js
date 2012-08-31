
/*!
 * grid.js
 *
 * @dependency Three.js
 */

;(function(exports) {
  
  function ParticleGrid() {

    THREE.Object3D.call(this);

    var gridParticles = new THREE.Geometry()
      , gridPMaterial = new THREE.ParticleBasicMaterial({color: 0x009900, size: 100});
    
    var grid = new THREE.ParticleSystem(gridParticles, gridPMaterial);
    
    for (var i=-20000, il=40000; i<il; i+=2000) {
      for (var j=-20000, jl=40000; j<jl; j+=2000) {     
        var p = new THREE.Vector3(); 
  
        p.x = i;
        p.z = j;
              
        gridParticles.vertices.push(p);
      }
    }
    
    this.add(grid);
  };

  ParticleGrid.prototype = new THREE.Object3D();

  exports.ParticleGrid = ParticleGrid;


  function LineGrid() {
    var lineMaterial, geometry, line, i;
    lineMaterial = new THREE.LineBasicMaterial({ color: 0x222222 });
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-40000, 0, 0));
	geometry.vertices.push(new THREE.Vector3( 40000, 0, 0));
	for (i = 0; i <= 200; i ++ ) {
	  line = new THREE.Line(geometry, lineMaterial);
	  line.position.z = (i * 400) - 40000;
	  this.add(line);
	  line = new THREE.Line(geometry, lineMaterial);
	  line.position.x = (i * 400) - 40000;
	  line.rotation.y = 90 * Math.PI / 180;
	  this.add(line);
	}
  };

  LineGrid.prototype = new THREE.Object3D();

  exports.LineGrid = LineGrid;  

})(this);