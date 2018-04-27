"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var root;
if (typeof window !== 'undefined') {
    root = window;
}
else if (typeof self !== 'undefined') {
    root = self;
}
else {
    console.warn("Using browser-only version of superagent in non-browser environment");
    root = this;
}
var Events = require('../../events').default;
var RequestBase = require('./request-base');
var index_1 = require("../../utils/index");
var isObject = index_1.default.isObject;
var ResponseBase = require('./response-base');
var Agent = require('./agent-base');
function noop() { }
;
var request = exports = module.exports = function (method, url) {
    if ('function' == typeof url) {
        return new exports.Request('GET', method).end(url);
    }
    if (1 == arguments.length) {
        return new exports.Request('GET', method);
    }
    return new exports.Request(method, url);
};
request.getXHR = function () {
    if (root.XMLHttpRequest
        && (!root.location || 'file:' != root.location.protocol
            || !root.ActiveXObject)) {
        return new XMLHttpRequest;
    }
    else {
        try {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (e) { }
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.6.0');
        }
        catch (e) { }
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
        }
        catch (e) { }
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (e) { }
    }
    throw Error("Browser-only version of superagent could not find XHR");
};
var trim = ''.trim
    ? function (s) { return s.trim(); }
    : function (s) { return s.replace(/(^\s*|\s*$)/g, ''); };
function serialize(obj) {
    if (!isObject(obj))
        return obj;
    var pairs = [];
    for (var key in obj) {
        pushEncodedKeyValuePair(pairs, key, obj[key]);
    }
    return pairs.join('&');
}
function pushEncodedKeyValuePair(pairs, key, val) {
    if (val != null) {
        if (Array.isArray(val)) {
            val.forEach(function (v) {
                pushEncodedKeyValuePair(pairs, key, v);
            });
        }
        else if (isObject(val)) {
            for (var subkey in val) {
                pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
            }
        }
        else {
            pairs.push(encodeURIComponent(key)
                + '=' + encodeURIComponent(val));
        }
    }
    else if (val === null) {
        pairs.push(encodeURIComponent(key));
    }
}
request.serializeObject = serialize;
function parseString(str) {
    var obj = {};
    var pairs = str.split('&');
    var pair;
    var pos;
    for (var i = 0, len = pairs.length; i < len; ++i) {
        pair = pairs[i];
        pos = pair.indexOf('=');
        if (pos == -1) {
            obj[decodeURIComponent(pair)] = '';
        }
        else {
            obj[decodeURIComponent(pair.slice(0, pos))] =
                decodeURIComponent(pair.slice(pos + 1));
        }
    }
    return obj;
}
request.parseString = parseString;
request.types = {
    html: 'text/html',
    json: 'application/json',
    xml: 'text/xml',
    urlencoded: 'application/x-www-form-urlencoded',
    'form': 'application/x-www-form-urlencoded',
    'form-data': 'application/x-www-form-urlencoded'
};
request.serialize = {
    'application/x-www-form-urlencoded': serialize,
    'application/json': JSON.stringify
};
request.parse = {
    'application/x-www-form-urlencoded': parseString,
    'application/json': JSON.parse
};
function parseHeader(str) {
    var lines = str.split(/\r?\n/);
    var fields = {};
    var index;
    var line;
    var field;
    var val;
    for (var i = 0, len = lines.length; i < len; ++i) {
        line = lines[i];
        index = line.indexOf(':');
        if (index === -1) {
            continue;
        }
        field = line.slice(0, index).toLowerCase();
        val = trim(line.slice(index + 1));
        fields[field] = val;
    }
    return fields;
}
function isJSON(mime) {
    return /[\/+]json($|[^-\w])/.test(mime);
}
function Response(req) {
    this.req = req;
    this.xhr = this.req.xhr;
    this.text = ((this.req.method != 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
        ? this.xhr.responseText
        : null;
    this.statusText = this.req.xhr.statusText;
    var status = this.xhr.status;
    if (status === 1223) {
        status = 204;
    }
    this._setStatusProperties(status);
    this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
    this.header['content-type'] = this.xhr.getResponseHeader('content-type');
    this._setHeaderProperties(this.header);
    if (null === this.text && req._responseType) {
        this.body = this.xhr.response;
    }
    else {
        this.body = this.req.method != 'HEAD'
            ? this._parseBody(this.text ? this.text : this.xhr.response)
            : null;
    }
}
ResponseBase(Response.prototype);
Response.prototype._parseBody = function (str) {
    var parse = request.parse[this.type];
    if (this.req._parser) {
        return this.req._parser(this, str);
    }
    if (!parse && isJSON(this.type)) {
        parse = request.parse['application/json'];
    }
    return parse && str && (str.length || str instanceof Object)
        ? parse(str)
        : null;
};
Response.prototype.toError = function () {
    var req = this.req;
    var method = req.method;
    var url = req.url;
    var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
    var err = new Error(msg);
    err.status = this.status;
    err.method = method;
    err.url = url;
    return err;
};
request.Response = Response;
function Request(method, url) {
    var self = this;
    this._query = this._query || [];
    this.method = method;
    this.url = url;
    this.header = {};
    this._header = {};
    this.on('end', function () {
        var err = null;
        var res = null;
        try {
            res = new Response(self);
        }
        catch (e) {
            err = new Error('Parser is unable to parse the response');
            err.parse = true;
            err.original = e;
            if (self.xhr) {
                err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
                err.status = self.xhr.status ? self.xhr.status : null;
                err.statusCode = err.status;
            }
            else {
                err.rawResponse = null;
                err.status = null;
            }
            return self.callback(err);
        }
        self.emit('response', res);
        var new_err;
        try {
            if (!self._isResponseOK(res)) {
                new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
            }
        }
        catch (custom_err) {
            new_err = custom_err;
        }
        if (new_err) {
            new_err.original = err;
            new_err.response = res;
            new_err.status = res.status;
            self.callback(new_err, res);
        }
        else {
            self.callback(null, res);
        }
    });
}
index_1.default.extends(Request, Events);
RequestBase(Request.prototype);
Request.prototype.type = function (type) {
    this.set('Content-Type', request.types[type] || type);
    return this;
};
Request.prototype.accept = function (type) {
    this.set('Accept', request.types[type] || type);
    return this;
};
Request.prototype.auth = function (user, pass, options) {
    if (1 === arguments.length)
        pass = '';
    if (typeof pass === 'object' && pass !== null) {
        options = pass;
        pass = '';
    }
    if (!options) {
        options = {
            type: 'function' === typeof btoa ? 'basic' : 'auto',
        };
    }
    var encoder = function (string) {
        if ('function' === typeof btoa) {
            return btoa(string);
        }
        throw new Error('Cannot use basic auth, btoa is not a function');
    };
    return this._auth(user, pass, options, encoder);
};
Request.prototype.query = function (val) {
    if ('string' != typeof val)
        val = serialize(val);
    if (val)
        this._query.push(val);
    return this;
};
Request.prototype.attach = function (field, file, options) {
    if (file) {
        if (this._data) {
            throw Error("superagent can't mix .send() and .attach()");
        }
        this._getFormData().append(field, file, options || file.name);
    }
    return this;
};
Request.prototype._getFormData = function () {
    if (!this._formData) {
        this._formData = new root.FormData();
    }
    return this._formData;
};
Request.prototype.callback = function (err, res) {
    if (this._shouldRetry(err, res)) {
        return this._retry();
    }
    var fn = this._callback;
    this.clearTimeout();
    if (err) {
        if (this._maxRetries)
            err.retries = this._retries - 1;
        this.emit('error', err);
    }
    fn(err, res);
};
Request.prototype.crossDomainError = function () {
    var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
    err.crossDomain = true;
    err.status = this.status;
    err.method = this.method;
    err.url = this.url;
    this.callback(err);
};
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function () {
    console.warn("This is not supported in browser version of superagent");
    return this;
};
Request.prototype.pipe = Request.prototype.write = function () {
    throw Error("Streaming is not supported in browser version of superagent");
};
Request.prototype._isHost = function _isHost(obj) {
    return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
};
Request.prototype.end = function (fn) {
    if (this._endCalled) {
        console.warn("Warning: .end() was called twice. This is not supported in superagent");
    }
    this._endCalled = true;
    this._callback = fn || noop;
    this._finalizeQueryString();
    return this._end();
};
Request.prototype._end = function () {
    var self = this;
    var xhr = (this.xhr = request.getXHR());
    var data = this._formData || this._data;
    this._setTimeouts();
    xhr.onreadystatechange = function () {
        var readyState = xhr.readyState;
        if (readyState >= 2 && self._responseTimeoutTimer) {
            clearTimeout(self._responseTimeoutTimer);
        }
        if (4 != readyState) {
            return;
        }
        var status;
        try {
            status = xhr.status;
        }
        catch (e) {
            status = 0;
        }
        if (!status) {
            if (self.timedout || self._aborted)
                return;
            return self.crossDomainError();
        }
        self.emit('end');
    };
    var handleProgress = function (direction, e) {
        if (e.total > 0) {
            e.percent = e.loaded / e.total * 100;
        }
        e.direction = direction;
        self.emit('progress', e);
    };
    if (this.hasListeners('progress')) {
        try {
            xhr.onprogress = handleProgress.bind(null, 'download');
            if (xhr.upload) {
                xhr.upload.onprogress = handleProgress.bind(null, 'upload');
            }
        }
        catch (e) {
        }
    }
    try {
        if (this.username && this.password) {
            xhr.open(this.method, this.url, true, this.username, this.password);
        }
        else {
            xhr.open(this.method, this.url, true);
        }
    }
    catch (err) {
        return this.callback(err);
    }
    if (this._withCredentials)
        xhr.withCredentials = true;
    if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
        var contentType = this._header['content-type'];
        var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
        if (!serialize && isJSON(contentType)) {
            serialize = request.serialize['application/json'];
        }
        if (serialize)
            data = serialize(data);
    }
    for (var field in this.header) {
        if (null == this.header[field])
            continue;
        if (this.header.hasOwnProperty(field))
            xhr.setRequestHeader(field, this.header[field]);
    }
    if (this._responseType) {
        xhr.responseType = this._responseType;
    }
    this.emit('request', this);
    xhr.send(typeof data !== 'undefined' ? data : null);
    return this;
};
request.agent = function () {
    return new Agent();
};
["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function (method) {
    Agent.prototype[method.toLowerCase()] = function (url, fn) {
        var req = new request.Request(method, url);
        this._setDefaults(req);
        if (fn) {
            req.end(fn);
        }
        return req;
    };
});
Agent.prototype.del = Agent.prototype['delete'];
request.get = function (url, data, fn) {
    var req = request('GET', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.query(data);
    if (fn)
        req.end(fn);
    return req;
};
request.head = function (url, data, fn) {
    var req = request('HEAD', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.query(data);
    if (fn)
        req.end(fn);
    return req;
};
request.options = function (url, data, fn) {
    var req = request('OPTIONS', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.send(data);
    if (fn)
        req.end(fn);
    return req;
};
function del(url, data, fn) {
    var req = request('DELETE', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.send(data);
    if (fn)
        req.end(fn);
    return req;
}
request['del'] = del;
request['delete'] = del;
request.patch = function (url, data, fn) {
    var req = request('PATCH', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.send(data);
    if (fn)
        req.end(fn);
    return req;
};
request.post = function (url, data, fn) {
    var req = request('POST', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.send(data);
    if (fn)
        req.end(fn);
    return req;
};
request.put = function (url, data, fn) {
    var req = request('PUT', url);
    if ('function' == typeof data)
        (fn = data), (data = null);
    if (data)
        req.send(data);
    if (fn)
        req.end(fn);
    return req;
};
exports.default = Request;
