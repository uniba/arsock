-function(window, docuemnt, $, undefined) {
	var socket = io.connect('http://' + window.location.host);
	socket.on('news', function(data) {
		console.log(data);
		socket.emit('someevent', { my: 'data' });
	});
	
	$(function() {
		$ul = $('<ul></ul>').appendTo('body');
		socket.on('ping', function(data) {
			$ul.append($('<li>' + JSON.stringify(data) + '</li>'));
		});
		socket.on('accel', function(data) {
			$ul.append($('<li>' + JSON.stringify(data) + '</li>'));
		});
		socket.on('location', function(data) {
			$ul.append($('<li>' + JSON.stringify(data) + '</li>'));
		});
	});
}(window, document, jQuery);
