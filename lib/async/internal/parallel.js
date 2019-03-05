"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../utils/index");
var noop = index_1.default.noop;
var isArrayLike = index_1.default.isArrayLike;
var slice_1 = require("./slice");
var wrapAsync_1 = require("./wrapAsync");
function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};
    eachfn(tasks, function (task, key, callback) {
        wrapAsync_1.default(task)(function (err, result) {
            if (arguments.length > 2) {
                result = slice_1.default(arguments, 1);
            }
            results[key] = result;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}
exports.default = _parallel;
