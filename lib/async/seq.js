"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slice_1 = require("./internal/slice");
var reduce_1 = require("./reduce");
var wrapAsync_1 = require("./internal/wrapAsync");
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
function seq() {
    var functions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        functions[_i] = arguments[_i];
    }
    var _functions = functions.map(wrapAsync_1.default);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var that = this;
        var cb = args[args.length - 1];
        if (typeof cb == 'function') {
            args.pop();
        }
        else {
            cb = noop;
        }
        reduce_1.default(_functions, args, function (newargs, fn, cb) {
            fn.apply(that, newargs.concat(function (err) {
                var nextargs = slice_1.default(arguments, 1);
                cb(err, nextargs);
            }));
        }, function (err, results) {
            cb.apply(that, [err].concat(results));
        });
    };
}
exports.default = seq;
