"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var everyLimit_1 = require("./everyLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(everyLimit_1.default, 1);
