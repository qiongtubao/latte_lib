"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_1 = require("../event/event");
const utils_1 = require("../utils");
class LatteObjectProxy extends event_1.default {
    constructor() {
        super();
        this._isLatte = true;
    }
}
exports.LatteObjectProxy = LatteObjectProxy;
function set(proxy) {
    return function (target, name, value) {
        if (target[name] === value) {
            return true;
        }
        if (name == "events") {
            target[name] = value;
            return true;
        }
        if (utils_1.default.isObject(value) || utils_1.default.isArray(value)) {
            let child;
            if (utils_1.default.isObject(value)) {
                child = LatteObject(value);
                child.on('change', (name1, value) => {
                    proxy.emit(name.toString() + '.' + name1, value);
                    proxy.emit('change', name.toString() + '.' + name1, value);
                });
            }
            else {
                child = LatteArray(value);
                child.on('change', (name1, value) => {
                    proxy.emit(name.toString() + '[' + name1 + ']', value);
                    proxy.emit('change', name.toString() + '[' + name1 + ']', value);
                });
            }
            target[name] = child;
        }
        else {
            target[name] = value;
        }
        proxy.emit(name.toString(), target[name]);
        proxy.emit('change', name, target[name]);
        return true;
    };
}
function LatteArray(data) {
    if (data._isLatte) {
        return data;
    }
    let proxy = [];
    Object.assign(proxy, event_1.default.prototype);
    proxy['on'] = event_1.default.prototype.on;
    proxy['off'] = event_1.default.prototype.off;
    proxy['emit'] = event_1.default.prototype.emit;
    proxy._isLatte = true;
    let result = new Proxy(proxy, {
        get: function (target, name) {
            return target[name];
        },
        set: set(proxy)
    });
    Object.assign(result, data);
    return result;
}
exports.LatteArray = LatteArray;
function LatteObject(data) {
    if (data._isLatte) {
        return data;
    }
    let proxy = new LatteObjectProxy();
    let result = new Proxy(proxy, {
        get: function (target, name) {
            return target[name];
        },
        set: set(proxy)
    });
    Object.assign(result, data);
    return result;
}
exports.LatteObject = LatteObject;
