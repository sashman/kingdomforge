var app = require('express')();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var npm_crafty = require('npm_crafty');
var PlayerPool = require('./modules/player_pool');
var ExpressRouter = require('./modules/express_router');
var IORouter = require('./modules/io_router');

var sockets = [];
//var expressRouter = new ExpressRouter(app);
var ioRouter = new IORouter(io,sockets);
var playerPool = new PlayerPool(ioRouter);


npm_crafty.setupDefault( function () { //immediate callback
	//setup additional get requests

	var expressRouter = new ExpressRouter();

	npm_crafty.app.get('/', expressRouter.handleGetRoot);
	npm_crafty.app.get('/*', expressRouter.handleGetFile);

	//create Crafty Server and bind it to "Room1"
	Crafty = npm_crafty.createServer("Room1");
	
	//start the loading scene of our game
	// var pongBasic = require('./pongBasic.game.js');
	// pongBasic.startGame(Crafty);

		
	
}, function (socket) { //connect callback
	//bind to socket
	npm_crafty.addClient(Crafty, socket);
	
	
	
}, function (socket) { //disconnect callback
	//socket will auto leave room
	
});


// server.listen(4004);
