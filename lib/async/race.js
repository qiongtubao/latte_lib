"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var once_1 = require("./internal/once");
var wrapAsync_1 = require("./internal/wrapAsync");
function race(tasks, callback) {
    callback = once_1.default(callback || noop);
    if (!Array.isArray(tasks))
        return callback(new TypeError('First argument to race must be an array of functions'));
    if (!tasks.length)
        return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
        wrapAsync_1.default(tasks[i])(callback);
    }
}
exports.default = race;
