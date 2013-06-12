var networking = function(player){
	
    this.theplayer = theplayer;
    this.players = [];

	this.state = "";
    this.local_time = 0;
    this.first_player = false;

    this.net_ping = 0;
    this.net_latency = 0;

    //Set up some physics integration values
    this._pdt = 0.0001;                 //The physics update delta time
    this._pdte = new Date().getTime();  //The physics update last delta time
        //A local timer for precision on server and client
    this.local_time = 0.016;            //The local timer
    this._dt = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();   //The local timer last frame time

    this.server_updates = [];

    //Connect to the socket.io server!
    //this.client_connect_to_server();

    //We start pinging the server to determine latency
    this.create_ping_timer();         

}

networking.prototype.add_player = function(player){
    console.log("Player "+player.id+" added");
    this.players.push(player);
}

networking.prototype.ondisconnect = function(data){
	console.log("disconnect");
}

networking.prototype.onserverupdate_recieved = function(data){
	console.log("serverupdate_recieved");
}

networking.prototype.onconnected = function(data){
	this.state = "connected";
	console.log(this.state);
	
}
networking.prototype.onnetmessage = function(data){
	console.log("NETMESSAGE: " + data);

    var commands = data.split('.');
    var command = commands[0];
    var subcommand = commands[1] || null;
    var commanddata = commands[2] || null;

    switch(command) {
        case 's': //server message

            switch(subcommand) {

                case 'h' : //host a game requested
                    this.onhostgame(commanddata); break;

                case 'j' : //join a game requested
                    this.onjoingame(commanddata); break;

                case 'r' : //ready a game requested
                    this.onreadygame(commanddata); break;

                case 'e' : //end game requested
                    this.ondisconnect(commanddata); break;

                case 'p' : //server ping
                    this.onping(commanddata); break;

            } //subcommand

        break; //'s'
    } //command
}


/* ==============================================
* 
*   HANDLER CODE
*
   ============================================== */

networking.prototype.connect_to_server = function() {
        
            //Store a local reference to our connection to the server
        this.socket = io.connect();

            //When we connect, we are not 'connected' until we have a server id
            //and are placed in a game by the server. The server sends us a message for that.

        
        this.socket.on('connect', function(){
            this.state = 'connecting';
        }.bind(this));

            //Sent when we are disconnected (network, server down, etc)
        this.socket.on('disconnect', this.ondisconnect.bind(this));
            //Sent each tick of the server simulation. This is our authoritive update
        this.socket.on('onserverupdate', this.onserverupdate_recieved.bind(this));
            //Handle when we connect to the server, showing state and storing id's.
        this.socket.on('onconnected', this.onconnected.bind(this));
            //On error we just show that we are not connected for now. Can print the data.
        this.socket.on('error', this.ondisconnect.bind(this));
            //On message from the server, we parse the commands and send it to the handlers
        this.socket.on('message', this.onnetmessage.bind(this));
        

}; //game_core.client_connect_to_server

/*
    Message received by the first player joining the game
*/
networking.prototype.onhostgame = function(data) {

        //The server sends the time when asking us to host, but it should be a new game.
        //so the value will be really small anyway (15 or 16ms)
    var server_time = parseFloat(data.replace('-','.'));

        //Get an estimate of the current time on the server
    this.local_time = server_time + this.net_latency;

        //Update debugging information to display state
    this.first_player = true;
    this.state = 'hosting.waiting for a player';
    

//TODO: initialise the player here


}; //client_onhostgame

/*
    Message received by every next player joining the game
*/
networking.prototype.onjoingame = function(data) {

        //We are not the host
    
    this.state = 'connected.joined.waiting';

    //TODO: initialise the player here
    

}; //client_onjoingame

networking.prototype.onreadygame = function(data) {

    var server_time = parseFloat(data.replace('-','.'));


    //TODO: set up player instances

    //var player_host = this.players.self.host ?  this.players.self : this.players.other;
    //var player_client = this.players.self.host ?  this.players.other : this.players.self;


    this.local_time = server_time + this.net_latency;
    console.log('server time is about ' + this.local_time);

        //Store their info colors for clarity. server is always blue
        /*
    player_host.info_color = '#2288cc';
    player_client.info_color = '#cc8822';
        
        //Update their information
    player_host.state = 'local_pos(hosting)';
    player_client.state = 'local_pos(joined)';
*/
    this.state = "joined.ready";

}; //client_onreadygame

networking.prototype.ondisconnect = function(data) {

    this.state = 'not-connected';

}; //client_ondisconnect

networking.prototype.onping = function(data) {

    this.net_ping = new Date().getTime() - parseFloat( data );
    this.net_latency = this.net_ping/2;

}; //client_onping

networking.prototype.create_ping_timer = function() {

        //Set a ping timer to 1 second, to maintain the ping/latency between
        //client and server and calculated roughly how our connection is doing

    setInterval(function(){

        this.last_ping_time = new Date().getTime() - this.fake_lag;
        this.socket.send('p.' + (this.last_ping_time) );

    }.bind(this), 1000);
    
}; //game_core.client_create_ping_timer


/* ==============================================
* 
*   UPDATE LOOP CODE
*
   ============================================== */

    //Main update loop
networking.prototype.update = function(t) {
    //IMPORTANT
    //this method should be called on every frame from outside!
    
        //Work out the delta time
    this.dt = this.lastframetime ? ( (t - this.lastframetime)/1000.0).fixed() : 0.016;

    //Store the last frame time
    this.lastframetime = t;

    //Update the game specifics

    this.client_update();


    //schedule the next update
    //to be used for stand alone
    //this.updateid = window.requestAnimationFrame( this.update.bind(this), this.viewport );

}; //game_core.update


game_core.prototype.client_update = function() {

    //Capture inputs from the player
    //this.handle_input();
    //see game_core.prototype.client_handle_input 
    //at this point we want to gather up all the client movement events
    //push them to a queue
    //send to server

        //Network player just gets drawn normally, with interpolation from
        //the server updates, smoothing out the positions from the past.
        //Note that if we don't have prediction enabled - this will also
        //update the actual local client position on screen as well.
    if( !this.naive_approach ) {
        this.client_process_net_updates();
    }

        //Now they should have updated, we can draw the entity
    this.players.other.draw();

        //When we are doing client side prediction, we smooth out our position
        //across frames using local input states we have stored.
    this.client_update_local_position();

        //And then we finally draw
    this.players.self.draw();

        //and these
    if(this.show_dest_pos && !this.naive_approach) {
        this.ghosts.pos_other.draw();
    }

        //and lastly draw these
    if(this.show_server_pos && !this.naive_approach) {
        this.ghosts.server_pos_self.draw();
        this.ghosts.server_pos_other.draw();
    }

        //Work out the fps average
    this.client_refresh_fps();

}; //game_core.update_client
