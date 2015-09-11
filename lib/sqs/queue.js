var WorkerCollection = require('../shared/worker_collection');
var Poll = require('../shared/poll');
var Job = require('./job');
var JobCreator = require('./job_creator');
var aws = require('aws-sdk');
var _ = require('lodash');
var Promise = require('bluebird');

aws.config.apiVersions = {
  sqs: '2012-11-05',
};

var Queue = function() {
  this.workers = new WorkerCollection(this);
  this.sqs = undefined;
  this.queueUrl = undefined;
  this.poll = new Poll(this.fetchJobs, this);
};

Queue.CONFIG_KEYS = [
  'endpoint',
  'accessKeyId',
  'secretAccessKey',
  'region',
];

Queue.CONFIG_DEFAULTS = {
  interval: 1000,
};

// Public:
Queue.prototype.configure = function(config) {
  var endpoint;
  var sqs;

  _.defaults(config, Queue.CONFIG_DEFAULTS);

  this.validateConfig(config);
  this.config = config;
  this.config.queueUrl = config.endpoint;
  this.poll.delay = this.config.interval;

  this.setupSqs();
};

// Public: Assign a worker to a queue name.
Queue.prototype.process = function(type, cb) {
  this.workers.push({
    type: type,
    execute: cb,
  });

  return this;
};

Queue.prototype.start = function() {
  this.poll.start();
};

// Public:
Queue.prototype.createJob = function(type, data) {
  return new JobCreator(this, type, data);
};

// Public: Stop listening for new jobs.
Queue.prototype.shutdown = function() {
  this.poll.stop();
};

// Private:
Queue.prototype.validateConfig = function(config) {
  Queue.CONFIG_KEYS.forEach(function(key) {
    if (typeof config[key] !== 'string') {
      throw key + ' configuration is not valid.';
    }
  });
};

// Private:
Queue.prototype.setupSqs = function() {
  sqs = new aws.SQS(this.config);

  this.sqs = {
    receiveMessage: Promise.promisify(sqs.receiveMessage, sqs),
    sendMessage: Promise.promisify(sqs.sendMessage, sqs),
    deleteMessage: Promise.promisify(sqs.deleteMessage, sqs),
  };
};

// Private: Push a job to SQS.
Queue.prototype.sendJob = function(job) {
  var params = this.sqsParams(job.sendParams());

  return this.sqs.sendMessage(params);
};

// Private: Run job pulled from queue.
Queue.prototype.executeMessage = function(message) {
  this.workers.execute(new Job(message));
};

// Private: Create sqs param object with the QueueUrl.
Queue.prototype.sqsParams = function(params) {
  return _.extend({
    QueueUrl: this.config.queueUrl,
  }, params);
};

Queue.prototype.done = function(job, err) {
  if (err) throw err;

  var params = this.sqsParams(job.deleteParams());

  return this.sqs.deleteMessage(params);
};

// Private: Retrive jobs from queue.
Queue.prototype.fetchJobs = function() {
  return this.sqs.receiveMessage({
    QueueUrl: this.config.queueUrl,
  }).then(_.bind(function(data) {
    if (_.isEmpty(data.Messages)) return;

    data.Messages.forEach(function(message) {
      this.executeMessage(message);
    }, this);
  }, this));
};

module.exports = Queue;
