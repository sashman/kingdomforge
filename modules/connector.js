var Connector = function(io) {
	this.io = io;
};

var p = Connector.prototype;

p.requestNewConnection = function() {
	return this.io.connect('http://' + location.host );
};

exports = Connector;