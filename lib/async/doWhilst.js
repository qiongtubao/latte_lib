"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var slice_1 = require("./internal/slice");
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
function doWhilst(iteratee, test, callback) {
    callback = onlyOnce_1.default(callback || noop);
    var _iteratee = wrapAsync_1.default(iteratee);
    var next = function (err) {
        if (err)
            return callback(err);
        var args = slice_1.default(arguments, 1);
        if (test.apply(this, args))
            return _iteratee(next);
        callback.apply(null, [null].concat(args));
    };
    _iteratee(next);
}
exports.default = doWhilst;
