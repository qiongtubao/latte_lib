(function(define) { 'use strict';
	define("latte_lib/promise", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib");
		var Promise = function() {

		};
		(function() {
			this.reject = function(value) {
				this.stat = Promise.Type.onRejected;
				this.value = value;
				this.latte();
			}
			this.resolve = function(value) {
				this.stat = Promise.Type.onResolved;
				this.value = latte.isArray(value)? value: [value];
				this.latte();
			}
			this.then = function(onResolved, onRejected) {
				this.onResolved = onResolved;
				this.onRejected = onRejected || function(err) {
					return err;
				};
				this.next = new Promise();
				this.latte();
				return this.next;
			}
			this.latte = function() {
				switch(this.stat) {
					case Promise.Type.onRejected:
						if(this.onRejected && this.value) {
							this.next.reject(this.onRejected(this.value));
						}
					break;
					case Promise.Type.onResolved:
						if(this.onResolved && this.value) {
							try {
								var result = this.this.onResolved.apply(null, this.value);
								this.next.resolve(result);
							} catch(err) {
								this.next.resolve(result);
							}
						}			
					break;
				}
			}
		}).call(Promise.prototype);
		var async = require("async");
		(function() {
			this.denodeify = function(callback) {
				return function() {
					var args = Array.prototype.slice.call(arguments);
					var promise = new Promise();
					args.push(function(err, data) {
						if(err) {
							promise.reject(err);
						} else {
							promise.resolve(data);
						}
					});
					callback.apply(this, args);
					return promise;
				}				
			};
			this.when = function() {
				var args = Array.prototype.slice.call(arguments);
				var funs = [];
				var promise = new Promise();
				args.forEach(function(pro) {
					var fun = function(callback) {
						pro.then(function(data) {
							callback(null, data);
						}, function(err) {
							callback(err);
						});
					}
					funs.push(fun);
				});
				async.parallel(funs, function(err, result) {
					if(err) {
						return promise.reject(err);
					}
					promise.resolve(result);
				});
				return promise;
			}
			this.Type = {
				onDeferred: 0,
				onResolved: 1,
				onRejected: 2,
				onFulfilled: 3
			};
		}).call(Promise);

		module.exports = Promise;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });