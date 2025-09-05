var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('express-async-errors');
const installRouter = require('./routes')

var app = express();

// 注册调试中间件（仅开发环境）
if (process.env.NODE_ENV  === 'development') {
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

installRouter(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.status = err.status;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //
  // // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
