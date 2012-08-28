
;(function(exports) {

  function World(stream, state, width, height) {
    EventEmitter.call(this);

    var that = this;    

    var camera, renderer, scene, light;

    this.persons = {};
    this.rendering = false;
    this.state = state;

    // setup renderer, camera, scene, and so on.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    
    camera = new THREE.PerspectiveCamera(45, 2, 0.1, 10000);
    camera.rotation.x = - 0.3;
    camera.position.y = 300;
    camera.position.z = 800;

    scene = new THREE.Scene();
    scene.add(camera);

    light = new THREE.PointLight(0xFFFFFF);
    light.position.x = 10;
    light.position.y = 500;
    light.position.z = 1000;
    scene.add(light);
    
    var lineMaterial, geometry, line, i;
    lineMaterial = new THREE.LineBasicMaterial({ color: 0xDDDDDD });
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(-8000, 0, 0));
	geometry.vertices.push(new THREE.Vector3( 8000, 0, 0));
	for (i = 0; i <= 160; i ++ ) {
	  line = new THREE.Line(geometry, lineMaterial);
	  line.position.z = (i * 100) - 8000;
	  scene.add(line);
	  line = new THREE.Line(geometry, lineMaterial);
	  line.position.x = (i * 100) - 8000;
	  line.rotation.y = 90 * Math.PI / 180;
	  scene.add(line);
	}
  
    this.controls = new THREE.TrackballControls(camera, renderer.domElement);

    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;

    // ユーザごとのstreamを作成
    stream.on('connection', function(personStream) {
      var person = new Person(personStream, that.scene);
      that.persons[personStream.id] = person;
      that.scene.add(person);
    });

    state.on('hide', function(id) {
      that.persons[id].hide();
    });

    state.on('show', function(id) {
      that.persons[id].show();
    });

    stream.connect();
  };
  
  World.prototype = new EventEmitter();
  
  World.prototype.start = function() {
    this.rendering = true;
    this.render();
    return this;
  };
  
  World.prototype.stop = function() {
    this.rendering = false;
    return this;
  };

  World.prototype.render = function() {
    var that = this;

    this.emit('beforerender');

    Object.keys(this.persons).forEach(function(id) {
      that.persons[id].update();
    });

    this.state.tick();

    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    if (this.rendering) {
      requestAnimationFrame(function() { that.render(); });
    }

    this.emit('afterrender');
  };

  /** 
   * Export modules.
   */
  exports.World = World;

})(this);