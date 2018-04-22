"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doLimit_1 = require("./internal/doLimit");
var concatLimit_1 = require("./concatLimit");
exports.default = doLimit_1.default(concatLimit_1.default, 1);
