"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var whilst_1 = require("./whilst");
function until(test, iteratee, callback) {
    whilst_1.default(function () {
        return !test.apply(this, arguments);
    }, iteratee, callback);
}
exports.default = until;
