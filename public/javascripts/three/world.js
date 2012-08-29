
/*!
 * world.js
 * controller for Three.js elements
 *
 * @dependency EventEmitter.js
 * @dependency Three.js
 */

;(function(exports) {

  function World(stream, state, width, height) {
    EventEmitter.call(this);

    var that = this;
    
    var renderer
      , camera
      , scene
      , controls
      , grid;
      
    this.people = {};
    this.rendering = false;
    this.state = state;

    // setup renderer, camera, scene, and so on.
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    
    // camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100000);
    camera.position.x = - 5000;
    camera.position.y = 2000;
    camera.position.z = 0;

    scene = new THREE.Scene();
      
    controls = new THREE.TrackballControls(camera, renderer.domElement);

    scene.add(camera);    
    scene.add(new ParticleGrid());
    scene.add(new LineGrid());    
    scene.add(new Geography());

    stream.on('connection', function(personStream) {
      var person = new Person(personStream, that.scene);
      that.people[personStream.id] = person;
      that.scene.add(person);
    });

    state.on('hide', function(id) {
      that.people[id].hide();
    });

    state.on('show', function(id) {
      that.people[id].show();
    });

    stream.connect();
            
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.controls = controls;   
    this.grid = grid;
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

    Object.keys(this.people).forEach(function(id) {
      that.people[id].update();
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