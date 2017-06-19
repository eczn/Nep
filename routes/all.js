// all
var express = require('express');
var router = express.Router();

var auth = require('../nepping/auth'); 

/* GET home page. */
router.all(['/board', '/profile', '/profile/*', '/'], function(req, res, next){
	auth.check(req.cookies.auth, function(checked, user){
		if (checked){
			req.nepUser = user; 
			next(); 
		} else {
			res.redirect('/login'); 
		}
	}); 

	// next(); 
});


module.exports = router; 