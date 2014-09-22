//must rewrite
latte.define("lib/http",["require", "exports", "module"], function(require, exports, module, window) {
	
	(function() {
		this.websocket = require("lib/http/websocket");
		this.xhr = require("lib/http/xhr");

	}).call(module.exports);
});

latte.define("lib/http/websocket", ["require", "exports", "module"], function(require, exports, module, window) {
	var WS = window.WebSocket || window.MozWebSocket;
	var Websocket = function(uri, protocols, opts) {
		var instance;
		if(protocols) {
			instance = new WS(uri, protocols);
		} else {
			instance = new WS(uri);
		}
		return instance;
	};
	if(WS) Websocket.prototype = WS.prototype;
	module.exports = WS? Websocket : null;
	
});

latte.define("lib/http/xmlhttprequest", ["require", "exports", "module"], function(require, exports, module, window) {
	var hasCORS = (function() {
		try {
			return "XMLHttpRequest" in global & "withCredentials" in new global.XMLHttpRequest();
		}catch(err) {
			return false;
		}

	})();
	var xr = function(opts) {
		var xdomain = opts.xdomain;
		try {
			if("undefined" != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
				return new XMLHttpRequest();
			}
		} catch(e) {}
		if(!xdomain) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {};
		}
	};
	module.exports = xr;
	
});


latte.define("lib/http/xhr", ["require", "exports", "module"], function(require, exports, module, window) {
	var latte_lib = require("latte_lib/lib")
		,EventEmitter = require("latte_lib/events").EventEmitter
		, empty = function() {};

	function Request(opts) {
		this.method = opts.method || "Get";
		this.uri = opts.uri;
		this.xd = !!opts.xd;
		this.xs = !!opts.xs;
		this.async = false !== opts.async;
		this.data = undefined != opts.data ? opts.data : null;
		this.agent = opts.agent;
		this.isBinary = opts.isBinary;
		this.supportsBinary = opts.supportsBinary;
		this.enablesXDR = opts.enablesXDR;
		this.create();
	};

	latte_lib.inherits(Request, EventEmitter);

	(function() {
		this.create = function() {
			var xhr = this.xhr = new XMLHttpRequest({agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR});
			var self = this;
			try {
				xhr.open(this.method, this.uri, this.async);
				if(this.supportsBinary) {
					xhr.responseType = "arraybuffer";
				}
				if("POST" == this.method) {
					try {
						if(this.isBinary) {
							xhr.setRequstHeader("Content-type", "application/octet-stream");
						} else {
							xhr.setRequstHeader("Content-type", "text/plain;charset=UTF-8");
						}
					} catch(e) {};
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
						if( 4 != xhr.readyState) return;
						if( 200 == xhr.status || 1223 == xhr.status) {
							self.onLoad();
						} else {
							setTimeout(function() {
								self.onError(xhr.status);
							}, 0);
						}
					};
				}
				xhr.send(this.data);
			}catch(e) {
				setTimeout(function() {
					self.onError(e);
				}, 0);
				return;
			}
			if(Request.requests) {
				this.index = Request.requestsCount++;
				Request.requests[this.index] = this;
			}
		};

		this.onSuccess = function() {
			this.emit("success");
			this.cleanup();
		};
		this.onData = function(data) {
			this.emit("data", data);
			this.onSuccess();
		};
		this.onError = function(err) {
			this.emit("error", err);
			this.cleanup();
		};
		this.cleanup = function() {
			if("undefined" == typeof this.xhr || null == this.xhr) {
				return;
			}
			if(this.hasXDR()) {
				this.xhr.onload = this.xhr.onerror = empty;
			} else {
				this.xhr.onreadystatechange = empty;
			}
			try {
				this.xhr.abort();
			} catch(e) {};
			if(Request.requests) {
				delete Request.requests[this.index];
			}
			this.xhr = null;
		};
		this.onLoad = function() {
			var data;
			try {
				var contentType;
				try {
					contentType = this.xhr.getResponseHeader("Content-Type");
				} catch(e) {}
				if(contentType == "application/octet-stream") {
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
			return "undefined" !== typeof window.XDomainRequest && !this.xs && this.enablesXDR;
		};
		this.abort = function() {
			this.cleanup();
		}
	}).call(Request.prototype);
	
	(function() {
		 var unloadHandler = function() {
		 	for(var i in Request.requests) {
		 		if(Request.requests.hasOwnProperty(i)) {
		 			Request.requests[i].abort();
		 		}
		 	}
		 }
		if(window.document) {
			Request.requestsCount = 0;
			Request.requests = {};
			if(window.attachEvent) {
				window.attachEvent("onunload", unloadHandler);
			} else if(window.addEventListener) {
				window.addEventListener("beforeunload", unloadHandler);
			}
		}
	}).call(Request);
	module.exports = Request;
});