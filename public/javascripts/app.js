/*
 * 
 */

$(function() {

  var stream = new LogStream(),
      state = new State(),
      world = new World(stream, state, window.innerWidth, window.innerHeight),
      stats = new Stats();


  var $fake = $('.fake span'),
      $real = $('.real span');

  stream.on('connection', function(person) {
    $('.persons').append('<li><label><input type="checkbox" data-person-id=' + person.id + ' checked="checked" /><label>' + person.id + '</li></label>');
  });

  $('.persons :input').live('change', function() {
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

  state.on('speedchange', function(val) {
    $('.speed').text('x' + val);
  });

  $('.speed').text('x' + state.getSpeed());

  state.on('tick', function() {
    $real.text(util.formatTime(new Date()));
    $fake.text(util.formatTime(state.getDate()));
  });
  
  $(stats.domElement)
    .addClass('stats')
    .appendTo(document.body);
  
  world.start();
  world.on('beforerender', stats.begin);
  world.on('afterrender', stats.end);

  document.body.appendChild(world.renderer.domElement);
});
