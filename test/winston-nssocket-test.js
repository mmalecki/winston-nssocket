/**
 * winston-nssocket tests
 */

var assert = require('assert'),
    vows = require('vows'),
    winston = require('winston'),
    nssocket = require('nssocket'),
    macros = require('./helpers/macros'),
    ns = require('../'),
    winstond = require('winstond');

//
// winstond nssocket server
//

var server = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 1234
});

server.add(winstond.transports.File, {
  filename: __dirname + '/test.log'
});

server.listen();

//
// winston logger
//

var logger = new winston.Logger({
  transports: [
    new ns.Nssocket({ host: 'localhost', port: 1234 })
  ]
});

//
// tests
//

vows.describe('winston-nssocket').addBatch({
  'When using `winston-nssocket`': {
    'topic': logger,
    'the log() method': {
      'topic': function() {
        logger.log('info', 'hello world', {}, this.callback);
      },
      'should respond with true': function (err, logged) {
        assert.isNull(err);
        assert.isNotNull(logged);
      }
    },
    'the query() method': {
      'topic': function (logger) {
        var cb = this.callback;
        logger.log('info', 'hello world', {});
        setTimeout(function () {
          logger.query({}, cb);
        }, 1000);
      },
      'should return matching results': function (err, results) {
        results = results.nssocket.file;
        var log = results.pop();
        assert.ok(log.message.indexOf('hello world') === 0
                  || log.message.indexOf('test message') === 0);
      }
    },
    'the stream() method': {
      'topic': function () {
        logger.log('info', 'hello world', {});

        var cb = this.callback,
            j = 10,
            i = 10,
            results = [],
            stream = logger.stream({});

        stream.on('log', function (log) {
          results.push(log);
          results.stream = stream;
          if (!--j) cb(null, results);
        });

        stream.on('error', function () {});

        while (i--) logger.log('info', 'hello world ' + i, {});
      },
      'should stream logs': function (err, results) {
        results.forEach(function (log) {
          assert.ok(log.message.indexOf('hello world') === 0
                    || log.message.indexOf('test message') === 0);
        });
        results.stream.destroy();
      }
    }
  }
}).export(module);
