(function(define) { 'use strict';
	define("latte_lib/index", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		module.exports = require("./lib");
		module.exports.async = require("./async");
		module.exports.events = window? require("./events").EventEmitter: 
				require("events").EventEmitter;
		var Mustache = require("./mustache");
		if(Mustache) {
			module.exports.mustache = require("./mustache").to_html;
		}
		module.exports.removeIdle = require("./removeIdle");
		module.exports.reconnection = require("./reconnection");
		if(!window) {
			module.exports.fs = require("./fs");
		}
		
		module.exports.random = require("./random");
		module.exports.utf8 = require("./utf8");
		module.exports.queue = require("./queue");
		module.exports.xmlhttprequest = require("./xmlhttprequest");
		module.exports.xhr = require("./xhr");
		module.exports.request = require("./request");
		module.exports.test = require("./test");
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });