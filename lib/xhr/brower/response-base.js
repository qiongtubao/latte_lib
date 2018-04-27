'use strict';
var utils = require('./utils');
module.exports = ResponseBase;
function ResponseBase(obj) {
    if (obj)
        return mixin(obj);
}
function mixin(obj) {
    for (var key in ResponseBase.prototype) {
        obj[key] = ResponseBase.prototype[key];
    }
    return obj;
}
ResponseBase.prototype.get = function (field) {
    return this.header[field.toLowerCase()];
};
ResponseBase.prototype._setHeaderProperties = function (header) {
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);
    var params = utils.params(ct);
    for (var key in params)
        this[key] = params[key];
    this.links = {};
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    }
    catch (err) {
    }
};
ResponseBase.prototype._setStatusProperties = function (status) {
    var type = status / 100 | 0;
    this.status = this.statusCode = status;
    this.statusType = type;
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;
    this.created = 201 == status;
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
    this.unprocessableEntity = 422 == status;
};
