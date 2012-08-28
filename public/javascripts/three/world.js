
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
      , linz
      , grid;
      
    var jsonLoader = new THREE.JSONLoader();

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
    scene.add(camera);
      
    controls = new THREE.TrackballControls(camera, renderer.domElement);

    // ユーザごとのstreamを作成
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
    
    // grid
    var gridParticles = new THREE.Geometry()
      , gridPMaterial = new THREE.ParticleBasicMaterial({color: 0x009900, size: 50});
    
    grid = new THREE.ParticleSystem(gridParticles, gridPMaterial);
    
    for (var i=-50000, il=100000; i<il; i+=2000) {
      for (var j=-50000, jl=100000; j<jl; j+=2000) {     
        var p = new THREE.Vector3(); 
  
        p.x = i;
        p.z = j;
              
        gridParticles.vertices.push(p);
      }
    }

    scene.add(grid);
    
    // ars electronica center
    
    linz = new THREE.Object3D();
    
    jsonLoader.load('assets/models/linz/json/arselectronicacenter.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0x009900, wireframe: true})
        , line = new THREE.Mesh(geometry, material);

      line.position.x = 3000;
      line.position.z = 1500;
      line.rotation.y = Math.PI * 0.66;
      line.scale.x = 500;
      line.scale.y = 500;
      line.scale.z = 500;
      
      that.linz.add(line);
    }); 

    // donau river (line)
    jsonLoader.load('assets/models/linz/json/donau.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 10000;
      line.scale.y = 10000;
      line.scale.z = 10000;
      
      that.linz.add(line);
    });
    
    scene.add(linz);
    
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
    this.controls = controls;   
    this.linz = linz;
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