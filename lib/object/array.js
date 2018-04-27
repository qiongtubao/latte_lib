"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
            (_a = _this.data).unshift.apply(_a, args.map(function (o) {
                return undefined;
            }));
            var self = _this;
            var unshiftArray = args.map(function (value, index) {
                return self.addChild(index, value);
            });
            _this.emit('splice', 0, [], unshiftArray);
            for (var i_1 = 0, len = _this.data.length; i_1 < len; i_1++) {
                _this.emit("change", i_1, _this.data[i_1], _this.data[i_1 + 1]);
            }
            var _a;
        };
        _this.shift = function () {
            var data = _this.removeChild(0, _this.data[0]);
            var oldValue = _this.data.shift();
            _this.emit("splice", 0, [oldValue], []);
            _this.emit("change", 0, _this.data[i], oldValue);
            for (var i_2 = 1, len = _this.data.length; i_2 < len; i_2++) {
                _this.emit("change", i_2, _this.data[i_2], _this.data[i_2 - 1]);
            }
            _this.emit("change", _this.data.length, undefined);
        };
        _this.splice = function (startIndex, num) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var oLength = _this.data.length;
            var adds = index_1.default.undefineds([args.length]);
            var olds = [];
            for (var i_3 = 0; i_3 < num; i_3++) {
                var old_1 = _this.data[startIndex + i_3];
                olds.push(_this.removeChild(startIndex + i_3, _this.data[startIndex + i_3]).oldValue);
            }
            (_a = _this.data).splice.apply(_a, [startIndex, num].concat(adds));
            var self = _this;
            adds = args.map(function (a, index) {
                self.addChild(startIndex + index, a);
            });
            _this.emit('splice', startIndex, olds, adds);
            for (var i_4 = 0; i_4 < num; i_4++) {
                self.emit("change", i_4 + startIndex, self.data[i_4], olds[i_4]);
            }
            var off = self.data.length - oLength;
            if (off !== 0) {
                for (var i_5 = startIndex + num, len = Math.max(oLength, self.data.length); i_5 < len; i_5++) {
                    self.emit("change", i_5, self.data[i_5], self.data[i_5 + off]);
                }
            }
            var _a;
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
                for (var i_6 = 0; i_6 < num; i_6++) {
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
    return LatteArray;
}(class_1.LatteClass));
exports.default = LatteArray;
