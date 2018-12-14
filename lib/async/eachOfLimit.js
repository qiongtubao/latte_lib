"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eachOfLimit_1 = require("./internal/eachOfLimit");
const wrapAsync_1 = require("./internal/wrapAsync");
function eachOfLimit(coll, limit, iteratee, callback) {
    eachOfLimit_1.default(limit)(coll, wrapAsync_1.default(iteratee), callback);
}
exports.default = eachOfLimit;
