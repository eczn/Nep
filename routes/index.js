var express = require('express');
var router = express.Router();

var IO = require('../io'); 

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		BOARD_LIST: IO.list
	});
});

module.exports = router;
