// auth.js
var md5 = require('md5'); 


var userList = [
	{
		id: 'eczn', 
		pwd: 'asd123'
	}
];

var authList = []; 

var auth = {}; 

module.exports = auth; 

function _blankFunc(){}

auth.verify = function(user, cb){
	cb = cb || _blankFunc; 

	cb(userList.some((e)=>{
		return (e.id === user.id) && (e.pwd === user.pwd); 
	})); 
}

auth.generate = function(){
	let temp = new Date(); 
	temp = temp.toString() + Math.random().toString(); 

	let md5Value = md5(temp); 

	authList.unshift(md5Value); 
	return md5Value; 
}

auth.check = function(cookieAuth, cb){
	cb = cb || _blankFunc; 

	// cb(true); 
	cb(authList.some(e => {
		return cookieAuth === e; 
	}));
}

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
