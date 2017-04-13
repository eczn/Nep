// msg.js

function Msg(user){
	var pre = user.auth; 
	user.auth = 'You_Dont_Know_My_Auth'; 
	
	function mk(text){
		return {
			user: user, 
			text: text
		}
	}
	
	this.mk = mk; 
}
