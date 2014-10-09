(function(define) { 'use strict';
	define("latte_lib/request", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib");
		var Emitter = require("./events").EventEmitter;
		var XMLHttpRequest = require("./xmlhttprequest");
		function Request(opts) {
			this.method = opts.method || "GET";
			this.uri = opts.uri;
			this.xd = !!opts.xd;
			this.xs = !!opts.xs;
			this.async = false !== opts.async;
			this.data = undefined !=  opts.data ? opts.data : null;
			this.agent = opts.agent;
			this.isBinary = opts.isBinary;
			this.supportsBinary = opts.supportsBinary;
			this.enablesXDR = opts.enablesXDR;
			this.create();
		};
		latte_lib.inherits(Request, Emitter);
		function empty() {};
		(function() {
			this.create = function() {
				var xhr = this.xhr = new XMLHttpRequest({ agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR})
				var self = this;
				//try {
					xhr.open(this.method, this.uri, this.async);
					if(this.supportsBinary) {
						xhr.responseType = "arraybuffer";
					}
					if("POST" == this.method) {
						try {
							if(this.isBinary) {
								xhr.setRequestHeader("Content-type", "application/octet-stream");
							} else {
								xhr.setRequestHeader("Content-type", "ext/plain;charset=UTF-8");
							}
						} catch(e) {}
					}
					if("withCredentials" in xhr) {
						xhr.withCredentials = true;
					}

					if(this.hasXDR()) {
						xhr.onload = function() {
							self.onLoad();
						};
						xhr.onerror = function() {

							self.onError(xhr.responseText);
						};
					} else {
						xhr.onreadystatechange = function() {
							if(4 != xhr.readyState) return;
							if(200 == xhr.status || 1223 == xhr.status) {
								self.onLoad();
							} else {
								setTimeout(function() {
									self.onError(xhr.status);
								}, 0);
							}
						};
					}
					xhr.send(this.data);
				//} catch(e) {
				//	setTimeout(function() {
				//		self.onError(e);
				//	}, 0);
				//	return;
				//}
				//if(window && window.document) {
					this.index = Request.requestsCount++;
					Request.requests[this.index] = this;
				//}
			};
			this.onSuccess = function() {
				this.emit("success");
				this.cleanup();
			};
			this.onData = function(data) {
				this.emit("data", data);
				this.onSuccess();
			}
			this.onError = function(err) {
				this.emit("error", err);
				this.cleanup();
			}
			this.cleanup = function() {
				if("undefined" == typeof this.xhr || null === this.xhr) {
					return;
				}
				if(this.hasXDR()) {
					this.xhr.onload = this.xhr.onerror = empty;
				} else {
					this.xhr.onreadystatechange = empty;
				}

				try {
					this.xhr.abort();
				} catch(e) {}

				//if(window && window.document) {
					delete Request.requests[this.index];
				//}
				this.xhr = null;
			}
			this.onLoad = function() {
				var data;
				try {
					var contentType;
					try {
						contentType = this.xhr.getResponseHeader("Content-Type").split(";")[0];
					} catch(e) {};
					if(contentType === "application/octet-stream") {
						data = this.xhr.response;
					} else {
						if(!this.supportsBinary) {
							data = this.xhr.responseText;
						} else {
							data = "ok";
						}
					}
				} catch(e) {
					this.onError(e);
				}
				if(null != data) {
					this.onData(data);
				}
			};

			this.hasXDR = function() {
				if(window) {
					return 'undefined' !== typeof window.XDomainRequest && !this.xs && this.enablesXDR;
				} else {
					return "undefined" !== !this.xs && this.enablesXDR;
				}
				
			}
			this.abort = function() {
				this.cleanup();
			}

		}).call(Request.prototype);

		(function() {
			this.requestsCount = 0;
			this.requests = {};

			if(window) {
				if(window.attachEvent) {
					window.attachEvent("onunload", unloadHandler);
				} else if(window.addEventListener) {
					window.addEventListener("beforeunload", unloadHandler);
				}
			}

			var unloadHandler = function() {
				for(var i in Request.requests) {
					if(Request.requests.hasOwnProperty(i)) {
						Request.requests[i].abort();
					}
				}
			}
		}).call(Request);
		module.exports = Request;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });