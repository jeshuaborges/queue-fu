var Promise = require('bluebird');
var chai = require('chai');
var sinon = require('sinon');
var Poll = require('../../lib/shared/poll');
var _ = require('lodash');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

describe('shared/poll', function() {
  beforeEach(function() {
    this.delay = 10;
    this.ctx = {};
    this.worker = function() {
      return Promise.resolve(true);
    };

    this.subject = new Poll(this.worker, this.ctx, this.delay);
  });

  it('immediately polls', function() {
    stub = sinon.stub(this.subject, 'step');
    this.subject.start();
    stub.called.should.be.true;
  });

  it('it waits an interval between pulls', function(done) {
    var stub = sinon.stub(global, 'setTimeout');
    return this.subject.step()
      .then(function() {
        stub.should.have.deep.property('args[0][1]', this.delay);
        done();
      });
  });

  it('calls the callback', function() {
    stub = sinon.stub(this.subject, 'cb').returns(Promise.resolve(true));
    this.subject.step();

    stub.called.should.be.true;
  });

  it('sets the timeout', function() {
    return this.subject.step()
      .should.eventually.have.property('timeout');
  });

  // There is no clear way to detect this without extending our own timeout
  // implementation
  // http://stackoverflow.com/questions/5226578/check-if-a-timeout-has-been-cleared
  //
  // it('stops the current timeout', function() {
  //   return this.subject.start()
  //     .then(this.subject.stop)
  //     .then(function(obj) {
  //       console.log(obj.timeout);
  //     })
  //     .should.eventually.have.deep.property('timeout[0]', null);
  // });

  it('logs an error when the callback does not return a promise');
});
