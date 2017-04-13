// board.js
var express = require('express');
var router = express.Router();

var IO = require('../io'); 

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log(req.query); 
	
	res.render('board', {
		BOARD_ID: req.query.BOARD_ID || 'Nep',
		BOARD_LIST: IO.list
	}); 
});


module.exports = router; 
