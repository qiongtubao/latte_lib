	var latte_lib = require("./lib.js")
		, events = require("./events.js");
	var LatteArray = function(data) {
		var self = this;
		this.data = [];

		var doEvent = function(name, value, oldValue) {
			var index = self.data.indexOf(this);
			self.emit(index + "." + name, value, oldValue, data);
			self.emit("change", index + "." + name, value, oldValue, data);
		}
		data.forEach(function(o, i) {
			var n = LatteObject.create(o);
			if(n) {
				n.on("change", doEvent);
				//console.log("equ",doEvent.bind(n) == doEvent.bind(n));
				self.data[i] = n;
			}else{
				self.data[i] = o;
			}
		});
		var set = function(key, value) {
			if(!latte_lib.isArray(key)) {
				key = key.toString().split(".");
			}
			if(key.length == 1) {
				var k = key[0];
				var ov = self.data[k];
				var nv;
				if(LatteObject.isLatteArray(value)) {
					if(!LatteObject.isLatteObject(ov)) {
						ov.off("change", doEvent);
						self.data[k] = value;
						data[k] = value.toJSON();
					}else if(LatteObject.isLatteArray(ov)) {
						var okeys = ov.getKeys()
							, nkeys = value.getKeys();
						var separateData = separate(okeys, nkeys);
						separateData.oa.forEach(function(ok) {
							self.data[k].set(ok, null);
						});
						nkeys.forEach(function(ok) {
							self.data[k].set(ok, value.get(ok));
						});
					}else{
						self.data[k] = value;
						data[k] = value.toJSON();
					}
				}else if(LatteObject.isLatteObject(value)) {

					if(!LatteObject.isLatteObject(ov)) {
						//ov.off("change", self.childEvents[key]);
						self.data[k] = value;
						data[k] = value.toJSON();
					}else if(LatteObject.isLatteArray(ov)) {
						ov.off("change",doEvent);
						self.data[k] = value;
						data[k] = value.toJSON();

					}else{
						var oks = ov.getKeys()
							, vks = value.getKeys();
						var separateData = separate(okeys, nkeys);
						separateData.oa.forEach(function(ok) {
							self.data[k].set(ok, null);
						});
						nkeys.forEach(function(ok) {
							self.data[k].set(ok, value.get(ok));
						});
						

					}
				}else if(latte_lib.isObject(value)){
					var add = function() {
							var o = LatteObject.create(value);
						
							self.data[k] = o;
							data[k] = value;
							o.on('change', doEvent);
						}
					if(!LatteObject.isLatteObject(ov) ) {
						add();
					}else if(LatteObject.isLatteArray(ov)){
						ov.off("change", doEvent);
						add();
					}else{
						//object -> object
						var nkeys = Object.keys(value);
						var okeys = Object.keys(data[k]);
						var separateData = separate(okeys, nkeys);
						separateData.oa.forEach(function(ok) {
							self.data[k].set(ok, null);
						});
						nkeys.forEach(function(ok) {
							self.data[k].set(ok, value[ok]);
						});
					}
							
				}else if(latte_lib.isArray(value)){
						var add = function() {
							var o = LatteObject.create(value);
					
							o.on('change', doEvent);
							self.data[k] = o;
							data[k] = value;
						}
					if(!LatteObject.isLatteObject(ov) ) {
						add();
					}else if(LatteObject.isLatteArray(ov)){
						var nkeys = Object.keys(value);
						var okeys = Object.keys(data[k]);
						var separateData = separate(okeys, nkeys);
						separateData.oa.forEach(function(ok) {
							self.data[k].set(ok, null);
						});
						nkeys.forEach(function(ok) {
							self.data[k].set(ok, value[ok]);
						});
					}else{
						ov.off("change", doEvent);
						add();
					}
				}else{
					if(LatteObject.isLatteObject(ov)) {
						ov.off("change", doEvent);
					}
					nv = value;
					self.data[k] = value; 
					data[k] = value;
				}	
				return {
					ov: ov, 
					nv: nv
				}
			}else{
				var k = key.shift();
				return self.get(k).set(key, value);
			}
			//data[key] = value;

		}
		var set_ = function(key, value) {

			data[key] = value;
			var ov = self.data[key];
			var nv ;
			if(LatteObject.isLatteObject(ov)) {
				console.log(ov._events);
			}
				nv = LatteObject.create(value);
				if(nv) {
					nv.on("change", doEvent);
					/**
					self.data[key] = nv;
					nv.getKeys().forEach(function(k) {

						self.emit(key+"."+k, nv.get(k));
					});
					*/

				}else{
					self.data[ key] = nv = value;					
				}
			return {
				ov: ov,
				nv: nv
			};
		}
		
		this.get = function(key) {
			if(key == "this" &&  !self.data[key]) {
				return self.data;
			}
			if(!latte_lib.isArray(key)) {
				key = key.toString().split(".");
			}
			
			var v = self;
			if(key.length == 1) {
				return self.data[key[0]];
			}else{
				var k = key.shift();
				return self.data[k].get(key);
			}
			//return self.data[key];
		}
		this._set = set;
		this.set = function(key, value) {
			var data = set(key, value);
			self.emit("set", key, data.nv, data.ov);
			self.emit("change", key, data.nv, data.ov);
			return data;
		}
		this.push = function(o) {
			var key = self.data.length;
			var data = set(key, o);
			self.emit("push", key, data.nv);
			self.emit("change", key, data.nv);
		}
		this.pop = function() {
			var data = set(self.length - 1, null);
			self.data.pop();
			self.emit("pop",  data.ov);
			self.emit("change", self.length, null, data.ov);
		}


		this.shift = function() {
			var old = self.data.shift();
			old.off("change", doEvent);
			self.emit("shift", old);

			for(var i = 0, len = self.data.length; i < len; i++) {
				self.emit("change", i, self.data[i]);
			}
			self.emit("change", self.data.length, null);
		}
		this.unshift = function() {
			var args = Array.prototype.map.call(arguments, function(value) {
				var o = LatteObject.create(value);
				if(o) {
					o.on("change", doEvent);
				}
				return o || value;
			});
			self.data.unshift.apply(self.data, args);
			self.emit.apply(self, ["unshift"].concat(args));

			for(var i = 0, len = self.data.length; i < len; i++) {
				self.emit("change", i, self.data[i]);
			}
		}

		this.splice = function(startIndex, num) {
			var oLength = self.data.length;
			var adds = Array.prototype.splice.call(arguments, 2);
			var addOs = adds.map(function(o) {
				var n = LatteObject.create(o);
				if(n) {
					n.on("change", doEvent);
				}
				return n || o;
			});

			self.data.splice.apply(self.data, [startIndex, num].concat(addOs));
			console.log(["splice",startIndex, num].concat(addOs));
			self.emit.apply(self,  ["splice", startIndex, num].concat(addOs));
			
			for(var i = 0, len = Math.max(oLength, self.data.length); i < len; i++) {
				self.emit("change", i, self.data[i]);
			}
		} 

		this.toJSON = function() {
			return data;
		}


		//this.concat 不改变原来数组的
		this.indexOf = function(data) {
			return self.data.indexOf(data);
		}
		this.forEach = function(callback) {
			self.data.forEach(callback);
		};

		this.map = function(callback) {
			return self.data.map(callback);
		}

		Object.defineProperty(self, "length", {
			get: function() {
				return self.data.length;
			},
			set: function(value) {
				throw new Error("暂时没处理")
			}
		});


		this.getKeys = function() {
			return Object.keys(self.data);
		}
		/**
		this.emitPartner = function(key, partner, old) {
			this.getKeys().forEach(function(k) {	
				if(LatteObject.isLatteObject( self.get(k))) {
					self.get(k).emitPartner(key + "."+k, partner);
				}else{
					partner.emit(key + "." + k, self.get(k), old.get(key + "." + k));
				}
			});
		}
		*/

	};
	latte_lib.inherits(LatteArray, events);
	(function() {
		
	}).call(LatteArray.prototype);
		
		var separate = function(o, n) {
			var oa = []
				, na = latte_lib.copy(n)
				, sa = [];
			o.forEach(function(i, index) {
				var ni = na.indexOf(i);
				if(ni != -1) {
					na.splice(ni, 1);
					sa.push(i);
				}else{
					oa.push(i);
				}
			});
			return  {
				oa: oa,
				na: na,
				sa: sa
			};

		}
	var LatteObject = function(data) {

		
			var self = this;
			this.childEvents = {};
			self.data = {};
			for(var i in data) {	
				//		
				var l = LatteObject.create(data[i]);
				if(l) {
					self.childEvents[i] = function(name, value, oldValue) {
						self.emit(i+"."+name, value, oldValue, data);
						self.emit("change", i+"."+name, value, oldValue, data);
					};
					l.on("change", self.childEvents[i]);	
					self.data[i] = l;
				}else{
					self.data[i] = data[i];
				}		
			}
				
				var set =  function(key, value) {
					if(!latte_lib.isArray(key)) {
						key = key.toString().split(".");
					}
					var k = key[0];
					if(key.length == 1) {
						var ov = self.data[k];
						var od = data[k];
						var nv;
						if(LatteObject.isLatteArray(value)) {
							if(!LatteObject.isLatteObject(ov)) {
								ov.off("change", self.childEvents[key]);
								self.data[k] = value;
								data[k] = value.toJSON();
							}else if(LatteObject.isLatteArray(ov)) {
								var okeys = ov.getKeys()
									, nkeys = value.getKeys();
								var separateData = separate(okeys, nkeys);
								separateData.oa.forEach(function(ok) {
									self.data[k].set(ok, null);
								});
								nkeys.forEach(function(ok) {
									self.data[k].set(ok, value.get(ok));
								});
							}else{
								self.data[k] = value;
								data[k] = value.toJSON();
							}
						}else if(LatteObject.isLatteObject(value)) {
							
							if(!LatteObject.isLatteObject(ov)) {
								//ov.off("change", self.childEvents[key]);
								self.data[k] = value;
								data[k] = value.toJSON();
							}else if(LatteObject.isLatteArray(ov)) {
								ov.off("change", self.childEvents[key]);
								self.data[k] = value;
								data[k] = value.toJSON();
							}else{
								var oks = ov.getKeys()
									, vks = value.getKeys();
								var separateData = separate(okeys, nkeys);
								separateData.oa.forEach(function(ok) {
									self.data[k].set(ok, null);
								});
								nkeys.forEach(function(ok) {
									self.data[k].set(ok, value.get(ok));
								});
								

							}
						}else if(latte_lib.isObject(value)){
						
								var add = function() {
									var o = LatteObject.create(value);
									
									self.childEvents[k] = function(name, value, oldValue) {
										self.emit(k + "." + name, value, oldValue, data);
										self.emit("change", k+"."+name, value, oldValue, data);
									}
									o.on('change', self.childEvents[k]);
									self.data[k] = o;
									data[k] = value;
								}
							if(!LatteObject.isLatteObject(ov) ) {
								add();
							}else if(LatteObject.isLatteArray(ov)){
								ov.off("change", self.childEvents[key]);
								add();
							}else{
								//object -> object
								var nkeys = Object.keys(value);
								var okeys = Object.keys(data[k]);
								var separateData = separate(okeys, nkeys);
								separateData.oa.forEach(function(ok) {
									self.data[k].set(ok, null);
								});
								nkeys.forEach(function(ok) {
									self.data[k].set(ok, value[ok]);
								});
							}
							
							
						}else if(latte_lib.isArray(value)){
								var add = function() {
									var o = LatteObject.create(value);
									
									self.childEvents[k] = function(name, value, oldValue) {
										self.emit(k + "." + name, value, oldValue, data);
										self.emit("change", k+"."+name, value, oldValue, data);
									}
									o.on('change', self.childEvents[k]);
									self.data[k] = o;
									data[k] = value;
								}
							if(!LatteObject.isLatteObject(ov) ) {
								add();
							}else if(LatteObject.isLatteArray(ov)){
								var nkeys = Object.keys(value);
								var okeys = Object.keys(data[k]);
								var separateData = separate(okeys, nkeys);
								separateData.oa.forEach(function(ok) {
									self.data[k].set(ok, null);
								});
								nkeys.forEach(function(ok) {
									self.data[k].set(ok, value[ok]);
								});
							}else{
								ov.off("change", self.childEvents[key]);
								add();
							}
						
						}else{
							if(LatteObject.isLatteObject(ov)) {
								ov.off("change", self.childEvents[key]);
							}
							nv = value;
							if(value == null) {
								delete self.data[key[0]];
								delete data[key[0]];
							}else{
								self.data[ key[0]] = value;
								data[key[0]] = value; 
							}
							
						};	
						
						return {
							ov: ov, 
							nv: nv
						};
					}else{
						var k = key.shift();
						return self.get(k).set(key, value);
					}
						//data[key] = value;					
				}
					this._set = set;
					this.set = function(key, value) {
						
						var data = set(key, value);
						self.emit(key, data.nv, data.ov);
						self.emit("change", key, data.nv, data.ov);
						return data;
					}
				this._set_ = function(key, value) {
					data[key] = value;
					var oldValue = self.data[key];
					if(LatteObject.isLatteObject(oldValue)) {
						self.data[key].off("change", self.childEvents[key]);
					}
					var nowValue = LatteObject.create(value);
					
					if(nowValue) {
						self.childEvents[key] = function(name, value, oldValue) {
							self.emit(i + "." + name, value, oldValue, self.data[key]);
							self.emit("change", i + "." + name, value, oldValue, self.data[key]);
						}
						nowValue.on("change", self.childEvents[key]);
						self.data[key] = nowValue;												
					}else{						
						nowValue = value;	
						self.data[key] = value;					
					}
					return {
						ov: oldValue,
						nv: nowValue
					};
				}
				this.get = function(key) {
					if(key == "this" &&  !self.data[key]) {
						return self.data;
					}
					if(!latte_lib.isArray(key)) {
						key = key.toString().split(".");
					}
					
					var v = self;
					if(key.length == 1) {
						return self.data[key[0]];
					}else{
						var k = key.shift();
						return self.data[k].get(key);
					}
					//return self.data[key];
				}

				this.toJSON = function() {
					return data;
				}
				
				this.getKeys = function() {
					return Object.keys(self.data);
				}
				
		
	};
	latte_lib.inherits(LatteObject, events);
	(function() {
		
	}).call(LatteObject.prototype);
	(function() {
		this.isLatteArray= function(data) {
			return data.constructor == LatteArray;
		}
		this.isLatteObject = function(data) {
			return data && (
				data.constructor == LatteObject || 
				data.constructor == LatteArray
			);
		}
		this.getType = function(data) {
			if(LatteObject.isLatteObject(data)) {
				return "LatteObject";
			}
			if(Array.isArray(data)) {
				return "Array";
			}
			if(data && data.constructor == Object) {
				return "Object";
			}
		}
		this.create = function(data) {
			switch(LatteObject.getType(data)) {
				case "LatteObject":
					return data;
				break;
				case "Array":
					return new LatteArray(data);
				break;
				case "Object":
					return new LatteObject(data);
				break;
				default:
					return null;
				break;
			}
			
		}
	}).call(LatteObject);
	module.exports = LatteObject;