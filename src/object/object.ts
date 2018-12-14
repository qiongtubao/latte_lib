import EventEmitter , {Event} from "../event/event";
import utils from '../utils'

export class LatteObjectProxy extends EventEmitter {
    _isLatte: boolean = true;
    constructor() {
        super()
    }
}
// @Event
// export class LatteArrayProxy extends Array<any>  {
//     constructor(...args) {
//         super(args)
//     }
// }

function set(proxy) {
    return function (target, name, value) {
        if (target[name] === value) {
            return true;
        }
        if (name == "events") {
            target[name] = value;
            return true;
        }
        if (utils.isObject(value) || utils.isArray(value)) {
            let child 
            if(utils.isObject(value)) {
                child = LatteObject(value)
                child.on('change', (name1, value) => {
                    proxy.emit(name.toString() + '.' + name1, value)
                    proxy.emit('change', name.toString() + '.' + name1, value)
                })
            }else{
                child = LatteArray(value)
                child.on('change', (name1, value) => {
                    proxy.emit(name.toString() + '[' + name1 + ']', value)
                    proxy.emit('change', name.toString() + '[' + name1 + ']', value)
                })
            }
            target[name] = child;
        } else {
            target[name] = value
        }
        proxy.emit(name.toString(), target[name])
        proxy.emit('change', name, target[name])
        return true

    }
}


export function LatteArray(data) {
    if (data._isLatte) {
        return data;
    }
    let proxy:any = [];
    Object.assign(proxy, EventEmitter.prototype)
    proxy['on'] = EventEmitter.prototype.on
    proxy['off'] = EventEmitter.prototype.off
    proxy['emit'] = EventEmitter.prototype.emit
    proxy._isLatte = true
    let result = new Proxy(proxy, {
        get: function (target, name) {
            return target[name];
        },
        set: set(proxy)
    })
    Object.assign(result, data)
    return result
}


export function LatteObject(data) {
    if (data._isLatte) {
        return data;
    }
    let proxy = new LatteObjectProxy();
    let result = new Proxy(proxy, {
        get: function (target, name) {
            return target[name];
        },
        set: set(proxy)
    });
    Object.assign(result, data)
    return result
}

