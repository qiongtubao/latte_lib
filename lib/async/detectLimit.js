"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createTester_1 = require("./internal/createTester");
var doParallelLimit_1 = require("./internal/doParallelLimit");
var findGetResult_1 = require("./internal/findGetResult");
var identity = function (x) { return x; };
exports.default = doParallelLimit_1.default(createTester_1.default(identity, findGetResult_1.default));
