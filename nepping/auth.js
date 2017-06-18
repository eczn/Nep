// auth.js
var md5 = require('md5'); 
var db = require('./db'); 

var userList = [ ];
var authList = []; 

// Init Load 
db.load('userList').then(list => {
	userList = list; 
}).catch(err => {
	db.save('userList', userList); 
})

var saveUserList = () => {
	return db.save('userList', userList); 
}

// module.exports 
var auth = {}; 
module.exports = auth; 


// 空函数 
function _blankFunc(){}

// 检验 
auth.verify = function(user, cb){
	cb = cb || _blankFunc; 

	cb(userList.some((e)=>{
		return (e.id === user.id) && (e.pwd === user.pwd); 
	})); 
}

// getUser by id 
auth.getUser = id => {
	return userList.filter(user => user.id === id)[0]
}

// md5 生成器 
auth.generate = function(){
	let temp = new Date(); 
	temp = temp.toString() + Math.random().toString(); 

	let md5Value = md5(temp); 

	authList.unshift(md5Value); 
	return md5Value; 
}

// 检查cookie 
auth.check = function(cookieAuth, cb){
	cb = cb || _blankFunc; 

	// cb(true); 
	cb(authList.some(e => {
		return cookieAuth === e; 
	}));
}

// 登出 
auth.logout = function(cookieAuth, cb){
	cb = cb || _blankFunc; 
	let bo = true; 
	authList = authList.filter(e => {
		let temp = (e!== cookieAuth); 
		bo = bo & temp; 
		return temp; 
	});

	cb(bo); 
}

// 注册 
auth.register = (newUser, cb) => {
	let has = userList.filter(user => user.id === newUser.id); 


	if (has.length === 0){
		// 说明无重复 
		newUser.head = '/img/huaji.png';
		userList.push(newUser); 

		// 存入数据库 
		saveUserList(); 

		cb(true); 
	} else {
		// 否则 
		cb(false); 
	}
}
