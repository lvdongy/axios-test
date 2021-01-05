const koa = require('koa') 
const Router = require('koa-router')

const router = new Router()
const app = new koa() 

app.use(router.routes())

router.get('/demo', (ctx, next)=>{
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:5500');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    console.log('===============================================================>');
    console.log(ctx.request.query, ctx.request.search);
    ctx.body = 'hello world' + ctx.request.querystring
})

router.post('/post', (ctx, next)=>{
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    console.log('===============================================================>');
    console.log(ctx.request.body);
    ctx.response.type = 'json';
    ctx.body = { name: 'lv_dongy', account: '15089767992' };
})

//匹配出现路由出现的东西
app.listen(3000, ()=>{
     console.log(`server is started at port 3000`)
})
//监听一个3000的端口