
      var lib = require("../lib")
          , events = require("../events")
          , empty = function() {}
          , Request
          , XMLHttpRequest;
      var defaultHeaders = {

      };
      if(lib.isWindow) {
          XMLHttpRequest = window.XMLHttpRequest;
          Request = function(opts) {
              this.method = opts.method || "GET";
              this.uri = opts.uri;
              this.data = opts.data;
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

              this.headers = lib.merger(defaultHeaders, opts.headers);
              this.create();
          }
          lib.inherits(Request, events);
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
                      cert: this.cert,
                      ca: this.ca,
                      ciphers: this.ciphers,
                      rejectUnauthorized: this.rejectUnauthorized
                  });
                  var self = this;
                  try {
                     xhr.open(this.method, this.uri, this.async);
                     if("withCredentials" in xhr) {
                        xhr.withCredentials = true;
                     }
                     try {
                          if(this.headers) {
                              //xhr.setDisableHeaderCheck(true);
                              for(var i in this.headers) {
                                  if(this.headers.hasOwnProperty(i)) {
                                      xhr.setRequestHeader(i, this.headers[i]);
                                  }
                              }
                          }
                     }catch(e) {
                        console.log("setHeader error", e);
                     }
                     if(this.hasXDR()) {
                        xhr.onload = function() {
                            self.onLoad();
                        }
                        xhr.onerror = function() {
                            self.onError(xhr.responseText);
                        }
                     } else {
                        xhr.onreadystatechange = function() {
                            if(4 != xhr.readyState) return;
                            if(200 == xhr.status || 1223 == xhr.status) {
                                self.onLoad();
                            }else{
                                lib.nextTick(function(){
                                    self.onError(xhr.status);
                                });
                            }
                        }
                     }
                     xhr.send(this.data);
                  } catch(e) {
                      return lib.nextTick(function() {
                            self.onError(e);
                      });
                  }
                  if(Request.requests) {
                      this.index = Request.requests.requestsCount++;
                      Request.requests[this.index] = this;
                  }
              }

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
                  this.cleanup(true);
              }

              this.cleanup = function(fromError) {
                  if("undefined" == typeof this.xhr || null == this.xhr) {
                      return;
                  }
                  if(this.hasXDR()) {
                      this.xhr.onload = this.xhr.onerror = empty;
                  }else{
                      this.xhr.onreadystatechange = empty;
                  }
                  if(fromError) {
                      try {
                          this.xhr.abort();
                      }catch(e) {

                      }
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
                      }catch(e) {}
                      if(contentType == "application/octet-stream") {
                          data = this.xhr.response;
                      }else{
                          if(!this.supportsBinary) {
                              data = this.xhr.responseText;
                          } else {
                              var Buffer = require("./buffer");
                              data = String.fromCharCode.apply(null, new Buffer(this.xhr.response));
                          }
                      }
                  } catch(e) {
                      this.onError(e);
                  }
                  if( null != data) {
                      this.onData(data);
                  }
              }

              this.hasXDR = function() {
                  return (!window || "undefined" !== typeof window.XDomainRequest) && !this.xs && this.enablesXDR;
              }

              this.abort = function() {
                  this.cleanup();
              }
              if(window.attachEvent) {
                window.attachEvent("onunload", Request.unloadHandler);
              }else{
								window.addEventListener("beforeunload", Request.unloadHandler, false);
							}

          }).call(Request.prototype);
      }else{
        var URL = require("url");
        var Request = function(opts) {
            this.uri = opts.uri;
            this.method = opts.method || "GET";
            this.data = opts.data;
            this.encoding = opts.encoding ;
            this.headers = lib.merger(defaultHeaders, opts.headers);
            this.create();
        };
        lib.inherits(Request, events);
        (function() {
            this.create = function() {
                var self = this;
                var opts = URL.parse(this.uri);
                console.log(opts);
                opts.method = this.method;
                //opts.pathname = encodeURIComponent(opts.pathname);
               
                var handleName = opts.protocol.substring(0,  opts.protocol.length -1) || "http";
                var handle = require(handleName);
								var Domain = require("domain");
								var domain = Domain.create();
								domain.on("error", function(err) {
										self.onError(err);
								});
								domain.run(function() {
									var req = this.req = handle.request(opts, function(res) {
											if(res.statusCode != 200) {
													return self.onError(res.statusCode);
											}
											self.emit("headers", res.headers);
											if(self.encoding) {
                           res.setEncoding(self.encoding);
                      }
                     
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
									req.end(self.data);
									if(Request.requests) {
											self.index = Request.requests.requestsCount++;
											Request.requests[self.index]  = self;
									}
								});

            }
            this.onError = function(error) {
                this.emit("error", error);
                this.cleanup(true);
            }
            this.onData = function(data, type) {
                this.emit("data", data, type);
                this.cleanup(false);
            }
            this.cleanup = function(fromError) {
                if("undefined" == typeof this.req || null == this.req) {
                    return;
                }
                this.onData = this.onError = empty;
                if(fromError) {
                    try {
                        this.req.abort();
                    }catch(e){}
                }
                if(Request.requests) {
                    delete Request.requests[this.index];
                }
                this.req = null;
            }
        }).call(Request.prototype);

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
                  var pairs = qs.split("&");
                  for(var i = 0, l = pairs.length; i < l; i++) {
                      var pair = pairs[i].split("=");
                      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                  }
                  return qry;
              }

              this.get = function(uri, data, opts, onData, onError) {
                  if(lib.isFunction(opts)) {
                      onError = onData;
                      onData = opts;
                      opts = {};
                  }
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
                          if(lib.isString(data)) {
                              return data;
                          }
                          var keys = Object.keys(data);
                          headers["x-file-name"] = keys[0];
                          return data[keys[0]];
                      break;
                      default:
                          return data.toString();
                      break;
                  }
              }
          this.post = function(uri, data, opts, onData, onError) {
              if(lib.isFunction(opts)) {
                  onError = onData;
                  onData = opts;
                  opts = {};
              }
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
 