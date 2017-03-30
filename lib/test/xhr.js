(function() {
		//class Request
		var latte_lib = require("../basic/lib.js");
		var events = require("../basic/events.js");

		var utils = {
			type: function(str) {
				return str.split(/ *; */).shift();
			},
			params: function(str) {
				return str.split(/ *; */).reduce(function(obj, str){
				    var parts = str.split(/ *= */);
				    var key = parts.shift();
				    var val = parts.shift();

				    if (key && val) obj[key] = val;
				    return obj;
				  }, {});
			},
			parseLinks: function(str) {
				return str.split(/ *, */).reduce(function(obj, str){
				    var parts = str.split(/ *; */);
				    var url = parts[0].slice(1, -1);
				    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
				    obj[rel] = url;
				    return obj;
			  	}, {});
			}
		};
		var Response;
		var STATUS_CODES = { '100': 'Continue',
		  '101': 'Switching Protocols',
		  '102': 'Processing',
		  '200': 'OK',
		  '201': 'Created',
		  '202': 'Accepted',
		  '203': 'Non-Authoritative Information',
		  '204': 'No Content',
		  '205': 'Reset Content',
		  '206': 'Partial Content',
		  '207': 'Multi-Status',
		  '208': 'Already Reported',
		  '226': 'IM Used',
		  '300': 'Multiple Choices',
		  '301': 'Moved Permanently',
		  '302': 'Found',
		  '303': 'See Other',
		  '304': 'Not Modified',
		  '305': 'Use Proxy',
		  '307': 'Temporary Redirect',
		  '308': 'Permanent Redirect',
		  '400': 'Bad Request',
		  '401': 'Unauthorized',
		  '402': 'Payment Required',
		  '403': 'Forbidden',
		  '404': 'Not Found',
		  '405': 'Method Not Allowed',
		  '406': 'Not Acceptable',
		  '407': 'Proxy Authentication Required',
		  '408': 'Request Timeout',
		  '409': 'Conflict',
		  '410': 'Gone',
		  '411': 'Length Required',
		  '412': 'Precondition Failed',
		  '413': 'Payload Too Large',
		  '414': 'URI Too Long',
		  '415': 'Unsupported Media Type',
		  '416': 'Range Not Satisfiable',
		  '417': 'Expectation Failed',
		  '418': 'I\'m a teapot',
		  '421': 'Misdirected Request',
		  '422': 'Unprocessable Entity',
		  '423': 'Locked',
		  '424': 'Failed Dependency',
		  '425': 'Unordered Collection',
		  '426': 'Upgrade Required',
		  '428': 'Precondition Required',
		  '429': 'Too Many Requests',
		  '431': 'Request Header Fields Too Large',
		  '451': 'Unavailable For Legal Reasons',
		  '500': 'Internal Server Error',
		  '501': 'Not Implemented',
		  '502': 'Bad Gateway',
		  '503': 'Service Unavailable',
		  '504': 'Gateway Timeout',
		  '505': 'HTTP Version Not Supported',
		  '506': 'Variant Also Negotiates',
		  '507': 'Insufficient Storage',
		  '508': 'Loop Detected',
		  '509': 'Bandwidth Limit Exceeded',
		  '510': 'Not Extended',
		  '511': 'Network Authentication Required'
		};
		var Request = function(method, url) {
			console.log(method, url);
			this.method = method;
			this.url = url;
			//对外保存的小写头属性
			this._headers = {};
			//保存原来header头属性
			this.headers = {};
		};
		latte_lib.extends(Request, events);
		(function() {
			var self = this;
			var setsMap = {
				type: "Content-type",
				accept: "Accept"
			};
			
			Object.keys(setsMap).forEach(function(i) {
				self[i] = function(type) {
					this.set(setsMap[i], request.types[type] || type);
					return this;
				};
			});
			//设置头文件
			this.set = this.setHeader= function(field, val) {
				if(latte_lib.isObject(field)) {
					for(var key in field) {
						this.set(key, field[key]);
					}
					return this;
				}
				this.headers[field.toLowerCase()] = val;
				this.headers[field] = val;
			}
			this.get  = this.getHeader = function(field) {
				this._headers[field.toLowerCase()];
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
	              	var serialize  = function(obj, sep, eq) {
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
				var serialize = function() {
					if(!latte_lib.isObject(obj)) return obj;
					var pairs = [];
					for(var key in obj) {
						pushEncodeKeyValuePair(pairs, key, object[key]);
					}
					return pairs.join("&");
				}
			this.query = function(val) {
				if(!latte_lib.isString(val)) {
					val = serialize(val);
				}
				if(val) {
					this._query.push(val);
				}
				return this;
			}

			this.send = function(data) {
				var isObj = latte_lib.isObject(data);
				var type = this._headers["content-type"];
				if (this._formData) {
					console.error(".send() can't be used if .attach() or .field() is used. Please use only\
						 .send() or only .field() &.attach()");
				}
				if (isObj && !this._data) {
					if(Array.isArray(data)) {
						this._data = [];
					}else if(!this._isHost(data)){
						this._data = {};
					}
				}else if(data && this._data && this._isHost(this.data)) {
					throw Error("Can't merge these send calls");
				}
				if(isObj && latte_lib.isObject(this._data)) {
					for(var key in data) {
						this._data[key] = data[key];
					}
				}else if(latte_lib.isString(data)) {
					if(!type) {
						this.type("form");
					}
					type = this._headers["content-type"];
					if("application/x-www-form-urlencoded" == type) {
						this._data = this._data ? this._data + "&" + data : data;
					}else {
						this._data = (this._data || "") + data;
					}
				}else{
					this._data = data;
				}
				if(!isObj || this._isHost(data)) {
					return this;
				}
				if(!type) {
					this.type("json");
				}
				return this;
			}
			this.end = function(fn) {
				if(this._endCalled) {
					console.warn("Warning: .end() was called twice. This is not supported in superagent");
				}
				this._endCalled = true;
				this._callback = fn || noop;
				this._appendQueryString();
				return this._end();
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
				

			this._appendQueryString = function() {
				this._queryString = urlencode(this.qs);

			}
			this._setTimeouts = function() {
				var self = this;
				if(this._timeout && !this._timer) {
					this._timer = setTimeout(function() {
						self._timeoutError('Timeout of ', self._timeout, 'ETIME');
					}, this._timeout);
				}
				if(this._responseTimeout && !this._responseTimeoutTimer) {
					this._responseTimeoutTimer = setTimeout(function() {
						self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
					}, this._responseTimeout);
				}
			}

			this.callback = function(err, res) {
				if(this._maxRedirects && this._retries ++ < this._maxRedirects && shouldRetry(err, res)) {
					return this._retry();
				}
				var fn = this._callback || noop;
				this.clearTimeout();
				if(this.called) {
					return console.warn("superagent: double callback bug");
				}
				this.called = true;
				if(!err) {
					if(this._isResponseOK(res)) {
						return fn(err, res);
					}
					var msg = "Unsuccessful HTTP response";
					if(res) {
						msg = STATUS_CODES[res.status] || msg;
					}
					err = new Error(msg);
					err.status = res ? res.status : undefined;
				}
				err.response = res;
				if(this._maxRedirects) {
					err.retries = this._retries - 1;
				}
				if(err && this.hasListeners("error")) {
					this.emit("error", err);
				}
				fn(err, res);
			}
			this.clearTimeout = function() {
				clearTimeout(this._timer);
				clearTimeout(this._responseTimeout);
				delete this._timer;
				delete this._responseTimeoutTimer;
				return;
			}
			this._isResponseOK = function(res) {
				if(!res) {
					return false;
				}
				if(this._okCallback) {
					return this._okCallback(res);
				}
				return res.status >= 200 && res.status < 300;
			}
		}).call(Request.prototype);
	var urlencode = function(obj, sep, eq) {
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
	var request = function(method, url) {
		if(latte_lib.isFunction(url)) {
			return new Request("GET", method).end(url);
		}
		if(1 == arguments.length) {
			return new Request(method, url);
		}
		return new Request(method, url);
	};
	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};
	var self = this;
	this.request = function(method, url, data, fn) {
		var req = request(method, url);
		if(latte_lib.isFunction(data)) {
			fn = data;
			data = null;
		}
		if(data) {
			req.send(data);
		}
		if(fn) {
			req.end(fn);
		}
		return req;
	};
	["HEAD","GET", "POST", "PUT","PATCH", "DELETE"].forEach(function(o) {
		self[o.toLocaleLowerCase()] = function() {
			var args = Array.prototype.concat.call([o], Array.prototype.slice.call(arguments, 0));
			return self.request.apply(self, args);
		};
	});
	var mimeTypeV = {
		isJSON: function(mime) {
			return /[\/+]json\b/.test(mime);
		},
		isText: function(mime) {
			var parts = mime.split('/');
			var type = parts[0];
			var subtype = parts[1];

			return 'text' == type
			|| 'x-www-form-urlencoded' == subtype;
		},
		isImageOrVide: function(mime) {
			var type = mime.split('/')[0];
  			return 'image' == type || 'video' == type;
		}
	}
	var serializes = {
		"application/x-www-form-urlencoded": urlencode,
		"application/json" : JSON.stringify
	};
	function isRedirect(code) {
  		return ~[301, 302, 303, 305, 307, 308].indexOf(code);
	};
	if(latte_lib.env == "web" ) {
		(function() {
				var getXHR = function() {
					return new XMLHttpRequest();
				}
				var trim = "".trim? function(s) {
					return s.trim();
				}: function(s) {
					return s.replace(/(^\s*|\s*$)/g, "");
				}
				var parses = {
					"application/x-www-form-urlencoded": urlencode,
					"application/json": JSON.parse
				}
				var parseHeader = function(str) {
					var lines = str.split(/\r?\n/);
					var fields = {};
					var index;
					var line;
					var field;
					var val;
					lines.pop();
					for(var i = 0, len = lines.length; i < len; ++i) {
						line = lines[i];
						index = line.indexOf(":");
						field = line.slice(0, index).toLowerCase();
						val = trim(line.slice(index + 1));
						fields[field] = val;
					}
					return fields;
				};
				Response = function(req) {
					this.req = req;
					this.xhr = this.req.xhr;
					this.text = ((this.req.method != "HEAD") && (this.xhr.responseType === "" || this.xhr.responseType === "text" || typeof this.xhr.responseType === 'undefined')) 
						? this.xhr.responseText : null;
					this.statusText = this.req.xhr.statusText;
					var status = this.xhr.status;
					if(status == 1223) {
						status = 204;
					}
					this._setStatusProperties(status);
					this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
					this.header["content-type"] = this.xhr.getResponseHeader("content-type");
					this._setHeaderProperties(this.header);
					if(null === this.text && req._responseType) {
						this.body = this.xhr.response;
					} else {
						this.body = this.req.method != "HEAD" ? 
							this._parseBody(this.text ? this.text : this.xhr.response) : null;
					}
				};

				(function() {

					this._parseBody = function(str) {
						var parse = parses[this.type];
						if(this.req._parser) {
							return this.req._parser(this, str);
						}
						if(!parse && mimeTypeV.isJSON(this.type)) {
							parse = parses["application/json"];
						}
						if(parse && str && (str.length || str instanceof Object)) {
							try {
								return parse(str)
							}catch(err) {
								if(parse == parses["application/json"]) {
									str = str.replace(/\[,/img,"[null,").replace(/,\]/img, ",null]").replace(/,,/igm,",null,").replace(/,,/img,",null,");
									return parse(str);
								}
							}
						}else{
							return null;
						}
						
						
 					}
				}).call(Response.prototype);
			this._end = function() {
				var self = this;
				this.once("end", function() {
					var err = null;
					var res = null;
					try {
						res = new Response(self);
					}catch(err) {
						//err = new Error("Parser is unable to parse the response");
						err.parse = true;
						//err.original = e;
						if(self.xhr) {
							err.rawResponse = typeof self.xhr.responseType == "undefined" ? self.xhr.responseText : self.xhr.response;
							err.status = self.xhr.status ? self.xhr.status : null;
							err.statusCode = err.status;
						} else {
							err.rawResponse = null;
							err.status = null;
						}
						return self.callback(err);
					}
					self.emit("response", res);
					var new_err;
					try {
						if(!self._isResponseOK(res)) {
							new_err = new Error(res.statusText || "Unsuccessful HTTP response");
							new_err.original = err;
							new_err.response = res;
							new_err.status = res.status;
						}
					}catch(e) {
						new_err = e;
					}
					if(new_err) {
						self.callback(new_err, res);
					}else{
						self.callback(null, res);
					}
				});
				var xhr = this.xhr = getXHR();
				var data = this._formData || this._data;
				this._setTimeouts();
				xhr.onreadystatechange = function() {
					var readyState = xhr.readyState;
					if(readyState >= 2 && self._responseTimeoutTimer) {
						clearTimeout(self._responseTimeoutTimer);
					}
					if(4 != readyState) {
						return;
					}
					var status;
					try {
						status = xhr.status;
					}catch(e) {
						status = 0;
					}
					if(!status) {
						if(self.timeout || self._aborted) {
							return;
						}
						return self.crossDomainError();
					}
					self.emit("end");
				};
				var handleProgress = function(direction, e) {
					if(e.total > 0) {
						e.percent = e.loaded / e.total * 100;
					}
					e.direction = direction;
					self.emit("progress", e);
				}
				if(this.hasListeners("progress")) {
					try {
						xhr.onprogress = handleProgress.bind(null, "download");
						if(xhr.upload) {
							xhr.upload.onprogress = handleProgress.bind(null, "upload");
						}
					}catch(e) {

					}
				}
				try {
					if(this.username && this.password) {
						xhr.open(this.method, this.url, true, this.username, this.password);
					}else{
						xhr.open(this.method, this.url, true);
					}
				}catch(err) {
					return this.callback(err);
				}
				if(this._withCredentials) {
					xhr.withCredentials = true;
				}
				if(!this._formData && "GET" != this.method && "HEAD" != this.method 
						&& "string" != typeof data && !this._isHost(data)) {
					var contentType = this._headers["content-type"];
					var serialize = this._serializer || serializes[contentType ? contentType.split(";")[0]:""];
					if(!serialize && mimeTypeV.isJSON(contentType)) {
						serialize = serializes["application/json"];
					}
					if(serialize) {
						data = serialize(data);
					}
				}
				for(var field in this.header) {
					if(null == this.header[field]) {
						continue;
					}
					xhr.setRequestHeader(field, this.header[field]);
				}
				if(this._responseType) {
					xhr.responseType = this._responseType;
				}
				this.emit("request", this);
				xhr.send(typeof data !== "undefined" ? data: null);
				return this;
			}
			this._isHost = function _isHost(obj) {
			  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
			  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
			}
		}).call(Request.prototype);
	}else{
		var binary = function(res, fn) {
			var data = [];
			res.on("data", function(chunk) {
				data.push(chunk);
			});
			res.on("end", function() {
				fn(null, Buffer.concat(data));
			});
		};
		var qs = require("querystring");
		var parses = {
			"application/x-www-form-urlencoded": function(res, fn) {
				res.text = "";
				res.setEncoding("ascii");
				res.on("data", function(chunk) {
					res.text += chunk;
;				});
				res.on("end", function() {
					try {
						fn(null, qs.parse(res.text));
					}catch(err) {
						fn(err);
					}
				});
			},
			"application/json": function(res, fn) {
				res.text = "";
				res.setEncoding("utf8");
				res.on("data", function(chunk) {
					res.text += chunk;
				});
				res.on("end", function() {
					try {
						var body = res.text && JSON.parse(res.text);
					}catch(e) {
						var err = e;
						err. rawResponse = res.text || null;
						err.statusCode = res.statusCode;
					} finally {
						fn(err, body);
					}
				});
			},
			"text": function(res, fn) {
				res.text = "";
				res.setEncoding("utf8");
				res.on("data", function(chunk) {
					res.text += chunk;
				});
				res.on("end", fn);
			},
			"application/octet-stream": binary,
			"image": binary
		};
		(function() {
			var protocols = {
				"http:":require("http"),
				"https:": require("https")
			};
			Response = function(req) {
				
				var res = this.res = req.res;
				this.request = req;
				this.req = req.req;
				this.text = res.text;
				this.body = res.body != undefined ? res.body: {};
				this.header = this.headers = res.headers;
				this.files = res.files || {};
				this._setStatusProperties(res.statusCode);
				this._setHeaderProperties(this.header);
			};
			(function() {
				
				
			}).call(Response.prototype);
			this._emitResponse = function(body, files) {
				var response = new Response(this);
				this.response = response;
				response.redirects = this._redirectList;
				if(undefined !== body) {
					response.body = body;
				}
				response.files = files;
				this.emit("response", response);
				return response;
			}
			this.createReq = function() {
				if(this.req) {
					return this.req;
				}
				var self = this;
				var options = {};
				var url = this.url;
				var retres = this._retries;
				if( 0 != url.indexOf("http")) {
					url = "http://" + url;
				}
				url = require("url").parse(url);
				if(/^https?\+unix:/.test(url.protocol) === true) {
					url.protocol = url.protocol.split("+")[0] + ":";
					options.socketPath = unixParts[1].replace(/%2F/g, '/');
				 	url.pathname = unixParts[2];
				}
				options.method = this.method;
				options.port = url.port;
				options.path = url.pathname;
				options.host = url.hostname;
				options.ca = this._ca;
				options.key = this._key;
				options.pfx = this._pfx;
				options.cert = this._cert;
				options.agent = this._agent;
				var mod = protocols[url.protocol];
				var req = this.req = mod.request(options);
				if("HEAD" != options.method) {
					req.setHeader('Accept-Encoding', 'gzip, deflate');
				}
				this.protocol = url.protocol;
				this.host = url.host;
				req.once("drain", function() {
					self.emit('drain'); 
				});
				req.once("error", function(e) {
					if (self._aborted) return;
				    if (self._retries !== retries) return;
				    if (self.response) return;
				    self.callback(err);
				});
				if(url.auth) {
					var auth = url.auth.split(":");
					this.auth(auth[0], auth[1]);
				}
				//if(url.search) {
				//	this.query(url.search.substr(1));
				//}
				if(this.cookies) {
					req.setHeader('Cookie', this.cookies);
				}
				for(var key in this.header) {
					req.setHeader(key, this.header[key]);
				}

				try {
					this._appendQueryString(req);
				}catch(e) {
					return this.emit("error", e);
				}			
				return req;
			}
			this._shouldUnzip = function(res) {
				if (res.statusCode === 204 || res.statusCode === 304) {
				    // These aren't supposed to have any body
				    return false;
			  	}
			  	if("0" == res.headers["content-length"]) {
			  		return false;
			  	}
			  	return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
			}
			var URL = require("url");
			
			this._end = function() {
				var self = this;
				var data = this._data;
				this.createReq();
				var req = this.req;
				var buffer = this._buffer;
				var method = this.method;
				//设置定时器
				this._setTimeouts();
				//创建发送器
				
				//感觉这里可以放在end 函数里面
				//查看发送方式  不是head 和headerSent
				if ("HEAD" != method && !req.headerSent) {
					//判断data
					if(!latte_lib.isString(data)) {
						console.log(req);
						var contentType =  req.getHeader("Content-Type");
						if(contentType) {
							contentType = contentType.split(';')[0]
						}
						var serialize = serializes[contentType];
						if (!serialize && mimeTypeV.isJSON(contentType)) {
							serialize = serializes['application/json'];
						}
						if (serialize) data = serialize(data);
					}
					//设置length
					if(data && !req.getHeader("Content-Length")) {
						req.setHeader("Content-Length",  Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data));
					}
				}
				req.once("response", function(res) {
					if(self._responseTimeoutTimer) {
						clearTimeout(self._responseTimeoutTimer);
					}

					if(self.piped) {
						return;
					}
					//重定向次数
					var max = self._maxRedirects;
					//mime 类型
					var mime = utils.type(res.headers['content-type'] || '') || 'text/plain';
					var type = mime.split("/")[0];
					var multipart = "multipart" == type;
					//判断是否为重定项
					var redirect = isRedirect(res.statusCode);
					//重定向
					if (redirect && self._redirects++ != max) {
						return self._redirect(res);
					}
					var parser = self._parser;
					if("HEAD" == self.method) {
						self.emit("end");
						self.callback(null, self._emitResponse());
					}
					//暂时不支持unzip
					//if(self._shouldUnzip(res)) {
					//	unzip(req, res);
					//}
					if(!parser) {
						if(this._responseType) {
							parser = parses.image;
							buffer = true;
						} else if (multipart) {
							var form = new formidable.IncomingForm();
							parser = form.parse.bind(form);
							buffer = true;
						} else if(mimeTypeV.isImageOrVide(mime)) {
							parser = parses.image;
							buffer = true;
						} else if(parses[mime]) {
							parser = parses[mime];
						} else if("text" == type) {
							parser = parses.text;
							buffer = (buffer !== false);
						} else if(mimeTypeV.isJSON(mime)) {
							parser = parses["application/json"];
							buffer = (buffer !== false);
						} else if(buffer) {
							parser = parses.text;
						}
					}
					//判断mime类型 设置buffer
					if(undefined === buffer && isText(mime)  || mimeTypeV.isJSON(mime)) {
						buffer = true;
					} 

					var parserHandlesEnd = false;
					if(parser) {
						try {
							parserHandlesEnd = buffer;
							//解析
							parser(res, function(err, obj, files) {
								if(self.timedout) {
									return;
								} 
								if(err && !self._aborted) {
									return self.callback(err);
								}
								if(parserHandlesEnd) {
									self.emit("end");
									self.callback(null, self._emitResponse(obj, files));
								}
							});
						}catch(err) {
							self.callback(err);
							return;
						}
					}

					self.res = res;
					if(!buffer) {
						self.callback(null, self._emitResponse());
						if(multipart) return;
						res.once("end", function() {
							self.emit("end");
						});
						return;
					}
					res.once("error", function(err) {
						self.callback(err, null);
					});
					if(!parserHandlesEnd) {
						res.once("end", function() {
							self.emit("end");
							self.callback(null, self._emitResponse());
						});
					}
				});
				this.emit("request", this);
				var formData = this._formData;
				//formData 是个对象 暂时还没弄清楚是个什么对象
				if(formData) {
					var headers = formData.getHeaders();
					for(var i in headers) {
						req.setHeader(i, headers[i]);
					}
					formData.getLength(function(err, length) {
						//设置content -length
						if("number" == typeof length) {
							req.setHeader("Content-Length", length);
						}
						var getProgressMonitor = function() {
							var lengthComputable = true;
							var total = req.getHeader("Content-Length");
							var loaded = 0;
							var progress = new Stream.Transform();
							progress._transform = function(chunk, encoding, cb) {
								loaded += chunk.length;
								self.emit("progress", {
									direction: "upload",
									lengthComputable: lengthComputable,
									loaded: loaded,
									total: total
								});
								cb(null, chunk);
							};
							return progress;
						};
						formData.pipe(getProgressMonitor()).pipe(req);
					});

				}else {
					req.end(data);
				}
			}	
		}).call(Request.prototype);
	};	
	(function() {
		this._setHeaderProperties = function(header) {
			console.log(header);
			var ct = header["content-type"] || "";
			this.type = utils.type(ct);
			var params = utils.params(ct);
			for(var key in params) {
				this[key] = params[key];
			}
			this.links = {};
			try {
				if(header.link) {
					this.links = utils.parseLinks(header.link);
				}
			}catch(err) {

			}
		}
		this._setStatusProperties = function(status){
		    var type = status / 100 | 0;

		    // status / class
		    this.status = this.statusCode = status;
		    this.statusType = type;

		    // basics
		    this.info = 1 == type;
		    this.ok = 2 == type;
		    this.redirect = 3 == type;
		    this.clientError = 4 == type;
		    this.serverError = 5 == type;
		    this.error = (4 == type || 5 == type)
		        ? this.toError()
		        : false;

		    // sugar
		    this.accepted = 202 == status;
		    this.noContent = 204 == status;
		    this.badRequest = 400 == status;
		    this.unauthorized = 401 == status;
		    this.notAcceptable = 406 == status;
		    this.forbidden = 403 == status;
		    this.notFound = 404 == status;
		};
		this.toError = function(){
		  var req = this.req;
		  var method = req.method;
		  var url = req.url;

		  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
		  var err = new Error(msg);
		  err.status = this.status;
		  err.method = method;
		  err.url = url;

		  return err;
		};
	}).call(Response.prototype);
}).call(module.exports);