
/*!
 * person.js
 *
 * @dependency Three.js
 */

;(function(exports) {

  function Person(stream, state) {  
    THREE.Object3D.call(this);
    
    var that = this,
        token = new Token(stream.id, util.randColor()),
        particles = new THREE.Geometry(),
        route  = new THREE.ParticleSystem(particles, new THREE.ParticleBasicMaterial({ color: 0xff6600, size: 40 })),
        records = [];

    stream.on('latest', function(data) {
      records.push(data);
    });

    stream.on('past', function(data) {
    });

    state.on('tick', function(time) {
      if (that.records.length > 0) {
        that.moveTo(that.calcIndex(time));
      }
    });

    this.add(token);
    this.add(route);
        
    for (var i = 0, il = 100000; i<il; i++) {
      var p = new THREE.Vector3(0, 0, 0);
      p.y = 1000000;
      route.geometry.vertices.push(p);
    }

    this.token = token;
    this.route = route;
    this.particles = particles;
    this.counter = 0;
    this.currentIndex = 0;
    this.records = records;

    // plot initial location
    //this.updateLocation(0, 0, 0);
  }

  Person.prototype = new THREE.Object3D();
  
  Person.prototype.show = function() {
    this.forAllChildren(function(child) {
      child.visible = true;
    });
  };
  
  Person.prototype.hide = function() {
    this.forAllChildren(function(child) {
      child.visible = false;
    });
  };

  Person.prototype.forAllChildren = function(callback) {
    function iter(obj) {
      callback(obj);
      obj.children.forEach(function(child) {
        iter(child);
      });
    };
    iter(this);
  };

  Person.prototype.updateLocation = function(x, y, z) {
    this.token.updateLocation(x, y, z);
    this.addFootPrint(x, y, z);
  };

  Person.prototype.addFootPrint = function(x, y, z) {
    this.route.geometry.vertices[this.counter].set(x, y, z);
    this.counter++;
  };

  Person.prototype.removeFootPrint = function() {
    this.route.geometry.vertices[this.counter].set(0, 100000, 0);
    this.counter--;
  };
  
  Person.prototype.moveTo = function(nextIndex) {
    var i = this.currentIndex,
        data;

    if (i < nextIndex) {
      data = this.records[i];
      while (i < nextIndex) {
        i++;
        data = this.records[i];
        this.renderForward(data);
      }
    } else {
      data = this.records[i];
      while (nextIndex < i) {
        i--;
        data = this.records[i];
        this.renderBackward(data);
      }
    }    

    this.currentIndex = nextIndex;
  };

  Person.prototype.renderForward = function(data) {
    if (data.type === 'location') {
      this.token.updateLocation(data.data.longitude, 0, data.data.latitude);
      this.addFootPrint(data.data.longitude, 0, data.data.latitude);
    } else if (data.type === 'heading') {
      this.token.updateDirection(util.deg2rad(data.data.trueHeading));
    } else if (data.type === 'acceleration') {
      // do something!
    }
  };

  Person.prototype.renderBackward = function(data) {
    if (data.type === 'location') {
      this.token.updateLocation(data.data.longitude, 0, data.data.latitude);
      this.removeFootPrint();
    } else if (data.type === 'heading') {
      this.token.updateDirection(util.deg2rad(data.data.trueHeading));
    } else if (data.type === 'acceleration') {
      // do something!
    }
  };

  Person.prototype.calcIndex = function(date) {
    var i = this.currentIndex,
        data = this.records[i];
    if (!data) return i;
    if (date < data.data.timestamp) {
      while (data && date < data.data.timestamp) {
        i--;
        data = this.records[i];
      }
      i = Math.max(i, 0);
    } else {
      while (data && data.data.timestamp < date) {
        i++;
        data = this.records[i];
      }
      i = Math.max(--i, 0);
    }
    return i;
  };

  // 標準のループ
  Person.prototype.update = function() {
    this.route.geometry.verticesNeedUpdate = true;
  };

  exports.Person = Person;

})(this);