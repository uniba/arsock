
/*!
 * clock
 * Copyright (c) 2012 hitsujiwool <utatanenohibi@gmail.com>
 * MIT Licensed
 */

;(function(exports) {  

  /**
   * @param {Number} speed 時計のスピード
   * @param {Boolean} overtime 実時間より未来に進むか否か
   */
  function Clock(speed, overtime) {
    var now = new Date().getTime();    
    this.current = now;
    this.timeWhenChecked = now;
    this.speed = speed || 1;
    this.overtime = overtime;
  };

  Clock.prototype.getSpeed = function() {
    return this.speed;
  };

  Clock.prototype.setSpeed = function(speed) {
    this.speed = speed;
  };

  Clock.prototype.update = function() {
    var now = new Date().getTime();
    this.current += (now - this.timeWhenChecked) * this.speed;
    if (!this.overtime && this.current > now) {
      this.current = now;
    }
    this.timeWhenChecked = now;
    return this;
  };
  
  Clock.prototype.getDate = function() {
    this.update();
    return new Date(this.current);
  };

  Clock.prototype.getTime = function() {
    this.update();
    return this.current;
  };

  exports.Clock = Clock;
  
})(typeof window !== 'undefined' ? window : module.exports);