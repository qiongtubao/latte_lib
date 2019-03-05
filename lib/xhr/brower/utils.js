'use strict';
exports.type = function (str) {
    return str.split(/ *; */).shift();
};
exports.params = function (str) {
    return str.split(/ *; */).reduce(function (obj, str) {
        var parts = str.split(/ *= */);
        var key = parts.shift();
        var val = parts.shift();
        if (key && val)
            obj[key] = val;
        return obj;
    }, {});
};
exports.parseLinks = function (str) {
    return str.split(/ *, */).reduce(function (obj, str) {
        var parts = str.split(/ *; */);
        var url = parts[0].slice(1, -1);
        var rel = parts[1].split(/ *= */)[1].slice(1, -1);
        obj[rel] = url;
        return obj;
    }, {});
};
exports.cleanHeader = function (header, changesOrigin) {
    delete header['content-type'];
    delete header['content-length'];
    delete header['transfer-encoding'];
    delete header['host'];
    if (changesOrigin) {
        delete header['authorization'];
        delete header['cookie'];
    }
    return header;
};
