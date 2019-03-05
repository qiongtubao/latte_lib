"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onlyOnce(fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (fn === null)
            throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, args);
    };
}
exports.default = onlyOnce;
