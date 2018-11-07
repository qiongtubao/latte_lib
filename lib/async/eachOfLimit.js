"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOfLimit_1 = require("./internal/eachOfLimit");
var wrapAsync_1 = require("./internal/wrapAsync");
function eachOfLimit(coll, limit, iteratee, callback) {
    eachOfLimit_1.default(limit)(coll, wrapAsync_1.default(iteratee), callback);
}
exports.default = eachOfLimit;
