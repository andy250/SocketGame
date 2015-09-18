var util, io, players;

util = require('util');
	
function init() {
	players = {};
	
	io = require("socket.io")(8666);
	
	io.on('connection', function (socket) {
		util.log("New player has connected: " + socket.id);
		
		socket.on('newplayer', function (msg) {
			util.log("Player logon: " + util.inspect(msg, false, null));
			socket.broadcast.emit('newplayer', msg);
		
			for (var key in players) {
				if (players.hasOwnProperty(key)) {
					socket.emit('newplayer', players[key]);
				}
			}
			
			players[socket.id] = msg;
		});
		
		socket.on('move', function (msg) {
			util.log("Player moved: " + socket.id);
			util.log(util.inspect(msg, false, null));
			msg.id = socket.id;
			players[socket.id].x = msg.x;
			players[socket.id].y = msg.y;
			players[socket.id].r = msg.r;
			socket.broadcast.emit('move', msg);
		});
		
		socket.on('shoot', function (msg) {
			util.log("Player shot: " + socket.id);
			util.log(util.inspect(msg, false, null));
			socket.broadcast.emit('shoot', msg);
		});
		
		socket.on('shotend', function (msg) {
			util.log("shot end: " + msg);
			io.emit('shotend', msg);
		});
		
		socket.on('hit', function () {
			util.log("shot end: " + socket.id);
			io.emit('hit', socket.id);
		});
		
		socket.on('death', function () {
			util.log("death: " + socket.id);
			delete players[socket.id];
			io.emit('death', socket.id);
		});
		
		socket.on('disconnect', function () {
			util.log("Player disconnected: " + socket.id);
			delete players[socket.id];
			socket.broadcast.emit('dumpplayer', socket.id);
		});
	});
};

init();