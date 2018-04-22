"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createTester_1 = require("./internal/createTester");
var doParallelLimit_1 = require("./internal/doParallelLimit");
var notId_1 = require("./internal/notId");
exports.default = doParallelLimit_1.default(createTester_1.default(notId_1.default, notId_1.default));
