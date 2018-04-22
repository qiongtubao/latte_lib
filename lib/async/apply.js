"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function () {
        var callArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            callArgs[_i] = arguments[_i];
        }
        return fn.apply(void 0, args.concat(callArgs));
    };
}
exports.default = default_1;
;
