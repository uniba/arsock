-function(window, docuemnt, $, undefined) {
	var socket = io.connect('http://localhost:3001');
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
	});
}(window, document, jQuery);
