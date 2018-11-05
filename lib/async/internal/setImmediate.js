'use strict';
exports.__esModule = true;
exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';
function fallback(fn) {
    setTimeout(fn, 0);
}
exports.fallback = fallback;
function wrap(defer) {
    return function (fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        defer(function () {
            fn.apply(void 0, args);
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
exports["default"] = wrap(_defer);
