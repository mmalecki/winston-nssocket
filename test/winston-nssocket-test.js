/**
 * winston-nssocket tests
 */

var assert = require('assert'),
    vows = require('vows'),
    winston = require('winston'),
    nssocket = require('nssocket'),
    macros = require('./helpers/macros'),
    ns = require('../'),
    transport = require('winston/test/transports/transport'),
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
// test
//

vows.describe('winston/transports/nssocket').addBatch({
  'An instance of the Nssocket Transport': transport(ns.Nssocket, {
    host: 'localhost',
    port: 1234
  })
}).addBatch({
  'An instance of the Nssocket Transport': {
    'topic': server,
    'should cleanup when done': function() {
      server.close();
    }
  }
}).export(module);
