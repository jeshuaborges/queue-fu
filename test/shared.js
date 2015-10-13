var sinon = require('sinon');

exports.shouldBehaveLikeAQueue = function() {
  describe('behaves like a queue', function() {
    it('calls back when a job is queued', function(done) {
      this.queue.process('job-type', function() {
        done();
      });

      this.queue.createJob('job-type', {}).save();
      this.queue.start();
    });

    it('passes job with data back to the worker', function(done) {
      this.queue.process('job-type', function(job, ctx, jobDone) {
        jobDone();
        if (job.data === 'first-param') {
          done();
        }
      });

      this.queue.createJob('job-type', 'first-param').save();
      this.queue.start();
    });

    it('can have multiple queues', function(done) {
      var firstSpy = sinon.spy();
      var secondSpy = sinon.spy();

      this.queue.process('first', firstSpy);
      this.queue.process('second', secondSpy);

      this.queue.createJob('first', 'first-param').save();
      this.queue.createJob('second', 'second-param').save();

      this.queue.poll.step();
      this.queue.poll.step();

      var interval = setInterval(function() {
        if (firstSpy.called && secondSpy.called) {
          clearInterval(interval);
          done();
        }
      }, 5);
    });

    it('can set concurrency');
  });
};
