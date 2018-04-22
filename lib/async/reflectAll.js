"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reflect_1 = require("./reflect");
var index_1 = require("../utils/index");
function reflectAll(tasks) {
    var results;
    if (Array.isArray(tasks)) {
        results = tasks.map(reflect_1.default);
    }
    else {
        results = {};
        index_1.default.forOwn(tasks, function (task, key) {
            results[key] = reflect_1.default.call(this, task);
        });
    }
    return results;
}
exports.default = reflectAll;
