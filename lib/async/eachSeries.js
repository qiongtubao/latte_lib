"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eachLimit_1 = require("./eachLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(eachLimit_1.default, 1);
