"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapValuesLimit_1 = require("./mapValuesLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(mapValuesLimit_1.default, Infinity);
