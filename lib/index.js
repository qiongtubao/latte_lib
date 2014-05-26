(function(define) { 'use strict';
	define(function(require, exports, module) {	
		/**
			@module
		*/
		(function() {
			/**
				@method isArray
				@static
				@params object {Object} 
				@return  {boolean}
			*/
			this.isArray = function(object) {
				return Array.isArray(object);
			}

			/**
				@method isNum
				@static
				@params object {Object} 
				@return  {boolean}
			*/
			this.isNum = function(data) {
				return !isNaN(data);
			}

			/**
				@method clone
				@static
				@params object {Object} 
				@return  {Object}
			*/
			this.clone = function(data){
				return JSON.parse(JSON.stringify(data));
			}

			/**
				@method isFunction
				@static
				@params object {Object} 
				@return  {boolean}
			*/
			this.isFunction = function(object){
				return typeof object === "function";
			}

			/**
				@method arrayRemove
				@static
				@params array {Array}  
				@params start  {number} 
				@params  [end = start] {number} 
				@return  {number}  array.length
			*/
			this.arrayRemove = function(array, start, end) {
				var rest = array.slice((end || start)+1);
			    array.length = start < 0 ? array.length + start : start;
			    return array.push.apply(array, rest);
			}

			/**
				@method inherits
				@static
				@params ctor {Class} 
				@params superCtor  {Class} 
			*/
			this.inherits = function(ctor, superCtor) {
				ctor.super_ = superCtor;
				ctor.prototype = Object.create(superCtor.prototype, {
					constructor: {
					  value: ctor,
					  enumerable: false,
					  writable: true,
					  configurable: true
					}
				});
			};

			/**
				@method mergerAll
				@static
				@params []* {Object}
				@return {Object}
			*/
			this.mergerAll = function() {
				var merger = {}
					, all = Array.prototype.slice.call(arguments, 0);
				for(var i = 0, l = all.length; i < l; i++) {
					var json = all[i];
					for(var j in json) {
						merger[j] = json[j] ; 
					}
				}
				return merger;
			}
		}).call(module.exports);
	});
})(typeof define === 'function'  ? define : function (factory) { factory(require, exports, module); } );