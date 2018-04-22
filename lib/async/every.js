"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createTester_1 = require("./internal/createTester");
var doParallel_1 = require("./internal/doParallel");
var notId_1 = require("./internal/notId");
exports.default = doParallel_1.default(createTester_1.default(notId_1.default, notId_1.default));
