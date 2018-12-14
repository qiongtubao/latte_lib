"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
const slice_1 = require("./internal/slice");
const once_1 = require("./internal/once");
const onlyOnce_1 = require("./internal/onlyOnce");
const wrapAsync_1 = require("./internal/wrapAsync");
let noop = index_1.default.noop;
let forOwn = index_1.default.forOwn;
function default_1(tasks, concurrency, callback) {
    if (typeof concurrency === 'function') {
        callback = concurrency;
        concurrency = null;
    }
    callback = once_1.default(callback || noop);
    var keys = Object.keys(tasks);
    var numTasks = keys.length;
    if (!numTasks) {
        return callback(null);
    }
    if (!concurrency) {
        concurrency = numTasks;
    }
    var results = {};
    var runningTasks = 0;
    var hasError = false;
    var listeners = Object.create(null);
    var readyTasks = [];
    var readyToCheck = [];
    var uncheckedDependencies = {};
    forOwn(tasks, function (task, key) {
        if (!Array.isArray(task)) {
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
        }
        var dependencies = task.slice(0, task.length - 1);
        var remainingDependencies = dependencies.length;
        if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
        }
        uncheckedDependencies[key] = remainingDependencies;
        dependencies.forEach(function (dependencyName) {
            if (!tasks[dependencyName]) {
                throw new Error('async.auto task `' + key +
                    '` has a non-existent dependency `' +
                    dependencyName + '` in ' +
                    dependencies.join(', '));
            }
            addListener(dependencyName, function () {
                remainingDependencies--;
                if (remainingDependencies === 0) {
                    enqueueTask(key, task);
                }
            });
        });
    });
    checkForDeadlocks();
    processQueue();
    function enqueueTask(key, task) {
        readyTasks.push(function () {
            runTask(key, task);
        });
    }
    function processQueue() {
        if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
        }
        while (readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
        }
    }
    function addListener(taskName, fn) {
        var taskListeners = listeners[taskName];
        if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
        }
        taskListeners.push(fn);
    }
    function taskComplete(taskName) {
        var taskListeners = listeners[taskName] || [];
        taskListeners.forEach(function (fn) {
            fn();
        });
        processQueue();
    }
    function runTask(key, task) {
        if (hasError)
            return;
        var taskCallback = onlyOnce_1.default(function (err, result) {
            runningTasks--;
            if (arguments.length > 2) {
                result = slice_1.default(arguments, 1);
            }
            if (err) {
                var safeResults = {};
                forOwn(results, function (val, rkey) {
                    safeResults[rkey] = val;
                });
                safeResults[key] = result;
                hasError = true;
                listeners = Object.create(null);
                callback(err, safeResults);
            }
            else {
                results[key] = result;
                taskComplete(key);
            }
        });
        runningTasks++;
        var taskFn = wrapAsync_1.default(task[task.length - 1]);
        if (task.length > 1) {
            taskFn(results, taskCallback);
        }
        else {
            taskFn(taskCallback);
        }
    }
    function checkForDeadlocks() {
        var currentTask;
        var counter = 0;
        while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            getDependents(currentTask).forEach(function (dependent) {
                if (--uncheckedDependencies[dependent] === 0) {
                    readyToCheck.push(dependent);
                }
            });
        }
        if (counter !== numTasks) {
            throw new Error('async.auto cannot execute tasks due to a recursive dependency');
        }
    }
    function getDependents(taskName) {
        var result = [];
        forOwn(tasks, function (task, key) {
            if (Array.isArray(task) && task.indexOf(taskName, 0) >= 0) {
                result.push(key);
            }
        });
        return result;
    }
}
exports.default = default_1;
