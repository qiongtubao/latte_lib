(function(define) { 
	//'use strict';
	define("latte_lib/lib", ["require", "exports", "module", "window"],
	function(require, exports, module, window) {
		/**
		*	@namespace latte_lib
		*	@class lib
			@module basic
		*
		*/
		(function() {
			var _self = this;
				function getFunctionName(func) {
				    if ( typeof func == 'function' || typeof func == 'object' ) {
				        var name = ('' + func).match(/function\s*([\w\$]*)\s*\(/);
				    }
				    return name && name[1];
				}
				_self.trace = console.trace || function trace (count) {        
					var caller = arguments.callee.caller;        
					var i = 0;        
					count = count || 10;        
					console.log("***----------------------------------------  ** " + (i + 1));        
					while (caller && i < count) {
					    console.log(caller.toString());
					    caller = caller.caller;            
					    i++;            
					    console.log("***----------------------------------------  ** " + (i + 1));        
					}    
				}
			
			/**
			*	@method nextTick
			*	@param {function} callback
			*	@async
			*	@static
			*	@all
			*	@example
					(function() {
						require("latte_lib").nextTick(function(){
							console.log("a");
						});
						console.log("b");
					})();
					//b
					//a
			*/
			this.setImmediate = this.nextTick = (function() {
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
			/**
			*
			*	@method inherits
			*	@param {class} ctor     class
			*	@param {class} superCtor    parentClass
			*	@sync
			*	@all
			*	@static
			*	@public
			*	@since 0.0.1
			*	@example
					var latte_lib = require("latte_lib");
					var A = function() {
						this.name = "a";
					};
					(function() {
						this.getName = function() {
							return this.name;
						}
					}).call(A.prototype);
					var B = function() {
						this.name = "b";
					}
					latte_lib.inherits(B, A);
					var b = new B();
					var a = new A();
					log(b.getName());//"b"
					log(a.getName());//"a";
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
			}
			/**
			*	@method forEach
			*	@static
			* 	@sync
			*	@all
			*	@since 0.0.1
			*	@public
			*	@param {class} ctor     class
			*	@param {class} superCtor    parentClass
			*	@example
					var latte_lib = require("latte_lib");
					var array = [1,2,3,4];
					var all = 0;
					latte_lib.forEach(array, function(key) {
							all += key;
					});
					log(all);//20
			*/
			this.forEach = function(arr, iterator) {
				if(arr.forEach) {
					return arr.forEach(iterator);
				}
				for(var i = 0 ,len = arr.length; i < len; i++) {
					iterator(arr[i], i, arr);
				}
			}
			/**
			*	@method keys
			*	@static
			*	@sync
			*	@all
			*	@since 0.0.1
			*	@public
			*	@param   {object} obj
			*	@return  {string[]} stringArray
			*	@example
					var latte_lib = require("latte_lib");
					var obj = { a: "a", b: "b"};
					var keys = latte_lib.keys(obj);
					log(keys);//["a","b"]
			*/
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

			/**
			* 	@method copyArray
			* 	@static
			*	@param {array} arr
			*	@return {array}
			*	@sync
			*	@public
			*	@since 0.0.1
			*
			*	@example
					var latte_lib = require("latte_lib");
					var array = ["1", "a"];
					var cArray = latte_lib.copyArray(array);
					log(cArray);//["1", "a"]
			*/
			this.copyArray = function(arr) {
				return arr.concat([]);
			}

			/**
			* 	@method indexOf
			* 	@static
			*	@param {object[] || string} arr
			*	@param {object}  obj
			*	@return {int}
			*	@sync
			*	@public
			*	@since 0.0.1
			*
			*	@example
					var latte_lib = require("latte_lib");
					var array = ["1", "a"];
					var cArray = latte_lib.indexOf(array, "1");
					log(cArray);//0
			*/
			this.indexOf = function(arr, obj) {
				if(arr.indexOf) return arr.indexOf(obj);
				for(var i = 0, len = arr.length; i < len; i++) {
					if(arr[i] === obj) return i;
				}
				return -1;
			}
			/**
				@method removeArray
				@static
				@param {object[]} 	arr
				@param {int}   start      0 start
				@param {int}	end
				@public
				@since 0.0.1
				@sync
				@return {object[]}  as
				@example

					var latte_lib = require("latte_lib");
					var arr = [1,2,3,4,5];
					var as = latte_lib.removeArray(arr, 2,3);
					log(as);//[1,2,5]
					log(arr);//[1,2,3,4,5]
			*/
			this.removeArray = function(arr, start, end) {
				var as = _self.copyArray(arr);
				_self.removeLocalArray(as, start, end);
				return as;
			}

			/**
			* 	@method removeLocalArray
			* 	@static
			*	@param {object[]} arr
			*	@param {int} start
			*	@param {int} end
			*	@public
			*	@since 0.0.1
			*	@sync
			*	@return {object[]} arr
				@example
					var latte_lib = require("latte_lib");
					var arr = [1,2,3,4,5];
					var as = latte_lib.removeLocalArray(arr, 2,3);
					log(as);//[1,2,5]
					log(arr);//[1,2,5]
			*/
			this.removeLocalArray = function(arr, start, end) {
				/**
					var rest = array.slice((end || start)+1);
					array.length = start < 0? array.length + start : start;
					return array;
				*/
				end = end || start;
				arr.splice(start , end - start+1);
				return arr;
			}
			/**
				@method inserLocalArray
				@static
				@public
				@sync
				@since 0.0.1
				@param {object[]} arr
				@param {int} index
				@param {object} obj
				@return {object[]} arr
				@example

					var latte_lib = require("latte_lib");
					var arr = [1,2,3,4,5];
					var as = latte_lib.inserLocalArray(arr, 2, 9);
					log(as);//[1,2,9,3,4,5]
					log(arr);//[1,2,9,3,4,5]
			*/
			this.inserLocalArray = function(arr, index, obj) {
				/*
					var rest = [node].concat(array.slice(index));
					array.length = index < 0? array.length + index: index;
					array.push.apply(array, rest);
					return array;
				*/
				arr.splice(index , 0 , obj);
				return arr;
			}

			/**
				@method copy
				@static
				@public
				@sync
				@since 0.0.1
				@param {object} obj
				@return {object} obj
				@example

					var latte_lib = require("latte_lib");
					var copy = latte_lib.copy({
						a: function() {

						},
						b: "1"
					});
					console.log(copy);
					//{ b : "1" }
			*/
			this.copy = function(obj) {
				return JSON.parse(JSON.stringify(obj));
			}
			/**
				@method clone
				@static
				@public
				@sync
				@since 0.0.1
				@param {object} obj
				@return {object} obj
				@example

					var latte_lib = require("latte_lib");
					var o = {
						a: function() {

						},
						b: "1"
					};
					var clone = latte_lib.clone(o);
					o.b = "2";
					console.log(clone);//{ a: function(){}, b: "1"}
					console.log(o);    //{ a: function(){}, b: "2"}
			*/
			this.clone = function(obj) {
				var o = {};
				for(var i in obj) {
					if(obj.hasOwnProperty(i)) {
						o[i] = obj[i];
					}
				}
				return o;
			}
			/**
				@method reduce
				@static
				@public
				@sync
				@since 0.0.1
				@param {object[]} arr
				@param {function} iterator
				@param {obj}  memo
				@return {obj} memo
				@example

					var latte_lib = require("latte_lib");
					var array = [1,2,3,4];
					var c = 0;
					var d = latte_lib.reduce(array, function(c, x, i, a) {
						return c + x;
					}, c);
					log(d);//10;
					log(c);//0;

			*/
			this.reduce = function(arr, iterator, memo) {
				if(arr.reduce) {
					return arr.reduce(iterator, memo);
				}
				_self.forEach(arr, function(x, i, a) {
					memo = iterator(memo, x, i, a);
				});
				return memo;
			}

			/**
				@method map
				@static
				@public
				@sync
				@param {object[]} arr
				@param {function} iterator
				@return {object[]} results;
				@since 0.0.1
				@example

					var latte_lib = require("latte_lib");
					var arr = [1,2,3,4];
					var as = latte_lib.map(arr, function(o) {
						return o+1;
					});
					log(as);//[2,3,4,5]
			*/
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
			/**
				@method jsonForEach
				@param {json} data
				@param {function} iterator
				@static
				@public
				@example
					var latte_lib = require("latte_lib");
					var data = {
						a: 1,
						b: "c",
						c: [1,2,3]
					};
					latte_lib.jsonForEach(data, function(key, value) {
						log(key, value);
					});
					//a   1
					//b   c
					//c   [1,2,3]
			*/
			this.jsonForEach = function(data, iterator) {
				this.keys(data).forEach(function(key) {
					iterator(key, data[key]);
				});
			}
			/**
				@method getChar
				@param {string} str
				@param {int} index
				@return  {string}
				@sync
				@public
				@static
				@example

					var latte_lib = require("latte_lib");
					var str = "abcde";
					var char = latte_lib.getChar(str, 1);
					log(char);//b
			*/
			this.getChar = function(str, index) {
				var strs = str.split("");
				return strs[index];
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

			/**
				@method	isArray
				@public
				@static
				@sync
				@param {objct}  obj
				@return {bool}
				@example

					var latte_lib = require("latte_lib");
					log( latte_lib.isArray(1) ); //false
					log( latte_lib.isArray([1,2,3]) ); //true
			*/
			this.isArray = function(obj) {
				if(Array.isArray) {
					return Array.isArray(obj);
				}else{
					throw "no handle isArray";
				}
			};

			/**
				@method isDate
				@static
				@public
				@sync
				@param {objct}  obj
				@return {bool}
				@example

					var latte_lib = require("latte_lib");
					log( latte_lib.isDate(1) ); //false
					var date = new Date();
					log( latte_lib.isDate(date) );	//true
			*/
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


			/**
				@method merger
				@sync
				@static
				@public
				@param {object} master
				@param {...object} arguments{1, -1}
				@return {object} master
				@example

					var latte_lib = require("latte_lib");
					var a = latte_lib.merger({
						a: 1
					}, {
						b: 2
					});
					log(a);// {a: 1, b: 2}
			*/
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
								var Util = require("util");
								errorString = Util.inspect(err);
						}
						return errorString;
				}
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
