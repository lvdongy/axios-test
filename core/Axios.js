import InterceptorManager from './InterceptorManager.js'
import dispatchRequest from './xhr.js'
import mergeObject from '../utils/mergeObject.js'

class Axios {
    constructor(config){
        this.defaults = config;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        }
    }

    request(config){
        'use strict';
        /**
         * 最终都是执行这个函数去发请求
         * 首先整理config，将传进来的config整理后与默认config合并
         * 整理执行顺序：请求拦截-请求-响应拦截
         */

        // 处理两种调用情况： Axios('/api', [config]); Axios(config);
        if(typeof arguments[0] === String){
            config = this.arguments[1] || {};
            config.url = arguments[0];  
        }else{
            config = config || {}
        }
        // 得到最终的config对象
        config = mergeObject(this.defaults, config);

        // 整理拦截器与请求器的执行顺序
        // 将请求拦截添加到chains前面，它理应优先得到执行，响应拦截则添加到最后，注意都是两两成对
        let chains = [dispatchRequest, undefined];
        chains.unshift(...this.interceptors.request.list);
        chains.push(...this.interceptors.response.list);
        
        // 首先决议一个promise，它的决议值是config
        // 然后每次从chains取出两个函数，分别作为resolve，reject传递给当前的promise
        // 每执行一次都将产生一个新的promise，直到最后将promise传出去
        let p = Promise.resolve(config);    
        while (chains.length > 0) {
            p = p.then(chains.shift(), chains.shift());
        }

        return p
    }

    /**
     * 暂时只实现get，post
     */

    get(url, config){
        config = mergeObject(
            config,
            { 
                methods: 'GET',
                url
            }, 
        );
        return this.request(config);
    }

    post(url, data, config){
        config = mergeObject(
            config,
            {
                methods: 'POST',
                url,
                data
            },
        );
        return this.request(config)
    }

}

export default Axios