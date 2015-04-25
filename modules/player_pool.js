var Collection = require('./collection');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var PlayerPool = function(ioRouter) {
	this.players = new Collection();
	ioRouter.on('key_down', this.handleKeyDown.bind(this));
	ioRouter.on('newplayer', this.handleNewPlayer.bind(this));
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
	this.emit('key_down', data);
};

p.handleNewPlayer = function(data) {
	console.log("newplayer");
	console.log(data);
	console.log(this);
	this.players.add(data);
	this.emit('new___player', data);
};

module.exports = PlayerPool;