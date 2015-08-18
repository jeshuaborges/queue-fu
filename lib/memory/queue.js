var Worker = require('./worker');
var Job = require('./job');

var Queue = function() {
  this.workers = {};
  this._concurrency = 1;
};

Queue.prototype.reset = function() {
  this.workers = {};
};

// Public: Assign a worker to a queue name.
Queue.prototype.process = function(name, cb) {
  if (this.workers[name]) throw name + ' already exists';

  var worker = this.workers[name] = new Worker(name, cb);

  return worker;
};

// Public: Create a job.
Queue.prototype.create = function(name, data) {
  var worker = this.getWorker(name);

  return new Job(worker, data);
};

Queue.prototype.getWorker = function(name) {
  var worker = this.workers[name];

  if (!worker) throw 'Worker ' + name + ' does not exist';

  return worker;
};

Queue.prototype.findOrCreate = function(name) {
  this.workers[name] = this.workers[name] || new Worker(name);

  return this.workers[name];
};

Queue.prototype.concurrency = function(count) {
  this._concurrency = count;

  return this;
};

Queue.prototype.getConcurrency = function(count) {
  return this._concurrency;
};

module.exports = Queue;
