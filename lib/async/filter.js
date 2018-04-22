"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter_1 = require("./internal/filter");
var doParallel_1 = require("./internal/doParallel");
exports.default = doParallel_1.default(filter_1.default);
