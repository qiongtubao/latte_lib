(function(define) { 'use strict';
	define("latte_lib/old/removeIdle", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		function RemoveIdle(config) {
			this.reapIntervalMillis = config.reapIntervalMillis || 1000;
			this.idleTimeoutMillis = config.idleTimeoutMillis || 10000;
			this.refreshIdle = config.refreshIdle || true;
			this.returnToHead = config.returnToHead || false;
			this.scheduleRemoveIdle();
			this.min = config.min || 0;
			this.max = config.max || 1000;
			this.availableObjects = [];
			this._destroy = config.destroy;
			this._create = config.create;
			this.log = config.log || null;
		};
		(function() {
			/*连接池才用到的
			this.removeConditions = function() {
				return this.availableObjects.length > this.min;
			}
			*/
			this.removeConditions = function() {return true;}
			this.ensureMinimum = function() {}
			this.dispense = function() {
				
			}
			this.getIdle = function(obj) {
				this.availableObjects = this.availableObjects.filter(function(objWithTimeout) {
					return (objWithTimeout.obj !== obj);
				});
			}
			this.update = function(obj) {
				for(var i =0 , len = this.availableObjects.length; (i < len && this.removeConditions());i++) {
    				if(obj == this.availableObjects[i].obj) {
    					this.availableObjects[i].timeout = new Date().getTime() + this.idleTimeoutMillis;
    				}
    			}
			}
			this.release = function(obj) {
				if(this.availableObjects.some(function(objWithTimeout) {
					if(objWithTimeout.obj === obj) {
						//objWithTimeout.timeout =  new Date().getTime() + this.idleTimeoutMillis;
						return true;
					}
				})) {
					this.log && this.log.error("called twice for the same resource")
					//刷新
					return;
				};
				var objWithTimeout = {obj: obj, timeout: (new Date().getTime() + this.idleTimeoutMillis)}
				if(this.returnToHead) {
					this.availableObjects.splice(0,0,objWithTimeout);
				} else{
					this.availableObjects.push(objWithTimeout);
				}
				this.dispense();
				this.scheduleRemoveIdle();
			}
			this.removeIdle = function() {
				var toRemove = [],
    				now = new Date().getTime(),
    				self = this
    				timeout;
				this.removeIdleScheduled = false;
    			for(var i =0 , len = this.availableObjects.length; (i < len && this.removeConditions());i++) {
    				var timeout = this.availableObjects[i].timeout;
    				if(now > timeout) {
    					toRemove.push(this.availableObjects[i].obj);
    				}
    			}
    			for(var i = 0, len = toRemove.length; i < len; i++) {
    				self.destroy(toRemove[i]);
    			}
    			if(this.availableObjects.length > 0) {
    				this.scheduleRemoveIdle();
    			}
			}
			this.scheduleRemoveIdle = function() {
				if (!this.removeIdleScheduled) {
					this.removeIdleScheduled = true;
					this.removeIdleTimer = setTimeout(this.removeIdle.bind(this), this.reapIntervalMillis);
			    }
			}
			this.destroy = function(obj) {
				this.getIdle(obj);
				this._destroy(obj);
				this.ensureMinimum();
			}
			this.destroyAllNow = function(callback) {
				var willDie = this.availableObjects;
				this.availableObjects = [];
				var obj = willDie.shift();
				var self = this;
				while(obj !== null && obj !== undefined) {
					self.destroy(obj.obj);
					obj = willDie.shift();
				}
				this.removeIdleScheduled = false;
				clearTimeout(this.removeIdleTimer);
				if(callback) {
					callback();
				}
			}
			/*连接池才用到的
			this.ensureMinimum = function() {
				var i , diff;
				if(!draining && (count < factory.min)) {
					diff = factory.min - this.availableObjects.length ;
					for(var i = 0; i < diff; i++) {
						createResource();
					}
				}
			}
			*/
		}).call(RemoveIdle.prototype);
		module.exports = RemoveIdle;

	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });