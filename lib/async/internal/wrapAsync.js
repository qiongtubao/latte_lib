"use strict";
exports.__esModule = true;
var asyncify_1 = require("../asyncify");
var supportsSymbol = typeof Symbol === 'function';
function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}
exports.isAsync = isAsync;
function wrapAsync(asyncFn) {
    return isAsync(asyncFn) ? asyncify_1["default"](asyncFn) : asyncFn;
}
exports["default"] = wrapAsync;
