"use strict";
exports.__esModule = true;
function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}
exports["default"] = doLimit;
