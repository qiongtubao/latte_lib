"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var mapLimit_1 = require("./mapLimit");
var wrapAsync_1 = require("./internal/wrapAsync");
function default_1(coll, limit, iteratee, callback) {
    callback = callback || noop;
    var _iteratee = wrapAsync_1.default(iteratee);
    mapLimit_1.default(coll, limit, function (val, callback) {
        _iteratee(val, function (err, key) {
            if (err)
                return callback(err);
            return callback(null, { key: key, val: val });
        });
    }, function (err, mapResults) {
        var result = {};
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        for (var i = 0; i < mapResults.length; i++) {
            if (mapResults[i]) {
                var key = mapResults[i].key;
                var val = mapResults[i].val;
                if (hasOwnProperty.call(result, key)) {
                    result[key].push(val);
                }
                else {
                    result[key] = [val];
                }
            }
        }
        return callback(err, result);
    });
}
exports.default = default_1;
;
