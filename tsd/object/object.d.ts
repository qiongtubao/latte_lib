import { LatteClass } from "./class";
export default class LatteObject extends LatteClass {
    protected data: object;
    protected rawData: object;
    protected childEvents: object;
    addChildEvent: (key: string, obj: LatteClass) => void;
    removeChildEvent: (key: string, obj: LatteClass) => void;
    constructor(data: object);
    equal: (value: any) => boolean;
    toJSON: () => object;
}
