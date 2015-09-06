var _ = require('lodash');
var Poll = require('../shared/poll');
var WorkerCollection = require('../shared/worker_collection');
var Job = require('./job');

var Queue = function() {
  this.workers = new WorkerCollection(this);
  this.poll = new Poll(this.fetchJobs, this, 5);
  this.jobs = [];
};

Queue.prototype.configure = function(options) {
  return this;
};

Queue.prototype.process = function(type, cb) {
  this.workers.push({
    type: type,
    execute: cb,
  });

  return this;
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

// Public: Start polling for jobs.
Queue.prototype.start = function() {
  return this.poll.start();
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

module.exports = Queue;
