class InterceptorManager {
    constructor(){
        this.list = [];
    }

    use(resole, reject){
        this.list.push(resole, reject);
    }
}

export default InterceptorManager