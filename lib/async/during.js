"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
function during(test, fn, callback) {
    callback = onlyOnce_1.default(callback || noop);
    var _fn = wrapAsync_1.default(fn);
    var _test = wrapAsync_1.default(test);
    function next(err) {
        if (err)
            return callback(err);
        _test(check);
    }
    function check(err, truth) {
        if (err)
            return callback(err);
        if (!truth)
            return callback(null);
        _fn(next);
    }
    _test(check);
}
exports.default = during;
