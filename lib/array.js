	var latte_lib = require("./lib.js")
		, events = require("./events.js")
		, LatteObject = require("./object");
		/*
			相关的splice 等返回事件  请返回latteObject 而不是Object对象   现在还没全修改完
			2016-7-7
		*/
	var LatteArray = function(data) {
		var self = this;
		this.data = [];
			var doEvent = function(name, value, oldValue) {
				var index = self.data.indexOf(this);
				if(index != -1) {
					self.emit(index + "." + name, value, oldValue, data);
					self.emit("change", index + "." + name, value, oldValue, data);
				}else{
					removeEvent(this);
				}
				
			};
			var addEvent = function(value) {
				
				value.on("change", doEvent);
				
			};
			var removeEvent = function(value) {
				if(LatteObject.isLatteObject(value)) {
					value.off("change", doEvent);
				}
			};
		(function init() {
			data.forEach(function(o, i) {
				var n = LatteObject.create(o);
				if(n) {
					addEvent(n);
					self.data[i] = n;
				}else{
					self.data[i] = o;
				}
			});
		})();

		/**
			var data = latte_lib.object.create({
				list: []
			});
			data.on("list", function(value, list) {
				
			});
			data.set("list", [1,2,3]);
		*/
		var set = function(key, value, mode) {
			if(!latte_lib.isArray(key)) {
				key = key.toString().split(".");
			}
			if(key.length == 1) {
				var k = key[0];
				var ov = self.data[k];
				var od = data[k];
				var nv;
				switch(mode) {
					case 1:
						
					break;
					default:
						removeEvent(ov);
						var nv = LatteObject.create(value);
						if(nv) {
							addEvent(nv);
						}else{
							nv = value;
						}
						self.data[k] = nv;
						data[k] = value;
						return {
							ov: ov,
							nv: nv
						};
					break;
				}

			}else{
				var k = key.pop();
				return self.get(key).set(k, value, mode);
			}
		};
		this._set = set;

		this.set = function(key, value, mode) {
			var result = set(key, value , mode);
			if(key.indexOf(".") == -1) {
				self.emit("change", key, result.nv, result.ov);
				self.emit(key, result.nv, result.ov);
			}
			self.emit("set", key, result.nv, result.ov);
			
			return result;
		}

		this.get = function(key) {
			if(key == "this" &&  !self.data[key]) {
				return self;
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
		}
		/**
			@method push
			@param o {any}
		*/
		this.push = function(o) {
			var key = self.data.length;
			var data = set(key, o);
			self.emit("splice", key, [], [data.nv]);
			self.emit("change", key, data.nv);
		}

		this.pop = function() {
			var data = set(self.length - 1, null);
			self.data.pop();
			self.emit("splice", self.length, [data.ov], []);
		}
		/**
			var data = latte_lib.object.create({
				a: [{
					c:1
				}],
				b:[1]
			});
			data.get("a").on("splice", function(index, removeArray, addArray) {
				
			});
			data.get("a").shift();

			data.get("b").on("splice", function(index, removeArray, addArray) {
				
			});
			data.get("b").shift();
		*/
		this.shift = function() {
			var old = self.data.shift();
			removeEvent(old);
			self.emit("splice", 0, [old],[]);
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
			self.emit("splice", 0, [], args);

			for(var i = 0, len = self.data.length; i < len; i++) {
				self.emit("change", i, self.data[i]);
			}
		}

		this.splice = function(startIndex, num) {
			var oLength = self.data.length;
			var adds = Array.prototype.splice.call(arguments, 2).map(function(o) {
				var n = LatteObject.create(o);
				if(n) {
					n.on("change", doEvent);
				}
				return n || o;
			});	
			var olds = [];
			for(var i = 0; i < num; i++) {
				var old = self.get(startIndex+i);
				if(old){
					removeEvent(old);
					olds.push(old);
				}
				
			}
			self.data.splice.apply(self.data, [startIndex, num].concat(adds));
			self.emit("splice", startIndex, olds, adds);

			for(var i = 0, len = Math.max(oLength, self.data.length); i < len; i++) {
				self.emit("change", i, self.data[i]);
			}
		}

		this.toJSON = function() {
			return data;
		}

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
	};
	latte_lib.inherits(LatteArray, events);
	(function() {

	}).call(LatteArray);
	module.exports = LatteArray;