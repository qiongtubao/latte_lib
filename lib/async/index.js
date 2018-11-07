"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parallel_1 = require("./parallel");
var series_1 = require("./series");
var auto_1 = require("./auto");
exports.default = {
    auto: auto_1.default,
    series: series_1.default,
    parallel: parallel_1.default
};
