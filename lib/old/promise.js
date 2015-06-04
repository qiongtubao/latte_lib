(function(define) { 'use strict';
	define("latte_lib/old/promise", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {

		(function() {
			this.defer = function() {
				var pending = [], value;
				return {
			        resolve: function (_value) {
			            if (pending) {
			                value = ref(_value);
			                for (var i = 0, ii = pending.length; i < ii; i++) {
			                    // XXX
			                    enqueue(function () {
			                        value.then.apply(value, pending[i]);
			                    });
			                }
			                pending = undefined;
			            }
			        },
			        promise: {
			            then: function (_callback, _errback) {
			                var result = defer();
			                _callback = _callback || function (value) {
			                    return value;
			                };
			                _errback = _errback || function (reason) {
			                    return reject(reason);
			                };
			                var callback = function (value) {
			                    result.resolve(_callback(value));
			                };
			                var errback = function (reason) {
			                    result.resolve(_errback(reason));
			                };
			                if (pending) {
			                    pending.push([callback, errback]);
			                } else {
			                    // XXX
			                    enqueue(function () {
			                        value.then(callback, errback);
			                    });
			                }
			                return result.promise;
			            }
			        }
			    };
			}

			this.ref = function(value) {
				if(value && value.then) {
					return value;
				}
				return {
					then: function(callback) {
						var result = defer();
						enqueue(function() {
							result.resolve(callback(value));
						});
						return result.promise;
					}
				};
			}
			this.reject = function(reason) {
				return {
					then: function(callback, errback) {
						var result = defer();
						enqueue(function() {
							result.resolve(errback(reason));
						});
						return result.promise;
					}
				}
			};
			this.when = function(value, _callback, _errback) {
				var result = defer();
				var done;
				_callback = _callback || function(value) {
					return value;
				}
				_errback = _errback || function(reason) {
					return reject(reason);
				}
				var callback = function(value) {
					try {
						return _callback(value);
					}catch(reason) {
						return reject(reason);
					}
				};
				var errback = function(reason) {
					try {
						return _errback(reason);
					} catch(reason) {
						return reject(reason);
					}
				};
				enqueue(function() {
					ref(value).then(function(value) {
						if(done) 
							return;
						done = true;
						result.resolve(ref(value).then(callback, errback));
					}, function(reason) {
						if(done) {
							return;
						}
						done = true;
						result.resolve(errback(reason));
					});
				});
				return result.promise;
			}
		}).call(module.exports);	
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });	