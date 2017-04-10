module.exports = Promise || (function() {
	function Promise() {
		this._callbacks = [];
	};
	(function() {
		this.then = function(func, context) {
			var p;
			if(this._isdone) {
				p = func.apply(context, this.result);
			}else{
				p = new Promise();
				this._callbacks.push(function() {
					var res = func.apply(context, arguments);
					if(res && typeof res.then === "function") {
						res.then(p.done, p);
					}
				});
			}
			return p;
		};
		this.done = function() {
			this.result = arguments;
			this._isdone = true;
			for(var i = 0, len = this._callbacks.length; i < len; i++) {
				this._callbacks[i].apply(null, arguments);
			}
			this._callbacks = [];
		};
		

	}).call(Promise.prototype);
	return Promise;
})();
(function() {
	this.join = function(promises) {
		var p = new Promise();
		var results = [];
		if(!promises || !promises.length) {
			p.done(results);
			return p;
		}
		var numdone = 0;
		var total = promises.length;
		function notifier(i) {
			return function() {
				numdone += 1;
				results[i] = Array.prototype.slice.call(arguments);
				if(numdone === total) {
					p.done(results);
				}
			}
		};
		for(var i = 0; i < total; i++) {
			promises[i].then(notifier(i));
		}
		return p;
	} 
		this.chain = function(funcs, args) {
			var p = new Promise();
			if (funcs.length === 0) {
				p.done.apply(p, args);
			} else {
				funcs[0].apply(null, args).then(function() {
					funcs.splice(0, 1);
					chain(funcs, arguments).then(function() {
						p.done.apply(p, arguments);
					});
				});
			}
			return p;
		}
		var thunkToPromise = this.thunkToPromise = function (fn) {
	        var self = this;
	        return new Promise(function (resolve, reject) {
	            fn.call(self, function (err, res) {
	                if (err) return reject(err);
	                if (arguments.length > 2) res = slice.call(arguments, 1);
	                resolve(res);
	            });
	        });
	    };
	    var slice = Array.prototype.slice;
	    this.functionToPromise = function (fn) {
	        var self = this;
	        var args = slice.call(arguments, 1);
	        return thunkToPromise(function (cb) {
	            args.push(cb);
	            fn.apply(self, args);
	        });
	    };
		
}).call(module.exports);

