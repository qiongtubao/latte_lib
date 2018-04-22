"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parallel_1 = require("./internal/parallel");
var eachOfSeries_1 = require("./eachOfSeries");
function series(tasks, callback) {
    parallel_1.default(eachOfSeries_1.default, tasks, callback);
}
exports.default = series;
