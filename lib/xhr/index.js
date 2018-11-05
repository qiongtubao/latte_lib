"use strict";
exports.__esModule = true;
var index_1 = require("../utils/index");
var index_2 = require("./node/index");
var brower = require('./brower/index');
exports["default"] = index_1["default"].isNode ? index_2["default"] : brower;
