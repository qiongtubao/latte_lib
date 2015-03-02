(function(define) { 'use strict';
	define("latte_lib/old/reconnection", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib");
		function Reconnection(config) {
			this.attempts = 0;
			this.reconnecting = config.reconnecting || false;//是否在重连
			this.openReconnect = true;//是否开启重启
			this.readyState = "close";
			this.reconnectionDelay = config.reconnectionDelay || 2000;
			this.reconnectionDelayMax = config.reconnectionDelayMax || 60*1000;
			
		};
		(function(){
			this.maybeReconnectOnOpen = function() {
				/*if(!this.openReconnect && !this.reconnecting && this._reconnection && this.attempts === 0) {
					this.openReconnect = true;
					this.reconnect();
				}*/
				if(!this.reconnecting && this.readyState.indexOf("close") != -1 && this.openReconnect) {
					this.reconnect();
				}
			}

			this.cleanup = function() {}
			this.onReconnect = function() {
				var attempt = this.attempts;
				this.attempts = 0;
				this.reconnecting = false;
			}
			this.reconnect = function () {
				if(this.reconnecting) return this;
				if(!this.openReconnect) return this;
				var self = this;
				if(this.attemptsMax && ++this.attempts > this.attemptsMax) {
					this.reconnecting = false;
					console.log("reconnecting_fail full");
				} else {
					var delay = this.attempts * this.reconnectionDelay;
					delay = Math.min(delay, this.reconnectionDelayMax);
					this.reconnecting = true;
					var timer = setTimeout(function() {
						self.open(function(err) {
							if(err) {
								self.reconnecting = false;
								self.reconnect();
							}else {
								self.onReconnect();
							}
						});
					}, delay);
				}
			}
			this.onClose = function(reason) {
				this.cleanup();
				this.readyState = "closed";
				//this.emit("close", reason);
				if(this.openReconnect) {
					this.reconnect();
				}
			}
		}).call(Reconnection.prototype);
		module.exports = Reconnection;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });