/**
					@property ISO8601_FORMAT
					@type String
      */
import utils from '../utils/index'

const ISO8601_FORMAT = "yyyy-MM-dd hh:mm:ss.SSS";
/**
  @property ISO8601_WITH_TZ_OFFSET_FORMAT
  @type String
*/
const ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ssO";
/**
  @property DATETIME_FORMAT
  @type String
*/
const DATETIME_FORMAT = "hh:mm:ss.SSS";


function padWithZeros(vNumber, width) {
  let numAsString = vNumber + "";
  while (numAsString.length < width) {
    numAsString = "0" + numAsString;
  }
  return numAsString;
}
function addZero(vNumber) {
  return padWithZeros(vNumber, 2);
}
function offset(date) {
  let os = Math.abs(date.getTimezoneOffset());
  let h = String(Math.floor(os / 60));
  let m = String(os % 60);
  if (h.length == 1) {
    h = "0" + h;
  }
  if (m.length == 1) {
    m = "0" + m;
  }
  return date.getTimezoneOffset() < 0 ? "+" + h + m : "-" + h + m;
}
/**
  @method getDateReplace
  @public
  @static
  @sync
  @param {Date} date
  @return {Object}
  @example
    let Format = require("latte_lib").format;
    let date = new Date();
    log(Format.getDateReplace(date));
*/
export function getDateReplace(date, prefix, postfix) {
  prefix = prefix || "";
  postfix = postfix || "";
  let vDay = addZero(date.getDate());
  let vMonth = addZero(date.getMonth() + 1);
  let vYearLong = addZero(date.getFullYear());
  let vYearShort = addZero(date.getFullYear().toString().substring(2, 4));
  //let vYear = (format.indexOf("yyyy") > -1 ? vYearLong: vYearShort);
  let vHour = addZero(date.getHours());
  let vMinute = addZero(date.getMinutes());
  let vSecond = addZero(date.getSeconds());
  let vMillisecond = padWithZeros(date.getMilliseconds(), 3);
  let vTimeZone = offset(date);

  let result = {};
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
/**
  @method dateFormat
  @public
  @static
  @sync
  @param {String} format
  @param {Date} date
  @return {String} formatted
  @example
    let Format = require("latte_lib").format;
    let date = new Date();
    log(Format.dateFormat(Format.ISO8601_FORMAT, date));
*/
export function dateFormat(format, date, prefix, postfix) {
  if (!date) {
    date = format || new Date();
    format = exports.ISO8601_FORMAT;
  }
  let formatted = format;
  let json = getDateReplace(date, prefix, postfix);
  utils.jsonForEach(json, function (key, value) {
    formatted = formatted.replace(new RegExp(key, "g"), value);
  });
  return formatted;
}

let replace = (data, replaceStr, value) => {
  //{! 'hello' == 'hello'?'a':'b' !}  替换  失败
  //return data.replace(new RegExp(replaceStr, "igm"), value);
  let runStr;
  while (1) {
    runStr = data;
    data = data.replace(replaceStr, value);
    if (data == runStr) {
      return data;
    }
  }
}
export function templateStringFormat(template: string, options: object, prefix = "{{", postfix = "}}"): string {
  let data = template;
  for (let i in options) {
    data = replace(data, prefix + i + postfix, options[i]);
  }
  return data;
}
export function templateJsonFormat(template: object, options: object): object {
  let templateData = JSON.stringify(template);
  let data = templateStringFormat(templateData, options);
  return JSON.parse(data);
}
let repeatStr = function (str, times) {
  var newStr = [];
  if (times > 0) {
    for (var i = 0; i < times; i++) {
      newStr.push(str);
    }
  }
  return newStr.join("");
}
function objFormat(object, level, jsonUti, isInArray?: boolean) {
  var tab = isInArray ? repeatStr(jsonUti.t, level - 1) : "";
  if (object === null || object === undefined) {
    return tab + "null";
  }
  switch (utils.getClassName(object)) {
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
        let temp: any[] = [];
        var paddingTab = repeatStr(jsonUti.t, level);
        temp.push(paddingTab);
        temp.push("\"" + key + "\" : ");
        var value = object[key];
        temp.push(objFormat(value, level + 1, jsonUti));
        currentObjStrings.push(temp.join(""));
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
export function jsonFormat(object, jsonUti) {
  let defaultUti = { n: "\n", t: "\t" };
  jsonUti = (<any>Object).assign(defaultUti, jsonUti);
  try {
    return objFormat(object, 1, jsonUti);
  } catch (e) {
    throw object;
    return JSON.stringify(object);
  }
}

export default { jsonFormat, templateJsonFormat, templateStringFormat, dateFormat, getDateReplace }