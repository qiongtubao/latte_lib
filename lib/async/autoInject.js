"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auto_1 = require("./auto");
var index_1 = require("../utils/index");
var wrapAsync_1 = require("./internal/wrapAsync");
var wrapAsync_2 = require("./internal/wrapAsync");
var forOwn = index_1.default.forOwn;
var FN_ARGS = /^(?:async\s+)?(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg) {
        return arg.replace(FN_ARG, '').trim();
    });
    return func;
}
function autoInject(tasks, callback) {
    var newTasks = {};
    forOwn(tasks, function (taskFn, key) {
        var params;
        var fnIsAsync = wrapAsync_2.isAsync(taskFn);
        var hasNoDeps = (!fnIsAsync && taskFn.length === 1) ||
            (fnIsAsync && taskFn.length === 0);
        if (Array.isArray(taskFn)) {
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];
            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
        }
        else if (hasNoDeps) {
            newTasks[key] = taskFn;
        }
        else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && !fnIsAsync && params.length === 0) {
                throw new Error("autoInject task functions require explicit parameters.");
            }
            if (!fnIsAsync)
                params.pop();
            newTasks[key] = params.concat(newTask);
        }
        function newTask(results, taskCb) {
            var newArgs = params.map(params, function (name) {
                return results[name];
            });
            newArgs.push(taskCb);
            wrapAsync_1.default(taskFn).apply(null, newArgs);
        }
    });
    auto_1.default(newTasks, callback);
}
exports.default = autoInject;
