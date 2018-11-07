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
var class_1 = require("./class");
var LatteObject = (function (_super) {
    __extends(LatteObject, _super);
    function LatteObject(data) {
        var _this = _super.call(this, data) || this;
        _this.addChildEvent = function (key, obj) {
            var self = _this;
            _this.childEvents[key] = function (name, value, oldValue) {
                self.emit(key + "." + name, value, oldValue);
                self.emit("change", key + "." + name, value, oldValue);
            };
            obj && obj.on && obj.on("change", _this.childEvents[key]);
        };
        _this.removeChildEvent = function (key, obj) {
            obj && obj.off && obj.off("change", _this.childEvents[key]);
            delete _this.childEvents[key];
        };
        _this.equal = function (value) {
            return _this.rawData == value;
        };
        _this.toJSON = function () {
            return _this.rawData;
        };
        _this.data = {};
        _this.rawData = data;
        _this.childEvents = {};
        var self = _this;
        Object.keys(data).forEach(function (key) {
            self.addChild(key, data[key]);
        });
        return _this;
    }
    return LatteObject;
}(class_1.LatteClass));
exports.default = LatteObject;
;
