//Constructor
var server_networking = function(){
    // Set up players
    this.players = [];

    // Set up time
    this.server_time = new Date().getTime();
    this.local_time = 0.016;

    // Start physics loop
    this.create_physics_simulation();

    // Start update loop
    this.start_update(this.server_time);

    // Clear last state
    this.last_state = {}
}

server_networking.prototype.create_physics_simulation = function() {

    setInterval(function(){
        // this._pdt = (new Date().getTime() - this._pdte)/1000.0;
        // this._pdte = new Date().getTime();
        this.update_physics();
    }.bind(this), 15);

};

server_networking.prototype.start_update = function(time) {
    //Work out the delta time
    this.dt = this.lastframetime ? ( (t - this.lastframetime)/1000.0).fixed() : 0.016;

    //Store the last frame time
    this.lastframetime = time;

    this.update();

    //schedule the next update
    this.updateid = window.requestAnimationFrame( this.start_loops.bind(this), this.viewport );
};

//Create loops with setInterval

server_networking.prototype.pos = function(a) { return {x:a.x,y:a.y}; };
    //Add a 2d vector with another one and return the resulting vector
server_networking.prototype.v_add = function(a,b) { return { x:(a.x+b.x).fixed(), y:(a.y+b.y).fixed() }; };

/* 
*  ==============================================
* 
*   UPDATE LOOP CODE
*
*  ============================================== 
*/

server_networking.prototype.update = function() {

    //Update the state of our local clock to match the timer
    this.server_time = this.local_time;

    //Make a snapshot of the current state, for updating the clients
    this.last_state = {
        pos: this.players.map(function(value){
            return value.pos;
        })                                          // player positions
        input: this.players.map(function(value){
            return value.last_input_seq;
        })                                        //'player input sequence', the last input we processed for the players
        t: this.server_time                      // our current local time on the server
    };


    // Send snapshots to players
    for(var _i=0, _l=this.players.length; _i<_l; _i++ )
    {
        this.players[_i].instance.emit( 'onserverupdate', this.last_state );
    }
}

/* 
*  ==============================================
* 
*   PHYSICS LOOP CODE
*
*  ============================================== 
*/
server_networking.prototype.update_physics = function() {
    // Handle player
    // Process player input
    // for each input in buffer
    //  LERP together
    //  get new direction
    // add to player's current vector to get new direction
    // clear input buffer

    //Handle players
    for(var _i=0, _l=this.players.length; _i<_l; _i++ )
    {
        this.players[_i].old_state.pos = this.pos( this.players[_i].pos );

        var new_dir = this.process_input(this.players[_i]);

        this.players[_i].pos = this.v_add( this.players[_i].old_state.pos, new_dir );

        this.players[_i].inputs = [];
    }
}

server_networking.prototype.process_input = function( player ) {

    //It's possible to have recieved multiple inputs by now,
    //so we process each one
    var x_dir = 0;
    var y_dir = 0;

    var l = player.inputs.length

    for(var _i = 0; _i < l; _i++) {
        //don't process ones we already have simulated locally
        if(player.inputs[_i].seq <= player.last_input_seq) continue;

        var input = player.inputs[_i].inputs;

        for(var _j = 0, _c = input.length; _j < _c; _j++) {
            var key = input[_j];

            if(key == 'l') {
                x_dir -= 1;
            }
            else if(key == 'r') {
                x_dir += 1;
            }
            else if(key == 'd') {
                y_dir += 1;
            }
            else if(key == 'u') {
                y_dir -= 1;
            }
        }
    }

    //we have a direction vector now, so apply the same physics as the client
    var resulting_vector = this.physics_movement_vector_from_direction(x_dir,y_dir);
    if(player.inputs.length) {

        //we can now clear the array since these have been processed
        player.last_input_time = player.inputs[l-1].time;
        player.last_input_seq = player.inputs[l-1].seq;
    }

    //give it back
    return resulting_vector;

};

server_networking.prototype.physics_movement_vector_from_direction = function(x,y) {
    //Must be fixed step, at physics sync speed.
    var speed = this.playerspeed * 0.015;

    return {
        x : (x * speed).fixed(3),
        y : (y * speed).fixed(3)
    };
};

/* 
*  ==============================================
* 
*   SERVER MESSAGE HANDLER CODE
*
*  ============================================== 
*/

server_networking.prototype.handle_server_input = function(client, input, input_time, input_seq) {

    var player_client = null;

    //TODO: Remove loop - either pass in index or use userid as a key
    for(var _i = 0, _l=this.players.length; _i<_l; _i++)
    {
        if(client.userid == this.players[_i].instance.userid)
        {
            player_client = this.players[_i];
            break;
        }
    }

    //Store the input on the player instance for processing in the physics loop
   player_client.inputs.push({inputs:input, time:input_time, seq:input_seq});

};