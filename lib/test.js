(function(define) { 'use strict';
	define("latte_lib/test", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib");
		var Event = require("./events");
		function Test(content) {
			this.content = content;
			this.sucess = 0;
			this.error = 0;
		};
		latte_lib.inherits(Test, Events);
		(function() {
			this.equal = function(actual, expected, message) {
				if(actual == expected) {
					console.log(message);
					this.sucess++;
				}
			}
			this.notEqual = function(actual , expected, message) {
				if( actual == expected) {
					console.log(message);
					this.error ++;
				}
			}
			this.start = function() {
				this.startTime = Date.now();
			}
			this.end = function() {
				console.log(
					"time:",
					Date.now()-this.startTime, 
					"sucess:", 
					sucess, 
					"error:", 
					error
				);
			}
		}).call(Test.prototype);
		var TestFunc = function(conntent, callback) {
			return function() {
				var test = new Test(content);
				test.start();
				callback(test);
			};
		}
		module.exports = function(content, callback) {
			return TestFunc(content, callback)();
		}
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });