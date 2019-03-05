"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter_1 = require("./filter");
function reject(eachfn, arr, iteratee, callback) {
    filter_1.default(eachfn, arr, function (value, cb) {
        iteratee(value, function (err, v) {
            cb(err, !v);
        });
    }, callback);
}
exports.default = reject;
