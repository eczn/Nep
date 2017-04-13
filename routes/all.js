// all
var express = require('express');
var router = express.Router();

var auth = require('../nepping/auth'); 

/* GET home page. */
router.get(['/board', '/'], function(req, res, next){
	auth.check(req.cookies.auth, function(checked){
		if (checked){
			next(); 
		} else {
			res.redirect('/login'); 
		}
	}); 

	// next(); 
});


module.exports = router; 