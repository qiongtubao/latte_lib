
		var latte_lib = require("./lib.js");
		/**
			@namespace latte_lib
			@class format
			@module basic
		*/
		(function() {
			var _self = this;
			/**
					@property ISO8601_FORMAT
					@type String
			*/
			this.ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
			/**
				@property ISO8601_WITH_TZ_OFFSET_FORMAT
				@type String
			*/
			this.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
			/**
				@property DATETIME_FORMAT
				@type String
			*/
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
				/**
					@method getDateReplace
					@public
					@static
					@sync
					@param {Date} date
					@return {Object}
					@example
						var Format = require("latte_lib").format;
						var date = new Date();
						log(Format.getDateReplace(date));
				*/
				this.getDateReplace = function(date, prefix, postfix) {
					prefix = prefix ||  "";
					postfix = postfix || "";
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

					var result = {};
					result[prefix + "dd" + postfix] = vDay;
					result[prefix + "MM" + postfix] = vMonth;
					result[prefix + "yyyy" + postfix] = vYearLong;
					result[prefix + "y{1,4}" + postfix] = vYearShort;
					result[prefix + "hh" + postfix] = vHour;
					result[prefix + "mm" + postfix] = vMinute;
					result[prefix + "ss" + postfix] = vSecond;
					result[prefix + "SSS" + postfix] = vMillisecond;
					result[prefix + "O" + postfix] = vTimeZone;
					return result;
				}
				/**
					@method dateFormat
					@public
					@static
					@sync
					@param {String} format
					@param {Date} date
					@return {String} formatted
					@example
						var Format = require("latte_lib").format;
						var date = new Date();
						log(Format.dateFormat(Format.ISO8601_FORMAT, date));
				*/
			this.dateFormat = function(format, date, prefix, postfix) {
				if(!date) {
					date = format || new Date();
					format = exports.ISO8601_FORMAT;
				}
				var formatted = format;
				var json = _self.getDateReplace(date, prefix, postfix);
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
			/**
				@method jsonFormat
				@public
				@static
				@param {Object}
				@param {Object} default { n: "\n", t: "\t"}
				@return {String}
				@example
					var Format = require("latte_lib").format;
					log(Format.jsonFormat({
						a: "1",
						b: 2,
						c: [3],
						d: {
							e: 4
					}
				}));

			*/
				var defaultUti = { n: "\n", t: "\t"};
			this.jsonFormat = function(object, jsonUti) {
				jsonUti = latte_lib.merger(defaultUti, jsonUti);
				try {
					return objFormat(object, 1, jsonUti);
				}catch(e) {
					throw object;
					return JSON.stringify(object);
				}
			}
			/**
			 * @method templateStringFormat
				 @sync
				 @public
				 @param {String} template
				 @param  {Object} options
				 @return {String} data
				 @example
						var Format = require("latte_lib").format;
						log(Format.templateStringFormat("hello, {{name}}", { name: "latte"}));
			 */
			this.templateStringFormat = function(template, options) {
				var data = template;
				for(var i in options) {
					data = data.replace(new RegExp("{{"+i+"}}","igm"), options[i]);
				}
				return data;
			}
			this.templateJsonFormat = function(template, options) {
						var template = JSON.stringify(template);
						var data = _self.templateStringFormat(template, options);
						return JSON.parse(data);
			}
		}).call(module.exports);
  