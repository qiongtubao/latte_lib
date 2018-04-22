"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reduce_1 = require("./reduce");
var slice_1 = require("./internal/slice");
function reduceRight(array, memo, iteratee, callback) {
    var reversed = slice_1.default(array).reverse();
    reduce_1.default(reversed, memo, iteratee, callback);
}
exports.default = reduceRight;
