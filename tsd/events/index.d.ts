export default class EventEmitter {
    private events;
    constructor();
    on(event: string, fn: Function): EventEmitter;
    addEventListener: (event: string, fn: Function) => EventEmitter;
    once(event: string, fn: Function): this;
    off(event: string, fn: Function): EventEmitter;
    removeListener: (event: string, fn: Function) => EventEmitter;
    removeAllListeners: (event: string, fn: Function) => EventEmitter;
    removeEventListener: (event: string, fn: Function) => EventEmitter;
    emit(event: string, ...args: any[]): EventEmitter;
    listeners(event: any): Function[];
    hasEvent(event: any, func: any): boolean;
    hasListeners: (event: string) => boolean;
}
