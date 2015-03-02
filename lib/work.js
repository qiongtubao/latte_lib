(function(define) { 'use strict';
	define("latte_lib/work", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var Master , Slave;
		if(window) {
			if(!window.Worker) { console.log("no Worker!"); }
			var Events = require("./events")
				, latte_lib = require("./lib")
				, Masters = [];
			var defaultMaster = {
				logger: console
			}
			if(!Worker) {

			}
			Master = function(file, opts) {
				this.file = file;
				this.opts = latte_lib.merger(defaultMaster, opts);
				Masters.push(this);
				var self = this;
				this.on("error", function(e) {
					//console.log(e);
					self.opts.logger.log("Worker error:"+e.filename ,e.lineno, e.message);
				});
			}
			latte_lib.inherits(Master, Events);
			(function(){
				this.start = function() {
					this.child = new Worker(this.file);
					var self = this;
					this.child.onmessage = function(event) {
						self.emit(event.data.type, event.data.data);
					}
					this.child.onerror = function(e) {
						self.emit("error", e);
					}
				}
				this.send = function(type, data) {
					if(this.child) {
						this.child.postMessage({
							type: type, 
							data: data
						});
					}				
				}
				this.restart = function() {
					var self = this;
					this.stop();				
					this.emit("restart");
					this.start();
				}
				this.stop = function(callback) {
					this.child.terminate();
					this.child = null;
				}

			}).call(Master.prototype);


			Slave = function() {
				var self = this;
				onmessage = function(event) {
					self.emit(event.data.type, event.data.data);
				}
			}
			latte_lib.inherits(Slave, Events);
			(function() {
				this.send = function(type, data) {
					postMessage({
						type: type,
						data: data
					});
				}
			}).call(Slave.prototype);

		} else {
			var Events = require("./events")
				, ChildProcess = require("child_process")
				, latte_lib = require("./lib")
				, Masters = [];
			var defaultMaster =  {
				time : 10000,
				logger: console,
				isRestart: 1,
				argv:[],
				type: "fork"
			}
			Master = function(file, opts) {
				this.file = file;
				this.opts = latte_lib.merger(defaultMaster, opts);
				Masters.push(this);
			}
			latte_lib.inherits(Master, Events);
			(function() {
				this.start = function() {
					var self = this;
					if(this.child) {
						self.emit("error", "work is runing");
						return;
					}
					switch(this.opts.type) {
						case "fork":
							this.child = ChildProcess.fork(this.file, this.opts.argv);
							this.child.on("message", function(m) {
								self.emit(m.type, m.data);
							});		
							this.child.on('exit', function(){						
								delete(self.child);
								self.child = null;
								if(self.opts.isRestart) {
									self.emit("autoRestart");
									setTimeout(self.start.bind(self), self.opts.time);
								}
		 					});
						break;
						case "spawn":
							var child = this.child = ChildProcess.spawn(this.file, this.argv);
							child.stdout.on("data", function(data) {
								self.emit("data", data);
							});
							child.stderr.on("data", function(err) {
								self.emit("error", data);
							});
							child.on("exit", function() {
								delete(self.child);
								self.child = null;
								if(self.opts.isRestart) {
									self.emit("autoRestart");
									setTimeout(self.start.bind(self), self)
								}

							});
						break;
					}
					
				}
				this.send = function(type, data) {
					if(this.child) {
						this.child.send({
							type: type, 
							data: data
						});
					}
				}
				this.sendHandle = function(type, data) {
					if(this.child) {
						this.child.send(type, data)
					}
				}
				this.restart = function() {
					var self = this;
					this.stop(function(){
						self.emit("restart");
						self.start();
					})
				}
				this.stop = function(callback) {
					this.opts.isRestart = 0;
					this.sendHandle("exit");
					//this.child.kill("SIGHUP");
					callback && callback();
				}
				
			}).call(Master.prototype);
			process.on("exit", function() {
				Masters.forEach(function(master) {
					master && master.stop();
				});
			});
			Slave = function() {
				var self = this;
				process.on("message", function(m) {
					self.emit(m.type, m.data);
				});
				self.on("exit", function(){
					process.exit();
				});
			}
			latte_lib.inherits(Slave, Events);
			(function() {
				this.send = function(type, data) {
					process.send({
						type: type, 
						data: data
					});
				}
				this.exit = function() {
					process.exit(1);
				}
			}).call(Slave.prototype);
			module.exports.getArgv  = function() {
				return process.argv.splice(2);
			}


		}

		(function() {
			this.createMaster = function(file, opts) {
				return new Master(file, opts);
			}
			this.createSlave = function() {
				return new Slave();
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
/*(function(define) { 'use strict';
	define("latte_lib/work", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		(function(){
			var Work
				, Works = [];
			if(window) {
				var latte_lib = require("./lib")
					, Events = require("./events").EventEmitter;
				Work = function(file, opts) {
					this.opts = opts || {};
					this.file = file;
					this.logger = this.opts.logger || console;
				}
				latte_lib.inherits(Work, Events);
				(function() {
					this.start = () {
						this.loader = new Worker(file);
						this.loader.onmessage = function(event) {

						}
					}
					this.stop = function() {
						if(this.loader) {
							this.loader.terminate();
						}
					}
				}).call(module.exports);
			}else{
				var Events = require("./events").EventEmitter
					, ChildProcess = require("child_process")
					, latte_lib = require("./lib");
				Work = function(nodeFile, opts) {
					this.opts = opts || {};
					this.nodeFile = nodeFile;
					this.time = this.opts.time || 10000;
					this.argv = this.opts.argv || [nodeFile].concat(process.argv.splice(2));
					this.logger = this.opts.logger || console;
					this.isRestart = this.opts.isRestart || 1;
					Works.push(this);
				};
				latte_lib.inherits(Work, Events);
				(function() {
					this.start = function() {
						var self = this;
						if(this.child) {
							self.emit("error", "work is runing");
							return;
						}
						var child = this.child = ChildProcess.spawn("node", this.argv);
						child.stdout.on("data", function(data) {
							self.emit("data", data);
						});
						child.stderr.on("data", function(err) {
							self.emit("error", err);
						});
						child.on("exit", function() {
							self.child = null;
							delete(self.child);
							if(self.isRestart) {
								self.emit("autoRestart");
								setTimeout(self.start.bind(self), self.time);
							}							
						});
					}
					this.restart = function() {
						var self = this;
						this.stop(function() {
							self.emit("restart");
							self.start();
						});
					}
					this.stop = function(callback) {
						this.isRestart = 0;
						this.child.kill("SIGHUP");
						callback && callback();
					}
				}).call(Work.prototype);
				process.on("exit", function() {
					Works.forEach(function(work) {
						work && work.stop();
					});
				});
			}
			
			module.exports = Work;
			(function(){
				this.create = function(file, opts) {
					return new Work(file, opts);
				}
			}).call(module.exports);
			
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });*/