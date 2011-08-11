-function(window, docuemnt, $, undefined) {
	var map,
		socket = io.connect('http://' + window.location.host);
	socket.on('news', function(data) {
		console.log(data);
		socket.emit('someevent', { my: 'data' });
	});
	
	$(function() {
		$ul = $('<ul></ul>').appendTo('body');
		socket.on('ping', function(data) {
			$ul.prepend($('<li>' + JSON.stringify(data) + '</li>'));
		});
		socket.on('accel', function(data) {
			$ul.prepend($('<li>' + JSON.stringify(data) + '</li>'));
		});
		socket.on('location', function(data) {
			$ul.prepend($('<li>' + JSON.stringify(data) + '</li>'));
			if (map) {
				
			}
		});
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
