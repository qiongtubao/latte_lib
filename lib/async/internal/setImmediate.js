'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';
function fallback(fn) {
    setTimeout(fn, 0);
}
exports.fallback = fallback;
function wrap(defer) {
    return function (fn, ...args) {
        defer(function () {
            fn(...args);
        });
    };
}
exports.wrap = wrap;
var _defer;
if (exports.hasSetImmediate) {
    _defer = setImmediate;
}
else if (exports.hasNextTick) {
    _defer = process.nextTick;
}
else {
    _defer = fallback;
}
exports.default = wrap(_defer);
