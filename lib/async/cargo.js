"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = require("./internal/queue");
function cargo(worker, payload) {
    return queue_1.default(worker, 1, payload);
}
exports.default = cargo;
