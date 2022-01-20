var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

let app2 = express();

app2.get('/users/:id', function(req, res, next) {
  // console.log(req.originalUrl)
  console.log(res)
  res.send('fuck you')
  next();
});

// error handler
app2.use(function(err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app2.listen(3000,()=>{
  console.log('正在 listen 3000')
})
