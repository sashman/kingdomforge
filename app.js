var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PlayerCollection = require('./modules/playercollection');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get( '/*' , function( req, res, next ) {
	var file = req.params[0];
	console.log('\t :: Express :: file requested : ' + file);
	res.sendFile( __dirname + '/' + file );
});


server.listen(80);
var playerinfos = new PlayerCollection();
var sockets = [];

io.on('connection', function (socket) {
	socket.emit('connected', {id: playerinfos.playerCount(), players: playerinfos.allPlayers()});

	socket.join( "players" );
	sockets.push(socket);
	
	socket.on('createdplayer', function (data) {
		playerinfos.addPlayer(data);
		io.to("players").emit("newplayer", data );
	});

	socket.on('playermoved', function (data) {
		playerinfos.addPlayer(data);
		io.to("players").emit("playermoved", data );
	});
});