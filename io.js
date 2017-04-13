// var socketController = require('../')(io); 

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
		msgs: [{
			text: 'asdasd',
			user: {
				user: '阿门',
				img: '/img/001.jpg'
			}
		},
		{
			text: '2312314',
			user: {
				user: 'nmb',
				img: '/img/001.jpg'
			}
		},
		{
			text: '661616661616661616661616661616661616661616661616661616661616661616661616661616661616661616661616661616661616661616661616',
			user: {
				user: '???',
				img: '/img/001.jpg'
			}
		}]
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

module.exports = IO

IO.todo = function(io){
	var ioList = boardList.map((boardItem) => {
		var board = io
			.of(boardItem.name);

		board.on('connection', function(socket){
			console.log('FIND CONNECTION!'); 
			

			socket.emit('history', boardItem.msgs);

			socket.on('message', function(msg){
				console.log('message: ' + msg);
				boardItem.msgs.push(msg); 

				board.emit('message', msg);
			});
		});

		return board; 
	}); 

}

IO.list = boardList; 
