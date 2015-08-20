// var Job = require('./job');
var  _ = require('lodash');

var Worker = function(name, cb) {
  if (!_.isString(name) || name.lenght < 1) throw 'name is invalid';

  this.name = name;

  if (cb) this.setWorker(cb);
};

Worker.prototype.execute = function(job) {
  var cb = this.cb;

  setTimeout(function() {
    cb(job);
  }, 10);

  return this;
};

Worker.prototype.setWorker = function(cb) {
  if (!_.isUndefined(this.worker)) throw 'worker is already set';
  if (!_.isFunction(cb)) throw 'callback is not a function!';

  this.cb = cb;
};

module.exports = Worker;
