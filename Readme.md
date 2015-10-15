## TODO:

Inspiration: Kue

- Add Concurrency
- Add Middleware pattern to worker call
  - Prevent SQS duplication
  - Create hooks for stats callbacks
    - Which stats services to connect to?
- Logging
  - Which lib to use?


## Setup

```bash
$ npm install
```

Sample worker:

```javascript
var Queue = require('queue-fu')({type: 'memory'});

new Queue().process('share-create', function(job, ctx, done) {
  done();
}).start();
```

Graceful shutdown

```javascript
process.once('SIGTERM', function() {
  queue.shutdown();
});
```

### SQS Setup

```javascript
var Queue = require('queue-fu')({
  type: 'sqs',
  endpoint: 'https://sqs.us-east-1.amazonaws.com/996905175585/posted-items-share-dev',
  accessKeyId: 'AKIAIL7...EH3Q',
  secretAccessKey: '7ZkUbusHaJltz...dP2ZFODXmEaDM',
  region: 'us-east-1',
  interval: 1000, // Number of ms between one message poll and the next
  pollSeconds: 20, // Number of seconds to wait for a message http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html
});
```


## Tests

require [fake_sqs](https://github.com/iain/fake_sqs)

## Code Standard

Airbnb style: https://github.com/airbnb/javascript

Lint:

```bash
$ node_modules/jscs/bin/jscs lib test
```
