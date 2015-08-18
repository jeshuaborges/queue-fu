var sinon = require('sinon');

exports.shouldBehaveLikeAQueue = function() {
  describe('shouldBehaveLikeAQueue', function() {
    beforeEach(function() {
      this.queue.reset();
    });

    it('calls back when a job is queued', function(done) {
      var spy = sinon.spy();
      this.queue.process('job-name', spy);
      this.queue.create('job-name', {}).save();
      var interval = setInterval(function() {
        if (spy.called) {
          clearInterval(interval);
          done();
        }
      }, 5);
    });

    it('passes job with data back to the worker', function(done) {
      var firstCalled;
      this.queue.process('first', function(job) {
        if (job.data === 'first-param') {
          firstCalled = true;
        }
      });

      this.queue.create('first', 'first-param').save();

      var interval = setInterval(function() {
        if (firstCalled) {
          clearInterval(interval);
          done();
        }
      }, 5);
    });

    it('can have multiple queues', function(done) {
      var firstCalled;
      var secondCalled;

      this.queue.process('first', function(job) {
        if (job.data === 'first-param') firstCalled = true;
      });

      this.queue.process('second', function(job) {
        if (job.data === 'second-param') secondCalled = true;
      });

      this.queue.create('first', 'first-param').save();
      this.queue.create('second', 'second-param').save();

      var interval = setInterval(function() {
        if (firstCalled && secondCalled) {
          clearInterval(interval);
          done();
        }
      }, 5);
    });

    it('can set concurrency', function() {
      this.queue.concurrency(2);
      this.queue.getConcurrency().should.equal(2);
    });
  });
};
