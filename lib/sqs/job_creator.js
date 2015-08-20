var Job = require('./job');

var JobCreator = function(queue, type, data) {
  this.job = new Job();
  this.queue = queue;

  if (!this.queue) {
    throw 'This job has been pulled from the queue and can not be saved';
  }

  this.job.setData(type, data);
};

// Public: Push the job to the queue.
JobCreator.prototype.save = function() {
  this.queue.sendJob(this.job);
};

JobCreator.prototype.params = function() {
  return this.job.params();
};

module.exports = JobCreator;
