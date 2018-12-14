

// import { expect } from 'chai'
import 'mocha'
import { LatteObject } from '../../src/object/object'
describe('object', () => {
    it('create', () => {
        let a = LatteObject({
            a: "heleo",
            b: {
                c: "d"
            }
        });
        // a.on("a", (v)=> {
        //     console.log('change',v)
        // })
        a.on('b.c', (v) => {
            console.log('ccccc', v)
        })
        a.on('b.d[0]', (v) => {
            console.log('ddddd', v)
        })
        a.b.c = "e"
        a.b.d = []
        a.b.d.push({
            e: 'f'
        })
        console.log(a.b.d[0])
    })
})