// msg.js

function Msg(user){
	var pre = user.auth; 
	user.auth = 'You_Dont_Know_My_Auth'; 
	
	function mk(text){
		return {
			user: user, 
			text: text,
			type: 'plain'
		}
	}
	
	this.mk = mk; 
}

function ImgMsg(user){
	function mk(base64){
		return {
			user: user, 
			img: base64,
			type: 'image'
		}
	}

	this.mk = mk; 
}

function FileMsg(user){
	this.mk = base64 => fileName => {
		return {
			user: user, 
			file: base64,
			fileName: fileName,
			type: 'file'
		}
	}
}
