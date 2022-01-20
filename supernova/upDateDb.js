var mysql  = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    port: '3306',
    database: 'record_db'
});

connection.connect();

let modSql = 'UPDATE re_article SET name = ?,id = ? content = ?';
let modSqlParams = ['01', '01',6];
//改
connection.query(modSql,modSqlParams,function (err, result) {
    if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
});

connection.end();
