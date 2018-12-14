"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initialParams_1 = require("./initialParams");
const wrapAsync_1 = require("./wrapAsync");
function applyEach(eachfn) {
    return function (fns, ...args) {
        let go = initialParams_1.default(function (args, callback) {
            return eachfn(fns, (fn, cb) => {
                wrapAsync_1.default(fn).apply(this, args.concat(cb));
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
exports.default = applyEach;
