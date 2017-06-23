// send-file.js

$('#any-file').change(function(e){
	var file = $('#any-file')[0].files[0];  
	
	loadFile(file, function(base64){
		let temp = $('#any-file').val()
		let fileName = temp.slice(temp.lastIndexOf('\\') + 1); 

		chat.emit('message', fileMsg.mk(base64)(fileName));
	})
})
