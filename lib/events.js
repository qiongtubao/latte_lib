(function(define) { 'use strict';
	define("latte_lib/events", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var EventEmitter = function() {
			this._events = this._events || {};
		};
		(function() {
			this.on = this.addEventListener = function(event , fn) {
				this._events = this._events || {};
				(this._events[event] = this._events[event] || [])
					.push(fn);
				return this;
			};
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
			this.listeners = function(event){
				this._events = this._events || {};
				return this._events[event] || [];
			};
			this.hasListeners = function(event){
				return !! this.listeners(event).length;
			};
		}).call(EventEmitter.prototype);


			module.exports.EventEmitter = EventEmitter;

		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });