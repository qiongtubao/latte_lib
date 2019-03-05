"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callback = args.pop();
        fn.call(this, args, callback);
    };
}
exports.default = default_1;
