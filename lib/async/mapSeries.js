"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mapLimit_1 = require("./mapLimit");
var doLimit_1 = require("./internal/doLimit");
exports.default = doLimit_1.default(mapLimit_1.default, 1);
