var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PlayerCollection = require('./modules/player_collection');
var ExpressRouter = require('./modules/express_router');
var IORouter = require('./modules/io_router');

var sockets = [];
var expressRouter = new ExpressRouter(app);
var ioRouter = new IORouter(io,sockets);

server.listen(4004);

var playerinfos = new PlayerCollection();
