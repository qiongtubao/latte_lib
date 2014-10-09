(function(define) { 'use strict';
	define("latte_lib/fs", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var fs = require("fs")
			, path = require("path");
		(function() {
			this.getTimeSort = function(dirName) {
				var files = fs.readdirSync(dirName).map(function(o) {
					var stat = fs.lstatSync(dirName+o);
					return {
						time: stat.ctime.getTime(),
						obj: dirName+o
					};
				});
				files.sort(function(a, b) {
					return a.time > b.time;
				});
				return files.map(function(o) {
					return o.obj;
				});
				
			}
			var mkdirs = this.mkdirs  = function(dirpath, mode, callback) {
				fs.exists(dirpath, function(exists) {
					if(exists) {
						callback(dirpath);
					} else {
						mkdirs(path.dirname(dirpath), mode, function() {
							fs.mkdir(dirpath, mode, callback);
						});
					}
				});
			}
			this.write = function(filename, data, callback) {
				fs.writeFileSync(filename, data,  callback);
			}
			this.read = function(filename) {
				return fs.readFileSync(filename).toString();
			}
			this.deleteFile = function(filename) {
				fs.unlinkSync(filename);
			}
		}).call(module.exports);
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });