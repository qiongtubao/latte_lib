'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../utils/index");
var promise_1 = require("../../promise");
var isObject = index_1.default.isObject;
module.exports = RequestBase;
function RequestBase(obj) {
    if (obj)
        return mixin(obj);
}
function mixin(obj) {
    for (var key in RequestBase.prototype) {
        obj[key] = RequestBase.prototype[key];
    }
    return obj;
}
RequestBase.prototype.clearTimeout = function _clearTimeout() {
    clearTimeout(this._timer);
    clearTimeout(this._responseTimeoutTimer);
    delete this._timer;
    delete this._responseTimeoutTimer;
    return this;
};
RequestBase.prototype.parse = function parse(fn) {
    this._parser = fn;
    return this;
};
RequestBase.prototype.responseType = function (val) {
    this._responseType = val;
    return this;
};
RequestBase.prototype.serialize = function serialize(fn) {
    this._serializer = fn;
    return this;
};
RequestBase.prototype.timeout = function timeout(options) {
    if (!options || 'object' !== typeof options) {
        this._timeout = options;
        this._responseTimeout = 0;
        return this;
    }
    for (var option in options) {
        switch (option) {
            case 'deadline':
                this._timeout = options.deadline;
                break;
            case 'response':
                this._responseTimeout = options.response;
                break;
            default:
                console.warn("Unknown timeout option", option);
        }
    }
    return this;
};
RequestBase.prototype.retry = function retry(count, fn) {
    if (arguments.length === 0 || count === true)
        count = 1;
    if (count <= 0)
        count = 0;
    this._maxRetries = count;
    this._retries = 0;
    this._retryCallback = fn;
    return this;
};
var ERROR_CODES = [
    'ECONNRESET',
    'ETIMEDOUT',
    'EADDRINFO',
    'ESOCKETTIMEDOUT'
];
RequestBase.prototype._shouldRetry = function (err, res) {
    if (!this._maxRetries || this._retries++ >= this._maxRetries) {
        return false;
    }
    if (this._retryCallback) {
        try {
            var override = this._retryCallback(err, res);
            if (override === true)
                return true;
            if (override === false)
                return false;
        }
        catch (e) {
            console.error(e);
        }
    }
    if (res && res.status && res.status >= 500 && res.status != 501)
        return true;
    if (err) {
        if (err.code && ~ERROR_CODES.indexOf(err.code))
            return true;
        if (err.timeout && err.code == 'ECONNABORTED')
            return true;
        if (err.crossDomain)
            return true;
    }
    return false;
};
RequestBase.prototype._retry = function () {
    this.clearTimeout();
    if (this.req) {
        this.req = null;
        this.req = this.request();
    }
    this._aborted = false;
    this.timedout = false;
    return this._end();
};
RequestBase.prototype.then = function then(resolve, reject) {
    if (!this._fullfilledPromise) {
        var self_1 = this;
        if (this._endCalled) {
            console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
        }
        this._fullfilledPromise = new promise_1.default(function (innerResolve, innerReject) {
            self_1.end(function (err, res) {
                if (err)
                    innerReject(err);
                else
                    innerResolve(res);
            });
        });
    }
    return this._fullfilledPromise.then(resolve, reject);
};
RequestBase.prototype['catch'] = function (cb) {
    return this.then(undefined, cb);
};
RequestBase.prototype.use = function use(fn) {
    fn(this);
    return this;
};
RequestBase.prototype.ok = function (cb) {
    if ('function' !== typeof cb)
        throw Error("Callback required");
    this._okCallback = cb;
    return this;
};
RequestBase.prototype._isResponseOK = function (res) {
    if (!res) {
        return false;
    }
    if (this._okCallback) {
        return this._okCallback(res);
    }
    return res.status >= 200 && res.status < 300;
};
RequestBase.prototype.get = function (field) {
    return this._header[field.toLowerCase()];
};
RequestBase.prototype.getHeader = RequestBase.prototype.get;
RequestBase.prototype.set = function (field, val) {
    if (isObject(field)) {
        for (var key in field) {
            this.set(key, field[key]);
        }
        return this;
    }
    this._header[field.toLowerCase()] = val;
    this.header[field] = val;
    return this;
};
RequestBase.prototype.unset = function (field) {
    delete this._header[field.toLowerCase()];
    delete this.header[field];
    return this;
};
RequestBase.prototype.field = function (name, val) {
    if (null === name || undefined === name) {
        throw new Error('.field(name, val) name can not be empty');
    }
    if (this._data) {
        throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
    }
    if (isObject(name)) {
        for (var key in name) {
            this.field(key, name[key]);
        }
        return this;
    }
    if (Array.isArray(val)) {
        for (var i in val) {
            this.field(name, val[i]);
        }
        return this;
    }
    if (null === val || undefined === val) {
        throw new Error('.field(name, val) val can not be empty');
    }
    if ('boolean' === typeof val) {
        val = '' + val;
    }
    this._getFormData().append(name, val);
    return this;
};
RequestBase.prototype.abort = function () {
    if (this._aborted) {
        return this;
    }
    this._aborted = true;
    this.xhr && this.xhr.abort();
    this.req && this.req.abort();
    this.clearTimeout();
    this.emit('abort');
    return this;
};
RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
    switch (options.type) {
        case 'basic':
            this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
            break;
        case 'auto':
            this.username = user;
            this.password = pass;
            break;
        case 'bearer':
            this.set('Authorization', 'Bearer ' + user);
            break;
    }
    return this;
};
RequestBase.prototype.withCredentials = function (on) {
    if (on == undefined)
        on = true;
    this._withCredentials = on;
    return this;
};
RequestBase.prototype.redirects = function (n) {
    this._maxRedirects = n;
    return this;
};
RequestBase.prototype.maxResponseSize = function (n) {
    if ('number' !== typeof n) {
        throw TypeError("Invalid argument");
    }
    this._maxResponseSize = n;
    return this;
};
RequestBase.prototype.toJSON = function () {
    return {
        method: this.method,
        url: this.url,
        data: this._data,
        headers: this._header,
    };
};
RequestBase.prototype.send = function (data) {
    var isObj = isObject(data);
    var type = this._header['content-type'];
    if (this._formData) {
        throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
    }
    if (isObj && !this._data) {
        if (Array.isArray(data)) {
            this._data = [];
        }
        else if (!this._isHost(data)) {
            this._data = {};
        }
    }
    else if (data && this._data && this._isHost(this._data)) {
        throw Error("Can't merge these send calls");
    }
    if (isObj && isObject(this._data)) {
        for (var key in data) {
            this._data[key] = data[key];
        }
    }
    else if ('string' == typeof data) {
        if (!type)
            this.type('form');
        type = this._header['content-type'];
        if ('application/x-www-form-urlencoded' == type) {
            this._data = this._data
                ? this._data + '&' + data
                : data;
        }
        else {
            this._data = (this._data || '') + data;
        }
    }
    else {
        this._data = data;
    }
    if (!isObj || this._isHost(data)) {
        return this;
    }
    if (!type)
        this.type('json');
    return this;
};
RequestBase.prototype.sortQuery = function (sort) {
    this._sort = typeof sort === 'undefined' ? true : sort;
    return this;
};
RequestBase.prototype._finalizeQueryString = function () {
    var query = this._query.join('&');
    if (query) {
        this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
    }
    this._query.length = 0;
    if (this._sort) {
        var index = this.url.indexOf('?');
        if (index >= 0) {
            var queryArr = this.url.substring(index + 1).split('&');
            if ('function' === typeof this._sort) {
                queryArr.sort(this._sort);
            }
            else {
                queryArr.sort();
            }
            this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
        }
    }
};
RequestBase.prototype._appendQueryString = function () { console.trace("Unsupported"); };
RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
    if (this._aborted) {
        return;
    }
    var err = new Error(reason + timeout + 'ms exceeded');
    err.timeout = timeout;
    err.code = 'ECONNABORTED';
    err.errno = errno;
    this.timedout = true;
    this.abort();
    this.callback(err);
};
RequestBase.prototype._setTimeouts = function () {
    var self = this;
    if (this._timeout && !this._timer) {
        this._timer = setTimeout(function () {
            self._timeoutError('Timeout of ', self._timeout, 'ETIME');
        }, this._timeout);
    }
    if (this._responseTimeout && !this._responseTimeoutTimer) {
        this._responseTimeoutTimer = setTimeout(function () {
            self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
        }, this._responseTimeout);
    }
};
