"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var noop = index_1.default.noop;
var setImmediate_1 = require("./setImmediate");
var queue_1 = require("./queue");
function default_1(worker, concurrency) {
    var q = queue_1.default(worker, concurrency);
    q.push = function (data, priority, callback) {
        if (callback == null)
            callback = noop;
        if (typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!Array.isArray(data)) {
            data = [data];
        }
        if (data.length === 0) {
            return setImmediate_1.default(function () {
                q.drain();
            });
        }
        priority = priority || 0;
        var nextNode = q._tasks.head;
        while (nextNode && priority >= nextNode.priority) {
            nextNode = nextNode.next;
        }
        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                priority: priority,
                callback: callback
            };
            if (nextNode) {
                q._tasks.insertBefore(nextNode, item);
            }
            else {
                q._tasks.push(item);
            }
        }
        setImmediate_1.default(q.process);
    };
    delete q.unshift;
    return q;
}
exports.default = default_1;
