var OtherPlayers = function(socket, playerData) {
	var t = this;
	t.socket = socket;

	var players = new PlayerCollection();
	for (var i = playerData.players.length - 1; i >= 0; i--) {
		players.addPlayer(new Player(false, playerData.players[i].id,
			document.URL + 'images/link.gif',
			playerData.players[i].x,
			playerData.players[i].y));
	};

	t.players = players;

	t.socket.on('newplayer', function(data) {
		t.handleNewPlayer(data);
	});

	t.socket.on('playermoved', function(data) {
		t.handlePlayerMoved(data);
	});
};

var p = OtherPlayers.prototype;

p.setLocalPlayerId = function(localPlayerId) {
	this.localPlayerId = localPlayerId;
};

p.handleNewPlayer = function(data) {
	if (data.id == this.localPlayerId) {
		return;
	}
	this.players.addPlayer(new Player(false, data.id, document.URL + 'images/link.gif', data.x, data.y));
};

p.handlePlayerMoved = function(data) {
	if (data.id == this.localPlayerId) {
		return;
	}
	this.players.getPlayer(data.id).setPosition(data.x, data.y);
};

exports = OtherPlayers;