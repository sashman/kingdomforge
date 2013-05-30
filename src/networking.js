var networking = function(){
	
	this.state = "";



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
	console.log("net message");
}


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

