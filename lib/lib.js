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
			}

			

			this.copyArray = function(array) {
				return array.concat([]);
			}
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

			this.indexOf = function(array, obj) {
				if(array.indexOf) return array.indexOf(obj);
				for(var i = 0, len = array.length; i < len; i++) {
					if(array[i] === obj) return i;
				}
				return -1;
			}

			this.removeArray = function(array, start, end) {
				var as = _self.copyArray(array);
				_self.removeLocalArray(as, start, end);
				return as;
			}
			this.removeLocalArray = function(array, start, end) {
				var rest = array.slice((end || start)+1);
				array.length = start < 0? array.length + start : start;
				return array;
			}
			this.insertLocalArray = function(array, index, obj) {
				var rest = [node].concat(array.slice(index));
				array.length = index < 0? array.length + index: index;
				array.push.apply(array, rest);
				return array;
			}
			this.copy = function(obj) {
				return JSON.parse(JSON.stringify(obj));
			}
			this.clone = function(obj) {
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
				for(var i = 0 ,len = arr.length; i < len; i++) {
					iterator(arr[i], i, arr);
				}
			}
			this.jsonForEach = function(data, iterator) {
				this.keys(data).forEach(function(key) {
					iterator(key, data[key]);
				});
			}
			this.getChar = function(string, index) {
				var strings = string.split("");
				return strings[index];
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

			this.isArray = function(obj) {
				if(Array.isArray) {
					return Array.isArray(obj);
				}else{
					throw "no handle isArray";
				}
			};

			this.isDate = function(obj) {
				return obj.constructor == Date;
			};

			["String", "Function", "Boolean", "Number"].forEach(function(className) {
				_self["is"+className] = function(obj) {
	        		return typeof(obj) == className.toLowerCase();
	        	}
			});

			this.getClassName = function(obj) {
				var allClass = ["Array", "String", "Number", "Date", "Boolean","Function"];
				for(var i = 0, len = allClass.length; i < len; i++) {
					if(_self["is"+allClass[i]](obj)) {
						return allClass[i].toLowerCase();
					}
				}
				return "object";
			}

			

			this.merger = function(master) {
				var master = _self.clone(master);
				Array.prototype.slice.call(arguments, 1).forEach(function(child) {
					if(!child) { return; }
					Object.keys(child).forEach(function(key) {
						master[key] = child[key];
					});
				});
				return master;
			}
			
			this.getErrorString = function(err) {
				if(err.stack) {
					return err.stack.toString();
				}else if(latte_lib.isString(err)) {
					return err.toString();
				}else{
						var errorString;
						try {
								errorString = JSON.stringify(err);
						}catch(e){
								if(!window) {
									var Util = require("util");
									errorString = Util.inspect(err);
								}else{
									return "[Object]";
								}
								
						}
						return errorString;
				}
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });