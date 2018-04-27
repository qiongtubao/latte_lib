import utils from '../utils/index'
let isNode = utils.isNode;
/**
  @class events
  @namespace latte_lib
  @module events
*/

let hasListeners = (event: string) => {
  return !!this.listeners(event).length;
};
export default class EventEmitter {
  private events: object;
  constructor() {
    this.events = {};
  }
  /**
   * @desc 绑定监听事件
    @method on
    @public
    @param {String} event
    @param {Function} fn
    @return {EventEmitter} this
    @example

      var Events = require("latte_lib").events;
      var events = new Events();
      events.on("hello", function() {
        log("latte");
      });
      events.emit("hello");
  */
  on(event: string, fn: Function): EventEmitter {
    this.events = this.events || {};
    (this.events[event] = this.events[event] || [])
      .push(fn);
    return this;
  };
  addEventListener = this.on;
  /**
   * @desc 绑定一次性监听事件
    @method once
    @public
    @param {String} event
    @param {Function} fn
    @return {EventEmitter} this
    @example

      var Events = require("latte_lib").events;
      var events = new Events();
      events.once("hello", function() {
        log("latte");
      });
      events.emit("hello");
      events.emit("hello");
  */
  once(event: string, fn: Function) {
    var self = this;
    this.events = this.events || {};

    let on = function () {
      self.off(event, on);
      fn.apply(this, arguments);
    }
    fn['on'] = on;
    this.on(event, on);
    return this;
  };
  /**
   *@desc 取消绑定监听的事件
    @method off
    @public
    @param {String} event
    @param {Function} fn
    @return {EventEmitter} this
    @example

      var Events = require("latte_lib").events;
      var events = new Events();
      var fun = function() {
        log("latte");
      };
      events.once("hello", fun);
      events.emit("hello", fun);
  */
  off(event: string, fn: Function): EventEmitter {
    this.events = this.events || {};

    // all
    if (0 == arguments.length) {
      this.events = {};
      return this;
    }

    // specific event
    var callbacks = this.events[event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this.events[event];
      return this;
    }

    // remove specific handler
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
  removeListener = this.off
  removeAllListeners = this.off
  removeEventListener = this.off
  /**
   * @desc 触发事件
    @method emit
    @public
    @param {string} event
    @return {EventEmitter} this
    @example

      var Events = require("latte_lib").events;
      var events = new Events();
      var fun = function() {
        log("latte");
      };
      events.on("hello", fun);
      event.emit("hello")
  */
  emit(event: string, ...args): EventEmitter {
    this.events = this.events || {};
    let callbacks = this.events[event];
    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };
  /**
   *  @desc 查看监听事件函数的队列
      @method listeners
      @public
      @param {string} event
      @return {Function[]}
      @example

        var Events = require("latte_lib").events;
        var events = new Events();
        var fun = function() {
          log("latte");
        };
        log(events.listeners("hello"));
  */
  listeners(event): Function[] {
    this.events = this.events || {};
    return this.events[event] || [];
  };
  /**
   * @desc 判断是否有存在
    @method hasListeners
    @public
    @param {string} event
    @return {boolean}
    @example

      var Events = require("latte_lib").events;
      var events = new Events();
      var fun = function() {
        log("latte");
      };
      log(events.hasListeners("hello"));
  */
  hasEvent(event, func): boolean {
    return this.listeners(event).indexOf(func) != -1;
  }
  hasListeners = hasListeners

}



