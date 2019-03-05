
import Events from "../events/index"
import utils from "../utils/index"
import { LatteClass, SetResult } from "./class";


export default class LatteArray extends LatteClass {
  protected data: Array<any>;
  protected rawData: Array<any>;
  changeEvent: Function;
  addChildEvent = (key, value) => {
    value.on("change", this.changeEvent);
  }
  removeChildEvent = (key, value?) => {
    if (!value) {
      value = key;
      key = undefined;
    }
    value.off && value.off("change", this.changeEvent);
    delete this.data[key];
  }
  length: number;
  constructor(data: Array<any> = []) {
    super(data);
    this.data = [];
    this.rawData = data;
    let self = this;
    this.changeEvent = function (name, value, oldValue) {
      let index = self.data.indexOf(this);
      if (index != -1) {
        self.emit(index + "." + name, value, oldValue, data);
        self.emit("change", index + "." + name, value, oldValue, data);
      } else {
        self.removeChild(this, undefined);
      }
    }
    Object.defineProperty(this, "length", {
      get: () => {
        return self.data.length;
      },
      set: () => {
        throw new Error('暂时警用直接设置length 进行删除操作')
      }
    });
    data.forEach((value, key) => {
      self.addChild(key, value);
    });
  }
  push = (o) => {
    let key = this.length;
    let data = this.set(key, o, undefined);
    this.emit("splice", key, [], [data.nowValue]);
    this.emit("change", key, data.nowValue);
  }
  pop = () => {
    let data = this.set(this.data.length - 1, undefined, undefined);
    this.data.pop();
    this.emit("splice", this.data.length, [data.oldValue], []);
  }
  unshift = (...args) => {
    this.data.unshift(...args.map((o) => {
      return undefined;
    }));
    var self = this;
    let unshiftArray = args.map(function (value, index) {
      return self.addChild(index, value);
    });
    this.emit('splice', 0, [], unshiftArray);
    for (let i = 0, len = this.data.length; i < len; i++) {
      this.emit("change", i, this.data[i], this.data[i + 1]);
    }
  }

  shift = () => {
    let data = this.removeChild(0, this.data[0]);
    let oldValue = this.data.shift();
    this.emit("splice", 0, [oldValue], []);
    this.emit("change", 0, this.data[0], oldValue);
    for (let i = 1, len = this.data.length; i < len; i++) {
      this.emit("change", i, this.data[i], this.data[i - 1]);
    }
    this.emit("change", this.data.length, undefined);
  }
  splice = (startIndex, num, ...args) => {
    let oLength = this.data.length;
    let adds = utils.undefineds([args.length]);
    let olds = [];
    for (let i = 0; i < num; i++) {
      let old = this.data[startIndex + i];
      olds.push(this.removeChild(startIndex + i, this.data[startIndex + i]).oldValue);
    }
    this.data.splice(startIndex, num, ...adds);
    let self = this;
    adds = args.map((a, index) => {
      self.addChild(startIndex + index, a);
    });
    this.emit('splice', startIndex, olds, adds);

    for (let i = 0; i < num; i++) {
      self.emit("change", i + startIndex, self.data[i], olds[i]);
    }
    let off = self.data.length - oLength;
    if (off !== 0) {
      for (let i = startIndex + num, len = Math.max(oLength, self.data.length); i < len; i++) {
        self.emit("change", i, self.data[i], self.data[i + off]);
      }
    }


    /** 
    for (var i = 0, len = Math.max(oLength, self.data.length); i < len; i++) {
      self.emit("change", i, self.data[i]);
    }
    */
  }
  indexOf = (data) => {
    return this.data.indexOf(data);
  }
  forEach = (callback: (value: any, index?: number, array?: any[]) => void): void => {
    this.data.forEach(callback);
  }
  map = (callback: (value: any, index?: number, array?: any[]) => void) => {
    this.data.map(callback);
  }
  filter = (callback: (value: any, index?: number, array?: any[]) => boolean) => {
    this.data.filter(callback);
  }
  removeValue = (value: any, num?: number) => {
    let index;
    if (num === undefined) {
      while ((index = this.indexOf(value)) != -1) {
        this.splice(index, 1);
      }
    } else {
      for (let i = 0; i < num; i++) {
        if ((index = this.indexOf(value)) != -1) {
          this.splice(index, 1);
        }
      }
    }
  }
  slice(start: number, end?: number) {
    let result = new LatteArray();
    if (start < 0) start = this.data.length + start;
    if (!end) end = this.data.length - 1;
    if (end < 0) end = this.data.length + end;
    for (; start < end; start++) {
      result.push(this.data[start]);
    }
    return result;

  }

  /**
   * 只针对子对象
   */
  diff = (value: any[]) => {
    let change = {};
    this.data.forEach((v, index) => {
      let nowIndex = value.indexOf(v);
      if (nowIndex !== -1) {
        change[index] = nowIndex;
      }
    });
    return change;
  }
}