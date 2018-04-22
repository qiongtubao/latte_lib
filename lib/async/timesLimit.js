"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapLimit_1 = require("./mapLimit");
var wrapAsync_1 = require("./internal/wrapAsync");
function range(start, end, step, fromRight) {
    var index = -1;
    var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
    var result = new Array(length);
    while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
    }
    return result;
}
function timeLimit(count, limit, iteratee, callback) {
    var _iteratee = wrapAsync_1.default(iteratee);
    mapLimit_1.default(range(0, count, 1), limit, _iteratee, callback);
}
exports.default = timeLimit;
