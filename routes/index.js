var express = require('express');
var router = express.Router();

var IO = require('../io'); 

var auth = require('../nepping/auth'); 

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.nepUser)
	res.render('index', {
		BOARD_LIST: IO.list,
		req: req
	});
});

module.exports = router;
