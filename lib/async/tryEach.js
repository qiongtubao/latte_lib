"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var eachSeries_1 = require("./eachSeries");
var wrapAsync_1 = require("./internal/wrapAsync");
var slice_1 = require("./internal/slice");
function tryEach(tasks, callback) {
    var error = null;
    var result;
    callback = callback || noop;
    eachSeries_1.default(tasks, function (task, callback) {
        wrapAsync_1.default(task)(function (err, res) {
            if (arguments.length > 2) {
                result = slice_1.default(arguments, 1);
            }
            else {
                result = res;
            }
            error = err;
            callback(!err);
        });
    }, function () {
        callback(error, result);
    });
}
exports.default = tryEach;
