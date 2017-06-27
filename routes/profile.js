var express = require('express');
var router = express.Router();

var multer  = require('multer'); 
var auth = require('../nepping/auth'); 
var path = require('path');

let dest = path.join(__dirname, '../', 'public/', 'ava'); 

var upload = multer({ dest: 'public/ava' }); 

// 渲染页面 
router.get('/', function(req, res, next) {
	res.render('profile', {
		req: req
	});
});

// 上传头像接口 
router.post('/upload', upload.single('img'), (req, res) => {
	let where = '/ava/' + req.file.filename 

	let user = auth.getUser(req.nepUser.id); 

	user.head = where; 
	auth.saveUserList(); 

	console.log(user)

	res.redirect('/profile');
}); 

module.exports = router;
