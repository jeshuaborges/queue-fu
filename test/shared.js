var sinon = require('sinon');

exports.shouldBehaveLikeAQueue = function() {
  describe('behaves like a queue', function() {
    beforeEach(function() {
      this.worker = {
        type: 'job-type',
        execute: function() {},
      };
    });

    it('calls back when a job is queued', function(done) {
      this.queue.pushWorker({
        type: 'job-type',
        execute: function() {
          done();
        },
      });
      this.queue.createJob('job-type', {}).save();
    });

    it('passes job with data back to the worker', function(done) {
      this.queue.pushWorker({
        type: 'job-type',
        execute: function(job, jobDone) {
          jobDone();
          if (job.data === 'first-param') {
            done();
          }
        },
      });

      this.queue.createJob('job-type', 'first-param').save();
    });

    it('can have multiple queues', function(done) {
      var firstCalled;
      var secondCalled;

      this.queue.pushWorker({
        type: 'first',
        execute: function(job) {
          if (job.data === 'first-param') firstCalled = true;
        },
      });

      this.queue.pushWorker({
        type: 'second',
        execute: function(job) {
          if (job.data === 'second-param') secondCalled = true;
        },
      });

      this.queue.createJob('first', 'first-param').save();
      this.queue.createJob('second', 'second-param').save();

      var interval = setInterval(function() {
        if (firstCalled && secondCalled) {
          clearInterval(interval);
          done();
        }
      }, 5);
    });

    it('can set concurrency');
  });
};
