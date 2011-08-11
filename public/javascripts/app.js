-function(window, docuemnt, $, undefined) {
	var map,
		socket = io.connect('http://' + window.location.host);
	
	socket.on('news', function(data) {
		console.log(data);
		socket.emit('someevent', { my: 'data' });
	});
	
	$(function() {
		$ul = $('<ul></ul>').appendTo('body');
		
		function log(type, data) {
			$ul.prepend($('<li>' + type  + ': ' + JSON.stringify(data) + '</li>'));			
		}
		
		socket.on('ping', function(data) {
			log('ping', data);
		});
		
		socket.on('accelerometer', function(data) {
			log('accelerometer', data);
		});
		
		socket.on('location', function(data) {
			log('location', data);
			
			if (map) {
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(data.latitude, data.longtitude),
					map: map,
					title: data._clientId
				}); 
			}
		});
		
		socket.on('heading', function(data) {
			log('heading', data);
		})
	});

	google.maps.event.addDomListener(window, 'load', function() {
		var div = document.getElementById('map_canvas'),
			map = new google.maps.Map(div, {
				zoom: 8,
				center: new google.maps.LatLng(35.663411, 139.70502),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: true
			});
	});
}(window, document, jQuery);
