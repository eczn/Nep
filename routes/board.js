// board.js
var express = require('express');
var router = express.Router();

// Socket 实例 
var IO = require('../io'); 

router.get('/', function(req, res, next) {
	// 渲染页面 
	res.render('board', {
		BOARD_ID: req.query.BOARD_ID || 'Nep',
		BOARD_LIST: IO.list
	}); 
});


module.exports = router; 
