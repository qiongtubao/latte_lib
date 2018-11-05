"use strict";
exports.__esModule = true;
var index_1 = require("../../utils/index");
var noop = index_1["default"].noop;
var once_1 = require("./once");
var iterator_1 = require("./iterator");
var onlyOnce_1 = require("./onlyOnce");
var breakLoop_1 = require("./breakLoop");
function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once_1["default"](callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator_1["default"](obj);
        var done = false;
        var running = 0;
        var looping = false;
        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            }
            else if (value === breakLoop_1["default"] || (done && running <= 0)) {
                done = true;
                return callback(null);
            }
            else if (!looping) {
                replenish();
            }
        }
        function replenish() {
            looping = true;
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, onlyOnce_1["default"](iterateeCallback));
            }
            looping = false;
        }
        replenish();
    };
}
exports["default"] = _eachOfLimit;
