var networking = function(player){
	
    this.theplayer = player;
    this.players = [];

	this.state = "";
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


    this.create_physics_simulation();

    this.server_updates = [];

    //Connect to the socket.io server!
    this.client_connect_to_server();

    //We start pinging the server to determine latency
    this.create_ping_timer();

}

// TODO: Move shared functions to other file
networking.prototype.pos = function(a) { return {x:a.x,y:a.y}; };
    //Add a 2d vector with another one and return the resulting vector
networking.prototype.v_add = function(a,b) { return { x:(a.x+b.x).fixed(), y:(a.y+b.y).fixed() }; };
    //Simple linear interpolation between 2 vectors
networking.prototype.v_lerp = function(v,tv,t) { return { x: this.lerp(v.x, tv.x, t), y:this.lerp(v.y, tv.y, t) }; };


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

networking.prototype.onserverupdate_recieved = function(data){

        //TODO: Tie up with data:

        // pos: this.players.map(function(value){
        //     return value.pos;
        // })                                          // player positions
        // input: this.players.map(function(value){
        //     return value.last_input_seq;
        // })                                        //'player input sequence', the last input we processed for the players
        // t: this.server_time  

            //Lets clarify the information we have locally. One of the players is 'hosting' and
            //the other is a joined in client, so we name these host and client for making sure
            //the positions we get from the server are mapped onto the correct local sprites
        var player_host = this.players.self.host ?  this.players.self : this.players.other;
        var player_client = this.players.self.host ?  this.players.other : this.players.self;
        var this_player = this.players.self;
        
            //Store the server time (this is offset by the latency in the network, by the time we get it)
        this.server_time = data.t;
            //Update our local offset time from the last server update
        this.client_time = this.server_time - (this.net_offset/1000);

            //One approach is to set the position directly as the server tells you.
            //This is a common mistake and causes somewhat playable results on a local LAN, for example,
            //but causes terrible lag when any ping/latency is introduced. The player can not deduce any
            //information to interpolate with so it misses positions, and packet loss destroys this approach
            //even more so. See 'the bouncing ball problem' on Wikipedia.

        if(this.naive_approach) {

            if(data.hp) {
                player_host.pos = this.pos(data.hp);
            }

            if(data.cp) {
                player_client.pos = this.pos(data.cp);
            }

        } else {

                //Cache the data from the server,
                //and then play the timeline
                //back to the player with a small delay (net_offset), allowing
                //interpolation between the points.
            this.server_updates.push(data);

                //we limit the buffer in seconds worth of updates
                //60fps*buffer seconds = number of samples
            if(this.server_updates.length >= ( 60*this.buffer_size )) {
                this.server_updates.splice(0,1);
            }

                //We can see when the last tick we know of happened.
                //If client_time gets behind this due to latency, a snap occurs
                //to the last tick. Unavoidable, and a reallly bad connection here.
                //If that happens it might be best to drop the game after a period of time.
            this.oldest_tick = this.server_updates[0].t;

                //Handle the latest positions from the server
                //and make sure to correct our local predictions, making the server have final say.
            this.client_process_net_prediction_correction();
            
        } //non naive

}; //game_core.client_onserverupdate_recieved

networking.prototype.client_process_net_prediction_correction = function() {

        //No updates...
    if(!this.server_updates.length) return;

        //The most recent server update
    var latest_server_data = this.server_updates[this.server_updates.length-1];

        //Our latest server position
    var my_server_pos = this.players.self.host ? latest_server_data.hp : latest_server_data.cp;

        //Update the debug server position block
    this.ghosts.server_pos_self.pos = this.pos(my_server_pos);

            //here we handle our local input prediction ,
            //by correcting it with the server and reconciling its differences

        var my_last_input_on_server = this.players.self.host ? latest_server_data.his : latest_server_data.cis;
        if(my_last_input_on_server) {
                //The last input sequence index in my local input list
            var lastinputseq_index = -1;
                //Find this input in the list, and store the index
            for(var i = 0; i < this.players.self.inputs.length; ++i) {
                if(this.players.self.inputs[i].seq == my_last_input_on_server) {
                    lastinputseq_index = i;
                    break;
                }
            }

                //Now we can crop the list of any updates we have already processed
            if(lastinputseq_index != -1) {
                //so we have now gotten an acknowledgement from the server that our inputs here have been accepted
                //and that we can predict from this known position instead

                    //remove the rest of the inputs we have confirmed on the server
                var number_to_clear = Math.abs(lastinputseq_index - (-1));
                this.players.self.inputs.splice(0, number_to_clear);
                    //The player is now located at the new server position, authoritive server
                this.players.self.cur_state.pos = this.pos(my_server_pos);
                this.players.self.last_input_seq = lastinputseq_index;
                    //Now we reapply all the inputs that we have locally that
                    //the server hasn't yet confirmed. This will 'keep' our position the same,
                    //but also confirm the server position at the same time.
                this.client_update_physics();
                this.client_update_local_position();

            } // if(lastinputseq_index != -1)
        } //if my_last_input_on_server

}; //game_core.client_process_net_prediction_correction



/* ==============================================
* 
*   HANDLER CODE
*
   ============================================== */

