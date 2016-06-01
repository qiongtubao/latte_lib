
		/**
		*	@class utf8
		*	@namespace latte_lib
		*	@module coding
		*
		*/
		(function() {
			/**
			*	@property version
			*	@type String
			*/
			this.version = "0.0.1"
			var stringFromCharCode = String.fromCharCode;
			/**
			*	@method ucs2encode
			*	@param {int[]} array   8byte int[]
			*	@return {string} output   utf8String
			*	@since 0.0.1
			*	@sync
			*	@static
			*	@demo utf8.html {utf测试}
			*	@example
					var Utf8 = require("latte_lib").utf8;
					console.log(Utf8.ucs2encode([108,97,116,116,101,30340,19990,30028])) ;//"latte的世界"
			*/
			var ucs2encode = this.ucs2encode = function(array) {
				var length = array.length;
				var index = -1;
				var value;
				var output = '';
				while (++index < length) {
					value = array[index];
					if (value > 0xFFFF) {
						value -= 0x10000;
						output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
						value = 0xDC00 | value & 0x3FF;
					}
					output += stringFromCharCode(value);
				}
				return output;
			}
			/**
			*	@method ucs2decode
			*	@param {string} str    utf8String
			*	@return {int[]} output   8byte int[]
			*	@since 0.0.1
			*	@sync
			*	@static
			*	@example
					var Utf8 = require("latte_lib").utf8;
					console.log(Utf8.ucs2decode("latte的世界")) ;//[108,97,116,116,101,30340,19990,30028]
			*/
			var ucs2decode = this.ucs2decode = function (string) {
				var output = [];
				var counter = 0;
				var length = string.length;
				var value;
				var extra;
				while (counter < length) {
					value = string.charCodeAt(counter++);
					if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
						// high surrogate, and there is a next character
						extra = string.charCodeAt(counter++);
						if ((extra & 0xFC00) == 0xDC00) { // low surrogate
							output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
						} else {
							// unmatched surrogate; only append this code unit, in case the next
							// code unit is the high surrogate of a surrogate pair
							output.push(value);
							counter--;
						}
					} else {
						output.push(value);
					}
				}
				return output;
			}
			function createByte(codePoint, shift) {
				return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
			}

			function encodeCodePoint(codePoint) {
				if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
					return stringFromCharCode(codePoint);
				}
				var symbol = '';
				if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
					symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
				}
				else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
					symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
					symbol += createByte(codePoint, 6);
				}
				else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
					symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
					symbol += createByte(codePoint, 12);
					symbol += createByte(codePoint, 6);
				}
				symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
				return symbol;
			}
			/**
			*
			*	@method encode
			*	@param {string}  str   utf8string
			*	@return {string} byteString
			*	@since 0.0.1
			*   @static
			*	@sync
			*	@example
					var Utf8 = require("latte_lib").utf8;
					log(Utf8.encode("latte的世界")) ;//latteçä¸ç
			*
			*/
			var utf8encode = this.encode =  function(str) {
				var codePoints = ucs2decode(str);
				// console.log(JSON.stringify(codePoints.map(function(x) {
				// 	return 'U+' + x.toString(16).toUpperCase();
				// })));

				var length = codePoints.length;
				var index = -1;
				var codePoint;
				var byteString = '';
				while (++index < length) {
					codePoint = codePoints[index];
					byteString += encodeCodePoint(codePoint);
				}
				return byteString;
			}


			function readContinuationByte() {
				if (byteIndex >= byteCount) {
					throw Error('Invalid byte index');
				}

				var continuationByte = byteArray[byteIndex] & 0xFF;
				byteIndex++;

				if ((continuationByte & 0xC0) == 0x80) {
					return continuationByte & 0x3F;
				}

				// If we end up here, it’s not a continuation byte
				throw Error('Invalid continuation byte');
			}

			function decodeSymbol() {
				var byte1;
				var byte2;
				var byte3;
				var byte4;
				var codePoint;

				if (byteIndex > byteCount) {
					throw Error('Invalid byte index');
				}

				if (byteIndex == byteCount) {
					return false;
				}

				// Read first byte
				byte1 = byteArray[byteIndex] & 0xFF;
				byteIndex++;

				// 1-byte sequence (no continuation bytes)
				if ((byte1 & 0x80) == 0) {
					return byte1;
				}

				// 2-byte sequence
				if ((byte1 & 0xE0) == 0xC0) {
					var byte2 = readContinuationByte();
					codePoint = ((byte1 & 0x1F) << 6) | byte2;
					if (codePoint >= 0x80) {
						return codePoint;
					} else {
						throw Error('Invalid continuation byte');
					}
				}

				// 3-byte sequence (may include unpaired surrogates)
				if ((byte1 & 0xF0) == 0xE0) {
					byte2 = readContinuationByte();
					byte3 = readContinuationByte();
					codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
					if (codePoint >= 0x0800) {
						return codePoint;
					} else {
						throw Error('Invalid continuation byte');
					}
				}

				// 4-byte sequence
				if ((byte1 & 0xF8) == 0xF0) {
					byte2 = readContinuationByte();
					byte3 = readContinuationByte();
					byte4 = readContinuationByte();
					codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
						(byte3 << 0x06) | byte4;
					if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
						return codePoint;
					}
				}

				throw Error('Invalid UTF-8 detected');
			}

			var byteArray;
			var byteCount;
			var byteIndex;
			/**
			*	@method decode
			*	@sync
			*	@static
			*	@param {string}  byteString   bytes
			*	@return {string}
			*	@since 0.0.1
			*	@example
			*		var Utf8;
			*
			*		var Utf8 = require("latte_lib").utf8;
			*
			*
			*		console.log(Utf8.decode("latteçä¸ç")) ; //latte的世界
			*/
			var utf8decode = this.decode = function(byteString) {
				byteArray = ucs2decode(byteString);
				byteCount = byteArray.length;
				byteIndex = 0;
				var codePoints = [];
				var tmp;
				while ((tmp = decodeSymbol()) !== false) {
					codePoints.push(tmp);
				}
				return ucs2encode(codePoints);
			}



			// private method for UTF-8 encoding
			var _utf8_encode = function (string) {
					string = string.replace(/\r\n/g,"\n");
					var utftext = "";
					for (var n = 0; n < string.length; n++) {
							var c = string.charCodeAt(n);
							if (c < 128) {
									utftext += String.fromCharCode(c);
							} else if((c > 127) && (c < 2048)) {
									utftext += String.fromCharCode((c >> 6) | 192);
									utftext += String.fromCharCode((c & 63) | 128);
							} else {
									utftext += String.fromCharCode((c >> 12) | 224);
									utftext += String.fromCharCode(((c >> 6) & 63) | 128);
									utftext += String.fromCharCode((c & 63) | 128);
							}

					}
					return utftext;
			}

			// private method for UTF-8 decoding
			var _utf8_decode = function (utftext) {
					var string = "";
					var i = 0;
					var c = c1 = c2 = 0;
					while ( i < utftext.length ) {
							c = utftext.charCodeAt(i);
							if (c < 128) {
									string += String.fromCharCode(c);
									i++;
							} else if((c > 191) && (c < 224)) {
									c2 = utftext.charCodeAt(i+1);
									string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
									i += 2;
							} else {
									c2 = utftext.charCodeAt(i+1);
									c3 = utftext.charCodeAt(i+2);
									string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
									i += 3;
							}
					}
					return string;
			}
		}).call(module.exports);
	