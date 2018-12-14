"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parallel_1 = require("./internal/parallel");
const eachOfSeries_1 = require("./eachOfSeries");
function series(tasks, callback) {
    parallel_1.default(eachOfSeries_1.default, tasks, callback);
}
exports.default = series;
