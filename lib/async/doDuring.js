"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slice_1 = require("./internal/slice");
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
function doDuring(fn, test, callback) {
    callback = onlyOnce_1.default(callback || noop);
    var _fn = wrapAsync_1.default(fn);
    var _test = wrapAsync_1.default(test);
    function next(err) {
        if (err)
            return callback(err);
        var args = slice_1.default(arguments, 1);
        args.push(check);
        _test.apply(this, args);
    }
    ;
    function check(err, truth) {
        if (err)
            return callback(err);
        if (!truth)
            return callback(null);
        _fn(next);
    }
    check(null, true);
}
exports.default = doDuring;
