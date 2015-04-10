var EventEmitter = require('events').EventEmitter;
var util = require('util');

function IORouter(io, sockets) {
	this.io = io;
	this.sockets = sockets;
	io.on('connection', this.handleConnection.bind(this));
}

util.inherits(IORouter, EventEmitter);
var p = IORouter.prototype;

p.handleConnection = function(socket) {
	socket.emit('connected', {
		id: this.sockets.length//playerinfos.playerCount(),
		//players: playerinfos.allPlayers()
	});

	socket.join("players");
	this.sockets.push(socket);
	var t = this;
	socket.on('createdplayer', function(data) {
		//playerinfos.addPlayer(data);
		t.io.to("players").emit("newplayer", data);
	});

	socket.on('key_down', this.handleKeyDown.bind(this));

	socket.on('ping', function(data) {
		console.log(data);
		var server_time = (new Date).getTime();
		socket.emit('pong', {
			'ping_time': server_time - data,
			'server_time': server_time
		});
	});
};

p.handleKeyDown = function(data) {
	console.log("key down");
	console.log(data);
	this.emit('key_down',data);
};


module.exports = IORouter;