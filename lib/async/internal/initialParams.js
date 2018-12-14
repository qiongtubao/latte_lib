"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(fn) {
    return function (...args) {
        var callback = args.pop();
        fn.call(this, args, callback);
    };
}
exports.default = default_1;
