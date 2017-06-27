// register.js
var express = require('express');
var router = express.Router();

var auth = require('../nepping/auth'); 

// 
router.get('/', function(req, res, next) {
	res.render('register', {
		msg: 'NepId & Pwd'
	});
});

router.post('/', function(req, res, next){
	auth.register(req.body, succ => {
		if (succ){
			res.render('login', {
				msg: '注册成功'
			});
		} else {
			res.render('register', {
				msg: `${req.body.id} 已被注册`
			})
		}
	}); 
}); 

module.exports = router;
