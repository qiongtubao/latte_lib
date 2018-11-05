import Events from "../events/index";
export interface SetResult {
    oldValue?: any;
    nowValue?: any;
}
export declare class LatteClass extends Events {
    protected data: any;
    protected rawData: any;
    constructor(data: any);
    get: (key: any) => any;
    _create: (key: any[]) => any;
    set: (key: any, value: any, mode?: number) => SetResult;
    addChildEvent: Function;
    removeChildEvent: Function;
    toJSON: () => any;
    static create(data: any): LatteClass;
    protected addChild: (key: any, value: any) => any;
    protected removeChild: (key: any, value: any) => SetResult;
    _set: (key: any, value: any) => SetResult;
    merge: (key: any, value: any) => SetResult;
    static isLatteObject(value: any): boolean;
}
