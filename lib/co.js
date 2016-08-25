



var latte_lib = require("./lib");
var slice = Array.prototype.slice;

	/**
		function -> promise
		@method thunkToPromise
		@param {Function}
		@return {Promise}
		@api private

	*/
	function thunkToPromise(fn) {
		var ctx = this;
		return new Promise(function(resolve, reject){
			fn.call(ctx, function(err, res) {
				if(err) {
					return reject(err);
				}
				if(arguments.length > 2) {
					res = slice.call(arguments, 1);
					resolve(res);
				}
			});
		});
	}
	/**
		@param {Array} obj
		@return {Promise}
		@api private
	*/
	function arrayToPromise(obj) {
		return Promise.all(obj.map(toPromise, this));
	}

	/**
		objectToPromise
	*/
	function objectToPromise(obj) {
		var results = new obj.constructor();
		var keys = Object.keys(obj);
		var promise = [];
		for(var i = 0, len = keys.length; i < len; i++) {
			var key = keys[i];
			var promise = toPromise.call(this, obj[key]);
			if(promise && isPromise(promise)) {
				defer(promise, key);
			}else{
				results[key] = obj[key];
			}
		}
		return Promise.all(promises).then(function() {
			return results
		});

		function defer(promise, key) {
			results[key] = undefined;
			promises.push(promise.then(function(res) {
				results[key] = res;
			}));
		}
	}
			var isGenerator = function(obj) {
				return latte_lib.isFunction(obj.next) && latte_lib.isFunction(obj.throw); 
			}

			var isGeneratorFunction = function(obj) {
				var constructor = obj.constructor;
				if(!constructor) {
					return false;
				}
				if(constructor.name === "GeneratorFunction" || "GeneratorFunction" === constructor.displayName) {
					return true;
				}
				return isGenerator(constructor.prototype);
			}
function toPromise(obj) {
	if(!obj) return obj;
	if(latte_lib.isPromise(obj)) return obj;
	if(isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
	if(latte_lib.isFunction(obj)) return thunkToPromise.call(this, obj);
	if(latte_lib.isArray(obj)) return arrayToPromise.call(this, obj);
	if(latte_lib.isObject(obj)) return objectToPromise.call(this, obj);
	return obj;
}

function co(gen) {
	var ctx = this;
	var args = slice.call(arguments, 1);
	return new Promise(function(resolve, reject) {
		if(latte_lib.isFunction(gen)) {
			gen = gen.apply(ctx, args);
		}
		if(!gen || latte_lib.isFunction(gen.next)) {
			return resolve(gen);
		}
		onFulfilled();

		function onFulfilled(res) {
			var ret ;
			try {
				ret = gen.next(res);
			}catch(e) {
				return rejet(e);
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
			return onRejected(new TypeError("You may only yield a function,promise, generator, array, or object, "+
				"but the following object was passwed: \"" + String(ret.value)+ "\""));
		}
	});
};
co.wrap = function(fn) {
	createPromise.__generatorFunction__ = fn;
	return createPromise;
	function createPromise() {
		return co.call(this, fn.apply(this, arguments));
	}
}