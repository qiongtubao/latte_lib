import _eachOfLimit from './internal/eachOfLimit';
import wrapAsync from './internal/wrapAsync';
export default function eachOfLimit(coll, limit, iteratee, callback) {
    _eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
}