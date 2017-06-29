var user = us.getUser(); 
var msg = new Msg(user); 
var imgMsg = new ImgMsg(user); 
var fileMsg = new FileMsg(user); 

console.groupCollapsed(
	` %c [${new Date().toLocaleTimeString()}] UserStorage Ready `,
	`background: rgb(64, 64, 64);color: #DDD;`
)
	console.log(user); 
console.groupEnd();

// var where = window.location.origin.toString() + '/' + BOARD_ID; 

var socket = io('127.0.0.1:3333');
socket.nsp = '/' + BOARD_ID; 

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
					<span class="n">${zeroPrefix(data.n)}</span>
				</span>
			</div>
			<div class="content">
				<span class="text">
					${ data.text }
				</span>
				<span class="time">${data.time}</span>
			</div>
		</li>
	`; 
	var toAdd = $(str); 


	$('#messages').prepend(toAdd);
}

function zeroPrefix(n){
	return ('00' + n.toString()).slice(-2); 
}

function addImg(data){
	let info = data.user.info; 

	var str = `
		<li username="${info.id}">
			<div class="msg-header">
				<img src="${info.head}" class="ava" />
				<span class="whosay">
					${info.id}
					<span class="n">${zeroPrefix(data.n)}</span>
				</span>
			</div>
			<div class="content">
				<img src="${data.img}" />

				<span class="time">${data.time}</span>
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
					<span class="n">${zeroPrefix(data.n)}</span>
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
				<span class="time">${data.time}</span>
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

function timeFilter(time){
	var s = zeroPrefix(time.getSeconds()),
		m = zeroPrefix(time.getMinutes()), 
		h = zeroPrefix(time.getHours()); 

	return [h, m, s].join(':'); 
}

function onChatMsg(data){
	data.time = timeFilter(
		new Date(data.time)
	);

	console.groupCollapsed(
		` %c [${new Date().toLocaleTimeString()}] ChatMsg ${data.type} Recive `,
		`background: rgb(255, 204, 102);color: #B33;`
	)
		console.log(data); 
	console.groupEnd();

	if (data.type === 'plain'){
		addItem(data); 	
	} else if (data.type === 'image'){
		addImg(data); 
	} else if (data.type === 'file'){
		addFile(data); 
	}
}

socket.on('chatMsg', onChatMsg);

socket.on('message', function(msg){
	console.log(
		` %c [${new Date().toLocaleTimeString()}] Msg From Server: ${msg} `,
		'color: #fff; background: #EB4; font-size: 24px;border-radius: 4px;font-family: consolas; line-height: 4em; padding: 1em;'
	)
	alert(msg); 
}); 

socket.on('chatDisconnect', function(who){
	boardAlert(`&gt;&gt;&gt;&gt; 用户 ${who.id} 已离开本版 &lt;&lt;&lt;&lt;`); 
	deleteFromUserList(who); 

	console.log(
		` %c [${new Date().toLocaleTimeString()}] ${who.id} 已离开本版 `,
		'background-color: #ff6a6a; color: #FFF; font-weight: bolder;'
	)
})

socket.on('chatConnect', function(who){
	boardAlert(`&gt;&gt;&gt;&gt; 用户 ${who.id} 已加入本版 &lt;&lt;&lt;&lt;`); 
	add2UserList(who);

	console.log(
		` %c [${new Date().toLocaleTimeString()}] ${who.id} 已加入本版 `,
		'background-color: #ff6a6a; color: #FFF; font-weight: bolder;'
	)
})

socket.on('history', function(msgArr){
	console.groupCollapsed(
		` %c [${new Date().toLocaleTimeString()}] History Msgs `,
		`background-color: rgb(240, 240, 255); color: rgb(35, 45, 75);`
	)
		console.log(msgArr); 
	console.groupEnd();

	msgArr.forEach(function(e, idx){
		setTimeout(() => {
			onChatMsg(e); 
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
	console.groupCollapsed(
		` %c [${new Date().toLocaleTimeString()}] UserList `,
		`background-color: rgb(180, 220, 250); color: rgb(40, 75, 45);`
	)
		console.log(userList); 
	console.groupEnd();
	
	userList.map(add2UserList); 
}); 
