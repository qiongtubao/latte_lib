"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onlyOnce(fn) {
    return function (...args) {
        if (fn === null)
            throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, args);
    };
}
exports.default = onlyOnce;
