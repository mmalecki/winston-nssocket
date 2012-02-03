var assert = require('assert'),
    vows = require('vows'),
    winston = require('winston'),
    nssocket = require('nssocket'),
    macros = require('./helpers/macros'),
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
      'with no meta': macros.log('info', 'hello world!'),
      'with meta': macros.log('error', 'hello world!', { chill: 'winston!' })
    }
  }
}).export(module);
