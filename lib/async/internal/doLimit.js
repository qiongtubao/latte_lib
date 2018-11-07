"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}
exports.default = doLimit;
