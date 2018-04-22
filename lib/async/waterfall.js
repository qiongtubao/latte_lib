"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var once_1 = require("./internal/once");
var slice_1 = require("./internal/slice");
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
function default_1(tasks, callback) {
    callback = once_1.default(callback || noop);
    if (!Array.isArray(tasks))
        return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length)
        return callback();
    var taskIndex = 0;
    function nextTask(args) {
        var task = wrapAsync_1.default(tasks[taskIndex++]);
        args.push(onlyOnce_1.default(next));
        task.apply(null, args);
    }
    function next(err) {
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments);
        }
        nextTask(slice_1.default(arguments, 1));
    }
    nextTask([]);
}
exports.default = default_1;
