
/*!
 * app.js
 * main scripts for realtimeweblog.in (2012)
 *
 * @dependency Stats.js r10
 * @dependency jQuery 1.7.2
 * @dependency world.js
 * @dependency state.js
 */

$(function() {

  var debug = true;

  var stream = new LogStream(),
      state = new State(),
      world = new World(stream, state, window.innerWidth, window.innerHeight),
      stats = new Stats();

  var $fake = $('.fake span'),
      $real = $('.real span');

  $('.people :input').live('change', function() {
    var id = this.getAttribute('data-person-id');
    if (this.checked) {
      state.show(id);
    } else {
      state.hide(id);
    }
  });

  $('.reduce').on('click', function() {
    var speed = state.getSpeed();
    if (speed > 1) {
      state.setSpeed(speed / 2);
    } else if (speed === 1) {
      state.setSpeed(0);
    } else if (speed === 0) {
      state.setSpeed(-1);
    } else {
      state.setSpeed(speed * 2);
    }
  });

  $('.increase').on('click', function() {
    var speed = state.getSpeed();
    if (speed >= 1) {
      state.setSpeed(speed * 2);
    } else if (speed === 0) {
      state.setSpeed(1);
    } else if (speed === -1) {
      state.setSpeed(0);
    } else {
      state.setSpeed(speed / 2);
    }
  });

  stream.on('connection', function(person) {
    $('.people')
      .append($('<li>')
              .append($('<label/>')
                      .append('<input type="checkbox" checked="checked" data-person-id="' + person.id + '" />')
                      .append(person.name)));
  });


  state.on('speedchange', function(val) {
    $('.speed').text('x' + val);
  });

  state.on('tick', function() {
    $real.text(util.formatTime(new Date()));
    $fake.text(util.formatTime(state.getDate()));
  });

  if (debug) {
    world.on('beforerender', stats.begin);
    world.on('afterrender', stats.end);

    $(stats.domElement)
      .addClass('stats')
      .appendTo(document.body);
  }

  // convert location relative to the center position, then scale it.
  stream.addFilter(function(data) {
    var lat,
        lon,
        center = debug ? arsock.config.location.uniba : arsock.config.location.arscenter;
    if (data.type === 'location') {
      lat = data.data.latitude,
      lon = data.data.longitude;
      data.data.latitude = (lat - center.latitude) * 1000000;
      data.data.longitude = (lon - center.longitude) * 1000000;
    }
    return data;
  });

  world.start();

  $('.speed').text('x' + state.getSpeed());

  document.body.appendChild(world.renderer.domElement);
});
