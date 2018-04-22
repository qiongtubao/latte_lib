"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initialParams_1 = require("./internal/initialParams");
var slice_1 = require("./internal/slice");
var wrapAsync_1 = require("./internal/wrapAsync");
function reflect(fn) {
    var _fn = wrapAsync_1.default(fn);
    return initialParams_1.default(function reflectOn(args, reflectCallback) {
        args.push(function callback(error, cbArg) {
            if (error) {
                reflectCallback(null, { error: error });
            }
            else {
                var value;
                if (arguments.length <= 2) {
                    value = cbArg;
                }
                else {
                    value = slice_1.default(arguments, 1);
                }
                reflectCallback(null, { value: value });
            }
        });
        return _fn.apply(this, args);
    });
}
exports.default = reflect;
