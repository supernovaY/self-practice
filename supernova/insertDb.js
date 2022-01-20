var mysql  = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port: '3306',
    database: 'proofread_goods'
});

connection.connect();

function select(){
    let addSql = 'INSERT INTO pg_goods_db(name,id,title,content,add_time) VALUES(?,?,?,?,?)';
// 插入值
//     let addSqlParams = ['04','06','新标题','新内容','2021-11-15'];
//增
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);
        console.log('INSERT ID:',result);
        console.log('-----------------------------------------------------------------\n\n');
    });
}
connection.end();
