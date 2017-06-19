var express = require('express');
var router = express.Router();

var multer  = require('multer'); 
var auth = require('../nepping/auth'); 
var path = require('path');

let dest = path.join(__dirname, '../', 'public/', 'ava'); 
console.log(dest)
var upload = multer({ dest: 'public/ava' }); 


router.get('/', function(req, res, next) {
	console.log(req.nepUser)
	res.render('profile', {
		req: req
	});
});

router.post('/upload', upload.single('img'), (req, res) => {
	let where = '/ava/' + req.file.filename 

	let user = auth.getUser(req.nepUser.id); 

	user.head = where; 
	auth.saveUserList(); 

	console.log(user)

	res.redirect('/profile');
}); 

module.exports = router;
