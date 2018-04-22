"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var onlyOnce_1 = require("./internal/onlyOnce");
var ensureAsync_1 = require("./ensureAsync");
var wrapAsync_1 = require("./internal/wrapAsync");
function forever(fn, errback) {
    var done = onlyOnce_1.default(errback || noop);
    var task = wrapAsync_1.default(ensureAsync_1.default(fn));
    function next(err) {
        if (err)
            return done(err);
        task(next);
    }
    next();
}
exports.default = forever;
