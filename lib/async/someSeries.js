"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var someLimit_1 = require("./someLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(someLimit_1.default, 1);
