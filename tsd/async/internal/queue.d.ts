export default function queue(worker: any, concurrency: any, payload?: any): {
    _tasks: any;
    concurrency: any;
    payload: any;
    saturated: (...args: any[]) => void;
    unsaturated: (...args: any[]) => void;
    buffer: number;
    empty: (...args: any[]) => void;
    drain: (...args: any[]) => void;
    error: (...args: any[]) => void;
    started: boolean;
    paused: boolean;
    push: (data: any, callback: any) => void;
    kill: () => void;
    unshift: (data: any, callback: any) => void;
    remove: (testFn: any) => void;
    process: () => void;
    length: () => any;
    running: () => number;
    workersList: () => any[];
    idle: () => boolean;
    pause: () => void;
    resume: () => void;
};
