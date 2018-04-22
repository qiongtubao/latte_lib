"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unmemoize(fn) {
    return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
    };
}
exports.default = unmemoize;
