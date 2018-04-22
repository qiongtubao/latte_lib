"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detectLimit_1 = require("./detectLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(detectLimit_1.default, 1);
