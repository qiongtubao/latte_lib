"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doParallelLimit_1 = require("./internal/doParallelLimit");
var map_1 = require("./internal/map");
exports.default = doParallelLimit_1.default(map_1.default);
