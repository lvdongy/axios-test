import { createError } from './createError.js'

function dispatchRequest(config){
    return new Promise((resole, reject) => {

        let xhr = new XMLHttpRequest();
        
        // 得到真实的请求地址 
        let fullPath = getFullPath(config.baseURL, config.url); 
        // 得到最终的请求URL（拼上参数等）
        let url = getURL(fullPath, config.params); 
        xhr.open(config.methods.toUpperCase(), url, true);

        xhr.onreadystatechange = ((e) => {
            if(xhr.readyState !== 4){
                return
            }

            // 请求成功响应
            let responseHeaders = xhr.getAllResponseHeaders ? parseHeaders(xhr.getAllResponseHeaders()) : null;
            let responseData = (!config.responseType || config.responseType === 'text') ? xhr.responseText : xhr.response;
            let response = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: responseHeaders,
                data: responseData,
                config: config,
                request: xhr
            }

            // 处理最后将抛出的结果
            // config.validateStatus将决定该结果是resole还是reject
            if(!config.validateStatus || config.validateStatus(response.status)){
                resole(response);
            }else{
                reject(createError(response.statusText || 'xhr error'));
            }

            // 最后将xhr清除
            xhr = null;
        })

        // 设置请求头
        let requestHeaders = config.headers;
        if(requestHeaders){
            for (const key in requestHeaders) {
                if (Object.hasOwnProperty.call(requestHeaders, key)) {
                    const val = requestHeaders[key];
                    xhr.setRequestHeader(key, val);
                }
            }
        }

        // 设置超时时长
        xhr.timeout = config.timeout;
        xhr.ontimeout = function(e){
            console.error(`timeout: ${config.timeout}`);
            if(config.ontimeout) config.ontimeout(e);
        }

        // 请求被终止时
        xhr.onabort = function(e){
            reject(createError('abort')); 
            xhr = null;
        }

        // 请求异常时
        xhr.onerror = function(e){
            reject(createError('error'));
            xhr = null;
        }

        // 设置上传，下载事件
        if(typeof config.onDownloadProgress === 'function'){
            xhr.addEventListener('progress', config.onDownloadProgress);
        }
        if(typeof config.onUploadProgress === 'function'){
            xhr.upload.addEventListener('progress', config.onUploadProgress);
        }

        // 请求body
        let requestData = config.data || null;
        if(requestData && typeof requestData === 'object'){
            requestData = JSON.stringify(requestData);
        }

        xhr.send(requestData);
    })
}

function getFullPath(baseURL, url){
    // 判断url是不是一个绝对路径，如果不是再拼上baseURL
    let isAbsoluteURL = /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    if(isAbsoluteURL){
        return url
    }
    return `${baseURL}${url}`
}

function getURL(fullPath, params){
    if(!params){
        return fullPath
    }

    let paramsList = [];
    for (let key in params) {
        if (Object.hasOwnProperty.call(params, key)) {
            let val = params[key];
            // 假如是数组，那么处理成 key[]=1&key[]=2 这种格式
            if(Array.isArray(val)){
                key = key + '[]'
            }else{
                val = [val]; // 方便和数组一起做遍历
            }

            val.forEach((item) => {
                if(typeof item === 'object'){
                    item = JSON.stringify(item);
                }
                paramsList.push(`${encode(key)}=${encode(item)}`)
            })
        }
    }
    
    let url = fullPath;
    let paramsStr = paramsList.join('&');
    if(paramsStr){
        // 去掉带#，如：http://api.com#demo
        let hashIndex = url.indexOf('#');
        if(hashIndex > -1){
            url = url.slice(0, hashIndex);
        }
        // 处理fullPath已经带了参数的情况，如：http://api.com?a=1
        if(fullPath.indexOf('?') > -1){
            url = url + '&' + paramsStr;
        }else{
            url = url + '?' + paramsStr;
        }
    }

    return url
}

function encode(val) {
    return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
}

function parseHeaders(headers){
    let res = {};
    headers.split('\n').forEach((line) => {
        if(line){
            let key = line.split(':')[0].trim();
            let value = line.split(':')[1].trim();
            res[key] = value;
        }
    })
    // 处理不够完善...
    return res
}

export default dispatchRequest 