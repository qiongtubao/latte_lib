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
		
	    var slice = Array.prototype.slice;
	    function isGenerator(obj) {
  			return 'function' == typeof obj.next && 'function' == typeof obj.throw;
		}
	    function isPromise(obj) {
		  	return 'function' == typeof obj.then;
		}
	    var arrayToPromise = function(obj) {
		  	return Promise.all(obj.map(toPromise, this));
		}
    	var objectToPromise = function(obj){
		  var results = new obj.constructor();
		  var keys = Object.keys(obj);
		  var promises = [];
		  for (var i = 0; i < keys.length; i++) {
		    var key = keys[i];
		    var promise = toPromise.call(this, obj[key]);
		    if (promise && isPromise(promise)) defer(promise, key);
		    else results[key] = obj[key];
		  }
		  return Promise.all(promises).then(function () {
		    return results;
		  });

		  function defer(promise, key) {
		    // predefine the key in the result
		    results[key] = undefined;
		    promises.push(promise.then(function (res) {
		      results[key] = res;
		    }));
		  }
		}
		function isGeneratorFunction(obj) {
		  var constructor = obj.constructor;
		  if (!constructor) return false;
		  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
		  return isGenerator(constructor.prototype);
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
	    var functionToPromise = this.functionToPromise = function (fn) {
	        var self = this;
	        var args = slice.call(arguments, 1);
	        return thunkToPromise(function (cb) {
	            args.push(cb);
	            fn.apply(self, args);
	        });
	    };
		var toPromise = this.toPromise = function(obj) {
		  if (!obj) return obj;
		  if (isPromise(obj)) return obj;
		  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
		  if ('function' == typeof obj) return functionToPromise.apply(this, slice.call(arguments,0));
		  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
		  if (isObject(obj)) return objectToPromise.call(this, obj);
		  return obj;
		}


	    var latte_lib = require("../basic/lib.js");
		this.co = function(gen) {
			var ctx = this;
			var args = slice.call(arguments, 1);
			return new Promise(function(resolve, reject) {
				if(latte_lib.isFunction(gen)) {
					gen = gen.apply(ctx, args);
				}
				if(!gen || !latte_lib.isFunction(gen.next)) {
					return resolve(gen);
				}
				onFulfilled();

				function onFulfilled(res) {
					var ret ;
					try {
						ret = gen.next(res);
					}catch(e) {
						return reject(e);
					}
					next(ret);
				}

				function onRejected(err) {
					var ret ;
					try {
						ret = gen.throw(err);
					}catch(e) {
						return reject(e);
					}
					next(ret);
				}

				function next(ret) {
					if(ret.done) return resolve(ret.value);
					var value = toPromise.call(ctx, ret.value);
					if(value  && isPromise(value)) {
						return value.then(onFulfilled, onRejected);
					}
					return onRejected(new Error("You may only yield a function,promise, generator, array, or object, "+
						"but the following object was passwed: \"" + String(ret.value)+ "\""));
				}
			});
		};
}).call(module.exports);

