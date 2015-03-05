var ClientGameInitialiser = function() {

	this.connector = new Connector(io);
	this.socket = this.connector.requestNewConnection();
	this.otherPlayers = null;
	this.player = null;
	this.players = [];

	var t = this;
	this.socket.on('connected', function(data) {
		t.handleConnected(data);
	});
};

var p = ClientGameInitialiser.prototype;

p.initialiseClientGame = function() {
	var sceneLoader = new SceneLoader();
	sceneLoader.initScene();

	var terrain = new Terrain();
	terrain.createTiles();

};

p.handleConnected = function(data) {

	player = new Player(true, data.id, document.URL + 'images/link.gif');
	player.setSocket(this.socket);

	this.otherPlayers = new OtherPlayers(this.socket, data);
	this.otherPlayers.setLocalPlayerId(data.id);
	this.socket.emit('createdplayer', player.getPlayerInfo());

}

exports = ClientGameInitialiser;