"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slice_1 = require("./slice");
var initialParams_1 = require("./initialParams");
var wrapAsync_1 = require("./wrapAsync");
function applyEach(eachfn) {
    return function (fns) {
        var args = slice_1.default(arguments, 1);
        var go = initialParams_1.default(function (args, callback) {
            var that = this;
            return eachfn(fns, function (fn, cb) {
                wrapAsync_1.default(fn).apply(that, args.concat(cb));
            }, callback);
        });
        if (args.length) {
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
}
exports.default = applyEach;
