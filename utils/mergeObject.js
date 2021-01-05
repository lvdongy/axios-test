// 这里其实应该叫做 mergeConfigObject 更好
function mergeObject(obj1 = {}, obj2){
    if(!obj1) obj1 = {};
    let res = deepClone(obj1); // deep

    if(!obj2){
        return res || {}
    }

    /**
     * 这里简单处理：
     * 只对headers，params，data做合并处理，其他的直接覆盖
     */
    const mergeDeepKeys = ['headers', 'params', 'data'];

    for (const key in obj2) {
        if (Object.hasOwnProperty.call(obj2, key)) {
            let val = obj2[key];
            if(res[key] && mergeDeepKeys.includes(key)){
                res[key] = getMergeDeepValue(res[key], val);
            }else{
                res[key] = val;
            }
        }
    }

    return res
}

function getMergeDeepValue(val1, val2){
    let res = val1;
    for (const key in val2) {
        if (Object.hasOwnProperty.call(val2, key)) {
            res[key] = val2[key];
        }
    }
    return res
}

function deepClone(obj){
    let res = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const val = obj[key];
            if(Array.isArray(val)){
                res[key] = val.slice();
            }
            else if(typeof val === 'object' && val !== null){
                res[key] = deepClone(val);
            }
            else{
                res[key] = val;
            }
        }
    }
    return res
}

export default mergeObject