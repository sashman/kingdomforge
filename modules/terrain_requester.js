var TerrainRequester = function(io) {
	this.io = io;

	this.io.on('mapresponse', this.handleMapResponse.bind(this));
};

var p = TerrainRequester.prototype;

p.requestMap = function() {
	this.io.emit('maprequest');
};

p.handleMapResponse = function(data) {
	console.log('got map repsonse');
	console.log(data);
};

exports = TerrainRequester;