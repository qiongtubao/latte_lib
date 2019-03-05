export interface Map<T> {
    [key: string]: T;
}
export interface ArrayLike<T> {
    length: number;
    [n: number]: T;
}
