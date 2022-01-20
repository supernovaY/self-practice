var express = require('express')
var app = express()

app.get('/xxx', function(resquest, response){
	response.send('hellow')
})

const port = 4000
app.listen(port,function(){
	console.log(`Express正在监听 prot ${port}`)
})