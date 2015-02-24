/*  Copyright (c) 2012 Sven "FuzzYspo0N" Bergström
	
	written by : http://underscorediscovery.com
	written for : http://buildnewgames.com/real-time-multiplayer/
	
	MIT Licensed.

	Usage : node app.js
*/

	var
		gameport        = process.env.PORT || 4004,

		io              = require('socket.io'),
		express         = require('express'),
		UUID            = require('node-uuid'),

		//ajax related
		http 			= require('http'),
		fs 				= require('fs'),
		url 			= require('url'),

		verbose         = false,
		app             = express();

/* Express server set up. */

//The express server handles passing our content to the browser,
//As well as routing users where they need to go. This example is bare bones
//and will serve any file the user requests from the root of your web server (where you launch the script from)
//so keep this in mind - this is not a production script but a development teaching tool.

	////Tell the server to listen for incoming connections
	//app.listen( gameport );

	var server = http.createServer(app).listen(gameport, function(){
		console.log('\t :: Express :: Listening on port ' + gameport );
	});

		//By default, we forward the / path to index.html automatically.
	app.get( '/', function( req, res ){
		res.sendfile( __dirname + '/index.html' );
	});


		

	//ajax handling for map requests
	app.enable('/get_map');
	app.get('/get_map', function(request, res) {

	  var x = url.parse(request.url, true).query['global_x'];
	  var y = url.parse(request.url, true).query['global_y'];

	  //debug
	  //console.log("map request recieved x=" + x + " y=" + y);

		if(!fs.existsSync("data/map/"+x+"_"+y+".map"))
		{
			// res.write("{\"map\":{}}");  
			res.write("");  
			res.end('\n', "utf-8");

		} else {

			res.writeHead(200, {'content-type': 'text/json'});
			fs.readFile("data/map/"+x+"_"+y+".map", function(err, file) {  
					if(err) {  
						// write an error response or nothing here  
						console.log(err);
						return;  
					}
					res.write(file);  
					res.end('\n', "utf-8");  
				});
		}

	});

	//This handler will listen for requests on /*, any file from the root of our server.
	//See expressjs documentation for more info on routing.

	app.get( '/*' , function( req, res, next ) {

			//This is the current file they have requested
		var file = req.params[0];

			//For debugging, we can track what files are requested.
		if(verbose) console.log('\t :: Express :: file requested : ' + file);

			//Send the requesting client the file.
		res.sendfile( __dirname + '/' + file );

	}); //app.get *


/* Socket.IO server set up. */

//Express and socket.io can work together to serve the socket.io client files for you.
//This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
		
		//Create a socket.io instance using our express server
	var sio = io.listen(server);

		//Configure the socket.io connection settings.
		//See http://socket.io/
	sio.configure(function (){

		sio.set('log level', 0);

		sio.set('authorization', function (handshakeData, callback) {
		  callback(null, true); // error first callback style
		});

	});

	


		//Enter the game server code. The game server handles
		//client connections looking for a game, creating games,
		//leaving games, joining games and ending games when they leave.
	// game_server = require('./src/game.server.js');

		//Socket.io will call this function when a client connects,
		//So we can send that client looking for a game to play,
		//as well as give that client a unique ID to use so we can
		//maintain the list if players.
	sio.sockets.on('connection', function (client) {
		
			//Generate a new UUID, looks something like
			//5b2ca132-64bd-4513-99da-90e838ca47d1
			//and store this on their socket/connection
		client.userid = UUID();

			//tell the player they connected, giving them their id
		client.emit('onconnected', { id: client.userid } );

			//now we can find them a game to play with someone.
			//if no game exists with someone waiting, they create one and wait.
		//console.log("calling findGame");
		game_server.findGame(client);

			//Useful to know when someone connects
		console.log('\t socket.io:: player ' + client.userid + ' connected');
		

			//Now we want to handle some of the messages that clients will send.
			//They send messages here, and we send them to the game_server to handle.
		client.on('message', function(m) {

			game_server.onMessage(client, m);

		}); //client.on message

			//When this client disconnects, we want to tell the game server
			//about that as well, so it can remove them from the game they are
			//in, and make sure the other player knows that they left and so on.
		client.on('disconnect', function () {

				//Useful to know when soomeone disconnects
			console.log('\t socket.io:: client disconnected ' + client.userid + ' ' + client.game_id);
			
				//If the client was in a game, set by game_server.findGame,
				//we can tell the game server to update that game state.
			if(client.game && client.game.id) {

				//player leaving a game should destroy that game
				game_server.endGame(client.game.id, client.userid);

			} //client.game_id

		}); //client.on disconnect
	 
	}); //sio.sockets.on connection

