declare function isAsync(fn: any): boolean;
declare function wrapAsync(asyncFn: any): any;
export default wrapAsync;
export { isAsync };
