(function(define) { 'use strict';
	define("latte_lib/debug", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {		
		var getLocation = function(str) {
				var at = str.toString().split("\n")[2];
				var data = at.substring(at.indexOf("(")+1, at.indexOf(")"));
				return data;
			}
		var disabled = window? !window.debug: process.argv.indexOf("-debug") == -1;
		var loggers = {};
		/*module.exports = function(name) {
			if(loggers[name]) {
				return loggers[name];
			}
			var logger = {};
			["log", "info", "error","warn"].forEach(function(type) {
				logger[type] = function() {
					if(disabled) {
						return;
					}
					var debug = new Error("debug");
					console[type].apply( console[type], [name, getLocation(debug.stack)].concat( Array.prototype.slice.call(arguments)));
				}
			});
			loggers[name] = logger;
			return logger;
		};
		module.exports.disabled = function() {
			disabled = true;
		}*/
		var logger = {};
		["log", "info", "error","warn"].forEach(function(type) {
			logger[type] = function() {
				if(disabled) {
					return;
				}
				var debug = new Error("debug");
				console[type].apply( console[type], [ getLocation(debug.stack)].concat( Array.prototype.slice.call(arguments)));
			}
		});
		module.exports = logger;

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });