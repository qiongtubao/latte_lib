export default class EventEmitter {
    private events;
    constructor();
    on(event: string, fn: Function): EventEmitter;
    once(event: string, fn: Function): this;
    off(event: string, fn: Function): EventEmitter;
    emit(event: string, ...args: any[]): EventEmitter;
    listeners(event: any): Function[];
    hasEvent(event: any, func: any): boolean;
    hasListeners: Function;
    removeListener: Function;
    removeAllListeners: Function;
    removeEventListener: Function;
    addEventListener: Function;
}
