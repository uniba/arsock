-function(window, docuemnt, $, undefined) {
	var socket = io.connect('http://realtimeweblog.in:3000');

	$(function() {
        	var map = $('#map_canvas').arsmap().data('arsmap-api');
		var $span = $('<span></span>');
		var firstPersonClientId;

		$span.css({ display: 'block', position: 'absolute', overflow: 'hidden', bottom: 10, right: 0, width: '100%' });
		$span.appendTo('body');

		function log(type, data) {
			/* $list.prepend($('<li>' + type  + ': ' + JSON.stringify(data) + '</li>'));
			if ($list.find('li').length > 10) {
				$list.find('li').last().remove();
			} */
			//if (console) {
			//	console.log([type, JSON.stringify(data)]);
			//}
			$span.text(JSON.stringify(data));
		}

		socket.on('ping', function(data) {
			log('ping', data);
		});
		socket.on('accelerometer', function(data) {
			log('accelerometer', data);
		});
		socket.on('location', function(data) {
			log('location', data);
			map.mark(data);
		});

		socket.on('heading', function(data) {
			firstPersonClientId = firstPersonClientId || data._clientId;
			if (firstPersonClientId === data._clientId) {
				log('heading', data);
				setRotate( data );
			}
		});

		init();
		animate();
	});



	var container, stats;
	var camera, scene, renderer, group, particle;
	var mouseX = 0, mouseY = 0;

	var camTargetX;
	var camTargetY;
	var camTargetDistance = 1000;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = 350 / 2;

	function init() {

		container = document.createElement( 'div' );
		document.getElementById( 'canvas' ).appendChild( container );

		camera = new THREE.Camera( 75, window.innerWidth / 350, 1, 3000 );
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

		for ( var i = 0; i < 10; i++ ) {
			for ( var j = 0; j < 10; j++ ) {
				for ( var k = 0; k < 10; k++ ) {

					particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: 0x000000, program: program } ) );
					particle.position.x = i*100 - 5*100;
					particle.position.y = j*100 - 5*100;
					particle.position.z = k*100 - 5*100;
					particle.scale.x = particle.scale.y = 2;
					group.addChild( particle );

				}
			}
		}

		/*
		// particles

		var PI2 = Math.PI * 2;
		var material = new THREE.ParticleCanvasMaterial( {

			color: 0xffffff,
			program: function ( context ) {

				context.beginPath();
				context.arc( 0, 0, 1, 0, PI2, true );
				context.closePath();
				context.fill();

			}

		} );

		var geometry = new THREE.Geometry();

		for ( var i = 0; i < 10; i++ ) {
			for ( var j = 0; j < 10; j++ ) {
				for ( var k = 0; k < 10; k++ ) {

					/*
					particle = new THREE.Particle( material );
					particle.position.x = i * 2/10 - 2/5;
					particle.position.y = j * 2/10 - 2/5;
					particle.position.z = k * 2/10 - 2/5;
					particle.position.normalize();
					particle.position.multiplyScalar( 10 + 450 );
					particle.scale.x = particle.scale.y = 5;
					scene.addObject( particle );


					geometry.vertices.push( new THREE.Vertex( particle.position ) );
				}
			}
		}

		// lines

		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ) );
		scene.addObject( line );
		*/


		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, 350 );
		container.appendChild( renderer.domElement );

		/* stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild( stats.domElement ); */

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
		// stats.update();

	}

	function setRotate( data ) {
		//console.log(['setrotate', data.trueHeading/Math.PI*2]);
		camera.target.position.x = Math.sin(data.trueHeading/(Math.PI*16)) * camTargetDistance;
		camera.target.position.z = Math.cos(data.trueHeading/(Math.PI*16)) * camTargetDistance;

		camera.position.x = data.x;
		camera.position.y = data.y;
		camera.position.z = data.z;

		renderer.render( scene, camera );
	}

	function render() {

		//camera.target.x = camTargetX;
		//camera.target.y = camTargetY;
		//camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		//camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

		//group.rotation.x += 0.01;
		//group.rotation.y += 0.02;

		renderer.render( scene, camera );

	}
}(window, document, jQuery);
