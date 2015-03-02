(function(define) { 'use strict';
	define("latte_lib/xhr", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib")
			, Events = require("./events")
			, empty = function() {}
			, Request
			, XMLHttpRequest;


			
		if(window) {
			XMLHttpRequest = window.XMLHttpRequest;
			Request = function (opts) {
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
			latte_lib.inherits(Request, Events);
			(function() {
				this.create = function() {
					var xhr = this.xhr = new XMLHttpRequest({
						agent: this.agent, 
						xdomain: this.xd,
						xscheme: this.xs,
						enablesXDR: this.enablesXDR
					});
					var self = this;
					try {
						xhr.open(this.method, this.uri, this.async);
						xhr.withCredentials = true;
						if(this.supportsBinary) {
							xhr.responseType = "arraybuffer";
						}
						if("POST" == this.method) {
							try {
								if(this.isBinary) {
									xhr.setRequestHeader("Content-type", "application/octet-stream");
								}else{

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
								if( 4 != xhr.readyState ) return;
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
					} catch(e) {
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
					}catch(e) {}
					if(Request.requests) {
						delete Request.requests[this.index];
					}
					this.xhr = null;
				}
				this.onLoad = function() {
					var data;
					try {
						var contentType;
						try {
							contentType = this.xhr.getResponseHeader("Content-Type");
						} catch (e) {}
						if(contentType == "application/octet-stream") {
							data = this.xhr.response;
						} else {
							if(!this.supportsBinary) {
								data = this.xhr.responseText;
							} else {
								data = "ok";
							}
						}
					} catch (e) {
						this.onError(e);
					}
					if(null != data) {
						this.onData(data);
					}
				};
				this.hasXDR = function() {
					return (!window || "undefined" !== typeof window.XDomainRequest) && !this.xs && this.enablesXDR;
				}
				this.abort = function() {
					this.cleanup();
				}
			}).call(Request.prototype);
			
			
		}else{

			var  URL = require("url");
			var Request = function(opts) {
				this.uri = opts.uri;
				this.method = opts.method || "GET";
				this.data = opts.data;
				this.create();
			};
			latte_lib.inherits(Request, Events);
			(function() {
				this.create = function() {
					var self = this;
					var opts =URL.parse(this.uri);
					opts.method = this.method;
					var headName = opts.protocol.substring(0, opts.protocol.length -1);
					var head = require(headName);
					var req = head.request(opts, function(res) {
						res.setEncoding("utf8");
						var data = "";
						res.on("data", function(chunk) {
							data += chunk;
						});
						res.on("end", function() {
							self.emit("data", data);
						});
					});
					req.on("error", function(error) {
						self.emit("error", error);
					});
					this.data && req.write(this.data);
					req.end();					
				}
			}).call(Request.prototype);

			
		}


		(function() {
				var escape = function(str) {
					return encodeURIComponent(str);
				}
				var stringifyPrimitive = function(v) {
					switch(typeof v) {
						case "string":
						return v;
						case "boolean":
						return v? "true": "false";
						case "number":
						return isFinite(v)? v: "";
						case "object":
						return JSON.stringify(v);
						default:
						return "";
					}
				}
				var stringify = function(obj, sep, eq) {
					sep = sep || "&";
					eq = eq || "=";
					if(obj === null) {
						obj = undefined;
					}
					if(typeof obj === "object") {
						return Object.keys(obj).map(function(k) {
							var ks = escape(stringifyPrimitive(k)) + eq;
							if(Array.isArray(obj[k])) {
								return ks + escape(JSON.stringify(obj[k]));
							} else {
								return ks + escape(stringifyPrimitive(obj[k]));
							}
						}).join(sep);
					}
				}
				var unloadHandler = function() {
					if(Request.requests.hasOwnProperty(i)) {
						Request.requests[i].abort();
					}
				}
				if(window && window.document) {
					Request.requestsCount = 0;
					Request.requests = {};
					if(window.attachEvent) {
						window.attachEvent("onunload", unloadHandler);
					}else if(window.addeventListener) {
						window.addeventListener("beforeunload", unloadHandler);
					}
				}
				
			this.get = function(uri, data, onData, onError) {
				var req = new Request({
					uri: uri + "?" + stringify(data)
				});
				onData && req.on("data", onData);
				onError && req.on("error", onError);
				return req;
			}
			this.post = function(uri, data, onData, onError) {
				var req = new Request({
					uri: uri,
					method: "POST",
					data: stringify(data)
				});
				onData && req.on("data", onData);
				onError && req.on("error", onError);
				return req;
			}
			this.XMLHttpRequest = XMLHttpRequest;
		}).call(module.exports);

		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
