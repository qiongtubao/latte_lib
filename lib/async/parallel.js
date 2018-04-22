"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOf_1 = require("./eachOf");
var parallel_1 = require("./internal/parallel");
function parallelLimit(tasks, callback) {
    parallel_1.default(eachOf_1.default, tasks, callback);
}
exports.default = parallelLimit;
