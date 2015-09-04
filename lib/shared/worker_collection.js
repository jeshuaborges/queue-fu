var _ = require('lodash');

var Collection = function(queue) {
  this.internal = {};
  this.queue = queue;
};

Collection.prototype.get = function(name) {
  var worker = _.find(this.internal, function(worker) {
    return (_.isString(worker.type) && worker.type === name) ||
           (_.isRegExp(worker.type) && !!name.match(worker.type));
  });

  if (!worker) throw 'Worker ' + name + ' does not exist';

  return worker;
};

Collection.prototype.push = function(worker) {
  var name = worker.type;

  if (!worker.type) {
    throw 'Worker must have type';
  }

  if (!_.isFunction(worker.execute)) {
    throw 'Worker must execute';
  }

  if (this.internal[name]) throw name + ' already exists';

  this.internal[name] = worker;

  return this;
};

// Public: Find the appropriate worker and send the job to it.
Collection.prototype.execute = function(job) {
  this.get(job.type).execute(job, _.bind(function(err) {
    return this.queue.done(job, err);
  }, this));
};

module.exports = Collection;
