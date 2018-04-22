"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reject_1 = require("./internal/reject");
var doParallelLimit_1 = require("./internal/doParallelLimit");
exports.default = doParallelLimit_1.default(reject_1.default);
