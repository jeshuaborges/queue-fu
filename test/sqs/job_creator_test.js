var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var JobCreator = require('../../lib/sqs/job_creator');
var _ = require('lodash');
var Promise = require('bluebird');

chai.should();
chai.use(sinonChai);

describe('sqs/job_creator', function() {
  beforeEach(function() {
    this.queue = {
      sendJob: sinon.spy(),
    };
    this.data = {};
    this.subject = new JobCreator(this.queue, 'job-type', this.data);
  });

  it('saves a job to the queue', function() {
    this.subject.save();
    this.queue.sendJob.called.should.be.true;
  });
});
