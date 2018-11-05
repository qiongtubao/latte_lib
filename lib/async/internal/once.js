"use strict";
exports.__esModule = true;
function once(fn) {
    return function () {
        if (fn === null)
            return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
exports["default"] = once;
