"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applyEach_1 = require("./internal/applyEach");
var mapSeries_1 = require("./mapSeries");
exports.default = applyEach_1.default(mapSeries_1.default);
