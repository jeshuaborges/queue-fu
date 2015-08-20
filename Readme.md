## TODO:

- Add Concurrency
- Add Middleware pattern to worker call
  - Prevent SQS duplication
  - Call stats services

## Setup

```bash
$ npm install
```

Graceful shutdown

```javascript
process.once('SIGTERM', function() {
  queue.shutdown(;
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
