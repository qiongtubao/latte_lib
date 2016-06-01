
		/**
			@module old
			@namespace latte_lib
			@class queue
		*/

		function Queue(size) {
			this._size = Math.max(+size | 0, 1);
			this.slots = [];
			for(var i = 0; i < this._size; i++) {
				this.slots.push([]);
			}
		}
		(function(){
			/**
				@method size
				@return {Int} total
				@sync
				@example

					var Queue =  require("latte_lib").queue;
					console.log(Queue);
					var queue = new Queue();
					log(queue.size()); //0
			*/
			this.size = function() {
				if(this.total == null) {
					this.total = 0;
					for(var i = 0 ; i< this._size; i++) {
						this.total += this.slots[i].length;
					}
				}
				return this.total;
			}
			/**
				@method enqueue
				@param {Object} obj
				@param {Int} priority
				@example
					var Queue = require("latte_lib").queue;
					var q = new Queue(2);
					q.enqueue("1", 0);
					q.enqueue("2", 1);
					q.enqueue("3",0);
					log(q.size());//3
					log(q.dequeue());//1
					log(q.dequeue());//3
					log(q.dequeue());//2
			*/
			this.enqueue = function(obj, priority) {
				var priorityOrig;
				priority = priority && +priority | 0 || 0;
				this.total = null;
				if(priority) {
					priorityOrig = priority;
					if(priority < 0 || priority >= this._size) {
						priority = (this._size -1);
					}
				}
				this.slots[priority].push(obj);
			}
			/**
				@method dequeue
				@return {Object} obj
				@example
					var Queue = require("latte_lib").queue;
					var q = new Queue();
					var one = q.dequeue();
					log(one); //null
					q.enqueue("1");
					var two = q.dequeue();
					log(two); // 1

			*/
			this.dequeue = function() {
				var obj = null, sl = this.slots.length;
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
  