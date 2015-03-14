(function(define) { 'use strict';
	define("latte_lib/index", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {		
		module.exports = require("./lib");
		(function() {
			this.xhr = require("./xhr");
			this.events = require("./events");
			this.async = require("./async");
			this.utf8 = require("./utf8");
			this.queue = require("./old/queue");
			this.reconnection = require("./old/reconnection");
			this.removeIdle = require("./old/removeIdle");
			this.format = require("./format");
			if(!window) {
				this.fs = require("./fs");
			}
		}).call(module.exports);
		
		

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });