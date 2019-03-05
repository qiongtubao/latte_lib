"use strict";
import * as util from "./util"

let isPrimitive = util.isPrimitive;

module.exports = function (Promise) {
    let returner = function () {
        return this;
    };
    let thrower = function () {
        throw this;
    };
    let returnUndefined = function () { };
    let throwUndefined = function () {
        throw undefined;
    };

    let wrapper = function (value, action) {
        if (action === 1) {
            return function () {
                throw value;
            };
        } else if (action === 2) {
            return function () {
                return value;
            };
        }
    };


    Promise.prototype["return"] =
        Promise.prototype.thenReturn = function (value) {
            if (value === undefined) return this.then(returnUndefined);

            if (isPrimitive(value)) {
                return this._then(
                    wrapper(value, 2),
                    undefined,
                    undefined,
                    undefined,
                    undefined
                );
            } else if (value instanceof Promise) {
                value._ignoreRejections();
            }
            return this._then(returner, undefined, undefined, value, undefined);
        };

    Promise.prototype["throw"] =
        Promise.prototype.thenThrow = function (reason) {
            if (reason === undefined) return this.then(throwUndefined);

            if (isPrimitive(reason)) {
                return this._then(
                    wrapper(reason, 1),
                    undefined,
                    undefined,
                    undefined,
                    undefined
                );
            }
            return this._then(thrower, undefined, undefined, reason, undefined);
        };
};
