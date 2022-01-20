import Koa, {BaseContext} from 'koa'

const app = new Koa()

// koa的中间件洋葱模型
app.use(async(e:BaseContext, next)=>{
    e.body = 'hello' // 1
    next()
    e.body += '啊'// 4 最后再调用这行
})
app.use(async(e:BaseContext, next)=>{
    e.body += '你'// 2
    next()
})
app.use(async(e:BaseContext, next)=>{
    e.body += '好'// 3
})
app.listen(3001)