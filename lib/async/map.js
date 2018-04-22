"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doParallel_1 = require("./internal/doParallel");
var map_1 = require("./internal/map");
exports.default = doParallel_1.default(map_1.default);
