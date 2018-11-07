"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;
function default_1(coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
}
exports.default = default_1;
