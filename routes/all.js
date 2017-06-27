// all
var express = require('express');
var router = express.Router();

var auth = require('../nepping/auth'); 

// 一夫当关 
// 负责登录状态的维持、校验
router.all(['/board', '/profile', '/profile/*', '/'], function(req, res, next){
	// 调用 check 检查 cookie 是否在已登录用户的列表里
	// next();
	// return; 
	auth.check(req.cookies.auth, function(checked, user){
		// 如果确实在 
		if (checked){
			// 给 req 添加属性 
			req.nepUser = user;

			// 下一个中间件  
			next(); 
		} else {
			// 否则重定向到登录页 
			res.redirect('/login'); 
		}
	}); 
});

module.exports = router; 
