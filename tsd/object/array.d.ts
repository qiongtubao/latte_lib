import { LatteClass } from "./class";
export default class LatteArray extends LatteClass {
    protected data: Array<any>;
    protected rawData: Array<any>;
    changeEvent: Function;
    addChildEvent: (key: any, value: any) => void;
    removeChildEvent: (key: any, value?: any) => void;
    length: number;
    constructor(data: Array<any>);
    push: (o: any) => void;
    pop: () => void;
    unshift: (...args: any[]) => void;
    shift: () => void;
    splice: (startIndex: any, num: any, ...args: any[]) => void;
    indexOf: (data: any) => number;
    forEach: (callback: (value: any, index?: number, array?: any[]) => void) => void;
    map: (callback: (value: any, index?: number, array?: any[]) => void) => void;
    filter: (callback: (value: any, index?: number, array?: any[]) => boolean) => void;
    removeValue: (value: any, num?: number) => void;
    diff: (value: any[]) => {};
}
