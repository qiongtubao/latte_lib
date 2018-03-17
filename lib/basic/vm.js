(function() {
	this.script = function(data, opts) {
		

	}
	this.func = function(data, self, params) {
		var func= new Function('latte_func' + Date.now(), data);
		func.apply(self, params);
	}

}).call(module.exports);