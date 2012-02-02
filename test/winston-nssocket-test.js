var assert = require('assert'),
    vows = require('vows'),
    winston = require('winston'),
    nssocket = require('nssocket'),
    ns = require('../');

vows.describe('winston-nssocket').addBatch({
  'When using `winston-nssocket`': {
    topic: function () {
      var logger = new winston.Logger({
        transports: [
          new ns.NsSocket({ host: '127.0.0.1', port: 1234 })
        ]
      });

      nssocket.createServer(this.callback.bind(this, null, logger)).listen(1234);
    },
    'it should send logs to `nssocket` server': {
      topic: function (logger, sock) {
        sock.data(['log'], this.callback.bind(this, null));
        logger.error('hello, world!');
      },
      'with correct payload': function (payload) {
        assert.deepEqual(payload, {
          message: 'hello, world!',
          level: 'error',
          meta: null
        });
      }
    }
  }
}).export(module);
