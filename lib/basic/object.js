	var latte_lib = require("./lib.js")
		, events = require("./events.js");

	var LatteObject = function(data) {
		var self = this;
		this.childEvents = {};
		self.data = {};
			var addEvent = function(key, value) {
				self.childEvents[key] = function(name, value, oldValue) {
					self.emit(key+"."+name, value, oldValue, data);
					self.emit("change", key+"."+name, value, oldValue, data);
				};
				value.on("change", self.childEvents[key]);
			};
			var removeEvent = function(key, value) {
				if(LatteObject.isLatteObject(value)) {
					value.off("change", self.childEvents[key]);
					delete self.childEvents[key];
				}
			};
		(function init() {
			for(var i in data) {
				var l = LatteObject.create(data[i]);
				if(l) {
					addEvent(i, l);
					self.data[i] = l;
				}else{
					self.data[i] = data[i];
				}
			}
			
		})();


		var set = function (key, value, mode) {
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
						removeEvent(k, ov);
						var nv = LatteObject.create(value);
						if(nv) {
							addEvent(k, nv);
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
				var o = self;
				var parent;
				for(var i = 0, len = key.length ; i < len; i++) {
					parent = o;
					o = o.get(key[i]);
					if(!o) {
						o = new LatteObject({});
						parent.set(key[i], o);
					}
				}
				return self.get(key).set(k, value, mode);
			}
		}
		this._set = set;
		this.merge = function(value) {
			for(var i in value) {
				self.set(i, value[i]);
			}
		}
		this.set = function(key, value, mode) {

			var result = set(key, value);
			
			if(key.indexOf(".") == -1) {
				self.emit("change", key, result.nv, result.ov);
			}
			
			self.emit(key, result.nv, result.ov);
			
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

		this.toJSON = function() {
			return data;
		}
		
		this.getKeys = function() {
			return Object.keys(self.data);
		}
	};
	(function() {
		this.isLatteArray= function(data) {
			var LatteArray = require("./array");
			return data.constructor == LatteArray;
		};
		this.isLatteObject = function(data) {
			var LatteArray = require("./array");
			return data && (
				data.constructor == LatteObject || 
				data.constructor == require("./array")
			);
		};
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
		};

		this.create = function(data) {
			var LatteArray = require("./array");
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
		};
		
		this.equal = function(a, b) {
			if(a == null && b == null) {
				return true;
			}
			if( (a == null && b!= null)  || (a != null && b == null)) {
				return false;
			}
			//console.log(a, b);
			if(a.constructor != b.constructor) {
				return false;
			}
			if(latte_lib.isArray(a) ){
				if(a.length != b.length) {
					return false;
				}
				for(var i =0 ,len = a.length; i < len; i++) {
					if(!equal(a[i], b[i])) {
						return false;
					}
				}
				return true;
			}
			if(LatteObject.isLatteArray(a) ) {
				if(a.length != b.length) {
					return false;
				}
				for(var i =0 ,len = a.length; i < len; i++) {
					if(!equal(a.get(i), b.get(i))) {
						return false;
					}
				}
				return true;
			}
			if(LatteObject.isLatteObject(a)) {
				return a.toJSON() == b.toJSON();
			}
			return a == b;
		};
	}).call(LatteObject);
	latte_lib.inherits(LatteObject, events);
	module.exports = LatteObject;