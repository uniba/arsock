
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

  var config = arsock.config;

  var stream = new LogStream(),
      state = new State(),
      world = new World(stream, state, window.innerWidth, window.innerHeight, config),
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

  /*
  $(window).on('keydown', function(e) {
    switch (String.fromCharCode(e.keyCode)) {
    case 'Q':
      state.emit('move', 'up');
      break;
    case 'E':
      state.emit('move', 'down');
      break;
    case 'W':
      state.emit('move', 'forward');
      break;
    case 'A':
      state.emit('move', 'left');
      break;
    case 'S':
      state.emit('move', 'backward');
      break;
    case 'D':
      state.emit('move', 'right');
      break;
    }
  });
  */

  world.on('beforerender', stats.begin);
  world.on('afterrender', stats.end);

  $(stats.domElement)
    .addClass('stats')
    .appendTo(document.body);

  // convert location relative to the center position, then scale it.
  stream.addFilter((function() {
    var center = config.location.arscenter,
        latCenter = util.latToY(center.latitude),
        lonCenter = util.lonToX(center.longitude),
        scale = Math.pow(2, 21 - (config.gmap.zoom + Math.log(config.gmap.scale) / Math.log(2)));
    return function(data) {
      var lat,
          lon;
      if (data.type === 'location') {
        data.data.latitude = (util.latToY(data.data.latitude) -  latCenter) / scale;
        data.data.longitude = (util.lonToX(data.data.longitude) -  lonCenter) / scale;
      }
      return data;
    };
  })());

  world.start();

  $('.speed').text('x' + state.getSpeed());

  document.body.appendChild(world.renderer.domElement);
});
