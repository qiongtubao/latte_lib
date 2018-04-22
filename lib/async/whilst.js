"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var slice_1 = require("./internal/slice");
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
function whilst(test, iteratee, callback) {
    callback = onlyOnce_1.default(callback || noop);
    var _iteratee = wrapAsync_1.default(iteratee);
    if (!test())
        return callback(null);
    var next = function (err) {
        if (err)
            return callback(err);
        if (test())
            return _iteratee(next);
        var args = slice_1.default(arguments, 1);
        callback.apply(null, [null].concat(args));
    };
    _iteratee(next);
}
exports.default = whilst;
