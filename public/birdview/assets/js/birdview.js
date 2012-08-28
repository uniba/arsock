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
    , people
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
    camera.position.x = -5000;
    camera.position.y = 2000;
    scene.add(camera);
    
    // people
    var person = new THREE.Object3D()
      , body   = new THREE.Object3D()
      , status = new THREE.Object3D()
      , name   = new THREE.Object3D()
      , jsonLoader = new THREE.JSONLoader();
      
    people = new THREE.Object3D();
 
    status.position.y = 100;
 
    person.body = body;
    person.status = status;
    person.name = name;    
    people.person = person;
    
    person.add(body);
    person.add(status);
    person.add(name);
    people.add(person);
    
    scene.add(people);

    // person body (circle mesh)
    jsonLoader.load('assets/models/person/json/001_body1.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0xffff00, side: 2})
        , mesh = new THREE.Mesh(geometry, material);
      
      mesh.scale.x = 100;
      mesh.scale.y = 100;
      mesh.scale.z = 100;
      
      people.person.body.add(mesh);
    });

    // person body (line)
    jsonLoader.load('assets/models/person/json/001_body2.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 100;
      line.scale.y = 100;
      line.scale.z = 100;
      
      people.person.body.add(line);
    });
    
    // person body (circle line)
    jsonLoader.load('assets/models/person/json/001_body3.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 100;
      line.scale.y = 100;
      line.scale.z = 100;
      
      people.person.body.add(line);
    });
    
    // person name
    jsonLoader.load('assets/models/person/json/001_name.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0xffff00, side: 2})
        , mesh = new THREE.Mesh(geometry, material);

      mesh.scale.x = 100;
      mesh.scale.y = 100;
      mesh.scale.z = 100;
      
      people.person.name.add(mesh);
    });
    
    // person status (cross line)
    jsonLoader.load('assets/models/person/json/001_status1.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);
      
      line.scale.x = 100;
      line.scale.y = 100;
      line.scale.z = 100;
      
      people.person.status.add(line);
    });   
    
    // person status (circle line)
    jsonLoader.load('assets/models/person/json/001_body3.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0xffff00, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 100;
      line.scale.y = 100;
      line.scale.z = 100;
      
      people.person.status.add(line);
    });    

    // ars electronica center
    jsonLoader.load('assets/models/linz/json/arselectronicacenter.js', function(geometry){
      var material = new THREE.MeshBasicMaterial({color: 0x009900, wireframe: true})
        , line = new THREE.Mesh(geometry, material);

      line.position.x = 3000;
      line.position.z = 1500;
      line.rotation.y = Math.PI * 0.66;
      line.scale.x = 500;
      line.scale.y = 500;
      line.scale.z = 500;
      
      scene.add(line);
    }); 

    // donau river (line)
    jsonLoader.load('assets/models/linz/json/donau.js', function(geometry){
      var material = new THREE.LineBasicMaterial({color: 0x009900, lineWidth: 1.25})
        , line = new THREE.Line(geometry, material);

      line.scale.x = 10000;
      line.scale.y = 10000;
      line.scale.z = 10000;
      
      scene.add(line);
    }); 
    
    // past routes
    var particles = new THREE.Geometry()
      , pMaterial = new THREE.ParticleBasicMaterial({color: 0xff6600, size: 1})
      , particleSystem = new THREE.ParticleSystem(particles, pMaterial)
      , direction = new THREE.Vector3(Math.random(), Math.random(), 0)
      , speed
      , px
      , pz;
    
    for (var i=0, il=20; i<il; i++) {
    
      speed = Math.random() * 100;
      px = Math.random() * 1000 - 500;
      pz = Math.random() * 1000 - 500;
      
      for (var j=0, jl=50000; j<jl; j++) {      
        var p = new THREE.Vector3();
  
        p.x = px;
        p.z = pz;
        
        px += direction.x * speed;
        pz += direction.z * speed;
  
        speed += Math.random() * 0.2 - 0.1;
        direction.x += Math.random() * 0.2 - 0.1;
        direction.z += Math.random() * 0.2 - 0.1;
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
        p.z = j;
              
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
    camera.lookAt(people.person.position);
    //people.person.name.lookAt(camera.position);
    
    if (Math.random() < 0.01) {
      updatePeoplePosition(Math.random() * 50, Math.random() * 50);
    }

    if (Math.random() < 0.6) {
      updatePeopleRotation(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1);
    }
    
    renderer.render(scene, camera);
    stats.update();
  }  

  function updatePeoplePosition(px, pz) {
    people.person.position.x += px;
    people.person.position.z += pz;
    camera.position.x += px;
    camera.position.z += pz;
  }
  
  function updatePeopleRotation(rx, ry, rz) {
    people.person.status.rotation.x += rx;
    people.person.status.rotation.y += ry;
    people.person.status.rotation.z += rz;
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