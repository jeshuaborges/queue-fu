var Job = function(queue, type, data) {
  this.queue = queue;
  this.type = type;
  this.data = data;
};

Job.prototype.save = function() {
  this.queue.jobs.push(this);
};

module.exports = Job;
