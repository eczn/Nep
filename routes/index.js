var express = require('express');
var router = express.Router();

// Socket 实例 
var IO = require('../io'); 

// auth 模块 
var auth = require('../nepping/auth'); 

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.nepUser)

	// 渲染 index.ejs 
	res.render('index', {
		BOARD_LIST: IO.list,
		req: req
	});
});

module.exports = router;
