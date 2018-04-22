"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identity = function (x) { return x; };
var setImmediate_1 = require("./internal/setImmediate");
var initialParams_1 = require("./internal/initialParams");
var wrapAsync_1 = require("./internal/wrapAsync");
function has(obj, key) {
    return key in obj;
}
function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;
    var _fn = wrapAsync_1.default(fn);
    var memoized = initialParams_1.default(function memoized(args, callback) {
        var key = hasher.apply(null, args);
        if (has(memo, key)) {
            setImmediate_1.default(function () {
                callback.apply(null, memo[key]);
            });
        }
        else if (has(queues, key)) {
            queues[key].push(callback);
        }
        else {
            queues[key] = [callback];
            _fn.apply(null, args.concat(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                memo[key] = args;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            }));
        }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}
exports.default = memoize;
