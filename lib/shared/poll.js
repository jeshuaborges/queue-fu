var _ = require('lodash');
var Promise = require('bluebird');

var Poll = function(cb, ctx, delay) {
  this.cb = cb;
  this.ctx = ctx;
  this.delay = delay;
  this.timeout = undefined;
};

Poll.prototype = {
  start: function() {
    return this.step();
  },

  // It is important to callout that we use a setTimeout rather than a
  // setInterval. This is because we want to immediately call the next
  // iteration if it is configured to do so. This ensures that we are only bound
  // the the performance of the machine and network to determine how many
  // messages we can pull.
  step: function() {
    return Promise.resolve(this.cb())
      .bind(this)
      .then(function() {
        return this;
      })
      .finally(function() {
        this.timeout = setTimeout(this.step.bind(this), this.delay);
      });
  },

  stop: function() {
    clearTimeout(this.timeout);

    return this;
  },
};

module.exports = Poll;
