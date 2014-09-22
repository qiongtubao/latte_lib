(function(define) { 'use strict';
	define("latte_lib", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		module.exports = require("./lib");
		module.exports.async = require("./async");
		module.exports.events = window? require("./events"): require("events").EventEmitter;
		module.exports.mustache = require("./mustache").to_html;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });