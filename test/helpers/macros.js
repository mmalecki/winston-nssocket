var assert = require('assert');

var macros = exports;

macros.log = function () {
  var args = arguments;
  return {
    topic: function (logger, sock) {
      sock.dataOnce(['log'], this.callback.bind(this, null));
      logger.log.apply(logger, args);
    },
    'with correct payload': function (payload) {
      var p = {
        level: args[0],
        message: args[1]
      };

      if (args[2]) {
        p.meta = args[2];
      }

      assert.deepEqual(payload, p);
    }
  };
};

