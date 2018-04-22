"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rejectLimit_1 = require("./rejectLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(rejectLimit_1.default, 1);
