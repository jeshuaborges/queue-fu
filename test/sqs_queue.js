var chai = require('chai');
var sinon = require('sinon');
var Queue = require('../lib/sqs/queue');
var shared = require('./shared');

chai.should();

describe('sqs/queue', function() {
  beforeEach(function() {
    this.queue = Queue;
  });

  it('can be configured', function() {

  });

  shared.shouldBehaveLikeAQueue();
});
