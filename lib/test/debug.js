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
	var styles = {
		"bold":      [1, 22],
		"italic":    [2, 23],
		"underline": [4, 24],
		"inverse":   [7, 27],
		"white":     [37,39],
		"grey":      [90,39],
		"black":     [90,39],
		"blue":      [34,39],
		"cyan":      [36,39],
		"green":     [32,39],
		"magenta":   [35,39],
		"red":       [31,39],
		"yellow":    [33,39]
	};
	function colorizeStart(style) {
		return style ? "\x1B[" + styles[style][0] + "m": "";
	}
	function colorizeEnd(style) {
		return style ? "\x1B[" + styles[style][1] + "m": "";
	}
	var color = function(data, style) {
		return  colorizeStart(style) + data + colorizeEnd(style);
	}
	Object.keys(types).forEach(function(type) {
		self[type] = function() {
			if(self.disabled) {
				return;
			}
			var debug = new Error("debug");
			var date = new Date();
			//console[type].apply( console[type], [ getLocation(debug.stack)].concat( Array.prototype.slice.call(arguments)));
			console[type].apply(console[type], [
				color(getLocation(debug.stack), types[type]),
				"-",
				color(format.dateFormat("yyyy-MM-dd hh:mm:ss", date), types[type]),
				color(":")
			].concat(Array.prototype.slice.call(arguments)));
		}
	});

}).call(module.exports);