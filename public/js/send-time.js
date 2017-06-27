// send-time.js
$('.clock').click(function(){
	let data = myClock.canvas2img(); 

	socket.emit('chatMsg', imgMsg.mk(data));
})