window.onload = function() {

  // Global
  var ww = window.innerWidth
    , wh = window.innerHeight;
        
  // Option
  var forceUseCanvas     = false;
  
  // Three.js Scene Members  
  var scene
    , renderer
    , camera
    , controls
    , stats
    , Renderer           = Modernizr.webgl && !forceUseCanvas ? THREE.WebGLRenderer : THREE.CanvasRenderer
    , MeshMaterial       = Modernizr.webgl && !forceUseCanvas ? THREE.MeshLambertMaterial : THREE.MeshBasicMaterial;
      
  // Value Holders
  var strokeDefaultPos   = []
    , depthDefaultPos    = []      
    , cameraFriction     = 0.03
    , cameraSpring       = 0.05
    , cameraScale        = 0
    , strokeVertexTarget = []
    , curCamPos          = {x:0, y:0, z:10}
    , nextCamPos         = {x:0, y:0, z:10}
    , speed              = {x:0, y:0, z:0};

  setup();
  animate();
  
  function setup() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(45.0, ww / wh, 0.1, 100000);
    camera.position.z = 5000;
    scene.add(camera);
    
    // past routes
    var particles = new THREE.Geometry()
      , pMaterial = new THREE.ParticleBasicMaterial({color: 0xff6600, size: 1})
      , particleSystem = new THREE.ParticleSystem(particles, pMaterial)
      , direction = new THREE.Vector3(Math.random(), Math.random(), 0)
      , speed
      , px
      , py;
    
    for (var i=0, il=20; i<il; i++) {
    
      speed = Math.random() * 100;
      px = Math.random() * 1000 - 500;
      py = Math.random() * 1000 - 500;
      
      for (var j=0, jl=50000; j<jl; j++) {      
        var p = new THREE.Vector3();
  
        p.x = px;
        p.y = py;
        
        px += direction.x * speed;
        py += direction.y * speed;
  
        speed += Math.random() * 0.2 - 0.1;
        direction.x += Math.random() * 0.2 - 0.1;
        direction.y += Math.random() * 0.2 - 0.1;
        direction.normalize();
              
        particles.vertices.push(p);
      }
    }
    
    scene.add(particleSystem);
    
    // grid
    var gridParticles = new THREE.Geometry()
      , gridPMaterial = new THREE.ParticleBasicMaterial({color: 0x009900, size: 50})
      , grid = new THREE.ParticleSystem(gridParticles, gridPMaterial);
    
    for (var i=-50000, il=100000; i<il; i+=2000) {
      for (var j=-50000, jl=100000; j<jl; j+=2000) {      
        var p = new THREE.Vector3();
  
        p.x = i;
        p.y = j;
              
        gridParticles.vertices.push(p);
      }
    }
    
    scene.add(grid);
    
    renderer = new Renderer({antialias: true, canvas: document.getElementById('birdview')});
    renderer.setSize(ww, wh);
        
    // Three.js TrackballControls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    
    stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		stats.domElement.style.zIndex = 100;
		document.getElementById('container').appendChild(stats.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }
  
  function render() {
    controls.update();
    //camera.lookAt({x:0, y:0, z:0});
    renderer.render(scene, camera);
    stats.update();
  }  

  function rgb2hex(r, g, b) {
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return parseInt('0x' + (((256 + r << 8) + g << 8) + b).toString(16).slice(1), 16);
  }
  
  function v(x, y, z) {
    var v = new THREE.Vector3( x/100 - 4, y/100 - 2, z/100 );
    return v;
  }
    
  function f4(a, b, c, d) {
    var f = new THREE.Face4(a, b, c, d);
    return f;
  }
  
};