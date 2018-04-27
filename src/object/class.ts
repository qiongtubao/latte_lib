import Events from "../events/index"
import utils from "../utils/index"
import { unwatchFile } from "fs";
export interface SetResult {
  oldValue?: any;
  nowValue?: any;
}
export class LatteClass extends Events {
  protected data: any;
  protected rawData: any;
  constructor(data) {
    super();
  }
  get = (key) => {
    if (this.data[key]) {
      return this.data[key]
    }
    if (key === "this" && !this.data[key]) {
      return this;
    }
    if (!utils.isArray(key)) {
      key = key.toString().split('.');
    }
    let l = this;
    while (key.length != 1) {
      let k = key.shift();
      if (!l || !l.data || !l.data[k]) {
        return undefined;
      }
      l = l.data[k];
    }
    if (!l || !l.data || !l.data[key[0]]) {
      return undefined;
    }
    if (utils.isFunction(l.data[key[0]])) {
      return l.data[key[0]].bind(l);
    }
    return l.data[key[0]];
  }
  _create = (key: any[]): any => {
    let parent;
    let o = this;
    for (let i = 0, len = key.length; i < len; i++) {
      parent = o;
      o = o.get(key[i]);
      if (!o) {
        let result = parent.set(key[i], {});
        o = result.nowValue;
      }
    }
    return o;
  }
  set = (key, value, mode): SetResult => {
    key = key.toString();
    if (mode) {
      return this.merge(key, value);
    }
    let result = this._set(key, value);
    if (key.indexOf('.') === -1) {
      this.emit('change', key, result.nowValue, result.oldValue);
    }
    this.emit('set', key, result.nowValue, result.oldValue);
    this.emit(key, result.nowValue, result.oldValue)
    return result;
  }
  addChildEvent: Function;
  removeChildEvent: Function;
  toJSON = () => {
    return this.rawData;
  }
  static create(data): LatteClass {
    if (LatteClass.isLatteObject(data)) {
      return data;
    }
    if (utils.isArray(data)) {
      let LatteArray = require('./array').default;
      return new LatteArray(data);
    }
    if (utils.isObject(data)) {
      let LatteObject = require('./object').default;
      return new LatteObject(data);
    }

  }

  protected addChild = (key, value) => {
    let obj = LatteClass.create(value);
    this.rawData[key] = obj ? obj.toJSON ? obj.toJSON() : obj : value;
    if (obj) {
      this.addChildEvent(key, obj);
      this.data[key] = obj;
      return obj;
    } else {
      this.data[key] = value;
      return value;
    }
  }
  protected removeChild = (key, value): SetResult => {
    if (!this.data[key]) {
      this.removeChildEvent(key, this.data[key]);
    }
    let oldValue = this.data[key];
    if (utils.isArray(this.data)) {
      this.data[key] = undefined;
      this.rawData[key] = undefined;
    } else {
      delete this.data[key];
      delete this.rawData[key];
    }

    return {
      oldValue: oldValue,
      nowValue: undefined
    }
  }

  _set = (key, value): SetResult => {
    if (!utils.isArray(key)) {
      key = key.toString().split('.');
    }
    if (key.length != 1) {
      let k = key.pop();
      let o = this._create(key);
      return o.set(k, value, undefined);
    }
    let oldValue = this.data[key[0]];
    let obj = this.addChild(key[0], value);
    if (obj == undefined) {
      delete this.data[key[0]];
      delete this.rawData[key[0]];
    }
    return {
      oldValue: oldValue,
      nowValue: obj
    };
  }

  merge = (key, value): SetResult => {
    if (!utils.isArray(key)) {
      key = key.toString().splice('.');
    }
    if (key.length != 1) {
      let k = key.pop();
      let o = this._create(key);
      return o.merge(k, value);
    }
    let oldValue = this.data[key[0]];
    var self = this;
    value = value.toJSON ? value.toJSON() : value;
    Object.keys(value).forEach(function (k) {
      oldValue.set(k, value[k], true);
    });
    return {
      oldValue: oldValue,
      nowValue: oldValue
    };
  }
  static isLatteObject(value): boolean {
    return false;
  }
}

