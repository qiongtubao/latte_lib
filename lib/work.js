(function(define) { 'use strict';
	define("latte_lib/work", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		(function() {
			var Work,
				Works = [];
		
			if(window) {

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
				});;
			}
			this.create = function(file, opts) {
				return new Work(file, opts);
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });