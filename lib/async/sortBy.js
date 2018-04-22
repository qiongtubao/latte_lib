"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./map");
var wrapAsync_1 = require("./internal/wrapAsync");
var property = function baseProperty(key) {
    return function (object) { return object == null ? undefined : object[key]; };
};
function sortBy(coll, iteratee, callback) {
    var _iteratee = wrapAsync_1.default(iteratee);
    map_1.default(coll, function (x, callback) {
        _iteratee(x, function (err, criteria) {
            if (err)
                return callback(err);
            callback(null, { value: x, criteria: criteria });
        });
    }, function (err, results) {
        if (err)
            return callback(err);
        callback(null, results.sort(comparator).map(property('value')));
    });
    function comparator(left, right) {
        var a = left.criteria, b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
    }
}
exports.default = sortBy;
