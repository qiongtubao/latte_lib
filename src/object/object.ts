
import Events from "../events/index"
import utils from "../utils/index"
import { LatteClass, SetResult } from "./class";

export default class LatteObject extends LatteClass {
  protected data: object;
  protected rawData: object;
  protected childEvents: object;
  addChildEvent = (key: string, obj: LatteClass) => {
    var self = this;
    this.childEvents[key] = (name, value, oldValue) => {
      self.emit(key + "." + name, value, oldValue);
      self.emit("change", key + "." + name, value, oldValue);
    }
    obj && obj.on && obj.on("change", this.childEvents[key]);
  }
  removeChildEvent = (key: string, obj: LatteClass) => {
    obj && obj.off && obj.off("change", this.childEvents[key]);
    delete this.childEvents[key];
  }

  constructor(data: object) {
    super(data);
    this.data = {};
    this.rawData = data;
    this.childEvents = {};
    //for(let i in data) 会把对象里面prototype内属性都添加的
    var self = this;
    Object.keys(data).forEach((key) => {
      self.addChild(key, data[key]);
    });
  }



  equal = (value): boolean => {
    return this.rawData == value;
  }
  toJSON = () => {
    return this.rawData;
  }
};