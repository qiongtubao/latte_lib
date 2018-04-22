"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var initialParams_1 = require("./internal/initialParams");
var setImmediate_1 = require("./internal/setImmediate");
var isObject = index_1.default.isObject;
function asyncify(func) {
    return initialParams_1.default(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        }
        catch (e) {
            return callback(e);
        }
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function (value) {
                invokeCallback(callback, null, value);
            }, function (err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        }
        else {
            callback(null, result);
        }
    });
}
exports.default = asyncify;
function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    }
    catch (e) {
        setImmediate_1.default(rethrow, e);
    }
}
function rethrow(error) {
    throw error;
}
