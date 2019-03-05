"use strict";
module.exports = function () {
    let async = require("./async.js");
    let util = require("./util.js");
    let bluebirdFramePattern =
        /[\\\/]bluebird[\\\/]js[\\\/](main|debug|zalgo|instrumented)/;
    let stackFramePattern = null;
    let formatStack = null;
    let indentStackFrames = false;
    let warn;

    function CapturedTrace(parent) {
        this._parent = parent;
        let length = this._length = 1 + (parent === undefined ? 0 : parent._length);
        captureStackTrace(this, CapturedTrace);
        if (length > 32) this.uncycle();
    }
    util.inherits(CapturedTrace, Error);

    CapturedTrace.prototype.uncycle = function () {
        let length = this._length;
        if (length < 2) return;
        let nodes = [];
        let stackToIndex = {};
        let i: any;
        let node;
        for (i = 0, node = this; node !== undefined; ++i) {
            nodes.push(node);
            node = node._parent;
        }
        length = this._length = i;
        for (let i = length - 1; i >= 0; --i) {
            let stack = nodes[i].stack;
            if (stackToIndex[stack] === undefined) {
                stackToIndex[stack] = i;
            }
        }
        for (let i = 0; i < length; ++i) {
            let currentStack = nodes[i].stack;
            let index = stackToIndex[currentStack];
            if (index !== undefined && index !== i) {
                if (index > 0) {
                    nodes[index - 1]._parent = undefined;
                    nodes[index - 1]._length = 1;
                }
                nodes[i]._parent = undefined;
                nodes[i]._length = 1;
                let cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

                if (index < length - 1) {
                    cycleEdgeNode._parent = nodes[index + 1];
                    cycleEdgeNode._parent.uncycle();
                    cycleEdgeNode._length =
                        cycleEdgeNode._parent._length + 1;
                } else {
                    cycleEdgeNode._parent = undefined;
                    cycleEdgeNode._length = 1;
                }
                let currentChildLength = cycleEdgeNode._length + 1;
                for (let j = i - 2; j >= 0; --j) {
                    nodes[j]._length = currentChildLength;
                    currentChildLength++;
                }
                return;
            }
        }
    };

    CapturedTrace.prototype.parent = function () {
        return this._parent;
    };

    CapturedTrace.prototype.hasParent = function () {
        return this._parent !== undefined;
    };

    CapturedTrace.prototype.attachExtraTrace = function (error) {
        if (error.__stackCleaned__) return;
        this.uncycle();
        let parsed = CapturedTrace.parseStackAndMessage(error);
        let message = parsed.message;
        let stacks = [parsed.stack];

        let trace = this;
        while (trace !== undefined) {
            stacks.push(cleanStack(trace.stack.split("\n")));
            trace = trace._parent;
        }
        removeCommonRoots(stacks);
        removeDuplicateOrEmptyJumps(stacks);
        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
        util.notEnumerableProp(error, "__stackCleaned__", true);
    };

    function reconstructStack(message, stacks) {
        let i;
        for (i = 0; i < stacks.length - 1; ++i) {
            stacks[i].push("From previous event:");
            stacks[i] = stacks[i].join("\n");
        }
        if (i < stacks.length) {
            stacks[i] = stacks[i].join("\n");
        }
        return message + "\n" + stacks.join("\n");
    }

    function removeDuplicateOrEmptyJumps(stacks) {
        for (let i = 0; i < stacks.length; ++i) {
            if (stacks[i].length === 0 ||
                ((i + 1 < stacks.length) && stacks[i][0] === stacks[i + 1][0])) {
                stacks.splice(i, 1);
                i--;
            }
        }
    }

    function removeCommonRoots(stacks) {
        let current = stacks[0];
        for (let i = 1; i < stacks.length; ++i) {
            let prev = stacks[i];
            let currentLastIndex = current.length - 1;
            let currentLastLine = current[currentLastIndex];
            let commonRootMeetPoint = -1;

            for (let j = prev.length - 1; j >= 0; --j) {
                if (prev[j] === currentLastLine) {
                    commonRootMeetPoint = j;
                    break;
                }
            }

            for (let j = commonRootMeetPoint; j >= 0; --j) {
                let line = prev[j];
                if (current[currentLastIndex] === line) {
                    current.pop();
                    currentLastIndex--;
                } else {
                    break;
                }
            }
            current = prev;
        }
    }

    function cleanStack(stack) {
        let ret = [];
        for (let i = 0; i < stack.length; ++i) {
            let line = stack[i];
            let isTraceLine = stackFramePattern.test(line) ||
                "    (No stack trace)" === line;
            let isInternalFrame = isTraceLine && shouldIgnore(line);
            if (isTraceLine && !isInternalFrame) {
                if (indentStackFrames && line.charAt(0) !== " ") {
                    line = "    " + line;
                }
                ret.push(line);
            }
        }
        return ret;
    }

    function stackFramesAsArray(error) {
        let stack = error.stack.replace(/\s+$/g, "").split("\n");
        let i;
        for (i = 0; i < stack.length; ++i) {
            let line = stack[i];
            if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
                break;
            }
        }
        if (i > 0) {
            stack = stack.slice(i);
        }
        return stack;
    }

    CapturedTrace.parseStackAndMessage = function (error) {
        let stack = error.stack;
        let message = error.toString();
        stack = typeof stack === "string" && stack.length > 0
            ? stackFramesAsArray(error) : ["    (No stack trace)"];
        return {
            message: message,
            stack: cleanStack(stack)
        };
    };

    CapturedTrace.formatAndLogError = function (error, title) {
        if (typeof console !== "undefined") {
            let message;
            if (typeof error === "object" || typeof error === "function") {
                let stack = error.stack;
                message = title + formatStack(stack, error);
            } else {
                message = title + String(error);
            }
            if (typeof warn === "function") {
                warn(message);
            } else if (typeof console.log === "function" ||
                typeof console.log === "object") {
                console.log(message);
            }
        }
    };

    CapturedTrace.unhandledRejection = function (reason) {
        CapturedTrace.formatAndLogError(reason, "^--- With additional stack trace: ");
    };

    CapturedTrace.isSupported = function () {
        return typeof captureStackTrace === "function";
    };

    CapturedTrace.fireRejectionEvent =
        function (name, localHandler, reason, promise) {
            let localEventFired = false;
            try {
                if (typeof localHandler === "function") {
                    localEventFired = true;
                    if (name === "rejectionHandled") {
                        localHandler(promise);
                    } else {
                        localHandler(reason, promise);
                    }
                }
            } catch (e) {
                async.throwLater(e);
            }

            let globalEventFired = false;
            try {
                globalEventFired = fireGlobalEvent(name, reason, promise);
            } catch (e) {
                globalEventFired = true;
                async.throwLater(e);
            }

            let domEventFired = false;
            if (fireDomEvent) {
                try {
                    domEventFired = fireDomEvent(name.toLowerCase(), {
                        reason: reason,
                        promise: promise
                    });
                } catch (e) {
                    domEventFired = true;
                    async.throwLater(e);
                }
            }

            if (!globalEventFired && !localEventFired && !domEventFired &&
                name === "unhandledRejection") {
                CapturedTrace.formatAndLogError(reason, "Unhandled rejection ");
            }
        };

    function formatNonError(obj) {
        let str;
        if (typeof obj === "function") {
            str = "[function " +
                (obj.name || "anonymous") +
                "]";
        } else {
            str = obj.toString();
            let ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
            if (ruselessToString.test(str)) {
                try {
                    let newStr = JSON.stringify(obj);
                    str = newStr;
                }
                catch (e) {

                }
            }
            if (str.length === 0) {
                str = "(empty array)";
            }
        }
        return ("(<" + snip(str) + ">, no stack trace)");
    }

    function snip(str) {
        let maxChars = 41;
        if (str.length < maxChars) {
            return str;
        }
        return str.substr(0, maxChars - 3) + "...";
    }

    let shouldIgnore = function (...args) { return false; };
    let parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
    function parseLineInfo(line) {
        let matches = line.match(parseLineInfoRegex);
        if (matches) {
            return {
                fileName: matches[1],
                line: parseInt(matches[2], 10)
            };
        }
    }
    CapturedTrace.setBounds = function (firstLineError, lastLineError) {
        if (!CapturedTrace.isSupported()) return;
        let firstStackLines = firstLineError.stack.split("\n");
        let lastStackLines = lastLineError.stack.split("\n");
        let firstIndex = -1;
        let lastIndex = -1;
        let firstFileName;
        let lastFileName;
        for (let i = 0; i < firstStackLines.length; ++i) {
            let result = parseLineInfo(firstStackLines[i]);
            if (result) {
                firstFileName = result.fileName;
                firstIndex = result.line;
                break;
            }
        }
        for (let i = 0; i < lastStackLines.length; ++i) {
            let result = parseLineInfo(lastStackLines[i]);
            if (result) {
                lastFileName = result.fileName;
                lastIndex = result.line;
                break;
            }
        }
        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
            firstFileName !== lastFileName || firstIndex >= lastIndex) {
            return;
        }

        shouldIgnore = function (line) {
            if (bluebirdFramePattern.test(line)) return true;
            let info = parseLineInfo(line);
            if (info) {
                if (info.fileName === firstFileName &&
                    (firstIndex <= info.line && info.line <= lastIndex)) {
                    return true;
                }
            }
            return false;
        };
    };

    let captureStackTrace = (function stackDetection(...args) {
        let v8stackFramePattern = /^\s*at\s*/;
        let v8stackFormatter = function (stack, error) {
            if (typeof stack === "string") return stack;

            if (error.name !== undefined &&
                error.message !== undefined) {
                return error.toString();
            }
            return formatNonError(error);
        };

        if (typeof Error.stackTraceLimit === "number" &&
            typeof Error.captureStackTrace === "function") {
            Error.stackTraceLimit = Error.stackTraceLimit + 6;
            stackFramePattern = v8stackFramePattern;
            formatStack = v8stackFormatter;
            let captureStackTrace = Error.captureStackTrace;

            shouldIgnore = function (line) {
                return bluebirdFramePattern.test(line);
            };
            return function (receiver, ignoreUntil) {
                Error.stackTraceLimit = Error.stackTraceLimit + 6;
                captureStackTrace(receiver, ignoreUntil);
                Error.stackTraceLimit = Error.stackTraceLimit - 6;
            };
        }
        let err = new Error();

        if (typeof err.stack === "string" &&
            err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
            stackFramePattern = /@/;
            formatStack = v8stackFormatter;
            indentStackFrames = true;
            return function captureStackTrace(o) {
                o.stack = new Error().stack;
            };
        }

        let hasStackAfterThrow;
        try { throw new Error(); }
        catch (e) {
            hasStackAfterThrow = ("stack" in e);
        }
        if (!("stack" in err) && hasStackAfterThrow &&
            typeof Error.stackTraceLimit === "number") {
            stackFramePattern = v8stackFramePattern;
            formatStack = v8stackFormatter;
            return function captureStackTrace(o) {
                Error.stackTraceLimit = Error.stackTraceLimit + 6;
                try { throw new Error(); }
                catch (e) { o.stack = e.stack; }
                Error.stackTraceLimit = Error.stackTraceLimit - 6;
            };
        }

        formatStack = function (stack, error) {
            if (typeof stack === "string") return stack;

            if ((typeof error === "object" ||
                typeof error === "function") &&
                error.name !== undefined &&
                error.message !== undefined) {
                return error.toString();
            }
            return formatNonError(error);
        };

        return null;

    })([]);

    let fireDomEvent;
    let fireGlobalEvent = (function () {
        if (util.isNode) {
            return function (name, reason, promise) {
                if (name === "rejectionHandled") {
                    return process.emit(name, promise);
                } else {
                    return process.emit(name, reason, promise);
                }
            };
        } else {
            let customEventWorks = false;
            let anyEventWorks = true;
            try {
                let ev = new CustomEvent("test");
                customEventWorks = ev instanceof CustomEvent;
            } catch (e) { }
            if (!customEventWorks) {
                try {
                    let event = document.createEvent("CustomEvent");
                    event.initCustomEvent("testingtheevent", false, true, {});
                    dispatchEvent(event);
                } catch (e) {
                    anyEventWorks = false;
                }
            }
            if (anyEventWorks) {
                fireDomEvent = function (type, detail) {
                    let event;
                    if (customEventWorks) {
                        event = new CustomEvent(type, {
                            detail: detail,
                            bubbles: false,
                            cancelable: true
                        });
                    } else if (dispatchEvent) {
                        event = document.createEvent("CustomEvent");
                        event.initCustomEvent(type, false, true, detail);
                    }

                    return event ? !dispatchEvent(event) : false;
                };
            }

            let toWindowMethodNameMap = {};
            toWindowMethodNameMap["unhandledRejection"] = ("on" +
                "unhandledRejection").toLowerCase();
            toWindowMethodNameMap["rejectionHandled"] = ("on" +
                "rejectionHandled").toLowerCase();

            return function (name, reason, promise) {
                let methodName = toWindowMethodNameMap[name];
                let method = window[methodName];
                if (!method) return false;
                if (name === "rejectionHandled") {
                    method.call(window, promise);
                } else {
                    method.call(window, reason, promise);
                }
                return true;
            };
        }
    })();

    if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
        warn = function (message) {
            console.warn(message);
        };
        if (util.isNode && process.stderr.isTTY) {
            warn = function (message) {
                process.stderr.write("\u001b[31m" + message + "\u001b[39m\n");
            };
        } else if (!util.isNode && typeof (new Error().stack) === "string") {
            warn = function (message) {
                console.warn("%c" + message, "color: red");
            };
        }
    }

    return CapturedTrace;
};
