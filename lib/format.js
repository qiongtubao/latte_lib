(function(define) { 'use strict';
	define("latte_lib/format", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var latte_lib = require("./lib");
		(function() {
			var _self = this;
			this.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
			this.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
			this.DATETIME_FORMAT = "hh:mm:ss.SSS";
				function padWithZeros(vNumber, width) {
					var numAsString =  vNumber + "";
					while(numAsString.length < width) {
						numAsString = "0" + numAsString;
					}
					return numAsString;
				}
				function addZero(vNumber) {
					return padWithZeros(vNumber, 2);
				}
				function offset(date) {
					var os = Math.abs(date.getTimezoneOffset());
					var h = String(Math.floor(os/60));
					var m = String(os%60);
					if(h.length == 1) {
						h = "0" + h;
					}
					if(m.length == 1) {
						m = "0" + m;
					}
					return date.getTimezoneOffset() < 0 ? "+" + h + m : "-" + h + m;
				}
				this.getDateReplace = function(date) {
					var vDay = addZero(date.getDate());
					var vMonth = addZero(date.getMonth() + 1);
					var vYearLong = addZero(date.getFullYear());
					var vYearShort = addZero(date.getFullYear().toString().substring(2,4));
					//var vYear = (format.indexOf("yyyy") > -1 ? vYearLong: vYearShort);
					var vHour = addZero(date.getHours());
					var vMinute = addZero(date.getMinutes());
					var vSecond = addZero(date.getSeconds());
					var vMillisecond = padWithZeros(date.getMilliseconds(), 3);
					var vTimeZone = offset(date);
					return {
						"dd": vDay,
						"MM": vMonth,
						"yyyy": vYearLong,
						"y{1,4}": vYearShort,
						"hh": vHour,
						"mm": vMinute,
						"ss": vSecond,
						"SSS": vMillisecond,
						"O": vTimeZone
					};
				}
			this.dateFormat = function(format, date) {
				if(!date) {
					date = format || new Date();
					format = exports.ISO8601_FORMAT;
				}
				var formatted = format;
				var json = _self.getDateReplace(date);
				latte_lib.jsonForEach(json, function(key, value) {
					formatted = formatted.replace(new RegExp(key,"g"), value);
				});
				return formatted;	
			}
				var repeatStr = function(str, times) {
					var newStr = [];
					if(times > 0) {
						for(var i = 0; i < times; i++) {
							newStr.push(str);
						}
					}
					return newStr.join("");
				}
				var objFormat = function(object, level, jsonUti, isInArray) {
					var tab = isInArray ? repeatStr(jsonUti.t, level - 1): "";
					if(object === null || object === undefined) {
						return tab + "null";
					}
					switch(latte_lib.getClassName(object)) {
						case "array":
							var paddingTab = repeatStr(jsonUti.t , level - 1);
							var temp = [ jsonUti.n + paddingTab + "[" + jsonUti.n];
							var tempArrValue = [];
							for(var i = 0 , len = object.length; i < len; i++ ) {
								tempArrValue.push(objFormat(object[i], level + 1, jsonUti, true));
							}
							temp.push(tempArrValue.join("," + jsonUti.n));
							temp.push(jsonUti.n + paddingTab + "] ");
							return temp.join("");
						break;
						case "object":
							var currentObjStrings = [];
							for(var key in object) {
								if(object[key] == undefined) {
									continue;
								}
								var temp = [];
								var paddingTab = repeatStr(jsonUti.t, level);
								temp.push(paddingTab);
								temp.push("\"" + key +"\" : ");
								var value = object[key];
								temp.push(objFormat(value, level + 1, jsonUti));
								currentObjStrings.push(temp.join(""));
							}
							return (level > 1 && !isInArray ? jsonUti.n : "")
								+ repeatStr(jsonUti.t, level - 1) + "{" + jsonUti.n
								+ currentObjStrings.join("," + jsonUti.n)
								+ jsonUti.n + repeatStr(jsonUti.t , level - 1) + "}";
						break;
						case "number":
							return tab + object.toString();
						break;
						case "boolean":
							return tab + object.toString().toLowerCase();
						break;
						case "function":
							return "[Function]";
						break;
						default:
							return tab + ("\"" + object.toString() + "\"");
						break;
					}
				}
				var defaultUti = { n: "\n", t: "\t"};
			this.jsonFormat = function(object, jsonUti) {
				jsonUti = latte_lib.merger(defaultUti, jsonUti);
				try {
					return objFormat(object, 1, jsonUti);
				}catch(e) {
					var error =  (new Error(JSON.stringify(object)));
					throw error;
					return JSON.stringify(object); 
				}	
			}
			this.templateStringFormat = function(data, options) {
				for(var i in options) {
					data = data.replace(new RegExp("{{"+i+"}}","igm"), options[i]);
				}
				return data;
			}
		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });