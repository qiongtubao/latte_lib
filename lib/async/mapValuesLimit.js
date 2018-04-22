"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOfLimit_1 = require("./eachOfLimit");
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var once_1 = require("./internal/once");
var wrapAsync_1 = require("./internal/wrapAsync");
function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once_1.default(callback || noop);
    var newObj = {};
    var _iteratee = wrapAsync_1.default(iteratee);
    eachOfLimit_1.default(obj, limit, function (val, key, next) {
        _iteratee(val, key, function (err, result) {
            if (err)
                return next(err);
            newObj[key] = result;
            next();
        });
    }, function (err) {
        callback(err, newObj);
    });
}
exports.default = mapValuesLimit;
