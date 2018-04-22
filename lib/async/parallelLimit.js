"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachOfLimit_1 = require("./internal/eachOfLimit");
var parallel_1 = require("./internal/parallel");
function parallelLimit(tasks, limit, callback) {
    parallel_1.default(eachOfLimit_1.default(limit), tasks, callback);
}
exports.default = parallelLimit;
