// send-img.js 
function loadImg(cb){  
	var file = $("#file-input")[0].files[0];  
	var reader = new FileReader();  

	// reader.onload = function(e) {  
	// 	var imgFile;  
	// 	// Base64: imgFile 
	// 	imgFile = e.target.result;  
	// 	$("#ava").attr('src', imgFile);  
	// };  

	reader.onload = function(e){
		cb(e.target.result); 
	} 

	return reader.readAsDataURL(file);
}  


$('#file-input').change(function(e){
	loadImg(function(base64){

		chat.emit('message', imgMsg.mk(base64));
	})
})

