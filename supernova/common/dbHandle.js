let mysql  = require('mysql');
var config = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'root',
    port     : '3306'
});

function query(sql, callback,data,) {
    config.getConnection(function (err, connection) {
        connection.query(sql,data, function (err, rows) {
            callback(err, rows)
            connection.release() // 中断连接
        })
    })
}
exports.query = query
