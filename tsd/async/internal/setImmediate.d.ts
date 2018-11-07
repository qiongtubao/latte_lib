/// <reference types="node" />
export declare var hasSetImmediate: typeof setImmediate;
export declare var hasNextTick: boolean;
export declare function fallback(fn: any): void;
export declare function wrap(defer: any): (fn: any, ...args: any[]) => void;
declare const _default: (fn: any, ...args: any[]) => void;
export default _default;
