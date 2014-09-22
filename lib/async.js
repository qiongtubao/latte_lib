(function(define) { 'use strict';
	define("latte_lib/async", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib");
		if(!latte_lib) {
			console.log("no load lib");
		}
		(function() {
			var _self = this;
			this.setImmediate = latte_lib.setImmediate;
			/**
				@method
				@static
				@param   fn   {function}  只执行一次的函数

				单次执行
			*/
			var only_once = function(fn) {
				var called = false;
				return function() {
					if (called) throw new Error("Callback was already called.");
					called = true;
					fn.apply(_self, arguments);
				}
			};
			/**
				@method
				@static
				@param   arr   {array}  需要被执行函数的数组
				@param   iterator  {function}  执行函数
				@param   callback  {function}  回调函数

				并行执行
			*/
			this.forEach = this.each = function(arr, iterator, callback) {
				callback = callback || function(){};
				if(!arr.length) {
					return callback();
				}
				var completed = 0;
				latte_lib.forEach(arr, function (x) {
		            iterator(x, only_once(done) );
		        });
		        function done(err) {
		          if (err) {
		              callback(err);
		              callback = function () {};
		          }
		          else {
		              completed += 1;
		              if (completed >= arr.length) {
		                  callback();
		              }
		          }
		        }
			};

			/**
				@method
				@static
				@param   arr   {array}  需要被执行函数的数组
				@param   iterator  {function}  执行函数
				@param   callback  {function}  回调函数

				串行执行
			*/
			this.forEachSeries = this.eachSeries = function(arr, iterator, callback) {
				callback = callback || function() {};
				if (!arr.length) {
		            return callback();
		        }
		        var completed = 0;
		        (function iterate() {
		            iterator(arr[completed], function (err) {
		                if (err) {
		                    callback(err);
		                    callback = function () {};
		                }
		                else {
		                    completed += 1;
		                    if (completed >= arr.length) {
		                        callback();
		                    }
		                    else {
		                        iterate();
		                    }
		                }
		            });
		        })();
			};

			this.forEachLimit = this.eachLimit = function(arr, limit, iterator, callback) {
				var fn = _eachLimit(limit);
	        	fn.apply(null, [arr, iterator, callback]);
			};

			var _eachLimit = function(limit) {
				return function(arr, iterator, callback) {
					callback = callback || function() {};
					if (!arr.length || limit <= 0) {
		                return callback();
		            }
		            var completed = 0;
		            var started = 0;
		            var running = 0;
	             	(function replenish () {
		                if (completed >= arr.length) {
		                    return callback();
		                }

		                while (running < limit && started < arr.length) {
		                    started += 1;
		                    running += 1;
		                    iterator(arr[started - 1], function (err) {
		                        if (err) {
		                            callback(err);
		                            callback = function () {};
		                        }
		                        else {
		                            completed += 1;
		                            running -= 1;
		                            if (completed >= arr.length) {
		                                callback();
		                            }
		                            else {
		                                replenish();
		                            }
		                        }
		                    });
		                }
		            })();
				};
			};

			var doParallel = function (fn) {
		        return function () {
		            var args = Array.prototype.slice.call(arguments);
		            return fn.apply(null, [_self.each].concat(args));
		        };
		    };

		    var doParallelLimit = function(limit, fn) {
		        return function () {
		            var args = Array.prototype.slice.call(arguments);
		            return fn.apply(null, [_eachLimit(limit)].concat(args));
		        };
		    };

		    var doSeries = function (fn) {
		        return function () {
		            var args = Array.prototype.slice.call(arguments);
		            return fn.apply(null, [_self.eachSeries].concat(args));
		        };
		    };

		    var _asyncMap = function(eachfn, arr, iterator, callback) {
		    	arr = latte_lib.map(arr, function(x, i) {
		    		return {
		    			index: i,
		    			value: x
		    		};
		    	});
		    	if (!callback) {
		            eachfn(arr, function (x, callback) {
		                iterator(x.value, function (err) {
		                    callback(err);
		                });
		            });
		        } else {
		            var results = [];
		            eachfn(arr, function (x, callback) {
		                iterator(x.value, function (err, v) {
		                    results[x.index] = v;
		                    callback(err);
		                });
		            }, function (err) {
		                callback(err, results);
		            });
		        }
		    };

		    this.map = doParallel(_asyncMap);
		    this.mapSeries = doSeries(_asyncMap);

		    var _mapLimit = function(limit) {
		        return doParallelLimit(limit, _asyncMap);
		    };

		    this.mapLimit = function(arr, limit, iterator, callback) {
		    	return _mapLimit(limit)(arr, iterator, callback);
		    };

		    this.inject = this.foldl = this.reduce = function(arr, memo, iterator, callback) {
		    	_self.eachSeries(arr, function(x, callback) {
		    		iterator(memo, x, function (err, v) {
		                memo = v;
		                callback(err);
		            });
		    	}, function (err) {
		            callback(err, memo);
		        });
		    };

		    this.foldr = this.reduceRight = function (arr, memo, iterator, callback) {
		        var reversed = latte_lib.map(arr, function (x) {
		            return x;
		        }).reverse();
		        _self.reduce(reversed, memo, iterator, callback);
		    };
		    var _filter = function (eachfn, arr, iterator, callback) {
		        var results = [];
		        arr = latte_lib.map(arr, function (x, i) {
		            return {index: i, value: x};
		        });
		        eachfn(arr, function (x, callback) {
		            iterator(x.value, function (v) {
		                if (v) {
		                    results.push(x);
		                }
		                callback();
		            });
		        }, function (err) {
		            callback(latte_lib.map(results.sort(function (a, b) {
		                return a.index - b.index;
		            }), function (x) {
		                return x.value;
		            }));
		        });
		    };

		    this.select = this.filter = doParallel(_filter);
	    	this.selectSeries = this.filterSeries = doSeries(_filter);
		
	    	var _reject = function (eachfn, arr, iterator, callback) {
		        var results = [];
		        arr = latte_lib.map(arr, function (x, i) {
		            return {index: i, value: x};
		        });
		        eachfn(arr, function (x, callback) {
		            iterator(x.value, function (v) {
		                if (!v) {
		                    results.push(x);
		                }
		                callback();
		            });
		        }, function (err) {
		            callback(latte_lib.map(results.sort(function (a, b) {
		                return a.index - b.index;
		            }), function (x) {
		                return x.value;
		            }));
		        });
		    };

		    this.reject = doParallel(_reject);
	 		this.rejectSeries = doSeries(_reject);

	 		var _detect = function (eachfn, arr, iterator, main_callback) {
		        eachfn(arr, function (x, callback) {
		            iterator(x, function (result) {
		                if (result) {
		                    main_callback(x);
		                    main_callback = function () {};
		                }
		                else {
		                    callback();
		                }
		            });
		        }, function (err) {
		            main_callback();
		        });
		    };

		    this.detect = doParallel(_detect);
		 	this.detectSeries = doSeries(_detect);

		 	this.any = this.some = function(arr, iterator, main_callback) {
		 		_self.each(arr, function (x, callback) {
		            iterator(x, function (v) {
		                if (v) {
		                    main_callback(true);
		                    main_callback = function () {};
		                }
		                callback();
		            });
		        }, function (err) {
		            main_callback(false);
		        });
		 	};

		 	this.all = this.every = function (arr, iterator, main_callback) {
		        _self.each(arr, function (x, callback) {
		            iterator(x, function (v) {
		                if (!v) {
		                    main_callback(false);
		                    main_callback = function () {};
		                }
		                callback();
		            });
		        }, function (err) {
		            main_callback(true);
		        });
		    };

		    this.sortBy = function (arr, iterator, callback) {
		        _self.map(arr, function (x, callback) {
		            iterator(x, function (err, criteria) {
		                if (err) {
		                    callback(err);
		                }
		                else {
		                    callback(null, {value: x, criteria: criteria});
		                }
		            });
		        }, function (err, results) {
		            if (err) {
		                return callback(err);
		            }
		            else {
		                var fn = function (left, right) {
		                    var a = left.criteria, b = right.criteria;
		                    return a < b ? -1 : a > b ? 1 : 0;
		                };
		                callback(null, latte_lib.map(results.sort(fn), function (x) {
		                    return x.value;
		                }));
		            }
		        });
		    };
		    /**
		    	@method
		    	@static
		    	自动 并行 如果有依赖的话等依赖好了在执行
		    */
		    this.auto = function (tasks, callback) {
		        callback = callback || function () {};
		        var keys = latte_lib.keys(tasks);
		        var remainingTasks = keys.length
		        if (!remainingTasks) {
		            return callback();
		        }

		        var results = {};

		        var listeners = [];
		        var addListener = function (fn) {
		            listeners.unshift(fn);
		        };
		        var removeListener = function (fn) {
		            for (var i = 0; i < listeners.length; i += 1) {
		                if (listeners[i] === fn) {
		                    listeners.splice(i, 1);
		                    return;
		                }
		            }
		        };
		        var taskComplete = function () {
		            remainingTasks--
		            latte_lib.forEach(listeners.slice(0), function (fn) {
		                fn();
		            });
		        };

		        addListener(function () {
		            if (!remainingTasks) {
		                var theCallback = callback;
		                // prevent final callback from calling itself if it errors
		                callback = function () {};

		                theCallback(null, results);
		            }
		        });

		        latte_lib.forEach(keys, function (k) {
		            var task = latte_lib.isArray(tasks[k]) ? tasks[k]: [tasks[k]];
		            var taskCallback = function (err) {
		                var args = Array.prototype.slice.call(arguments, 1);
		                if (args.length <= 1) {
		                    args = args[0];
		                }
		                if (err) {
		                    var safeResults = {};
		                    latte_lib.forEach(latte_lib.keys(results), function(rkey) {
		                        safeResults[rkey] = results[rkey];
		                    });
		                    safeResults[k] = args;
		                    callback(err, safeResults);
		                    // stop subsequent errors hitting callback multiple times
		                    callback = function () {};
		                }
		                else {
		                    results[k] = args;
		                    latte_lib.setImmediate(taskComplete);
		                }
		            };
		            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
		            var ready = function () {
		                return latte_lib.reduce(requires, function (a, x) {
		                    return (a && results.hasOwnProperty(x));
		                }, true) && !results.hasOwnProperty(k);
		            };
		            if (ready()) {
		                task[task.length - 1](taskCallback, results);
		            }
		            else {
		                var listener = function () {
		                    if (ready()) {
		                        removeListener(listener);
		                        task[task.length - 1](taskCallback, results);
		                    }
		                };
		                addListener(listener);
		            }
		        });
		    };

		    this.retry = function(times, task, callback) {
		        var DEFAULT_TIMES = 5;
		        var attempts = [];
		        // Use defaults if times not passed
		        if (typeof times === 'function') {
		            callback = task;
		            task = times;
		            times = DEFAULT_TIMES;
		        }
		        // Make sure times is a number
		        times = parseInt(times, 10) || DEFAULT_TIMES;
		        var wrappedTask = function(wrappedCallback, wrappedResults) {
		            var retryAttempt = function(task, finalAttempt) {
		                return function(seriesCallback) {
		                    task(function(err, result){
		                        seriesCallback(!err || finalAttempt, {err: err, result: result});
		                    }, wrappedResults);
		                };
		            };
		            while (times) {
		                attempts.push(retryAttempt(task, !(times-=1)));
		            }
		            _self.series(attempts, function(done, data){
		                data = data[data.length - 1];
		                (wrappedCallback || callback)(data.err, data.result);
		            });
		        }
		        // If a callback is passed, run this as a controll flow
		        return callback ? wrappedTask() : wrappedTask
		    };

		    this.waterfall = function (tasks, callback) {
		        callback = callback || function () {};
		        if (!latte_lib.isArray(tasks)) {
		          var err = new Error('First argument to waterfall must be an array of functions');
		          return callback(err);
		        }
		        if (!tasks.length) {
		            return callback();
		        }
		        var wrapIterator = function (iterator) {
		            return function (err) {
		                if (err) {
		                    callback.apply(null, arguments);
		                    callback = function () {};
		                }
		                else {
		                    var args = Array.prototype.slice.call(arguments, 1);
		                    var next = iterator.next();
		                    if (next) {
		                        args.push(wrapIterator(next));
		                    }
		                    else {
		                        args.push(callback);
		                    }
		                    latte_lib.setImmediate(function () {
		                        iterator.apply(null, args);
		                    });
		                }
		            };
		        };
		        wrapIterator(_self.iterator(tasks))();
		    };

		    var _parallel = function(eachfn, tasks, callback) {
		        callback = callback || function () {};
		        if (latte_lib.isArray(tasks)) {
		            eachfn.map(tasks, function (fn, callback) {
		                if (fn) {
		                    fn(function (err) {
		                        var args = Array.prototype.slice.call(arguments, 1);
		                        if (args.length <= 1) {
		                            args = args[0];
		                        }
		                        callback.call(null, err, args);
		                    });
		                }
		            }, callback);
		        }
		        else {
		            var results = {};
		            eachfn.each(latte_lib.keys(tasks), function (k, callback) {
		                tasks[k](function (err) {
		                    var args = Array.prototype.slice.call(arguments, 1);
		                    if (args.length <= 1) {
		                        args = args[0];
		                    }
		                    results[k] = args;
		                    callback(err);
		                });
		            }, function (err) {
		                callback(err, results);
		            });
		        }
		    };

		    this.parallel = function (tasks, callback) {
		        _parallel({ map: _self.map, each: _self.each }, tasks, callback);
		    };

		    this.parallelLimit = function(tasks, limit, callback) {
		        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
		    };

		    this.series = function (tasks, callback) {
		        callback = callback || function () {};
		        if (latte_lib.isArray(tasks)) {
		            _self.mapSeries(tasks, function (fn, callback) {
		                if (fn) {
		                    fn(function (err) {
		                        var args = Array.prototype.slice.call(arguments, 1);
		                        if (args.length <= 1) {
		                            args = args[0];
		                        }
		                        callback.call(null, err, args);
		                    });
		                }
		            }, callback);
		        }
		        else {
		            var results = {};
		            _self.eachSeries(_keys(tasks), function (k, callback) {
		                tasks[k](function (err) {
		                    var args = Array.prototype.slice.call(arguments, 1);
		                    if (args.length <= 1) {
		                        args = args[0];
		                    }
		                    results[k] = args;
		                    callback(err);
		                });
		            }, function (err) {
		                callback(err, results);
		            });
		        }
		    };

		    this.iterator = function (tasks) {
		        var makeCallback = function (index) {
		            var fn = function () {
		                if (tasks.length) {
		                    tasks[index].apply(null, arguments);
		                }
		                return fn.next();
		            };
		            fn.next = function () {
		                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
		            };
		            return fn;
		        };
		        return makeCallback(0);
		    };

		    this.apply = function (fn) {
		        var args = Array.prototype.slice.call(arguments, 1);
		        return function () {
		            return fn.apply(
		                null, args.concat(Array.prototype.slice.call(arguments))
		            );
		        };
		    };

		    var _concat = function (eachfn, arr, fn, callback) {
		        var r = [];
		        eachfn(arr, function (x, cb) {
		            fn(x, function (err, y) {
		                r = r.concat(y || []);
		                cb(err);
		            });
		        }, function (err) {
		            callback(err, r);
		        });
		    };
		    this.concat = doParallel(_concat);
	    	this.concatSeries = doSeries(_concat);
	    	this.whilst = function (test, iterator, callback) {
		        if (test()) {
		            iterator(function (err) {
		                if (err) {
		                    return callback(err);
		                }
		                _self.whilst(test, iterator, callback);
		            });
		        }
		        else {
		            callback();
		        }
		    };

		    this.doWhilst = function (iterator, test, callback) {
		        iterator(function (err) {
		            if (err) {
		                return callback(err);
		            }
		            var args = Array.prototype.slice.call(arguments, 1);
		            if (test.apply(null, args)) {
		                _self.doWhilst(iterator, test, callback);
		            }
		            else {
		                callback();
		            }
		        });
		    };

		    this.until = function(test, iterator, callback) {
		    	if (!test()) {
		            iterator(function (err) {
		                if (err) {
		                    return callback(err);
		                }
		                _self.until(test, iterator, callback);
		            });
		        }
		        else {
		            callback();
		        }
		    };

		    this.doUntil = function (iterator, test, callback) {
		        iterator(function (err) {
		            if (err) {
		                return callback(err);
		            }
		            var args = Array.prototype.slice.call(arguments, 1);
		            if (!test.apply(null, args)) {
		                _self.doUntil(iterator, test, callback);
		            }
		            else {
		                callback();
		            }
		        });
		    };

		    this.queue = function (worker, concurrency) {
		        if (concurrency === undefined) {
		            concurrency = 1;
		        }
		        function _insert(q, data, pos, callback) {
		          if (!q.started){
		            q.started = true;
		          }
		          if (!_isArray(data)) {
		              data = [data];
		          }
		          if(data.length == 0) {
		             // call drain immediately if there are no tasks
		             return latte_lib.setImmediate(function() {
		                 if (q.drain) {
		                     q.drain();
		                 }
		             });
		          }
		          latte_lib.forEach(data, function(task) {
		              var item = {
		                  data: task,
		                  callback: typeof callback === 'function' ? callback : null
		              };

		              if (pos) {
		                q.tasks.unshift(item);
		              } else {
		                q.tasks.push(item);
		              }

		              if (q.saturated && q.tasks.length === q.concurrency) {
		                  q.saturated();
		              }
		              latte_lib.setImmediate(q.process);
		          });
		        }

		        var workers = 0;
		        var q = {
		            tasks: [],
		            concurrency: concurrency,
		            saturated: null,
		            empty: null,
		            drain: null,
		            started: false,
		            paused: false,
		            push: function (data, callback) {
		              _insert(q, data, false, callback);
		            },
		            kill: function () {
		              q.drain = null;
		              q.tasks = [];
		            },
		            unshift: function (data, callback) {
		              _insert(q, data, true, callback);
		            },
		            process: function () {
		                if (!q.paused && workers < q.concurrency && q.tasks.length) {
		                    var task = q.tasks.shift();
		                    if (q.empty && q.tasks.length === 0) {
		                        q.empty();
		                    }
		                    workers += 1;
		                    var next = function () {
		                        workers -= 1;
		                        if (task.callback) {
		                            task.callback.apply(task, arguments);
		                        }
		                        if (q.drain && q.tasks.length + workers === 0) {
		                            q.drain();
		                        }
		                        q.process();
		                    };
		                    var cb = only_once(next);
		                    worker(task.data, cb);
		                }
		            },
		            length: function () {
		                return q.tasks.length;
		            },
		            running: function () {
		                return workers;
		            },
		            idle: function() {
		                return q.tasks.length + workers === 0;
		            },
		            pause: function () {
		                if (q.paused === true) { return; }
		                q.paused = true;
		                q.process();
		            },
		            resume: function () {
		                if (q.paused === false) { return; }
		                q.paused = false;
		                q.process();
		            }
		        };
		        return q;
		    };

		    this.priorityQueue = function(worker, concurrency) {
		    	function _compareTasks(a, b){
	          return a.priority - b.priority;
	        };
	        
	        function _binarySearch(sequence, item, compare) {
	          var beg = -1,
	              end = sequence.length - 1;
	          while (beg < end) {
	            var mid = beg + ((end - beg + 1) >>> 1);
	            if (compare(item, sequence[mid]) >= 0) {
	              beg = mid;
	            } else {
	              end = mid - 1;
	            }
	          }
	          return beg;
	        }
	        
	        function _insert(q, data, priority, callback) {
				if (!q.started){
					q.started = true;
				}
				if (!_isArray(data)) {
					data = [data];
				}
				if(data.length == 0) {
				// call drain immediately if there are no tasks
					return latte_lib.setImmediate(function() {
						if (q.drain) {
							q.drain();
						}
					});
				}
				  latte_lib.forEach(data, function(task) {
				      var item = {
				          data: task,
				          priority: priority,
				          callback: typeof callback === 'function' ? callback : null
				      };
				      
				      q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

				      if (q.saturated && q.tasks.length === q.concurrency) {
				          q.saturated();
				      }
				      latte_lib.setImmediate(q.process);
				  });
				}
		        
		        // Start with a normal queue
		        var q = _self.queue(worker, concurrency);
		        
		        // Override push to accept second parameter representing priority
		        q.push = function (data, priority, callback) {
		          _insert(q, data, priority, callback);
		        };
		        
		        // Remove unshift function
		        delete q.unshift;

		        return q;
		    };

		    this.cargo = function (worker, payload) {
		        var working     = false,
		            tasks       = [];

		        var cargo = {
		            tasks: tasks,
		            payload: payload,
		            saturated: null,
		            empty: null,
		            drain: null,
		            drained: true,
		            push: function (data, callback) {
		                if (!latte_lib.isArray(data)) {
		                    data = [data];
		                }
		                latte_lib.forEach(data, function(task) {
		                    tasks.push({
		                        data: task,
		                        callback: typeof callback === 'function' ? callback : null
		                    });
		                    cargo.drained = false;
		                    if (cargo.saturated && tasks.length === payload) {
		                        cargo.saturated();
		                    }
		                });
		                latte_lib.setImmediate(cargo.process);
		            },
		            process: function process() {
		                if (working) return;
		                if (tasks.length === 0) {
		                    if(cargo.drain && !cargo.drained) cargo.drain();
		                    cargo.drained = true;
		                    return;
		                }

		                var ts = typeof payload === 'number'
		                            ? tasks.splice(0, payload)
		                            : tasks.splice(0, tasks.length);

		                var ds = latte_lib.map(ts, function (task) {
		                    return task.data;
		                });

		                if(cargo.empty) cargo.empty();
		                working = true;
		                worker(ds, function () {
		                    working = false;

		                    var args = arguments;
		                    latte_lib.forEach(ts, function (data) {
		                        if (data.callback) {
		                            data.callback.apply(null, args);
		                        }
		                    });

		                    process();
		                });
		            },
		            length: function () {
		                return tasks.length;
		            },
		            running: function () {
		                return working;
		            }
		        };
		        return cargo;
		    };

		    var _console_fn = function (name) {
		        return function (fn) {
		            var args = Array.prototype.slice.call(arguments, 1);
		            fn.apply(null, args.concat([function (err) {
		                var args = Array.prototype.slice.call(arguments, 1);
		                if (typeof console !== 'undefined') {
		                    if (err) {
		                        if (console.error) {
		                            console.error(err);
		                        }
		                    }
		                    else if (console[name]) {
		                        latte_lib.forEach(args, function (x) {
		                            console[name](x);
		                        });
		                    }
		                }
		            }]));
		        };
		    };
		    this.log = _console_fn('log');
	 		this.dir = _console_fn('dir');

	 		this.memoize = function (fn, hasher) {
		        var memo = {};
		        var queues = {};
		        hasher = hasher || function (x) {
		            return x;
		        };
		        var memoized = function () {
		            var args = Array.prototype.slice.call(arguments);
		            var callback = args.pop();
		            var key = hasher.apply(null, args);
		            if (key in memo) {
		                latte_lib.nextTick(function () {
		                    callback.apply(null, memo[key]);
		                });
		            }
		            else if (key in queues) {
		                queues[key].push(callback);
		            }
		            else {
		                queues[key] = [callback];
		                fn.apply(null, args.concat([function () {
		                    memo[key] = arguments;
		                    var q = queues[key];
		                    delete queues[key];
		                    for (var i = 0, l = q.length; i < l; i++) {
		                      q[i].apply(null, arguments);
		                    }
		                }]));
		            }
		        };
		        memoized.memo = memo;
		        memoized.unmemoized = fn;
		        return memoized;
		    };

		    this.unmemoize = function (fn) {
				return function () {
					return (fn.unmemoized || fn).apply(null, arguments);
				};
		    };

		    this.times = function (count, iterator, callback) {
		        var counter = [];
		        for (var i = 0; i < count; i++) {
		            counter.push(i);
		        }
		        return _self.map(counter, iterator, callback);
		    };

		    this.timesSeries = function (count, iterator, callback) {
		        var counter = [];
		        for (var i = 0; i < count; i++) {
		            counter.push(i);
		        }
		        return _self.mapSeries(counter, iterator, callback);
		    };

		    /**
		    	@method
		    	@static


		    */

		    this.seq = function (/* functions... */) {
		        var fns = arguments;
		        return function () {
		            var that = this;
		            var args = Array.prototype.slice.call(arguments);
		            var callback = args.pop();
		            _self.reduce(fns, args, function (newargs, fn, cb) {
		                fn.apply(that, newargs.concat([function () {
		                    var err = arguments[0];
		                    var nextargs = Array.prototype.slice.call(arguments, 1);
		                    cb(err, nextargs);
		                }]))
		            },
		            function (err, results) {
		                callback.apply(that, [err].concat(results));
		            });
		        };
		    };
		    /**
		    	@method
		    	@static 
				
				串行执行  上一个函数的结果传到下一个函数的参数
		    */
		    this.compose = function (/* functions... */) {
		    	//颠倒参数
		      return _self.seq.apply(null, Array.prototype.reverse.call(arguments));
		    };

		    var _applyEach = function (eachfn, fns /*args...*/) {
		        var go = function () {
		            var that = this;
		            var args = Array.prototype.slice.call(arguments);
		            var callback = args.pop();
		            return eachfn(fns, function (fn, cb) {
		                fn.apply(that, args.concat([cb]));
		            },
		            callback);
		        };
		        if (arguments.length > 2) {
		            var args = Array.prototype.slice.call(arguments, 2);
		            return go.apply(this, args);
		        }
		        else {
		            return go;
		        }
		    };
		    this.applyEach = doParallel(_applyEach);
	    	this.applyEachSeries = doSeries(_applyEach);

	    	/**	    		
				@static
				@method
				@param   fn   {function}  循环执行到函数
				@param   callback  {function}  循环执行出现错误之后回调函数
				
					用法可以用做循环执行等待一个有结果之后回调  

	    	*/
	    	this.forever = function (fn, callback) {
		        function next(err) {
		            if (err) {
		                if (callback) {
		                    return callback(err);
		                }
		                throw err;
		            }
		            fn(next);
		        }
		        next();
		    };
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });