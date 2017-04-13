// userstorage.js
var us = (function(){
	var ls = window.localStorage; 

	var getUser = function(){
		var user = ls.getItem('user'); 

		if (user){
			return JSON.parse(user); 
		} else {
			window.location.href = '/login'; 
		}
	}

	var setUser = function(user){
		var str = JSON.stringify(user); 
		ls.setItem('user', str); 
		
		return true; 
	}

	return {
		getUser: getUser,
		setUser: setUser
	}
})()