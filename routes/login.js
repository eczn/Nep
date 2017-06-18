// login.js
var express = require('express');
var router = express.Router();

var auth = require('../nepping/auth'); 

/* GET home page. */
router.get('/', function(req, res, next) {
	auth.check(req.cookies.auth, function(checked){
		if (checked){
			res.redirect('/'); 
		} else {
			res.render('login', {
				msg: 'Welcome'
			});
		}
	}); 
});

router.get('/clear', function(req, res, next){
	auth.logout(req.cookies.auth); 

	res.clearCookie('auth'); 
	res.redirect('/login'); 
}); 	

router.post('/', function(req, res, next){
	auth.verify(req.body, function(isAuthed){

		if (isAuthed){
			// res.redirect('/'); 
			res.json({
				code: 200,
				data: {
					auth: auth.generate(),
					user: req.body.id,
					info: auth.getUser(req.body.id)
				},
				msg: '登录成功'
			}); 
		} else {
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
