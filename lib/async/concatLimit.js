"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wrapAsync_1 = require("./internal/wrapAsync");
var slice_1 = require("./internal/slice");
var mapLimit_1 = require("./mapLimit");
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var _concat = Array.prototype.concat;
function default_1(coll, limit, iteratee, callback) {
    callback = callback || noop;
    var _iteratee = wrapAsync_1.default(iteratee);
    mapLimit_1.default(coll, limit, function (val, callback) {
        _iteratee(val, function (err) {
            if (err)
                return callback(err);
            return callback(null, slice_1.default(arguments, 1));
        });
    }, function (err, mapResults) {
        var result = [];
        for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
                result = _concat.apply(result, mapResults[i]);
            }
        }
        return callback(err, result);
    });
}
exports.default = default_1;
