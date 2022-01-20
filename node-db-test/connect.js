var mysql      = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456'
})

connection.connect();

// 新建一个库
connection.query('CREATE DATABASE IF NOT EXISTS supernova DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_520_ci;', 
function(error,results, fields){
    if (error){throw error}
    console.log(results)
})
connection.query('use supernova;')
// // 新建一个表
connection.query(`CREATE TABLE IF NOT EXISTS user(
    name text,
    age int
)`, 
function(error,results, fields){
    if (error){throw error}
    console.log(results)
})
connection.end()