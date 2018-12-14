import slice from './slice';

export default function (fn) {
    return function (...args) {
        var callback = args.pop();
        fn.call(this, args, callback);
    };
}