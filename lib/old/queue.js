(function(define) { 'use strict';
	define("latte_lib/old/queue", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		function Queue(size) {
			this._size = Math.max(+size | 0, 1);
			this.slots = [];
			for(var i = 0; i< this._size; i++) {
				this.slots.push([]);
			}
		};
		(function (){
			this.size = function() {
				if(this.tatal == null)  {
					this.total = 0;
					for(var i = 0 ; i < this._size; i++) {
						this.total += this.slots[i].length;
					}
				}
				return this.total;
			}
			this.enqueue = function(obj, priority) {
				var priorityOrig;
				priority = priority && +priority | 0 || 0;
				this.total = null;
				if(priority) {
					priorityOrig = priority;
					if (priority < 0 || priority >= this._size) {
						priority = (this._size - 1);

					}
				}
				this.slots[priority].push(obj);
			}
			this.dequeue = function(callback) {
				var obj = null,  sl = this.slots.length;
				this.total = null;
				for(var i = 0; i < sl; i++) {
					if(this.slots[i].length > 0) {
						obj = this.slots[i].shift();
						break;
					}
				}
				return obj;
			}
		}).call(Queue.prototype);
		module.exports = Queue;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });