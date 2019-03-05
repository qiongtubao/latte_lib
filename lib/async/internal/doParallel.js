"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOf_1 = require("../eachOf");
var wrapAsync_1 = require("./wrapAsync");
function doParallel(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOf_1.default, obj, wrapAsync_1.default(iteratee), callback);
    };
}
exports.default = doParallel;
