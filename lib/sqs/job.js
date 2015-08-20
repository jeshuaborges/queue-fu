var Job = function(sqsJob) {
  this.type = undefined;
  this.data = undefined;

  if (sqsJob) this.deserialize(sqsJob);
};

Job.validate = function(message) {
  if (!message.data || !message.type) {
    throw 'Job must have both type and data';
  }
};

Job.prototype.setData = function(type, data) {
  this.type = type;
  this.data = data;
};

Job.prototype.deserialize = function(sqsJob) {
  var json = JSON.parse(sqsJob.Body);

  this.type = json.type;
  this.data = json.data;
  this.receiptHandle = sqsJob.ReceiptHandle;
};

Job.prototype.messageBody = function() {
  return JSON.stringify({
    type: this.type,
    data: this.data,
  });
};

Job.prototype.sendParams = function() {
  return {
    MessageBody: this.messageBody(),
  };
};

Job.prototype.deleteParams = function() {
  if (!this.receiptHandle) {
    throw 'Job can not be deleted without receiptHandle';
  }

  return {
    ReceiptHandle: this.receiptHandle,
  };
};

module.exports = Job;
