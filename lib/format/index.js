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
var replace = function (data, replaceStr, value) {
    var runStr;
    while (1) {
        runStr = data;
        data = data.replace(replaceStr, value);
        if (data == runStr) {
            return data;
        }
    }
};
function templateStringFormat(template, options, prefix, postfix) {
    if (prefix === void 0) { prefix = "{{"; }
    if (postfix === void 0) { postfix = "}}"; }
    var data = template;
    for (var i in options) {
        data = replace(data, prefix + i + postfix, options[i]);
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
var repeatStr = function (str, times) {
    var newStr = [];
    if (times > 0) {
        for (var i = 0; i < times; i++) {
            newStr.push(str);
        }
    }
    return newStr.join("");
};
function objFormat(object, level, jsonUti, isInArray) {
    var tab = isInArray ? repeatStr(jsonUti.t, level - 1) : "";
    if (object === null || object === undefined) {
        return tab + "null";
    }
    switch (index_1.default.getClassName(object)) {
        case "array":
            var paddingTab = repeatStr(jsonUti.t, level - 1);
            var temp = [jsonUti.n + paddingTab + "[" + jsonUti.n];
            var tempArrValue = [];
            for (var i = 0, len = object.length; i < len; i++) {
                tempArrValue.push(objFormat(object[i], level + 1, jsonUti, true));
            }
            temp.push(tempArrValue.join("," + jsonUti.n));
            temp.push(jsonUti.n + paddingTab + "] ");
            return temp.join("");
            break;
        case "object":
            var currentObjStrings = [];
            for (var key in object) {
                if (object[key] == undefined) {
                    continue;
                }
                var temp_1 = [];
                var paddingTab = repeatStr(jsonUti.t, level);
                temp_1.push(paddingTab);
                temp_1.push("\"" + key + "\" : ");
                var value = object[key];
                temp_1.push(objFormat(value, level + 1, jsonUti));
                currentObjStrings.push(temp_1.join(""));
            }
            return (level > 1 && !isInArray ? jsonUti.n : "")
                + repeatStr(jsonUti.t, level - 1) + "{" + jsonUti.n
                + currentObjStrings.join("," + jsonUti.n)
                + jsonUti.n + repeatStr(jsonUti.t, level - 1) + "}";
            break;
        case "number":
            return tab + object.toString();
            break;
        case "boolean":
            return tab + object.toString().toLowerCase();
            break;
        case "function":
            return object.toString();
            break;
        default:
            return tab + ("\"" + object.toString() + "\"");
            break;
    }
}
function jsonFormat(object, jsonUti) {
    var defaultUti = { n: "\n", t: "\t" };
    jsonUti = Object.assign(defaultUti, jsonUti);
    try {
        return objFormat(object, 1, jsonUti);
    }
    catch (e) {
        throw object;
        return JSON.stringify(object);
    }
}
exports.jsonFormat = jsonFormat;
exports.default = { jsonFormat: jsonFormat, templateJsonFormat: templateJsonFormat, templateStringFormat: templateStringFormat, dateFormat: dateFormat, getDateReplace: getDateReplace };
