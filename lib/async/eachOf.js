"use strict";
//import isArrayLike from 'lodash/isArrayLike';
exports.__esModule = true;
var breakLoop_1 = require("./internal/breakLoop");
var eachOfLimit_1 = require("./eachOfLimit");
var doLimit_1 = require("./internal/doLimit");
var index_1 = require("../utils/index");
var noop = index_1["default"].noop;
var isArrayLike = index_1["default"].isArrayLike;
var once_1 = require("./internal/once");
var onlyOnce_1 = require("./internal/onlyOnce");
var wrapAsync_1 = require("./internal/wrapAsync");
// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once_1["default"](callback || noop);
    var index = 0, completed = 0, length = coll.length;
    if (length === 0) {
        callback(null);
    }
    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        }
        else if ((++completed === length) || value === breakLoop_1["default"]) {
            callback(null);
        }
    }
    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce_1["default"](iteratorCallback));
    }
}
// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = doLimit_1["default"](eachOfLimit_1["default"], Infinity);
/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {AsyncFunction} iteratee - A function to apply to each
 * item in `coll`.
 * The `key` is the item's key, or index in the case of an array.
 * Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * let obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * let configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
function default_1(coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync_1["default"](iteratee), callback);
}
exports["default"] = default_1;
