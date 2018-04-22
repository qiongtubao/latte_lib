"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reject_1 = require("./internal/reject");
var doParallel_1 = require("./internal/doParallel");
exports.default = doParallel_1.default(reject_1.default);
