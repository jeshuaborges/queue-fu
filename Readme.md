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
var Queue = require('queue-fu').MemoryQueue;

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

## Tests

require [fake_sqs](https://github.com/iain/fake_sqs)

## Code Standard

Airbnb style: https://github.com/airbnb/javascript

Lint:

```bash
$ node_modules/jscs/bin/jscs lib test
```
