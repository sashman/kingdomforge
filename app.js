var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PlayerPool = require('./modules/player_pool');
var ExpressRouter = require('./modules/express_router');
var IORouter = require('./modules/io_router');

var sockets = [];
var expressRouter = new ExpressRouter(app);
var ioRouter = new IORouter(io,sockets);
var playerPool = new PlayerPool(ioRouter);

server.listen(4004);
