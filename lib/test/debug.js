(function() {
	this.disabled = true;
	var format = require("../basic/format");
	var getLocation = function(str) {
		var at = str.toString().split("\n")[2];
		var data = at.substring(at.indexOf("(")+1, at.indexOf(")"));
		
		return data;
	};
	var self = this;
	var types = {
		log: "blue",
		info: "green",
		warn: "yellow",
		error: "red",
	};
	
	Object.keys(types).forEach(function(type) {
		self[type] = function() {
			if(self.disabled) {
				return;
			}
			var debug = new Error("debug");
			var date = new Date();
			//console[type].apply( console[type], [ getLocation(debug.stack)].concat( Array.prototype.slice.call(arguments)));
			console[type].apply(console[type], [
				format.colorFormat(getLocation(debug.stack), types[type]),
				"-",
				format.colorFormat(format.dateFormat("yyyy-MM-dd hh:mm:ss", date), types[type]),
				":"
			].concat(Array.prototype.slice.call(arguments)));
		}
	});

}).call(module.exports);