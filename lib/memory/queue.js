var _ = require('lodash');
var Poll = require('../shared/poll');
var WorkerCollection = require('../shared/worker_collection');
var Job = require('./job');

var Queue = function() {
  this.workers = new WorkerCollection(this);
  this.poll = new Poll(this.fetchJobs, this, 5);
  this.jobs = [];
};

// Public: Assign a worker to a queue name.
Queue.prototype.pushWorker = function(worker) {
  this.workers.push(worker);

  this.poll.start();
};

// Public: Create a job.
Queue.prototype.createJob = function(type, data) {
  return new Job(this, type, data);
};

// Public: Mark job done.
Queue.prototype.done = function(job, err) {
  if (err) throw err;

  _.pull(this.jobs, job);
};

// Private: Stop polling for jobs in queue.
Queue.prototype.shutdown = function() {
  this.poll.stop();
};

// Private: Fetch jobs from the queue.
Queue.prototype.fetchJobs = function() {
  this.jobs.forEach(function(job) {
    this.workers.execute(job);
  }, this);
};

// Queue.prototype.concurrency = function(count) {
//   this._concurrency = count;
//
//   return this;
// };
//
// Queue.prototype.getConcurrency = function(count) {
//   return this._concurrency;
// };

module.exports = Queue;
