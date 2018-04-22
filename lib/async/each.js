"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOf_1 = require("./eachOf");
var withoutIndex_1 = require("./internal/withoutIndex");
var wrapAsync_1 = require("./internal/wrapAsync");
function eachLimit(coll, iteratee, callback) {
    eachOf_1.default(coll, withoutIndex_1.default(wrapAsync_1.default(iteratee)), callback);
}
exports.default = eachLimit;
