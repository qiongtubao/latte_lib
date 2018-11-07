"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var breakLoop_1 = require("./internal/breakLoop");
var eachOfLimit_1 = require("./eachOfLimit");
var doLimit_1 = require("./internal/doLimit");
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var isArrayLike = index_1.default.isArrayLike;
var once_1 = require("./internal/once");
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once_1.default(callback || noop);
    var index = 0, completed = 0, length = coll.length;
    if (length === 0) {
        callback(null);
    }
    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        }
        else if ((++completed === length) || value === breakLoop_1.default) {
            callback(null);
        }
    }
    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce_1.default(iteratorCallback));
    }
}
var eachOfGeneric = doLimit_1.default(eachOfLimit_1.default, Infinity);
function default_1(coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync_1.default(iteratee), callback);
}
exports.default = default_1;
