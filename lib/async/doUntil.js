"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doWhilst_1 = require("./doWhilst");
function doUntil(iteratee, test, callback) {
    doWhilst_1.default(iteratee, function () {
        return !test.apply(this, arguments);
    }, callback);
}
exports.default = doUntil;
