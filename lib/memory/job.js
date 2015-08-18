var Job = function(worker, data) {
  this.worker = worker;
  this.data = data;
};

Job.prototype.save = function() {
  this.worker.execute(this);
};

module.exports = Job;
