"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var eachOf_1 = require("./eachOf");
var once_1 = require("./internal/once");
var wrapAsync_1 = require("./internal/wrapAsync");
function transform(coll, accumulator, iteratee, callback) {
    if (arguments.length <= 3) {
        callback = iteratee;
        iteratee = accumulator;
        accumulator = Array.isArray(coll) ? [] : {};
    }
    callback = once_1.default(callback || noop);
    var _iteratee = wrapAsync_1.default(iteratee);
    eachOf_1.default(coll, function (v, k, cb) {
        _iteratee(accumulator, v, k, cb);
    }, function (err) {
        callback(err, accumulator);
    });
}
exports.default = transform;
