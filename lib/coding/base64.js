
			/**
				@namespace latte_lib
				@module coding
			  @class base64
			 */
			(function() {
				var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

					/**
						@method encode
						@param {String} input
						@return {String} output
						@example
							var Base64 = require("latte_lib").base64;
							log(Base64.encode("latte的世界"));
					*/
					this.encode = function (input) {
							var output = "";
							var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
							var i = 0;
							input = require("./utf8").encode(input);
							//input = _utf8_encode(input);
							while (i < input.length) {
									chr1 = input.charCodeAt(i++);
									chr2 = input.charCodeAt(i++);
									chr3 = input.charCodeAt(i++);
									enc1 = chr1 >> 2;
									enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
									enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
									enc4 = chr3 & 63;
									if (isNaN(chr2)) {
											enc3 = enc4 = 64;
									} else if (isNaN(chr3)) {
											enc4 = 64;
									}
									output = output +
									_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
									_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
							}
							return output;
					}

					/**
						@method decode
						@param {String} input
						@return {String} output
						@example
							var Base64 = require("latte_lib").base64;
							log(Base64.decode("bGF0dGXnmoTkuJbnlYw="));
					*/
					this.decode = function (input) {
							var output = "";
							var chr1, chr2, chr3;
							var enc1, enc2, enc3, enc4;
							var i = 0;
							input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
							while (i < input.length) {
									enc1 = _keyStr.indexOf(input.charAt(i++));
									enc2 = _keyStr.indexOf(input.charAt(i++));
									enc3 = _keyStr.indexOf(input.charAt(i++));
									enc4 = _keyStr.indexOf(input.charAt(i++));
									chr1 = (enc1 << 2) | (enc2 >> 4);
									chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
									chr3 = ((enc3 & 3) << 6) | enc4;
									output = output + String.fromCharCode(chr1);
									if (enc3 != 64) {
											output = output + String.fromCharCode(chr2);
									}
									if (enc4 != 64) {
											output = output + String.fromCharCode(chr3);
									}
							}
							output = require("./utf8").decode(output);
							//output = _utf8_decode(output);
							return output;
					}


			}).call(module.exports);
  