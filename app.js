var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PlayerCollection = require('./modules/player_collection');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/*', function(req, res, next) {
	var file = req.params[0];
	console.log('\t :: Express :: file requested : ' + file);
	res.sendFile(__dirname + '/' + file);
});


server.listen(4004);
var playerinfos = new PlayerCollection();
var sockets = [];

io.on('connection', function(socket) {
	socket.emit('connected', {
		id: playerinfos.playerCount(),
		players: playerinfos.allPlayers()
	});

	socket.join("players");
	sockets.push(socket);

	socket.on('createdplayer', function(data) {
		playerinfos.addPlayer(data);
		io.to("players").emit("newplayer", data);
	});

	socket.on('playermoved', function(data) {
		playerinfos.addPlayer(data);
		io.to("players").emit("playermoved", data);
	});

	socket.on('ping', function(data) {
		console.log(data);
		var server_time = (new Date).getTime();
		socket.emit('pong', {
			'ping_time': server_time - data,
			'server_time': server_time
		});
	});
});