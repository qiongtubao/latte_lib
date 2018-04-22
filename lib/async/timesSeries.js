"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timesLimit_1 = require("./timesLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(timesLimit_1.default, 1);