networking.prototype.client_connect_to_server = function() {
        
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

networking.prototype.create_physics_simulation = function() {

    setInterval(function(){
        this._pdt = (new Date().getTime() - this._pdte)/1000.0;
        this._pdte = new Date().getTime();
        this.update_physics();
    }.bind(this), 15);

}; //game_core.client_create_physics_simulation


/* 
*   ==============================================
* 
*   PHYSICS LOOP CODE
*
*   ============================================== 
*/

networking.prototype.update_physics = function() {

        //Fetch the new direction from the input buffer,
        //and apply it to the state so we can smooth it in the visual state

    if(this.client_predict) {

        this.theplayer.old_state.pos = this.pos( this.theplayer.cur_state.pos );
        var nd = this.process_input(this.theplayer);
        this.theplayer.cur_state.pos = this.v_add( this.theplayer.old_state.pos, nd);
        this.theplayer.state_time = this.local_time;

    }

}; //game_core.client_update_physics


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

networking.prototype.handle_input = function() {

    var x_dir = 0;
    var y_dir = 0;
    var input = this.theplayer.inputs;

    if(input.length)
    {

        this.input_seq += 1;

            //Store the input state as a snapshot of what happened.
        this.theplayer.inputs.push({
            inputs : input,
            time : this.local_time.fixed(3),
            seq : this.input_seq
        });

            //Send the packet of information to the server.
            //The input packets are labelled with an 'i' in front.
        var server_packet = 'i.';
            server_packet += input.join('-') + '.';
            server_packet += this.local_time.toFixed(3).replace('.','-') + '.';
            server_packet += this.input_seq;

            //Go
        this.socket.send(  server_packet  );

            //Return the direction if needed
            //================================================
            //return not used
            //================================================
        //return this.physics_movement_vector_from_direction( x_dir, y_dir );
        this.theplayer.inputs = [];

    }
    

}

networking.prototype.client_update = function() {

    //Capture inputs from the player
    this.handle_input();
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


networking.prototype.client_process_net_updates = function() {

        //No updates...
    if(!this.server_updates.length) return;

    //First : Find the position in the updates, on the timeline
    //We call this current_time, then we find the past_pos and the target_pos using this,
    //searching throught the server_updates array for current_time in between 2 other times.
    // Then :  other player position = lerp ( past_pos, target_pos, current_time );

        //Find the position in the timeline of updates we stored.
    var current_time = this.client_time;
    var count = this.server_updates.length-1;
    var target = null;
    var previous = null;

        //We look from the 'oldest' updates, since the newest ones
        //are at the end (list.length-1 for example). This will be expensive
        //only when our time is not found on the timeline, since it will run all
        //samples. Usually this iterates very little before breaking out with a target.
    for(var i = 0; i < count; ++i) {

        var point = this.server_updates[i];
        var next_point = this.server_updates[i+1];

            //Compare our point in time with the server times we have
        if(current_time > point.t && current_time < next_point.t) {
            target = next_point;
            previous = point;
            break;
        }
    }

        //With no target we store the last known
        //server position and move to that instead
    if(!target) {
        target = this.server_updates[0];
        previous = this.server_updates[0];
    }

        //Now that we have a target and a previous destination,
        //We can interpolate between then based on 'how far in between' we are.
        //This is simple percentage maths, value/target = [0,1] range of numbers.
        //lerp requires the 0,1 value to lerp to? thats the one.

     if(target && previous) {

        this.target_time = target.t;

        var difference = this.target_time - current_time;
        var max_difference = (target.t - previous.t).fixed(3);
        var time_point = (difference/max_difference).fixed(3);

            //Because we use the same target and previous in extreme cases
            //It is possible to get incorrect values due to division by 0 difference
            //and such. This is a safe guard and should probably not be here. lol.
        if( isNaN(time_point) ) time_point = 0;
        if(time_point == -Infinity) time_point = 0;
        if(time_point == Infinity) time_point = 0;

            //The most recent server update
        var latest_server_data = this.server_updates[ this.server_updates.length-1 ];

            //These are the exact server positions from this tick, but only for the ghost
        var other_server_pos = this.theplayer.host ? latest_server_data.cp : latest_server_data.hp;

            //The other players positions in this timeline, behind us and in front of us
        var other_target_pos = this.theplayer.host ? target.cp : target.hp;
        var other_past_pos = this.theplayer.host ? previous.cp : previous.hp;

            //update the dest block, this is a simple lerp
            //to the target from the previous point in the server_updates buffer
        this.ghosts.server_pos_other.pos = this.pos(other_server_pos);
        this.ghosts.pos_other.pos = this.v_lerp(other_past_pos, other_target_pos, time_point);

        if(this.client_smoothing) {
            this.players.other.pos = this.v_lerp( this.players.other.pos, this.ghosts.pos_other.pos, this._pdt*this.client_smooth);
        } else {
            this.players.other.pos = this.pos(this.ghosts.pos_other.pos);
        }

            //Now, if not predicting client movement , we will maintain the local player position
            //using the same method, smoothing the players information from the past.
        if(!this.client_predict && !this.naive_approach) {

                //These are the exact server positions from this tick, but only for the ghost
            var my_server_pos = this.theplayer.host ? latest_server_data.hp : latest_server_data.cp;

                //The other players positions in this timeline, behind us and in front of us
            var my_target_pos = this.theplayer.host ? target.hp : target.cp;
            var my_past_pos = this.theplayer.host ? previous.hp : previous.cp;

                //Snap the ghost to the new server position
            this.ghosts.server_pos_self.pos = this.pos(my_server_pos);
            var local_target = this.v_lerp(my_past_pos, my_target_pos, time_point);

                //Smoothly follow the destination position
            if(this.client_smoothing) {
                this.theplayer.pos = this.v_lerp( this.theplayer.pos, local_target, this._pdt*this.client_smooth);
            } else {
                this.theplayer.pos = this.pos( local_target );
            }
        }

    } //if target && previous

}; //game_core.client_process_net_updates
