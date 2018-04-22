"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOfLimit_1 = require("./eachOfLimit");
var wrapAsync_1 = require("./wrapAsync");
function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
        return fn(eachOfLimit_1.default(limit), obj, wrapAsync_1.default(iteratee), callback);
    };
}
exports.default = doParallelLimit;
