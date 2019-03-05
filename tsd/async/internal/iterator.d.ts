export default function iterator(coll: any): (() => {
    value: any;
    key: number;
}) | (() => {
    value: any;
    key: string;
});
