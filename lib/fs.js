(function(define) { 'use strict';
	define("latte_lib/fs", ["require", "exports", "module", "window"], 
	function(require, exports, module, window) {
		var fs = require("fs")
			, path = require("path");
		(function() {
			this.exists = function(path, callback) {
				return fs.exists(path, callback);
			}
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
			this.writeFile = function(filename, data, callback) {

					mkdirs(path.dirname(filename), null, function() {
						fs.writeFile(filename, data, {encoding: "utf8"}, callback);
					});		
					
			}
			this.readFile = function(filename) {
				return fs.readFileSync(filename).toString();
			}
			this.change = function() {
				
			}
			this.mkdirsSync = function(filename, options, mode) {
				if(!mode && fs.existsSync(filename)) {
					return null;
				}
				if(!fs.existsSync(path.dirname(filename))) {
					var error = this.mkdirsSync(path.dirname(filename), options, 1);
					if(error) { return error; }
				}
				return fs.mkdirSync(filename, options);		
										
			}
			this.createWriteStream = function(filename, options) {
				var stream = fs.createWriteStream(filename, options);
				return stream;
				
			};
			this.deleteFile = function(filename) {
				fs.unlinkSync(filename);
			}

		}).call(module.exports);
		
	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });