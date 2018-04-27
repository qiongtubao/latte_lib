"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isWindow = process ? false : window ? true : false;
var isNode = process ? true : false;
var inherits = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var ctor = args[0];
    var superCtor = args[1];
    if (typeof Object.create === "function") {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }
    else {
        ctor.super_ = superCtor;
        var TempCtor = function () { };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
    }
    if (args.length > 2) {
        args = Array.prototype.slice.call(args, 2);
        args.forEach(function (arg) {
            for (var key in arg) {
                ctor.prototype[key] = arg[key];
            }
        });
    }
};
var nextTick = (function () {
    if (!isNode || !(process.nextTick)) {
        if (window && typeof window.setImmediate === "function") {
            return window.setImmediate;
        }
        else {
            return function (fn) {
                setTimeout(fn, 0);
            };
        }
    }
    else {
        return process.nextTick;
    }
})();
var isArray = Array.isArray.bind(Array);
var isObject = function (obj) {
    if (!obj) {
        return false;
    }
    return obj.constructor == Object;
};
var noop = function () { };
var forOwn = function (object, iteratee) {
    object = Object(object);
    Object.keys(object).forEach(function (key) { return iteratee(object[key], key, object); });
};
var MAX_SAFE_INTEGER = 9007199254740991;
var isLength = function (value) {
    return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
};
var isArrayLike = function (value) {
    return value != null && typeof value != 'function' && isLength(value.length);
};
var baseProperty = function (key) {
    return function (object) { return object == null ? undefined : object[key]; };
};
var last = function (array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
};
var jsonForEach = function (data, iterator) {
    Object.keys(data).forEach(function (key) {
        iterator(key, data[key]);
    });
};
var getClassName = function (obj) {
    if (!obj) {
        return undefined;
    }
    var allClass = ["Array", "String", "Number", "Date", "Boolean", "Function", "Error"];
    for (var i = 0, len = allClass.length; i < len; i++) {
        if (module.exports.default["is" + allClass[i]](obj)) {
            return allClass[i].toLowerCase();
        }
    }
    return "object";
};
var isNumber = function (value) {
    return typeof value == 'number';
};
var isBoolean = function (value) {
    return value === true || value === false;
};
var isFunction = function (value) {
    var tag = (typeof value).toString();
    return tag === "function";
};
var isDate = function (value) {
    return value.constructor == Date;
};
var isRegExp = function (value) {
    return isObjectLike(value) && isFunction(value.test);
};
var isSymbol = function (value) {
    var type = typeof value;
    return type === 'symbol';
};
var isObjectLike = function (value) {
    return typeof value == 'object' && value !== null;
};
var isError = function (value) {
    return isObjectLike(value) && isString(value.message) && isString(value.name);
};
var isString = function (value) {
    var type = typeof value;
    return type == 'string';
};
var undefineds = function (array) {
    var map = [];
    for (var i_1 = 0, len = array[0]; i_1 < len; i_1++) {
        map.push(undefined);
    }
    return map;
};
var copy = function (data) {
    return JSON.parse(JSON.stringify(data));
};
exports.default = {
    isWindow: isWindow, isNode: isNode,
    extends: inherits, inherits: inherits, nextTick: nextTick, copy: copy,
    isArray: isArray, isObject: isObject, isArrayLike: isArrayLike, isNumber: isNumber,
    isString: isString, isError: isError, isRegExp: isRegExp, isSymbol: isSymbol,
    isFunction: isFunction, isDate: isDate, isBoolean: isBoolean, getClassName: getClassName,
    forOwn: forOwn, baseProperty: baseProperty, jsonForEach: jsonForEach,
    last: last, undefineds: undefineds,
    noop: noop
};
