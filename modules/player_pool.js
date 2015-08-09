var Collection = require('./collection');
var Character = require('./character');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var PlayerPool = function(ioRouter, crafty) {
	this.players = new Collection();
	this.ioRouter = ioRouter;
	this.ioRouter.on('key_down', this.handleKeyDown.bind(this));
	this.ioRouter.on('newplayer', this.handleNewPlayer.bind(this));
	this.crafty = crafty;
};

var p = PlayerPool.prototype;

p.on = function(eventName, callback) {
	eventEmitter.on(eventName, callback);
};

p.emit = function(eventName, data) {
	eventEmitter.emit(eventName, data);
};

p.handleKeyDown = function(data) {
	console.log("key down");
	console.log(data);
	// this.emit('key_down', data);
	this.players.getItem(data.id).handleKeyDown(data);
};

p.handlePlayerMoved = function(data) {
	this.ioRouter.broadcast('player_moved', data);
	this.emit('player_moved', data);
};

p.handleNewPlayer = function(data) {
	console.log("newplayer");
	console.log(data);

	var character = new Character(data.id, './images/link.gif', data.x, data.y, this.crafty);
	character.on('character_moved', this.handlePlayerMoved.bind(this));

	this.players.add(character);
	//TODO: if anything else eneeds this, other players?
	this.ioRouter.broadcast('new__player', data);
};

module.exports = PlayerPool;