// const express = require('express');
// const http = require('http');
// const app = express();
// let mysql      = require('mysql');
//
// function hi(req,res,next){
//     if(req.query.name === 'yang'){
//         next() // 放行，结束函数并执行后面代码
//     }else{
//         res.end('你输错了')
//     }
// }
// app.use(hi)
//
// // 下一个中间件有没有被调用取决于有没有调用next()
// app.use((req,res,next)=>{
//     console.log(`req.duang: ${req.duang}`)
//     next()
// })
//
// app.use((req,res)=>{
//     res.duang = 1
//     res.end('访问成功')
// })
//
//
//
// const server = http.createServer(app)
//
// server.listen('8888')

let express = require('express');   //引入express模块
let dbHandle = require('./common/dbHandle')
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "x-requested-with,Authorization, Content-Type");
    //跨域允许的请求方式

    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    next()
})

app.post('/test',async(req,res)=>{
    console.log(req)
    console.log(res)

})

// 新增数据
app.post('/post',async(req, res,next)=>{

    let post_data = req.body
    // 将post传来的数据key拎出来
    for(let key in post_data){
        // 将key字符串转为数组，用var向外暴露data
        var data = JSON.parse(key)
    }
    const insert_data = []
        data.map(e=>{
            if(e.fba === undefined || e.forwarder === undefined || e.product === undefined ){
                let addError = {
                    code: 404,
                    msg: '前三个字段不能为空！'
                }
                return res.send(addError)
            }else{
                insert_data.push([e.fba, e.forwarder, e.product, e.sku, e.the_store, e.site, e.containernumber])
            }
    })
    // sql语句，向 表 中插入记录
    let insertAddressSql = `INSERT INTO pg_goods_db(fba,forwarder,product,sku,the_store,site,containernumber) VALUES ?`;
    let result = await new Promise((resolve,reject)=>{
        return dbHandle.query(insertAddressSql,(err)=>{
            if(err) throw err
            let addData = {
                code: 200,
                msg: '插入成功！',
                data: data
            }
            resolve(addData)
        },[insert_data])
    })
    res.send(result)
})

// 获取数据
app.get('/get',async (req, res,next)=>{
    // sql语句，查找pg_goods_db表中的数据
    let selectSql = `SELECT * FROM pg_goods_db`;
    let result = await new Promise((res,rej)=>{
        return dbHandle.query(selectSql,(err,data)=>{
            if(err) throw err
            let addData = {
                code: 200,
                msg: '获取成功！',
                data: data,
                count: data.length
            }
            res(addData)
        })
    })
    res.send(result)
    console.log(result);
})

// 删除数据
app.post('/del',async (req, res,next)=>{
    // sql语句，查找表中的数据\
    console.log(req.body);
    let selectSql = `DELETE FROM pg_goods_db where id=${req.body.id}`;
    let result = await new Promise((res,rej)=>{
        return dbHandle.query(selectSql,(err)=>{
            if(err) throw err
            let addData = {
                code: 200,
                msg: '删除成功！',

            }
            res(addData)
        })
    })
    res.send(result)
})

// 更改数据
app.put('/update',async (req, res,next)=>{
    // sql语句，查找re_article表中的数据\
    let selectSql = `UPDATE pg_goods_db SET title = '${req.body.title}',content = '${req.body.content}' WHERE id = ${req.body.id}` ;
        dbHandle.query(selectSql,(err,result_data)=>{
            if(err) throw err
            let addData = {
                code: 200,
                msg: '更改成功！',
                data: req.body,
            }
            res.send(addData)
    })
})

app.listen(3000,function () {
    // 监听3000端口
    console.log('Server running at 3000 port');
})
