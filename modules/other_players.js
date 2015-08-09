function OtherPlayers(socket, playerData) {
    this.socket = socket;

    /*for (var i = playerData.players.length - 1; i >= 0; i--) {
        players.addPlayer(new Character(playerData.players[i].id,
                document.URL + 'images/link.gif',
                playerData.players[i].x,
                playerData.players[i].y));
    }*/

    this.players = new Collection();
    this.socket.on('new__player', this.handleNewPlayer.bind(this));
   // this.socket.on('playermoved', this.handlePlayerMoved.bind(this));
}

var p = OtherPlayers.prototype;

p.setLocalPlayerId = function(localPlayerId) {
    this.localPlayerId = localPlayerId;
};

p.handleNewPlayer = function(data) {
    console.log("handleNewPlayer");
    this.players.add(new Character(data.id, document.URL + 'images/link.gif', data.x, data.y));
};

p.handlePlayerMoved = function(data) {
    console.log("handlePlayerMoved");
    debugger;
    this.players.getItem(data.id).setPosition(data.x, data.y);
};

exports = OtherPlayers;