var axios = require('axios');
var chai = require('chai');
var sinon = require('sinon');
var aws = require('aws-sdk');
var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');
var Queue = require('../../lib/sqs/queue');
var shared = require('../shared');

chai.should();

aws.config.apiVersions = {
  sqs: '2012-11-05',
};

var resetSqs = function() {
  return axios.delete('http://127.0.0.1:4568/');
};

describe('sqs/queue', function() {
  beforeEach(function() {
    this.queue = new Queue();
    this.config = {
      endpoint: 'http://127.0.0.1:4568/queue-name',
      accessKeyId: 'access key id',
      secretAccessKey: 'secret access key',
      region: 'region',
      interval: 5,
    };
  });

  describe('configuration', function() {
    it('throws error when configured improperly', function() {
      _.bind(this.queue.configure, this.queue, {
        foo: 'bar',
      }).should.throw(/not valid/);
    });

    it('can be configured', function() {
      _.bind(this.queue.configure, this.queue, this.config).should.not.throw();
    });

    it('sets up the queueUrl', function() {
      this.queue.configure(this.config);
      this.queue.config.queueUrl.should.equal('http://127.0.0.1:4568/queue-name');
    });

    it('defaults interval', function() {
      delete(this.config.interval);
      this.queue.configure(this.config);
      this.queue.config.interval.should.equal(1000);
    });
  });

  describe('integration', function() {
    beforeEach(function(done) {
      this.queue.configure(this.config);

      var sqs = Promise.promisifyAll(new aws.SQS({
        endpoint: 'http://127.0.0.1:4568',
        accessKeyId: 'access key id',
        secretAccessKey: 'secret access key',
        region: 'region',
        interval: 5,
      }));

      var queueName = 'queue-name';

      resetSqs().then(function() {
        return sqs.createQueueAsync({
          QueueName: 'queue-name',
        });
      }).then(function() {
        done();
      });
    });

    afterEach(function() {
      this.queue.shutdown();
    });

    it('sends and receives jobs from the queue', function(done) {
      this.queue.process('job-type', function(job) {
        done();
      });

      this.queue.createJob('job-type', {}).save();

      this.queue.start();
    });

    it('deletes jobs from the queue');

    shared.shouldBehaveLikeAQueue();
  });
});
