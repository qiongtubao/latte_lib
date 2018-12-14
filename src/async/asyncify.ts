import utils from '../utils/index'
import initialParams from './internal/initialParams';
import setImmediate from './internal/setImmediate';
let isObject = utils.isObject;

export default function asyncify(func) {
    return initialParams(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function (value) {
                invokeCallback(callback, null, value);
            }, function (err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

function invokeCallback(callback?, error?, value?) {
    try {
        callback(error, value);
    } catch (e) {
        setImmediate(rethrow, e);
    }
}

function rethrow(error) {
    throw error;
}
