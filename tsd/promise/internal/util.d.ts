declare var es5: any;
declare var canEvaluate: boolean;
declare var haveGetters: boolean;
declare var errorObj: {
    e: {};
};
declare var tryCatchTarget: any;
declare function tryCatcher(): any;
declare function tryCatch(fn: any): typeof tryCatcher;
declare var inherits: (Child: any, Parent: any) => any;
declare function isPrimitive(val: any): boolean;
declare function isObject(value: any): boolean;
declare function maybeWrapAsError(maybeError: any): any;
declare function withAppended(target: any, appendee: any): any[];
declare function getDataPropertyOrDefault(obj: any, key: any, defaultValue: any): any;
declare function notEnumerableProp(obj: any, name: any, value: any): any;
declare function thrower(r: any): void;
declare var inheritedDataKeys: (obj: any) => any[];
declare var thisAssignmentPattern: RegExp;
declare function isClass(fn: any): boolean;
declare function toFastProperties(obj: any): any;
declare var rident: RegExp;
declare function isIdentifier(str: any): boolean;
declare function filledRange(count: any, prefix: any, suffix: any): any[];
declare function safeToString(obj: any): string;
declare function markAsOriginatingFromRejection(e: any): void;
declare function originatesFromRejection(e: any): boolean;
declare function canAttachTrace(obj: any): any;
declare var ensureErrorObject: (value: any) => any;
declare function classString(obj: any): any;
declare function copyDescriptors(from: any, to: any, filter: any): void;
declare var ret: any;
