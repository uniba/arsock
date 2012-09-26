
/*!
 * state.js
 * Object which integrates intenal state of the application
 * 
 * @dependency EventEmitter.js
 */

;(function(exports) {

  function State(time) {
    EventEmitter.call(this);
    this.clock = new Clock(time);
  }
  
  State.prototype = new EventEmitter();

  State.prototype.show = function(id) {
    this.emit('show', id);
  };

  State.prototype.hide = function(id) {
    this.emit('hide', id);
  };

  State.prototype.tick = function() {
    var time = this.clock.getTime();
    this.emit('tick', time);
    return this;
  };

  State.prototype.getSpeed = function() {
    return this.clock.getSpeed();
  };

  State.prototype.setSpeed = function(val) {
    this.clock.setSpeed(val);
    this.emit('speedchange', val);
  };

  State.prototype.getTime = function() {
    return this.clock.getTime();
  };

  State.prototype.getDate = function() {
    return this.clock.getDate();
  };

  exports.State = State;

})(this);