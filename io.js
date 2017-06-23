// var socketController = require('../')(io); 
var fs = require('then-fs'); 
var path = require('path'); 
var fileBase = path.join(__dirname, 'public', 'base'); 

var boardList = [
	{
		name: 'Nep',
		img: '/img/001.jpg',
		intro: 'Nep官方',
		msgs: []
	},
	{
		name: 'CHEETS',
		img: '/img/002.jpg',
		intro: '谈笑风生',
		msgs: []
	},
	{
		name: '2Chan',
		img: '/img/003.jpg',
		intro: '2-Chan',
		msgs: []
	},
	{
		name: 'PixiX',
		img: '/img/004.jpg',
		intro: '座谈',
		msgs: []
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
		var board = io.of(boardItem.name);

		board.on('connection', socket => {
			console.log('>>>> CONNECTION', boardItem.name); 
			
			// 发历史消息 
			socket.emit('history', boardItem.msgs);

			// On Msg 
			socket.on('message', msg => {
				let userInfo = msg.user.info; 

				if (msg.type === 'plain'){
					msg.text = md.render(msg.text);
					// 更新 
					userInfo.head = auth.getUser(userInfo.id).head; 
					board.emit('message', msg);
					boardItem.msgs.push(msg); 

				} else if (msg.type === 'image'){
					let datas = msg.img.split(','); 

					this.base64ToDisk(datas[1]).then(fileName => {
						// 保存成功 改名 
						msg.img = `/base/${ fileName }`; 

						// 触发 压栈 
						board.emit('message', msg); 
						boardItem.msgs.push(msg); 
					})
				} else if (msg.type === 'file'){
					let datas = msg.file.split(','); 
					console.log('On File', msg.fileName); 

					this.base64ToDisk(datas[1], msg.fileName).then(fileName => {
						msg.file = `/base/${ fileName }`; 

						board.emit('message', msg); 
						boardItem.msgs.push(msg);
					})
				}
			});
		});

		return board; 
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
