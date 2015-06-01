(function(define) { 'use strict';
	define("latte_lib/index", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {		
		module.exports = require("./lib");
		(function() {
			this.xhr = require("./old/xhr");
			this.events = require("./events");
			this.async = require("./async");
			this.utf8 = require("./coding/utf8");
			this.base64 = require("./coding/base64");
			this.hex = require("./coding/hex");
			this.queue = require("./old/queue");
			this.reconnection = require("./old/reconnection");
			this.removeIdle = require("./old/removeIdle");
			this.buffer = require("./old/buffer");
			this.format = require("./format");
			//this.rpc = require("./now/rpc");
			//this.test = require("./old/test");
			this.debug = require("./debug");
			if(!window) {
				this.fs = require("./old/fs");
				
			}else{
				this.blobBuilder = require("./old/blobBuilder");
				this.buffer  = require("./old/buffer");
			}
		}).call(module.exports);
		
		

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });