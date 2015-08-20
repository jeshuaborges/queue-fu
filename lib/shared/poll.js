var _ = require('lodash');

var Poll = function(cb, ctx, delay) {
  this.cb = cb;
  this.ctx = ctx;
  this.delay = delay;
  this.interval = undefined;
};

Poll.prototype.start = function() {
  // Consider replacing interval with setTimeout
  // http://jsfiddle.net/mayoung/Ctg8C/
  this.interval = setInterval(
    _.bind(this.cb, this.ctx),
    this.delay
  );
};

Poll.prototype.stop = function() {
  clearInterval(this.interval);
};

module.exports = Poll;
