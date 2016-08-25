
      /**
        @main
      */
      module.exports = require("./lib.js");
      (function() {
        if(!this.isWindow) {
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
        this.object = require("./object");
        this.reconnection = require("./old/reconnection");
        this.co = require("./co");
        
      }).call(module.exports);
  