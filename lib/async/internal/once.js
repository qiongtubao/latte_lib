"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function once(fn) {
    return function () {
        if (fn === null)
            return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
exports.default = once;
