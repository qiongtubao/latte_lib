"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eachOfLimit_1 = require("./eachOfLimit");
const doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(eachOfLimit_1.default, 1);
