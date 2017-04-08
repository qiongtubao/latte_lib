(function() {
	var disabled = true;
	var getLocation = function(str) {
		var at = str.toString().split("\n")[2];
		var data = at.substring(at.indexOf("(")+1, at.indexOf(")"));
		return data;
	};
	var self = this;
	["log", "info", "error","warn"].forEach(function(type) {
		self[type] = function() {
			if(disabled) {
				return;
			}
			var debug = new Error("debug");
			console[type].apply( console[type], [ getLocation(debug.stack)].concat( Array.prototype.slice.call(arguments)));
		}
	});
}).call(module.exports);