"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const breakLoop_1 = require("./internal/breakLoop");
const eachOfLimit_1 = require("./eachOfLimit");
const doLimit_1 = require("./internal/doLimit");
const index_1 = require("../utils/index");
let noop = index_1.default.noop;
let isArrayLike = index_1.default.isArrayLike;
const once_1 = require("./internal/once");
const onlyOnce_1 = require("./internal/onlyOnce");
const wrapAsync_1 = require("./internal/wrapAsync");
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once_1.default(callback || noop);
    let index = 0, completed = 0, length = coll.length;
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
let eachOfGeneric = doLimit_1.default(eachOfLimit_1.default, Infinity);
function default_1(coll, iteratee, callback) {
    let eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync_1.default(iteratee), callback);
}
exports.default = default_1;
