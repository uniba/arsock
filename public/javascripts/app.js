-function(window, docuemnt, $, undefined) {
	var map,
		socket = io.connect('http://' + window.location.host);
	
	socket.on('news', function(data) {
		console.log(data);
		socket.emit('someevent', { my: 'data' });
	});
	
	$(function() {
		var $list = $('<ul><li></li></ul>').appendTo('body');
		
		function log(type, data) {
			$list.prepend($('<li>' + type  + ': ' + JSON.stringify(data) + '</li>'));			
			if ($list.find('li').length > 10) {
				$list.find('li').last().remove();
			}
			if (console) {
				console.log([type, JSON.stringify(data)]);
			}
		}
		
		socket.on('ping', function(data) {
			log('ping', data);
		});
		socket.on('accelerometer', function(data) {
			log('accelerometer', data);
			setRotate(data);
		});
		socket.on('location', function(data) {
			log('location', data);
			
			if (map) {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(data.latitude, data.longitude),
					map: map,
					title: data._clientId
				}); 
				console.log(marker);
			}
		});
		
		socket.on('heading', function(data) {
			log('heading', data);
		});
		
		init();
		animate();
	});

	google.maps.event.addDomListener(window, 'load', function() {
		var div = document.getElementById('map_canvas');
		map = new google.maps.Map(div, {
			zoom: 8,
			center: new google.maps.LatLng(48.309659, 14.284415),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scaleControl: true
		});
	});
	
	var container, stats;
	var camera, scene, renderer, group, particle;
	var mouseX = 0, mouseY = 0;

	var camTargetX;
	var camTargetY;
	var camTargetDistance;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	
	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 0;

		scene = new THREE.Scene();

		var PI2 = Math.PI * 2;
		var program = function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 1, 0, PI2, true );
			context.closePath();
			context.fill();

		}

		group = new THREE.Object3D();
		scene.addObject( group );

		for ( var i = 0; i < 1000; i++ ) {

			particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: Math.random() * 0x808008 + 0x808080, program: program } ) );
			particle.position.x = Math.random() * 2000 - 1000;
			particle.position.y = Math.random() * 2000 - 1000;
			particle.position.z = Math.random() * 2000 - 1000;
			particle.scale.x = particle.scale.y = Math.random() * 10 + 5;
			group.addChild( particle );
		}

		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	}

	//

	function onDocumentMouseMove( event ) {

		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}

	function onDocumentTouchStart( event ) {

		if ( event.touches.length == 1 ) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}

	function onDocumentTouchMove( event ) {

		if ( event.touches.length == 1 ) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}

	//

	function animate() {

		requestAnimationFrame( animate );

		render();
		stats.update();

	}
	
	function setRotate( data ) {
		camTargetX = Math.sin(data.trueHeading) * camTargetDistance;
		camTargetY = Math.cos(data.trueHeading) * camTargetDistance;
	}

	function render() {

		camera.target.x = camTargetX;
		camera.target.y = camTargetY;
		//camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		//camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

		//group.rotation.x += 0.01;
		//group.rotation.y += 0.02;

		renderer.render( scene, camera );

	}
}(window, document, jQuery);
