var chai = require('chai');
var sinon = require('sinon');
var Queue = require('../../lib/memory/queue');
var shared = require('../shared');

chai.should();

describe('memory/queue', function() {
  beforeEach(function() {
    this.queue = new Queue();
  });

  afterEach(function() {
    this.queue.shutdown();
  });

  shared.shouldBehaveLikeAQueue();
});
