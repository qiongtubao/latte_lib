"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initialParams_1 = require("./internal/initialParams");
var wrapAsync_1 = require("./internal/wrapAsync");
function timeout(asyncFn, milliseconds, info) {
    var fn = wrapAsync_1.default(asyncFn);
    return initialParams_1.default(function (args, callback) {
        var timedOut = false;
        var timer;
        function timeoutCallback() {
            var name = asyncFn.name || 'anonymous';
            var error = new Error('Callback function "' + name + '" timed out.');
            error.code = 'ETIMEDOUT';
            if (info) {
                error.info = info;
            }
            timedOut = true;
            callback(error);
        }
        args.push(function () {
            if (!timedOut) {
                callback.apply(null, arguments);
                clearTimeout(timer);
            }
        });
        timer = setTimeout(timeoutCallback, milliseconds);
        fn.apply(null, args);
    });
}
exports.default = timeout;
