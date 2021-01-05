import Axios from './core/Axios.js'
import mergeObject from './utils/mergeObject.js'
import defaultConfig from './core/defaults.js'

function createInstance(config){
    let instance = new Axios(mergeObject(defaultConfig, config));
    let wrap = function(){
        return Axios.prototype.request.apply(instance, arguments);
    }
    extend(wrap, Axios.prototype, true);
    extend(wrap, instance);

    return wrap
}

function extend(o1, o2, isES6Class = false){
    if(isES6Class){
        // o2 是使用class的原型对象，默认原型上的方法不可枚举
        let keys = Object.getOwnPropertyNames(o2);
        keys.forEach((key) => {
            if(key !== 'constructor'){
                o1[key] = o2[key]
            }
        })
    }else{
        for (const key in o2) {
            if (Object.hasOwnProperty.call(o2, key)) {
                o1[key] = o2[key]; // 这里应该使用深拷贝。对象/函数
            }
        }
    }
    return o1
}

let axios = createInstance(); // function

axios.create = function(config){
    return createInstance(config);
}

export default axios
