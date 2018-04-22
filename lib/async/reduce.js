"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOfSeries_1 = require("./eachOfSeries");
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var once_1 = require("./internal/once");
var wrapAsync_1 = require("./internal/wrapAsync");
function reduce(coll, memo, iteratee, callback) {
    callback = once_1.default(callback || noop);
    var _iteratee = wrapAsync_1.default(iteratee);
    eachOfSeries_1.default(coll, function (x, i, callback) {
        _iteratee(memo, x, function (err, v) {
            memo = v;
            callback(err);
        });
    }, function (err) {
        callback(err, memo);
    });
}
exports.default = reduce;
