function getDefaults(){
    return {
        methods: 'GET',
        timeout: 3000,

        headers: {},

        // 校验响应结果函数
        validateStatus: function(status) {
            return status >= 200 && status < 300;
        }
    }
}

export default getDefaults()