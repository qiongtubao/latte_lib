
      var Fs = require("fs")
        , Path = require("path");
        /**
          @class fs
          @namespace latte_lib
          @module old
        */
      (function() {
        var self = this;
    		for(var i in Fs) {
    			self[i] = Fs[i]
    		};
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
        var rmdirSync = this.rmdirSync = function(path) {
          var files = self.readdirSync(path);
          files.forEach(function(file) {
            var stat = self.statSync(path + "/" + file)
            if(stat.isDirectory()) {
              self.rmdirSync(path + "/" + file);
            }else if(stat.isFile()) {
              self.deleteFileSync(path + "/" + file);
            }
          });
          
          var err = Fs.rmdirSync(path);
          console.log("delete Dir ", path, err);
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
            var error = self.mkdirSync(Path.dirname(path));
            return Fs.createWriteStream(path, options);
        }

        this.rename = function(oldPath, newPath, callback) {
            return Fs.rename(oldPath, newPath, callback);
        }
        this.renameSync = function(oldPath, newPath) {
           return Fs.renameSync(oldPath, newPath);
        }
        this.watch = function(filename, options, listener) {
            return Fs.watch(filename, options, listener);
        }
        this.statSync = function(filename) {
            return Fs.statSync(filename);
        }
        this.WriteStream = Fs.WriteStream;

        this.getTimeSort = function(dirName) {
          var files = Fs.readdirSync(dirName).map(function(o) {
            var stat = Fs.lstatSync(dirName+o);
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

      }).call(module.exports);
  