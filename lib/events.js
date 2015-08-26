(function(define) { 'use strict';
	define("latte_lib/events", ["require", "exports", "module", "window"],
	function(require, exports, module, window) {
		var events;
		if(window) {
			/**
				@class events
				@namespace latte_lib
				@module basic
			*/
			var events = function() {
				this._events = this._events || {};
			};
			(events.interface = function() {
				/**
					@method on
					@public
					@param {String} event
					@param {Function} fn
					@return {events} this
					@example

						var Events = require("latte_lib").events;
						var events = new Events();
						events.on("hello", function() {
							log("latte");
						});
						events.emit("hello");
				*/
				this.on = this.addEventListener = function(event , fn) {
					this._events = this._events || {};
					(this._events[event] = this._events[event] || [])
						.push(fn);
					return this;
				};
				/**
					@method once
					@public
					@param {String} event
					@param {Function} fn
					@return {EventEmitter} this
					@example

						var Events = require("latte_lib").events;
						var events = new Events();
						events.once("hello", function() {
							log("latte");
						});
						events.emit("hello");
						events.emit("hello");
				*/
				this.once = function(event, fn) {
					var self = this;
					this._events = this._events || {};

					function on() {
						self.off(event, on);
						fn.apply(this, arguments);
					}

					on.fn = fn;
					this.on(event, on);
					return this;
				};
				/**
					@method off
					@public
					@param {String} event
					@param {Function} fn
					@return {EventEmitter} this
					@example

						var Events = require("latte_lib").events;
						var events = new Events();
						var fun = function() {
							log("latte");
						};
						events.once("hello", fun);
						events.emit("hello", fun);
				*/
				this.off =
				this.removeListener =
				this.removeAllListeners =
				this.removeEventListener = function(event, fn){
				  this._events = this._events || {};

				  // all
				  if (0 == arguments.length) {
				    this._events = {};
				    return this;
				  }

				  // specific event
				  var callbacks = this._events[event];
				  if (!callbacks) return this;

				  // remove all handlers
				  if (1 == arguments.length) {
				    delete this._events[event];
				    return this;
				  }

				  // remove specific handler
				  var cb;
				  for (var i = 0; i < callbacks.length; i++) {
				    cb = callbacks[i];
				    if (cb === fn || cb.fn === fn) {
				      callbacks.splice(i, 1);
				      break;
				    }
				  }
				  return this;
				};
				/**
					@method emit
					@public
					@param {String} event
					@return {EventEmitter} this
					@example

						var Events = require("latte_lib").events;
						var events = new Events();
						var fun = function() {
							log("latte");
						};
						events.on("hello", fun);
						event.emit("hello")
				*/
				this.emit = function(event){
					this._events = this._events || {};
					var args = [].slice.call(arguments, 1)
					, callbacks = this._events[event];

					if (callbacks) {
						callbacks = callbacks.slice(0);
						for (var i = 0, len = callbacks.length; i < len; ++i) {
						  callbacks[i].apply(this, args);
						}
					}

					return this;
				};
				/**
					@method listeners
					@public
					@param {String} event
					@return {Function[]}
					@example

						var Events = require("latte_lib").events;
						var events = new Events();
						var fun = function() {
							log("latte");
						};
						log(events.listeners("hello"));
				*/
				this.listeners = function(event){
					this._events = this._events || {};
					return this._events[event] || [];
				};
				/**
					@method hasListeners
					@public
					@param {String} event
					@return {Bool}
					@example

						var Events = require("latte_lib").events;
						var events = new Events();
						var fun = function() {
							log("latte");
						};
						log(events.hasListeners("hello"));
				*/
				this.hasListeners = function(event){
					return !! this.listeners(event).length;
				};
			}).call(events.prototype);
		}else{
			events = require("events").EventEmitter;
		}
		module.exports = events;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
