var events = require('events');
var eventEmitter = new events.EventEmitter();


function IORouter(io, sockets) {
	this.io = io;
	this.sockets = sockets;
	
}

var p = IORouter.prototype;

p.on = function(eventName, callback) {
	eventEmitter.on(eventName, callback);
};

p.emit = function(eventName, data) {
	eventEmitter.emit(eventName, data);
};

p.handleConnection = function(socket) {
	socket.emit('connected', {
		id: this.sockets.length//playerinfos.playerCount(),
				//players: playerinfos.allPlayers()
	});
	this.sockets.push(socket);

	npm_crafty.addClient(this.craftyServer, socket);

	socket.on('createdplayer', this.handleCreatedPlayer.bind(this));
	socket.on('key_down', this.handleKeyDown.bind(this));
	socket.on('ping', this.handlePing.bind(socket));
};

p.handleDisconnection = function(socket) {
	console.log('Disconnecting')
	npm_crafty.removeClient(this.craftyServer, socket);
};

p.handleKeyDown = function(data) {
	console.log("key down");
	console.log(data);
	console.log(this);
	this.emit('key_down', data);
};

p.handleCreatedPlayer = function(data) {
	this.emit("newplayer", data);
};

p.handlePing = function(data) {
	console.log(data);
	var server_time = (new Date).getTime();
	this.emit('pong', {
		'ping_time': server_time - data,
		'server_time': server_time
	});
};


module.exports = IORouter;