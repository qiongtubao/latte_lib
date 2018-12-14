var iteratorSymbol = typeof Symbol === 'function' && (<any>Symbol).iterator;

export default function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
}