"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/index");
let noop = index_1.default.noop;
let isArrayLike = index_1.default.isArrayLike;
const slice_1 = require("./slice");
const wrapAsync_1 = require("./wrapAsync");
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
