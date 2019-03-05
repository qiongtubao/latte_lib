"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../events/index");
var index_2 = require("../utils/index");
var LatteClass = (function (_super) {
    __extends(LatteClass, _super);
    function LatteClass(data) {
        var _this = _super.call(this) || this;
        _this.get = function (key) {
            if (_this.data[key]) {
                return _this.data[key];
            }
            if (key === "this" && !_this.data[key]) {
                return _this;
            }
            if (!index_2.default.isArray(key)) {
                key = key.toString().split('.');
            }
            var l = _this;
            while (key.length != 1) {
                var k = key.shift();
                if (!l || !l.data || !l.data[k]) {
                    return undefined;
                }
                l = l.data[k];
            }
            if (!l || !l.data || !l.data[key[0]]) {
                return undefined;
            }
            if (index_2.default.isFunction(l.data[key[0]])) {
                return l.data[key[0]].bind(l);
            }
            return l.data[key[0]];
        };
        _this._create = function (key) {
            var parent;
            var o = _this;
            for (var i = 0, len = key.length; i < len; i++) {
                parent = o;
                o = o.get(key[i]);
                if (!o) {
                    var result = parent.set(key[i], {});
                    o = result.nowValue;
                }
            }
            return o;
        };
        _this.set = function (key, value, mode) {
            if (mode === void 0) { mode = 0; }
            key = key.toString();
            if (mode) {
                return _this.merge(key, value);
            }
            var result = _this._set(key, value);
            if (key.indexOf('.') === -1) {
                _this.emit('change', key, result.nowValue, result.oldValue);
            }
            _this.emit('set', key, result.nowValue, result.oldValue);
            _this.emit(key, result.nowValue, result.oldValue);
            return result;
        };
        _this.toJSON = function () {
            return _this.rawData;
        };
        _this.addChild = function (key, value) {
            var obj = LatteClass.create(value);
            _this.rawData[key] = obj ? obj.toJSON ? obj.toJSON() : obj : value;
            if (obj) {
                _this.addChildEvent(key, obj);
                _this.data[key] = obj;
                return obj;
            }
            else {
                _this.data[key] = value;
                return value;
            }
        };
        _this.removeChild = function (key, value) {
            if (!_this.data[key]) {
                _this.removeChildEvent(key, _this.data[key]);
            }
            var oldValue = _this.data[key];
            if (index_2.default.isArray(_this.data)) {
                _this.data[key] = undefined;
                _this.rawData[key] = undefined;
            }
            else {
                delete _this.data[key];
                delete _this.rawData[key];
            }
            return {
                oldValue: oldValue,
                nowValue: undefined
            };
        };
        _this._set = function (key, value) {
            if (!index_2.default.isArray(key)) {
                key = key.toString().split('.');
            }
            if (key.length != 1) {
                var k = key.pop();
                var o = _this._create(key);
                return o.set(k, value, undefined);
            }
            var oldValue = _this.data[key[0]];
            var obj = _this.addChild(key[0], value);
            if (obj == undefined) {
                delete _this.data[key[0]];
                delete _this.rawData[key[0]];
            }
            return {
                oldValue: oldValue,
                nowValue: obj
            };
        };
        _this.merge = function (key, value) {
            if (!index_2.default.isArray(key)) {
                key = key.toString().splice('.');
            }
            if (key.length != 1) {
                var k = key.pop();
                var o = _this._create(key);
                return o.merge(k, value);
            }
            var oldValue = _this.data[key[0]];
            var self = _this;
            value = value.toJSON ? value.toJSON() : value;
            Object.keys(value).forEach(function (k) {
                oldValue.set(k, value[k], true);
            });
            return {
                oldValue: oldValue,
                nowValue: oldValue
            };
        };
        return _this;
    }
    LatteClass.create = function (data) {
        if (LatteClass.isLatteObject(data)) {
            return data;
        }
        if (index_2.default.isArray(data)) {
            var LatteArray = require('./array').default;
            return new LatteArray(data);
        }
        if (index_2.default.isObject(data)) {
            var LatteObject = require('./object').default;
            return new LatteObject(data);
        }
    };
    LatteClass.isLatteObject = function (value) {
        return value instanceof LatteClass;
    };
    return LatteClass;
}(index_1.default));
exports.LatteClass = LatteClass;
