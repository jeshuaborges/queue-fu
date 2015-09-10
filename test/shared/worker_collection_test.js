var chai = require('chai');
var sinon = require('sinon');
var WorkerCollection = require('../../lib/shared/worker_collection');
var _ = require('lodash');
var Promise = require('bluebird');

chai.should();

describe('sqs/worker_collection', function() {
  beforeEach(function() {
    this.subject = new WorkerCollection();
    this.worker = {
      type: 'foo',
      execute: function() {},
    };
  });

  it('creates new workers', function() {
    _.bind(function() {
      this.subject.push(this.worker);
    }, this).should.not.throw();
  });

  describe('#get', function() {
    it('gets worker', function() {
      this.subject.push(this.worker);
      this.subject.get('foo').should.eq(this.worker);
    });

    it('throws error when worker doesnt exist', function() {
      _.bind(function() {
        this.subject.get('foo');
      }, this).should.throw(/does not exist/);
    });

    it('matches workers with regular expression names', function() {
      this.worker = {
        type: /foo/,
        execute: function() {},
      };
      this.subject.push(this.worker);
      this.subject.get('foo').should.eq(this.worker);
    });
  });
});
