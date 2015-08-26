(function(define) {'use strict'
  define("latte_lib/index", ["require", "exports", "module", "window"],
  function(require, exports, module, window){
      /**
        @main
      */
      module.exports = require("./lib");
      (function() {
        if(!window) {
          this.fs = require("./old/fs");
        }
        this.utf8 = require("./coding/utf8");
        this.async = require("./async");
        this.events = require("./events");
        this.format = require("./format");
        this.removeIdle = require("./old/removeIdle");
        this.queue = require("./old/queue");
        this.base64 = require("./coding/base64");
        this.debug = require("./debug");
        this.xhr = require("./old/xhr");
      }).call(module.exports);
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
