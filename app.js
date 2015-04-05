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

    //TODO: move to connection handler
    socket.emit('connected', {
        id: playerinfos.playerCount(),
        players: playerinfos.allPlayers()
    });

    socket.join("players");
    sockets.push(socket);

    //TODO: move to new player handler
    socket.on('createdplayer', function(data) {
        playerinfos.addPlayer(data);
        io.to("players").emit("newplayer", data);
    });

    //TODO: move to player action handler
    socket.on('playermoved', function(data) {
        playerinfos.addPlayer(data);
        io.to("players").emit("playermoved", data);
    });

    //TODO: move to ponger handler
    socket.on('ping', function(data) {
        console.log(data);
        var server_time = (new Date).getTime();
        socket.emit('pong', {
            'ping_time': server_time - data,
            'server_time': server_time
        });
    });

    //TODO: map request handler
    socket.on('maprequest', function(data) {
        console.log('maprequest', data);
        
        socket.emit('mapresponse', {
            data: 'mapdata'
        });
    });
});