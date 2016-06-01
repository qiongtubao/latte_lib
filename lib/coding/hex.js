
		(function() {
			this.encode = function(string) {
			 	var HEX = "0123456789ABCDEF",  
				radix = 16,  
				len = string.length,  
				encodeStr = "";  
				for (var i = 0; i < len; i++) {  
					var num = parseInt(string.charCodeAt(i), 10);  
					encodeStr += "%" + Math.floor(num / radix) + HEX.charAt(num % radix);  
				}  
				return encodeStr;  
			}
			this.decode = function(string) {
				var arr = string.split("%"),  
				str = "";
				for (var i = 1; arr[i]; i++) {  
					str += String.fromCharCode(parseInt(arr[i], 16));  
				}  
				return str; 
			}
		}).call(module.exports);
		
	