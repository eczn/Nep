var user = us.getUser(); 
var msg = new Msg(user); 
var imgMsg = new ImgMsg(user); 
var fileMsg = new FileMsg(user); 

console.log(user);

var where = window.location.origin.toString() + '/' + BOARD_ID; 
var socket = io(where);

socket.emit('control', {
	type: 'login',
	info: user.info
}); 

$('#to-send').click(function(){
	var toSend = $('#m').val(); 

	socket.emit('chatMsg', msg.mk(toSend));

	$('#m').val(''); 
	return false;
});

function addItem(data){
	// var toAdd = $('<li>').text(data.text).attr('username', data.user.user); 
	let info = data.user.info; 

	var str = `
		<li username="${info.id}" class="ani-big">
			<div class="msg-header">
				<img src="${info.head}" class="ava" />
				<span class="whosay">

					${info.id}
				</span>
			</div>
			<div class="content">
				<span class="text">
					${ data.text }
				</span>
			</div>
		</li>
	`; 
	var toAdd = $(str); 


	$('#messages').prepend(toAdd);
}

function addImg(data){
	let info = data.user.info; 

	var str = `
		<li username="${info.id}">
			<div class="msg-header">
				<img src="${info.head}" class="ava" />
				<span class="whosay">

					${info.id}
				</span>
			</div>
			<div class="content">
				<img src="${data.img}" />
			</div>
		</li>
	`; 
	var toAdd = $(str); 

	$('#messages').prepend(toAdd);
}

function addFile(data){
	let info = data.user.info; 

	var str = `
		<li username="${info.id}">
			<div class="msg-header">
				<img src="${info.head}" class="ava" />
				<span class="whosay">

					${info.id}
				</span>
			</div>
			<div class="content file-content">
				<a href="${data.file}" target="_blank" download="${data.fileName}">
					<div class="file-container">
						<svg class="file-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#556" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
						    <polyline points="13 2 13 9 20 9"/>
						</svg>
						<span class="file-name">${data.fileName}</span>

						<svg class="check" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#FFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						    <polyline points="20 6 9 17 4 12"/>
						</svg>
					</div>
				</a>
			</div>
		</li>
	`
	var toAdd = $(str); 

	$('#messages').prepend(toAdd);
}

function boardAlert(msg){
	var str = `
		<div class="board-alert ani-big">
			<p>${msg}</p>
		</div>
	`

	$('#messages').prepend($(str))
}

function handleClick(){

}

socket.on('chatMsg', function(data){
	if (data.type === 'plain'){
		addItem(data); 	
	} else if (data.type === 'image'){
		addImg(data); 
	} else if (data.type === 'file'){
		addFile(data); 
	}
});

socket.on('message', function(msg){
	alert(msg); 
}); 

socket.on('chatDisconnect', function(who){
	boardAlert(`&gt;&gt;&gt;&gt; 用户 ${who.id} 已离开本版 &lt;&lt;&lt;&lt;`); 
	deleteFromUserList(who); 
})
socket.on('chatConnect', function(who){
	boardAlert(`&gt;&gt;&gt;&gt; 用户 ${who.id} 已加入本版 &lt;&lt;&lt;&lt;`); 
	add2UserList(who)
})

socket.on('history', function(msgArr){
	var temp; 
	console.log('HISTORY', msgArr); 

	msgArr.forEach(function(e, idx){
		setTimeout(() => {
			// $('#messages').prepend($('<li>').text(e.text));
			if (e.type === 'plain') addItem(e); 
			else if (e.type === 'image') addImg(e); 
			else if (e.type === 'file') addFile(e); 

		}, idx * 100); 
	})
});

function add2UserList(user){
	$('.user-list').append(
		$(`
			<li user="${user.id}" class="user-avatar ani-big">
				<img src="${user.head}" />
				<p>${user.id}</p>
			</li>
		`)
	)
}

function deleteFromUserList(user){
	let id = user.id; 
	$(`.user-avatar[user="${id}"]`).addClass('ani-small'); 
}

socket.on('onlineUsers', function(userList){
	console.log('USERLIST'); 
	console.log(userList)
	
	userList.map(add2UserList); 
}); 
