
			
			var getLocation = function(str) {
				var at = str.toString().split("\n")[2];
				var data = at.substring(at.indexOf("(")+1, at.indexOf(")"));
				return data;
			}
		var latte_lib = require("./lib.js");	
		var disabled = latte_lib.isWindow? !window.debug: process.argv.indexOf("-debug") == -1;
		var loggers = {};
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

