"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slice_1 = require("./slice");
var wrapAsync_1 = require("./wrapAsync");
function consoleFunc(name) {
    return function (fn) {
        var args = slice_1.default(arguments, 1);
        args.push(function (err) {
            var args = slice_1.default(arguments, 1);
            if (typeof console === 'object') {
                if (err) {
                    if (console.error) {
                        console.error(err);
                    }
                }
                else if (console[name]) {
                    args.forEach(function (x) {
                        console[name](x);
                    });
                }
            }
        });
        wrapAsync_1.default(fn).apply(null, args);
    };
}
exports.default = consoleFunc;
