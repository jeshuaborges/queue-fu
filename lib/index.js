var _ = require('lodash');

var map = {
  memory: require('./memory/queue'),
  sqs: require('./sqs/queue'),
};

module.exports = function(config) {
  var Obj = map[config.type];

  if (_.isUndefined(Obj)) {
    throw new Error('Type for is invalid');
  }

  delete(config.type);

  var instance = new Obj();

  instance.configure(config);

  return instance;
};
