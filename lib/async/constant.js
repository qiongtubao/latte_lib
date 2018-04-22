"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var args = [null].concat(values);
    return function () {
        var callback = arguments[arguments.length - 1];
        return callback.apply(this, args);
    };
}
exports.default = default_1;
;
