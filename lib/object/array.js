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
var index_1 = require("../utils/index");
var class_1 = require("./class");
var LatteArray = (function (_super) {
    __extends(LatteArray, _super);
    function LatteArray(data) {
        if (data === void 0) { data = []; }
        var _this = _super.call(this, data) || this;
        _this.addChildEvent = function (key, value) {
            value.on("change", _this.changeEvent);
        };
        _this.removeChildEvent = function (key, value) {
            if (!value) {
                value = key;
                key = undefined;
            }
            value.off && value.off("change", _this.changeEvent);
            delete _this.data[key];
        };
        _this.push = function (o) {
            var key = _this.length;
            var data = _this.set(key, o, undefined);
            _this.emit("splice", key, [], [data.nowValue]);
            _this.emit("change", key, data.nowValue);
        };
        _this.pop = function () {
            var data = _this.set(_this.data.length - 1, undefined, undefined);
            _this.data.pop();
            _this.emit("splice", _this.data.length, [data.oldValue], []);
        };
        _this.unshift = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a;
            (_a = _this.data).unshift.apply(_a, args.map(function (o) {
                return undefined;
            }));
            var self = _this;
            var unshiftArray = args.map(function (value, index) {
                return self.addChild(index, value);
            });
            _this.emit('splice', 0, [], unshiftArray);
            for (var i = 0, len = _this.data.length; i < len; i++) {
                _this.emit("change", i, _this.data[i], _this.data[i + 1]);
            }
        };
        _this.shift = function () {
            var data = _this.removeChild(0, _this.data[0]);
            var oldValue = _this.data.shift();
            _this.emit("splice", 0, [oldValue], []);
            _this.emit("change", 0, _this.data[0], oldValue);
            for (var i = 1, len = _this.data.length; i < len; i++) {
                _this.emit("change", i, _this.data[i], _this.data[i - 1]);
            }
            _this.emit("change", _this.data.length, undefined);
        };
        _this.splice = function (startIndex, num) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var _a;
            var oLength = _this.data.length;
            var adds = index_1.default.undefineds([args.length]);
            var olds = [];
            for (var i = 0; i < num; i++) {
                var old_1 = _this.data[startIndex + i];
                olds.push(_this.removeChild(startIndex + i, _this.data[startIndex + i]).oldValue);
            }
            (_a = _this.data).splice.apply(_a, [startIndex, num].concat(adds));
            var self = _this;
            adds = args.map(function (a, index) {
                self.addChild(startIndex + index, a);
            });
            _this.emit('splice', startIndex, olds, adds);
            for (var i = 0; i < num; i++) {
                self.emit("change", i + startIndex, self.data[i], olds[i]);
            }
            var off = self.data.length - oLength;
            if (off !== 0) {
                for (var i = startIndex + num, len = Math.max(oLength, self.data.length); i < len; i++) {
                    self.emit("change", i, self.data[i], self.data[i + off]);
                }
            }
        };
        _this.indexOf = function (data) {
            return _this.data.indexOf(data);
        };
        _this.forEach = function (callback) {
            _this.data.forEach(callback);
        };
        _this.map = function (callback) {
            _this.data.map(callback);
        };
        _this.filter = function (callback) {
            _this.data.filter(callback);
        };
        _this.removeValue = function (value, num) {
            var index;
            if (num === undefined) {
                while ((index = _this.indexOf(value)) != -1) {
                    _this.splice(index, 1);
                }
            }
            else {
                for (var i = 0; i < num; i++) {
                    if ((index = _this.indexOf(value)) != -1) {
                        _this.splice(index, 1);
                    }
                }
            }
        };
        _this.diff = function (value) {
            var change = {};
            _this.data.forEach(function (v, index) {
                var nowIndex = value.indexOf(v);
                if (nowIndex !== -1) {
                    change[index] = nowIndex;
                }
            });
            return change;
        };
        _this.data = [];
        _this.rawData = data;
        var self = _this;
        _this.changeEvent = function (name, value, oldValue) {
            var index = self.data.indexOf(this);
            if (index != -1) {
                self.emit(index + "." + name, value, oldValue, data);
                self.emit("change", index + "." + name, value, oldValue, data);
            }
            else {
                self.removeChild(this, undefined);
            }
        };
        Object.defineProperty(_this, "length", {
            get: function () {
                return self.data.length;
            },
            set: function () {
                throw new Error('暂时警用直接设置length 进行删除操作');
            }
        });
        data.forEach(function (value, key) {
            self.addChild(key, value);
        });
        return _this;
    }
    LatteArray.prototype.slice = function (start, end) {
        var result = new LatteArray();
        if (start < 0)
            start = this.data.length + start;
        if (!end)
            end = this.data.length - 1;
        if (end < 0)
            end = this.data.length + end;
        for (; start < end; start++) {
            result.push(this.data[start]);
        }
        return result;
    };
    return LatteArray;
}(class_1.LatteClass));
exports.default = LatteArray;
