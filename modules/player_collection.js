var PlayerCollection = function() {
	this.players = [];
};

var p = PlayerCollection.prototype;

p.addPlayer = function(player) {
	this.players[player.id] = player;
};

p.removePlayer = function(playerid) {
	this.players = this.players.splice(playerid, 1);
};

p.getPlayer = function(playerid) {
	return this.players[playerid];
};

p.allPlayers = function() {
	return this.players;
};

p.playerCount = function() {
	console.log("num players: " + this.players.length);
	return this.players.length;
};

module.exports = PlayerCollection;