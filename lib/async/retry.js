"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var wrapAsync_1 = require("./internal/wrapAsync");
var constant = function (x) { return function () { return x; }; };
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;
    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: constant(DEFAULT_INTERVAL)
    };
    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;
            acc.intervalFunc = typeof t.interval === 'function' ?
                t.interval :
                constant(+t.interval || DEFAULT_INTERVAL);
            acc.errorFilter = t.errorFilter;
        }
        else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        }
        else {
            throw new Error("Invalid arguments for async.retry");
        }
    }
    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || noop;
        task = opts;
    }
    else {
        parseTimes(options, opts);
        callback = callback || noop;
    }
    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }
    var _task = wrapAsync_1.default(task);
    var attempt = 1;
    function retryAttempt() {
        _task(function (err) {
            if (err && attempt++ < options.times &&
                (typeof options.errorFilter != 'function' ||
                    options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            }
            else {
                callback.apply(null, arguments);
            }
        });
    }
    retryAttempt();
}
exports.default = retry;
