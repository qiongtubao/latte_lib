"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var retry_1 = require("./retry");
var initialParams_1 = require("./internal/initialParams");
var wrapAsync_1 = require("./internal/wrapAsync");
function default_1(opts, task) {
    if (!task) {
        task = opts;
        opts = null;
    }
    var _task = wrapAsync_1.default(task);
    return initialParams_1.default(function (args, callback) {
        function taskFn(cb) {
            _task.apply(null, args.concat(cb));
        }
        if (opts)
            retry_1.default(opts, taskFn, callback);
        else
            retry_1.default(taskFn, callback);
    });
}
exports.default = default_1;
