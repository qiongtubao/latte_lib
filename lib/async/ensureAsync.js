"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setImmediate_1 = require("./internal/setImmediate");
var initialParams_1 = require("./internal/initialParams");
var wrapAsync_1 = require("./internal/wrapAsync");
function ensureAsync(fn) {
    if (wrapAsync_1.isAsync(fn))
        return fn;
    return initialParams_1.default(function (args, callback) {
        var sync = true;
        args.push(function () {
            var innerArgs = arguments;
            if (sync) {
                setImmediate_1.default(function () {
                    callback.apply(null, innerArgs);
                });
            }
            else {
                callback.apply(null, innerArgs);
            }
        });
        fn.apply(this, args);
        sync = false;
    });
}
exports.default = ensureAsync;
