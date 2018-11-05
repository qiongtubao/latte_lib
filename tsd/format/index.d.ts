export declare function getDateReplace(date: any, prefix: any, postfix: any): {};
export declare function dateFormat(format: any, date: any, prefix: any, postfix: any): any;
export declare function templateStringFormat(template: string, options: object, prefix?: string, postfix?: string): string;
export declare function templateJsonFormat(template: object, options: object): object;
declare const _default: {
    templateJsonFormat: typeof templateJsonFormat;
    templateStringFormat: typeof templateStringFormat;
    dateFormat: typeof dateFormat;
    getDateReplace: typeof getDateReplace;
};
export default _default;
