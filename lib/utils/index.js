"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isWindow = (function () {
    try {
        if (window) {
            return true;
        }
    }
    catch (e) {
        return false;
    }
    try {
        if (process) {
            return false;
        }
    }
    catch (e) {
        return true;
    }
    return false;
})();
let isNode = isWindow ? false : global.process ? true : false;
let inherits = (...args) => {
    let ctor = args[0];
    let superCtor = args[1];
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
        let TempCtor = function () { };
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
let nextTick = (() => {
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
let isArray = Array.isArray.bind(Array);
let isObject = (obj) => {
    if (!obj) {
        return false;
    }
    return obj.constructor == Object;
};
let noop = (...args) => { };
let forOwn = (object, iteratee) => {
    object = Object(object);
    Object.keys(object).forEach((key) => iteratee(object[key], key, object));
};
let MAX_SAFE_INTEGER = 9007199254740991;
let isLength = (value) => {
    return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
};
let isArrayLike = (value) => {
    return value != null && typeof value != 'function' && isLength(value.length);
};
let baseProperty = (key) => {
    return (object) => object == null ? undefined : object[key];
};
let last = (array) => {
    const length = array == null ? 0 : array.length;
    return length ? array[length - 1] : undefined;
};
let jsonForEach = (data, iterator) => {
    Object.keys(data).forEach(function (key) {
        iterator(key, data[key]);
    });
};
let getClassName = function (obj) {
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
let isNumber = (value) => {
    return typeof value == 'number';
};
let isBoolean = (value) => {
    return value === true || value === false;
};
let isFunction = (value) => {
    let tag = (typeof value).toString();
    return tag === "function";
};
let isDate = (value) => {
    return value.constructor == Date;
};
let isRegExp = (value) => {
    return isObjectLike(value) && isFunction(value.test);
};
let isSymbol = (value) => {
    const type = typeof value;
    return type === 'symbol';
};
let isObjectLike = (value) => {
    return typeof value == 'object' && value !== null;
};
let isError = (value) => {
    return isObjectLike(value) && isString(value.message) && isString(value.name);
};
let isString = function (value) {
    const type = typeof value;
    return type == 'string';
};
let undefineds = (array) => {
    let map = [];
    for (let i = 0, len = array[0]; i < len; i++) {
        map.push(undefined);
    }
    return map;
};
let copy = (data) => {
    if (data == null) {
        return null;
    }
    return JSON.parse(JSON.stringify(data));
};
let isNullOrUndefined = (arg) => {
    return arg == null;
};
let isNull = (arg) => {
    return arg === null;
};
exports.default = {
    isWindow, isNode,
    extends: inherits, inherits, nextTick, copy,
    isArray, isObject, isArrayLike, isNumber,
    isString, isError, isRegExp, isSymbol, isNull, isNullOrUndefined,
    isFunction, isDate, isBoolean, getClassName,
    forOwn, baseProperty, jsonForEach,
    last, undefineds,
    noop
};
