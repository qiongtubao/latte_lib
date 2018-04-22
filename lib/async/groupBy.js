"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doLimit_1 = require("./internal/doLimit");
var groupByLimit_1 = require("./groupByLimit");
exports.default = doLimit_1.default(groupByLimit_1.default, Infinity);
