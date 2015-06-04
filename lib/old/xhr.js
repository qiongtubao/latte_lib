(function(define) { 'use strict';
	define("latte_lib/old/xhr", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {		
		var latte_lib = require("../lib")
			, events = require("../events")
			, empty = function() {}
			, Request
			, XMLHttpRequest;
		var defaultHeaders = {
			
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

				this.pfx = opts.pfx;
				this.key = opts.key;
				this.passphrase = opts.passphrase;
				this.cert = opts.cert;
				this.ca = opts.ca;
				this.ciphers = opts.ciphers;
				this.rejectUnauthorized = opts.rejectUnauthorized;

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
						enablesXDR: this.enablesXDR,
						pfx: this.pfx,
						key: this.key,
						passphrase: this.passphrase,
						cert : this.cert,
						ca: this.ca,
						ciphers: this.ciphers,
						rejectUnauthorized: this.rejectUnauthorized
					});
					var self = this;
					try {
						xhr.open(this.method, this.uri, this.async);
						//服务器需要设置Headers Access-Control-Allow-Credentials: true
						if("withCredentials" in xhr) {
							xhr.withCredentials = true;
						}
						try {
							if(this.headers) {
								xhr.setDisableHeaderCheck(true);
								for(var i in this.headers) {
									if (this.headers.hasOwnProperty(i)) {
										xhr.setRequestHeader(i, this.headers[i]);
									}
								}
							}
						}catch(e) {	}

						
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
					this.cleanup(true);
				}
				this.cleanup = function(fromError) {
					if("undefined" == typeof this.xhr || null == this.xhr) {
						return;
					}
					if(this.hasXDR()) {
						this.xhr.onload= this.xhr.onerror = empty;
					}else{
						this.xhr.onreadystatechange = empty;
					}
					if(fromError) {
						try {
							this.xhr.abort();
						} catch(e) {}
					}
					
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
								var Buffer = require("latte_lib/old/buffer");
								data = String.fromCharCode.apply(null, new Buffer(this.xhr.response));
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
			
			if (window.attachEvent) {
			    window.attachEvent('onunload',Request.unloadHandler);
		  	} else if (window.addEventListener) {
			    window.addEventListener('beforeunload', Request.unloadHandler, false);
		  	}
		} else {
			var URL = require("url");
			var Request = function(opts) {
				this.uri = opts.uri;
				this.method = opts.method || "GET";
				this.data = opts.data;
				this.encoding = opts.encoding || "utf8";
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
						if(res.statusCode != 200) {
							return self.onError(res.statusCode);
						}
						self.emit("headers", res.headers);
						res.setEncoding(self.encoding);
						var data = "";
						res.on("data", function(chunk) {
							self.emit("chunk", chunk);
							data += chunk.toString();
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
					this.cleanup(true);
				}
				this.onData = function(data, type) {
					this.emit("data", data, type);
					this.cleanup();
				}
				this.cleanup = function(fromError) {
					if("undefined" == typeof this.req || null == this.req) {
						return;
					}
					this.onData = this.onError = empty;
					if(fromError) {
						try {
							this.req.abort();
						} catch(e) {}
					}
					if(Request.requests) {
						delete Request.requests[this.index];
					}
					this.req = null;
				}
			}).call(Request.prototype);
			//process.on("exit", Request.unloadHandler);
		}
		(function() {
			this.requests = {};
			this.requestsCount = 0;
			var _self = this;
			this.unloadHandler = function() {
				for(var i in _self.requests) {
					if(_self.requests.hasOwnProperty(i)) {
						_self.requests[i].abort();
					}
				}
			}

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
				var urlencode = this.urlencode = function(obj, sep, eq) {
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
				var urldecode = this.urldecode = function(qs) {
					var qry = {};
					var pairs = qs.split('&');
					for (var i = 0, l = pairs.length; i < l; i++) {
						var pair = pairs[i].split('=');
						qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
					}
					return qry;
				}
				
			this.get = function(uri, data, opts, onData, onError) {
				if(latte_lib.isFunction(opts)) {
					onError = onData;
					onData = opts;
					opts = {};
				};
				opts.method = "GET";
				opts.uri = uri + "?" + urlencode(data);
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
							return urlencode(data);
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
				opts.headers["Content-length"] = opts.data.length;
				var req = new Request(opts);
				onData && req.on("data", onData);
				onError && req.on("error", onError);
				return req;
			}
			this.XMLHttpRequest = true;
			
		}).call(Request);
		module.exports = Request;
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });