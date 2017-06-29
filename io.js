// var socketController = require('../')(io); 
var fs = require('then-fs'); 
var path = require('path'); 
var fileBase = path.join(__dirname, 'public', 'base'); 
var auth = require('./nepping/auth'); 

var boardList = [
	{
		name: 'Nep',
		img: '/img/001.jpg',
		intro: 'Nep官方',
		msgs: [],
		users: []
	},
	{
		name: 'CHEETS',
		img: '/img/stars.png',
		intro: '谈笑风生',
		msgs: [],
		users: []
	},
	{
		name: '2Chan',
		img: '/img/003.jpg',
		intro: '2-Chan',
		msgs: [],
		users: []
	},
	{
		name: 'PixiX',
		img: '/img/004.jpg',
		intro: '座谈',
		msgs: [],
		users: []
	}
];

var IO = {}; 

var auth = require('./nepping/auth'); 

module.exports = IO

var md = require('./nepping/md'); 

IO.todo = function(io) {
	// 遍历房间列表 
	var ioList = boardList.map((boardItem) => {
		// 取得名字 并使用 SocketIO 命名空间
		var IOBoard = io.of(boardItem.name);

		IOBoard.on('connection', socket => {
			console.log('\n\n >>>> CONNECTION'.debug, boardItem.name); 
			console.log(' >>>> IP'.debug, socket.conn.remoteAddress); 
			let SOCKET_ID = socket.id.split('#')[1]; 			
			let user = {
				ip: socket.conn.remoteAddress
			};  

			// 发历史消息 
			socket.emit('history', boardItem.msgs);
			socket.emit('onlineUsers', boardItem.users.map(user => {
				user.pwd = ''

				return user; 
			})); 

			// On Msg 
			socket.on('chatMsg', msg => {
				let userInfo = msg.user.info; 
				// 楼层 时间 
				msg.n = boardItem.msgs.length; 
				msg.time = new Date(); 

				if (msg.type === 'plain'){
					msg.text = md.render(msg.text);
					// 更新 
					userInfo.head = auth.getUser(userInfo.id).head; 
					IOBoard.emit('chatMsg', msg);
					boardItem.msgs.push(msg); 

				} else if (msg.type === 'image'){
					let datas = msg.img.split(','); 

					this.base64ToDisk(datas[1]).then(fileName => {
						// 保存成功 改名 
						msg.img = `/base/${ fileName }`; 

						// 触发 压栈 
						IOBoard.emit('chatMsg', msg); 
						boardItem.msgs.push(msg); 
					})
				} else if (msg.type === 'file'){
					let datas = msg.file.split(','); 
					console.log('On File', msg.fileName); 

					this.base64ToDisk(datas[1], msg.fileName).then(fileName => {
						msg.file = `/base/${ fileName }`; 

						IOBoard.emit('chatMsg', msg); 
						boardItem.msgs.push(msg);
					})
				}
			});

			socket.on('control', msg => {

				if (msg.type === 'login'){
					auth.verify(msg.info, (suc, userInAuth) => {
						if (suc) {
							let temp = {
								id: userInAuth.id, 
								head: userInAuth.head,
								ip: user.ip
							}

							boardItem.users.push(temp); 
							user = temp
							IOBoard.emit('chatConnect', userInAuth); 
						} else {
							socket.send('登录失败, 请刷新重试'); 
						}
					})
				}
			})

			socket.on('disconnect', reason => {
				IOBoard.emit('chatDisconnect', user); 
				boardItem.users = boardItem.users.filter(e => e.id !== user.id); 
			})
		});



		return IOBoard; 
	}); 
}


IO.base64ToDisk = (base64, fileName = (+ new Date()).toString()) => {
	let buf = new Buffer(base64, 'base64'); 
	return fs.writeFile(path.join(fileBase, fileName), buf).then(() => {
		return fileName; 
	}).catch(err => {
		console.log(err); 
		setTimeout(_ => { throw err; })
	});
}

IO.list = boardList; 
