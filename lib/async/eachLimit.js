"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOfLimit_1 = require("./internal/eachOfLimit");
var withoutIndex_1 = require("./internal/withoutIndex");
var wrapAsync_1 = require("./internal/wrapAsync");
function eachLimit(coll, limit, iteratee, callback) {
    eachOfLimit_1.default(limit)(coll, withoutIndex_1.default(wrapAsync_1.default(iteratee)), callback);
}
exports.default = eachLimit;
