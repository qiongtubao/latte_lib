(function(define) {'use strict'
  define("latte_lib/old/fs", ["require", "exports", "module", "window"],
  function(require, exports, module, window){
      var Fs = require("fs")
        , Path = require("path");
        /**
          @class fs
          @namespace latte_lib
          @module old
        */
      (function() {
        var self = this;
        this.exists = function(path, callback) {
          return Fs.exists(path, callback);
        }
        /**
        *  @method existsSync
        *  @static
        *  @public
        *  @sync
        *  @param {String} path 文件地址字符串
        *  @return {Bool}  exists   是否存在   存在为true；不存在为false
        *  @nodejs
          @example

            //@nodejs
            var Fs  = require("latte_lib");
            var exists = Fs.existsSync("./test.js");
            log(exists);
        */
        this.existsSync = function(path) {
          return Fs.existsSync(path);
        }
        /**
        *  @method mkdirSync
        *  @static
        *  @public
        *  @sync
        *  @param {String} path
        *  @param {Object} options
        *  @return {Error} error
        *  @nodejs
           @example
              //nodejs


        */
        this.mkdirSync = function(path, options) {
            if( self.existsSync(path)) {
              return null;
            }
            if(!self.existsSync(Path.dirname(path))) {
              var error = self.mkdirSync(Path.dirname(path), options);
              if(error) { return error; }
            }
            return Fs.mkdirSync(path, options);
        }
        /**
        *  @method writeFileSync
        *  @static
        *  @public
        *  @sync
        *  @param {String} path
        *  @param {String} data
        *  @return {Error} error
        *  @example
            //@nodejs

        */
        this.writeFileSync = function(path, data) {
          var error = self.mkdirSync(Path.dirname(path));
          if(error) { return error; }
          return Fs.writeFileSync(path, data, {encoding: "utf8"});
        }
        /**
          @method writeFile
          @static
          @public
          @sync
          @param {String} path
          @param {String} data
          @param {Function} callback
          @example
            //@nodejs
            var Fs = require("latte_lib").fs;
            Fs.writeFile("./test", test);
        */
        this.writeFile = function(path, data, callback) {
          self.mkdir(Path.dirname(path), null, function() {
  					Fs.writeFile(path, data, {encoding: "utf8"}, callback);
  				});
        }
        this.readFile = function(path, callback) {
          return Fs.readFile(path, function(err, buffer) {
              callback(err, buffer? buffer.toString(): null);
          });
        }
        this.readFileSync = function(path) {
          return Fs.readFileSync(path).toString();
        }
        this.mkdir = function(path, options, callback) {
          self.exists(path, function(exists) {
              if(exists) {
                callback(null, path);
              }else{
                self.mkdir(Path.dirname(path), options, function(err) {
                  if(err) { return callback(err); }
                  Fs.mkdir(path, options, callback);
                });
              }
          });
        }
        this.copyFile = function(fromPath, toPath, callback) {
          //@finding best function
          try {
            var from = Fs.createReadStream(fromPath);
            self.mkdir(Path.dirname(toPath), null, function(error) {
              var to = Fs.createWriteStream(toPath);
              from.pipe(to);
              callback(null);
            });
          }catch(e) {
            callback(e);
          }
        }

        this.copyDir = function(fromPath, toPath, callback) {

        }
        this.fileType = function(path) {
          return Path.extname(path).substring(1);
        }
        this.lstatSync = function(path) {
          return Fs.lstatSync(path);
        }
        this.readdirSync = function(path) {
          return Fs.readdirSync(path);
        }
        this.realpathSync = function(path, cache) {
          return Fs.realpathSync(path, cache);
        }
        this.appendFile = function(filename, data, options, callback) {
          return Fs.appendFile(filename, data, options, callback);
        }
        this.appendFileSync = function(filename, data, options) {
          return Fs.appendFile(filename, data, options);
        }
        /**
          @method deleteFileSync
          @static
          @sync
          @param {String} filename
          @param {Function} callback
          @example

            var Fs = require("latte_lib").fs;
            Fs.deleteFile("test", function(error) {
              console.log(error);
            });
        */
        this.deleteFile = function(filename, callback) {
          Fs.unlink(filename, callback);
        }
        /**
          @method deleteFileSync
          @static
          @sync
          @param {String} path
          @return {Error} error
          @example

            var Fs = require("latte_lib").fs;
            Fs.deleteFileSync("test");
        */
        this.deleteFileSync = function(path) {
            return Fs.unlinkSync(path);
        }
        this.stat = function(path, callback) {
            return Fs.stat(path, callback);
        }
        this.createReadStream = function(path, options) {
            return Fs.createReadStream(path, options);
        }
        this.createWriteStream = function(path, options) {
            return Fs.createWriteStream(path, options);
        }

        this.rename = function(oldPath, newPath, callback) {
            return Fs.rename(oldPath, namePath, callback);
        }
        this.watch = function(filename, options, listener) {
            return Fs.watch(filename, options, listener);
        }
        this.statSync = function(filename) {
            return Fs.statSync(filename);
        }
        this.WriteStream = Fs.WriteStream;
      }).call(module.exports);
  });
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
