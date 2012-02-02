var util = require('util'),
    winston = require('winston'),
    nssocket = require('nssocket');

var NsSocket = exports.NsSocket = function (options) {
  options = options || {};

  this.name = 'nssocket';
  this.logEvent = options.logEvent || ['log'];

  this.socket = new nssocket.NsSocket(options.socket || {
    reconnect: true
  });
  this.socket.connect(options.host, options.port);
};
util.inherits(NsSocket, winston.Transport);

NsSocket.prototype.log = function (level, msg, meta, callback) {
  var self = this;

  if (typeof meta == 'function') {
    callback = meta;
    meta = {};
  }

  self.socket.send(self.logEvent, {
    meta: meta,
    level: level,
    message: msg
  }, function (err) {
    if (err) {
      return self.emit('error', err);
    }
    
    self.emit('logged');
    callback && callback();
  });
};

