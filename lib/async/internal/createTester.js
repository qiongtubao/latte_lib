"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../utils/index");
var noop = index_1.default.noop;
var breakLoop_1 = require("./breakLoop");
function _createTester(check, getResult) {
    return function (eachfn, arr, iteratee, cb) {
        cb = cb || noop;
        var testPassed = false;
        var testResult;
        eachfn(arr, function (value, _, callback) {
            iteratee(value, function (err, result) {
                if (err) {
                    callback(err);
                }
                else if (check(result) && !testResult) {
                    testPassed = true;
                    testResult = getResult(true, value);
                    callback(null, breakLoop_1.default);
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            if (err) {
                cb(err);
            }
            else {
                cb(null, testPassed ? testResult : getResult(false));
            }
        });
    };
}
exports.default = _createTester;
