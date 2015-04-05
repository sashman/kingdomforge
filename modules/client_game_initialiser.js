function ClientGameInitialiser() {
    this.connector = new Connector(io);
    this.socket = this.connector.requestNewConnection();
    this.inputHandler = null;
    this.pinger = null;
    this.players = null;

    this.socket.on('connected', this.handleConnected.bind(this));
}

var p = ClientGameInitialiser.prototype;

p.initialiseClientGame = function() {
    var sceneLoader = new SceneLoader();
    sceneLoader.initScene();

    var terrainRequester = new TerrainRequester(this.socket);
    terrainRequester.requestMap();

    var terrain = new Terrain();
    terrain.createTiles();
};

p.handleConnected = function(data) {
    this.inputHandler = new InputHandler(data.id, this.socket);
    this.pinger = new Pinger(this.socket);
    this.pinger.startPing();
    var character = new Character(data.id, document.URL + 'images/link.gif');

    this.players = new OtherPlayers(this.socket, data);
    this.players.setLocalPlayerId(data.id);
    this.socket.emit('createdplayer', character.getPlayerInfo());
};

exports = ClientGameInitialiser;