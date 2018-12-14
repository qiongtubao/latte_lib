"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../utils/index");
let isNode = index_1.default.isNode;
let hasListeners = (event) => {
    return !!this.listeners(event).length;
};
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, fn) {
        this.events = this.events || {};
        (this.events[event] = this.events[event] || [])
            .push(fn);
        return this;
    }
    ;
    once(event, fn) {
        var self = this;
        this.events = this.events || {};
        let on = function () {
            self.off(event, on);
            fn.apply(this, arguments);
        };
        fn['on'] = on;
        this.on(event, on);
        return this;
    }
    ;
    off(event, fn) {
        this.events = this.events || {};
        if (0 == arguments.length) {
            this.events = {};
            return this;
        }
        var callbacks = this.events[event];
        if (!callbacks)
            return this;
        if (1 == arguments.length) {
            delete this.events[event];
            return this;
        }
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }
        return this;
    }
    emit(event, ...args) {
        this.events = this.events || {};
        let callbacks = this.events[event];
        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }
        return this;
    }
    ;
    listeners(event) {
        this.events = this.events || {};
        return this.events[event] || [];
    }
    ;
    hasEvent(event, func) {
        return this.listeners(event).indexOf(func) != -1;
    }
}
exports.default = EventEmitter;
(function () {
    this.removeListener = this.off;
    this.removeAllListeners = this.off;
    this.removeEventListener = this.off;
    this.hasListeners = this.hasEvent;
    this.addEventListener = this.on;
}).call(EventEmitter.prototype);
function Event(target) {
    target.prototype.on = EventEmitter.prototype.on;
    target.prototype.off = EventEmitter.prototype.off;
    target.prototype.hasEvent = EventEmitter.prototype.hasEvent;
    target.prototype.listeners = EventEmitter.prototype.listeners;
    target.prototype.once = EventEmitter.prototype.once;
    target.prototype.emit = EventEmitter.prototype.emit;
}
exports.Event = Event;
