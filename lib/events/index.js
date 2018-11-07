"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var isNode = index_1.default.isNode;
var hasListeners = function (event) {
    return !!_this.listeners(event).length;
};
var EventEmitter = (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (event, fn) {
        this.events = this.events || {};
        (this.events[event] = this.events[event] || [])
            .push(fn);
        return this;
    };
    ;
    EventEmitter.prototype.once = function (event, fn) {
        var self = this;
        this.events = this.events || {};
        var on = function () {
            self.off(event, on);
            fn.apply(this, arguments);
        };
        fn['on'] = on;
        this.on(event, on);
        return this;
    };
    ;
    EventEmitter.prototype.off = function (event, fn) {
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
    };
    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.events = this.events || {};
        var callbacks = this.events[event];
        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }
        return this;
    };
    ;
    EventEmitter.prototype.listeners = function (event) {
        this.events = this.events || {};
        return this.events[event] || [];
    };
    ;
    EventEmitter.prototype.hasEvent = function (event, func) {
        return this.listeners(event).indexOf(func) != -1;
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
(function () {
    this.removeListener = this.off;
    this.removeAllListeners = this.off;
    this.removeEventListener = this.off;
    this.hasListeners = this.hasListeners;
    this.addEventListener = this.on;
}).call(EventEmitter.prototype);
