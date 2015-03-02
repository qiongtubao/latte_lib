(function(define) { 'use strict';
	define("latte_lib/vm", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		/**
			将字符串转换成函数
		*/
		(function() {
			this.createFunc = function(string) {
				return eval(string);
			}
		}).call(module.exports);
			
		
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });