"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seq_1 = require("./seq");
function default_1() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return seq_1.default(args.reverse());
}
exports.default = default_1;
;
