// login.js
var express = require('express');
var router = express.Router();

var auth = require('../nepping/auth'); 

router.get('/', function(req, res, next) {
	auth.check(req.cookies.auth, function(checked){
		// 已经登录过 
		if (checked){
			// 重定向到主页 
			res.redirect('/'); 
		} else {
			// 重定向到login
			res.render('login', {
				msg: 'Welcome'
			});
		}
	}); 
});

// 登出 logout 
router.get('/clear', function(req, res, next){
	// 剔除 cookie 
	auth.logout(req.cookies.auth); 

	// 清空浏览器 cookie 
	res.clearCookie('auth'); 
	res.redirect('/login'); 
}); 	

// 登录接口 ajax 
router.post('/', function(req, res, next){

	auth.verify(req.body, function(isAuthed){
		// req.body 里有用户帐号密码 
		if (isAuthed){
			// 通过 
			res.json({
				code: 200,
				data: {
					auth: auth.generate(req.body.id),
					user: req.body.id,
					info: auth.getUser(req.body.id)
				},
				msg: '登录成功'
			}); 
		} else {
			// 否则 
			res.status(403); 
			res.render('login', {
				code: 403,
				data: { },
				msg: "帐号或密码错误"
			}); 
		}
	})
}); 

module.exports = router;
