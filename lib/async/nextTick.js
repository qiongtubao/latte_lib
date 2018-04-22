'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var setImmediate_1 = require("./internal/setImmediate");
var _defer;
if (setImmediate_1.hasNextTick) {
    _defer = process.nextTick;
}
else if (setImmediate_1.hasSetImmediate) {
    _defer = setImmediate;
}
else {
    _defer = setImmediate_1.fallback;
}
exports.default = setImmediate_1.wrap(_defer);
