// 第三方模块  
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 路由模块 
var all = require('./routes/all'); 
var index = require('./routes/index');
var login = require('./routes/login'); 
var profile = require('./routes/profile'); 
var register = require('./routes/register');
var board = require('./routes/board'); 

// 实例化 Express 
var app = express();
var http = require('http').Server(app); 

// 使用 EJS 视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Logger 
// app.use(logger('dev'));

// 对 post body 处理的中间件 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie 中间件 
app.use(cookieParser());

// 静态文件服务器 
app.use(express.static(path.join(__dirname, 'public')));

// 自定义路由
app.use(all);
app.use('/', index);
app.use('/profile', profile); 
app.use('/login', login); 
app.use('/register', register); 
app.use('/board', board);

// 404 中间件 
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 500 错误
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// 暴露 Express 
module.exports = app;
