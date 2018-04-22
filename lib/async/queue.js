"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = require("./internal/queue");
var wrapAsync_1 = require("./internal/wrapAsync");
function default_1(worker, concurrency) {
    var _worker = wrapAsync_1.default(worker);
    return queue_1.default(function (items, cb) {
        _worker(items[0], cb);
    }, concurrency, 1);
}
exports.default = default_1;
