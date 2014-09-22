(function(define) { 'use strict';
	define("latte_lib/stringFormation", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		(function() {
			var _self = this;
			// var  jsonUti = {
			// 	n: "\n",
			// 	t: "\t"
			// };
			var  repeatStr = function(str, times) {
			        var newStr = [];
			        if (times > 0) {
			            for (var i = 0; i < times; i++) {
			                newStr.push(str);
			            }
			        }
			        return newStr.join("");
		    }
		    var getClassName = function(object) {
		    	if(latte_lib.isArray(object)) {
		    		return "array";
		    	}
		    	if(!isNaN(object.length)) {
		    		return "string";
		    	}
		    	if(!isNaN(object)) {
		    		return "number";
		    	}
		    	if(object.constructor == Date) {
		    		return "date";
		    	}
		    	if(object.constructor == Boolean) {
		    		return "boolean";
		    	}
		    	if(typeof object == "function") {
		    		return "function";
		    	}
		    	return "object";
		    }
			var jsonObject = function(object, level, jsonUti, isInArray) {
				if(object === null) {
					//return "null";
					return "null";
				}
				if(object === undefined) {
					//return "undefined";
					return "undefined";
				}
				var tab = isInArray? repeatStr(jsonUti.t, level-1) : "";
				switch(getClassName(object)) {
					case "array":
						var paddingTab = repeatStr(jsonUti.t, level-1);
						var temp = [ jsonUti.n + paddingTab + "[ " + jsonUti.n ];
						var tempArrValue = [];
						for(var i = 0; i < object.length; i++) {
							tempArrValue.push(jsonObject(object[i], level + 1, jsonUti, true));
						}
						temp.push(tempArrValue.join("," + jsonUti.n));
						temp.push(  jsonUti.n + paddingTab +  "] ");
						return temp.join("");
					break;
					case "object":
						var currentObjStrings = [];
						
						for(var key in object) {
							if(object[key] == undefined ) {
								continue;
							}	
							var temp = [];					
							var paddingTab = repeatStr(jsonUti.t, level);
							temp.push(paddingTab);
							temp.push("\"" + key + "\" : " );
							var value = object[key];
							temp.push(jsonObject(value, level + 1, jsonUti));
							currentObjStrings.push(temp.join(""));
						}
						
						return (level > 1 && !isInArray ? jsonUti.n : "" )
							+ repeatStr(jsonUti.t, level - 1) + "{" + jsonUti.n
							+ currentObjStrings.join("," + jsonUti.n)
							+ jsonUti.n + repeatStr(jsonUti.t , level - 1 ) + "}";
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
			};

			this.json = function(object, jsonUti) {
				jsonUti = jsonUti ||  {}
				jsonUti.n = jsonUti.n ||  "\n";
				jsonUti.t = jsonUti.t || "\t";
				return jsonObject(object, 1, jsonUti);
				//return JSON.stringify(object);
			};


		}).call(module.exports);
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });