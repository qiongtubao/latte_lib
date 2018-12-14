import slice from './slice';
import initialParams from './initialParams';
import wrapAsync from './wrapAsync';

export default function applyEach(eachfn) {
    return function(fns, ...args) {
        let go = initialParams(function(args, callback) {
            return eachfn(fns,  (fn, cb) => {
                wrapAsync(fn).apply(this, args.concat(cb));
            }, callback);
        });
        if (args.length) {
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
}
