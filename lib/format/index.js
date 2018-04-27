"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../utils/index");
var ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
var ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
var DATETIME_FORMAT = "hh:mm:ss.SSS";
function padWithZeros(vNumber, width) {
    var numAsString = vNumber + "";
    while (numAsString.length < width) {
        numAsString = "0" + numAsString;
    }
    return numAsString;
}
function addZero(vNumber) {
    return padWithZeros(vNumber, 2);
}
function offset(date) {
    var os = Math.abs(date.getTimezoneOffset());
    var h = String(Math.floor(os / 60));
    var m = String(os % 60);
    if (h.length == 1) {
        h = "0" + h;
    }
    if (m.length == 1) {
        m = "0" + m;
    }
    return date.getTimezoneOffset() < 0 ? "+" + h + m : "-" + h + m;
}
function getDateReplace(date, prefix, postfix) {
    prefix = prefix || "";
    postfix = postfix || "";
    var vDay = addZero(date.getDate());
    var vMonth = addZero(date.getMonth() + 1);
    var vYearLong = addZero(date.getFullYear());
    var vYearShort = addZero(date.getFullYear().toString().substring(2, 4));
    var vHour = addZero(date.getHours());
    var vMinute = addZero(date.getMinutes());
    var vSecond = addZero(date.getSeconds());
    var vMillisecond = padWithZeros(date.getMilliseconds(), 3);
    var vTimeZone = offset(date);
    var result = {};
    result[prefix + "dd" + postfix] = vDay;
    result[prefix + "MM" + postfix] = vMonth;
    result[prefix + "yyyy" + postfix] = vYearLong;
    result[prefix + "y{1,4}" + postfix] = vYearShort;
    result[prefix + "hh" + postfix] = vHour;
    result[prefix + "mm" + postfix] = vMinute;
    result[prefix + "ss" + postfix] = vSecond;
    result[prefix + "SSS" + postfix] = vMillisecond;
    result[prefix + "O" + postfix] = vTimeZone;
    return result;
}
exports.getDateReplace = getDateReplace;
function dateFormat(format, date, prefix, postfix) {
    if (!date) {
        date = format || new Date();
        format = exports.ISO8601_FORMAT;
    }
    var formatted = format;
    var json = getDateReplace(date, prefix, postfix);
    index_1.default.jsonForEach(json, function (key, value) {
        formatted = formatted.replace(new RegExp(key, "g"), value);
    });
    return formatted;
}
exports.dateFormat = dateFormat;
function templateStringFormat(template, options) {
    var data = template;
    for (var i_1 in options) {
        data = data.replace(new RegExp("{{" + i_1 + "}}", "igm"), options[i_1]);
    }
    return data;
}
exports.templateStringFormat = templateStringFormat;
function templateJsonFormat(template, options) {
    var templateData = JSON.stringify(template);
    var data = templateStringFormat(templateData, options);
    return JSON.parse(data);
}
exports.templateJsonFormat = templateJsonFormat;
exports.default = { templateJsonFormat: templateJsonFormat, templateStringFormat: templateStringFormat, dateFormat: dateFormat, getDateReplace: getDateReplace };
