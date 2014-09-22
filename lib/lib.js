(function(define) { 'use strict';
	define("latte_lib/lib", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		(function() {
			var _self = this;
			this.nextTick = (function() {
	            if(typeof process === "undefined" || !(process.nextTick)) {
	                if(window && typeof window.setImmediate === "function") {
	                    return window.setImmediate;
	                }else {
	                    return function(fn) {
	                        setTimeout(fn, 0);
	                    }
	                }  
	            } else {
	                return process.nextTick;
	            }
	        })();
	        this.setImmediate =  window? (window.setImmediate || this.nextTick) : this.nextTick  ; 
	        

	        /**
	    		@method
	    		继承
	    	*/
	        this.inherits = function(ctor, superCtor) {
	            if(typeof Object.create === "function") {
	                ctor.super_ = superCtor
	                ctor.prototype = Object.create(superCtor.prototype, {
	                  constructor: {
	                    value: ctor,
	                    enumerable: false,
	                    writable: true,
	                    configurable: true
	                  }
	                });
	            } else {
	                ctor.super_ = superCtor
	                var TempCtor = function () {}
	                TempCtor.prototype = superCtor.prototype
	                ctor.prototype = new TempCtor()
	                ctor.prototype.constructor = ctor
	            }
	        };

	        this.isArray = function(obj) {
	            return Array.isArray(obj);
	        }

	        this.copyArray = function(array) {
	        	return array.concat([]);
	        }

	        this.initCallback = function() {
	            return function() {

	            };
	        }
	        //兼容ES5
	        this.keys = function(obj) {
	            if(Object.keys) {
	                return Object.keys(obj);
	            }
	            var keys = [];
	            for(var k in obj) {
	                if(obj.hasOwnProperty(k)) {
	                    keys.push(k);
	                }
	            }
	            return keys;
	        }
	        this.indexOf = function(arr, obj) {
	            if(arr.indexOf) return arr.indexOf(obj);
	            for(var i = 0, l = arr.length; i < l ; i++) {
	                if(arr[i] === obj) return i;
	            }
	            return -1;
	        };

	        this.cloneArray = function(array) {
	        	return [].concat(array);
	        }

         	this.removeLocalArray = function(array, start, end) {
	        	var rest = array.slice((end || start)+1);
			    array.length = start < 0 ? array.length + start : start;
			    array.push.apply(array, rest);
			    return array;
	        }
	        this.removeArray = function(array, start, end) {
	        	var as = _self.cloneArray(array);
	        	_self.removeLocalArray(as, start, end);
	        	return as;
	        }

	        this._clone = function(obj) {
	            var o = {};
	            for(var i in obj) {
	                if(obj.hasOwnProperty(i)) {
	                    o[i] = obj[i];
	                }
	            }
	            return o;
	        }
	        this.reduce = function(arr, iterator, memo) {
	            if(arr.reduce) {
	                return arr.reduce(iterator, memo);
	            }
	            _self.forEach(arr, function(x, i, a) {
	                memo = iterator(memo, x, i, a);
	            });
	            return memo;
	        }
	        this.map = function(arr, iterator) {
	            if(arr.map) {
	                return arr.map(iterator);
	            }
	            var results = [];
	            _self.forEach(arr, function(x, i, a) {
	                results.push(iterator(x, i, a));
	            });
	            return results;
	        }
	        this.forEach = function(arr, iterator) {
	            if(arr.forEach) {
	                return arr.forEach(iterator);
	            }
	            for(var i = 0, len = arr.length; i < len; i++) {
	                iterator(arr[i], i , arr);
	            }
	        }
	        


	        if(!Function.prototype.bind) {
	        	Function.prototype.bind = function(thisArg) {
	        		var args = Array.prototype.slice.call(arguments, 1);
	        		var self = this;
	        		return function() {
	        			self.apply(thisArg, args.concat(Array.prototype.slice.call(arguments)));
	        		}
	        	}
	        }

	        ["String", "Function"].forEach(function(className) {
	        	_self["is"+className] = function(obj) {
	        		return typeof(obj) == className.toLowerCase();
	        	}
	        });

		}).call(module.exports);
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });