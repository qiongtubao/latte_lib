var lib = require('./lib/index');
for (let i in lib) {
  lib.utils[i] = lib[i];
}
lib.utils.default = lib;
module.exports = lib.utils;
