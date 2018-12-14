"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/index");
let isArrayLike = index_1.default.isArrayLike;
const getIterator_1 = require("./getIterator");
function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
    };
}
function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done)
            return null;
        i++;
        return { value: item.value, key: i };
    };
}
function createObjectIterator(obj) {
    var okeys = Object.keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? { value: obj[key], key: key } : null;
    };
}
function iterator(coll) {
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }
    var iterator = getIterator_1.default(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
exports.default = iterator;
