"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../utils/index");
var noop = index_1.default.noop;
var property = index_1.default.baseProperty;
var wrapAsync_1 = require("./wrapAsync");
function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, function (x, index, callback) {
        iteratee(x, function (err, v) {
            truthValues[index] = !!v;
            callback(err);
        });
    }, function (err) {
        if (err)
            return callback(err);
        var results = [];
        for (var i = 0; i < arr.length; i++) {
            if (truthValues[i])
                results.push(arr[i]);
        }
        callback(null, results);
    });
}
function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
        iteratee(x, function (err, v) {
            if (err) {
                callback(err);
            }
            else {
                if (v) {
                    results.push({ index: index, value: x });
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, results.sort(function (a, b) {
                return a.index - b.index;
            }).map(property('value')));
        }
    });
}
function _filter(eachfn, coll, iteratee, callback) {
    var filter = index_1.default.isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, wrapAsync_1.default(iteratee), callback || noop);
}
exports.default = _filter;
