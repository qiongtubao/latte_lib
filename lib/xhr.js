(function(define) { 'use strict';
	define("latte_lib/xhr", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {		
		var latte_lib = require("./lib")
			, events = require("./events")
			, empty = function() {}
			, Request
			, XMLHttpRequest;
		var defaultHeaders = {
			"Content-type": "text/plan"
		};
		if(window) {
			XMLHttpRequest = window.XMLHttpRequest;
			Request = function(opts) {
				this.method = opts.method || "GET";
				this.uri = opts.uri;
				this.data = opts.data ;
				this.async = false != opts.async;


				this.xd = !!opts.xd;
				this.xs = !!opts.xs;
				this.agent = opts.agent;
				this.enablesXDR = opts.enablesXDR;

				this.headers = latte_lib.merger(defaultHeaders, opts.headers);
				this.create();
			};
			latte_lib.inherits(Request, events);
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
						//服务器需要设置Headers Access-Control-Allow-Credentials: true
						xhr.withCredentials = true;
						for(var i in this.headers) {
							xhr.setRequestHeader(i, this.headers[i]);
						}
						if(this.hasXDR()) {
							xhr.onload = function() {
								self.onLoad();
							}
							xhr.onerror= function() {
								self.onError(xhr.responseText);
							}
						} else {
							xhr.onreadystatechange = function() {
								if( 4 != xhr.readyState) return;
								if(200 == xhr.status || 1223 == xhr.status) {
									self.onLoad();
								}else{
									latte_lib.nextTick(function() {
										self.onError(xhr.status);
									});
								}
							}
						}
						xhr.send(this.data);
					} catch (e) {
						return latte_lib.nextTick(function() {
							self.onError(e);
						});
					}
					if(Request.requests) {
						this.index = Request.requests.requestsCount++;
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
				}
				this.onError = function(err) {
					this.emit("error", err);
					this.cleanup();
				}
				this.cleanup = function() {
					if("undefined" == typeof this.xhr || null == this.xhr) {
						return;
					}
					if(this.hasXDR()) {
						this.xhr.onload= this.xhr.onerror = empty;
					}else{
						this.xhr.onreadystatechange = empty;
					}
					try {
						this.xhr.abort();
					} catch(e) {}
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
						} catch(e) {}
						if(contentType == "application/octet-stream") {
							data = this.xhr.response;
						}else {
							if(!this.supportsBinary) {
								data = this.xhr.responseText;
							} else {
								data = "ok";
							}
						}
					}catch(e) {
						this.onError(e);
					}
					if(null != data) {
						this.onData(data);
					}
				}
				this.hasXDR = function() {
					return (!window || "undefined" !== typeof window.XDomainRequest) && !this.xs && this.enablesXDR;
				}
				this.abort = function() {
					this.cleanup();
				}
			}).call(Request.prototype);
		} else {
			var URL = require("url");
			var Request = function(opts) {
				this.uri = opts.uri;
				this.method = opts.method || "GET";
				this.data = opts.data;
				this.headers = latte_lib.merger(defaultHeaders, opts.headers);
				this.create();
			};
			latte_lib.inherits(Request, events);
			(function() {
				this.create = function() {
					var self = this;
					var opts = URL.parse(this.uri);
					opts.method = this.method;
					var headName = opts.protocol.substring(0, opts.protocol.length -1);
					var head = require(headName);
					opts.headers = this.headers;
					var req = this.req = head.request(opts, function(res) {
						res.setEncoding("utf8");
						var data = "";
						res.on("data", function(chunk) {
							data += chunk;
						});
						res.on("end", function() {
							self.onData(data, res.headers);
						});
					});
					req.on("error", function(error) {
						self.onError(error);
					});
					req.end(this.data);
					if(Request.requests) {
						this.index = Request.requests.requestsCount++;
						Request.requests[this.index] = this;
					}
				}
				this.onError = function(error) {
					this.emit("error", error);
					this.cleanup();
				}
				this.onData = function(data, type) {
					this.emit("data", data, type);
					this.cleanup();
				}
				this.cleanup = function() {
					if("undefined" == typeof this.req || null == this.req) {
						return;
					}
					this.onData = this.onError = empty;
					try {
						this.req.abort();
					} catch(e) {}
					if(Request.requests) {
						delete Request.requests[this.index];
					}
					this.req = null;
				}
			}).call(Request.prototype);
		}
		(function() {
			this.requests = {
				requestsCount: 0
			};
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
				var urlencoded = function(obj, sep, eq) {
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
			this.get = function(uri, data, opts, onData, onError) {
				if(latte_lib.isFunction(opts)) {
					onError = onData;
					onData = opts;
					opts = {};
				};
				opts.uri = uri + "?" + urlencoded(data);
				var req = new Request(opts);
				onData && req.on("data", onData);
				onError && req.on("error", onError);
				return req;
			}

					var getType = function(headers) {
						if(!headers["Content-type"]) {
							return "text";
						}
						if(headers["Content-type"].match(/octet-stream/i)) {
							return "octet-stream";
						}
						if(headers["Content-type"].match(/urlencoded/i)) {
							return "urlencoded";
						}
						/*if(headers["Content-type"].match(/multipart/i)) {
							return "multipart";
						}*/
						if(headers["Content-type"].match(/json/i)) {
							return "json";
						}
						if(headers["Content-type"].match(/text/i)) {
							return "text";
						}
					}
				
				var getData = function(data, headers) {
					switch(getType(headers)) {				
						case "urlencoded":
							return urlencoded(data);
						break;
						case "json":
							return JSON.stringify(data);
						break;
						case "octet-stream":
							if(latte_lib.isString(data)) {
								return data;
							}
							var keys = Object.keys(data);
							headers["x-file-name"]= keys[0];
							return data[keys[0]];												
						break;
						default :
							return data.toString();
						break;
					}


				}
			this.post = function(uri, data, opts, onData, onError) {
				if(latte_lib.isFunction(opts)) {
					onError = onData;
					onData = opts;
					opts = {};
				};
				opts.method = "POST";
				opts.headers = opts.headers || {};
				opts.uri = uri;
				opts.data = getData(data, opts.headers);
				var req = new Request(opts);
				onData && req.on("data", onData);
				onError && req.on("error", onError);
				return req;
			}
		}).call(Request);
		module.exports = Request;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });