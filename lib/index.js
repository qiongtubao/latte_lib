(function(define) { 'use strict';
	define("latte_lib/index", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		module.exports = require("./lib");
		(function(){
			this.events = require("./events");
			this.format = require("./format");
			this.async = require("./async");
			this.work = require("./work");
			this.vm = require("./vm");
			this.utf8 = require("./utf8");
			this.xhr = require("./xhr");
			this.queue = require("./old/queue");
			this.removeIdle = require("./old/removeIdle");
			this.reconnection = require("./old/reconnection");
			if(!window) {
				this.fs = require("./fs");
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });