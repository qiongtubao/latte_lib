let isWindow = process ? false : window ? true : false;
let isNode = process ? true : false;
/**
*
*	@method inherits
*	@param {class} ctor     class
*	@param {class} superCtor    parentClass
*	@sync
*	@all
*	@static
*	@public
*	@since 0.0.1
*	@example
    var latte_lib = require("latte_lib");
    var A = function() {
      this.name = "a";
    };
    (function() {
      this.getName = function() {
        return this.name;
      }
    }).call(A.prototype);
    var B = function() {
      this.name = "b";
    }
    latte_lib.inherits(B, A);
    var b = new B();
    var a = new A();
    log(b.getName());//"b"
    log(a.getName());//"a";
*/
let inherits = (...args) => {
  let ctor = args[0];
  let superCtor = args[1];
  if (typeof Object.create === "function") {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  } else {
    ctor.super_ = superCtor
    let TempCtor = function () { }
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
  if (args.length > 2) {
    args = Array.prototype.slice.call(args, 2);
    args.forEach(function (arg) {
      for (var key in arg) {
        ctor.prototype[key] = arg[key];
      }
    });
  }
}
let nextTick = (fn: Function) => {
  if (!isNode || !(process.nextTick)) {
    if (window && typeof window.setImmediate === "function") {
      return window.setImmediate;
    } else {
      return function (fn) {
        setTimeout(fn, 0);
      }
    }
  } else {
    return process.nextTick;
  }
}
let isArray = Array.isArray.bind(Array);
let isObject = (obj): boolean => {
  if (!obj) { return false; }
  return obj.constructor == Object;
}
let noop = () => { }
let forOwn = (object, iteratee) => {
  object = Object(object)
  Object.keys(object).forEach((key) => iteratee(object[key], key, object))
}
let MAX_SAFE_INTEGER = 9007199254740991
let isLength = (value) => {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER
}
let isArrayLike = (value) => {
  return value != null && typeof value != 'function' && isLength(value.length)
}
let baseProperty = (key) => {
  return (object) => object == null ? undefined : object[key]
}
let last = (array: Array<any>): any => {
  const length = array == null ? 0 : array.length
  return length ? array[length - 1] : undefined
}
let jsonForEach = (data, iterator) => {
  Object.keys(data).forEach(function (key) {
    iterator(key, data[key]);
  });
}




////chai
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
}
let isNumber = (value) => {
  return typeof value == 'number'
}
let isBoolean = (value) => {
  return value === true || value === false;
}
let isFunction = (value) => {
  let tag = (typeof value).toString();
  return tag === "function";
}
let isDate = (value) => {
  return value.constructor == Date;
}
let isRegExp = (value) => {
  return isObjectLike(value) && isFunction(value.test)
}
let isSymbol = (value) => {
  const type = typeof value
  return type === 'symbol'
}
let isObjectLike = (value) => {
  return typeof value == 'object' && value !== null
}
let isError = (value) => {
  return isObjectLike(value) && isString(value.message) && isString(value.name);
}
let isString = function (value) {
  const type = typeof value
  return type == 'string'
}



export default {
  isWindow, isNode, //env
  extends: inherits, inherits, nextTick, //base
  isArray, isObject, isArrayLike, isNumber,
  isString, isError, isRegExp, isSymbol,
  isFunction, isDate, isBoolean, getClassName,//is Class
  forOwn, baseProperty, jsonForEach,//object
  last,  //array
  noop
}
