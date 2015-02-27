var Player = function(isMe, id, r, g, b, x, y) {
	var t = this;
	t.id = id;
	t.r = r == undefined ? Crafty.math.randomInt(0, 255) : r;
	t.g = g == undefined ? Crafty.math.randomInt(0, 255) : g;
	t.b = b == undefined ? Crafty.math.randomInt(0, 255) : b;
	t.x = x == undefined ? Crafty.math.randomInt(0, 255) : x;
	t.y = y == undefined ? Crafty.math.randomInt(0, 255) : y;
	t.craftyElement = Crafty.e();
	t.craftyElement.addComponent("2D, Canvas, Color");
	t.craftyElement.color(t.r, t.g, t.b).attr({ w:50, h:50, x:t.x, y:t.y });
	if (isMe) {
		t.socket = null;
		t.craftyElement.bind("Move", function() {
			t.handleMove();
		});
		t.craftyElement.addComponent("Multiway").multiway( 3, { W: -90, S: 90, D: 0, A: 180 } );
	}
};

var p = Player.prototype;

p.getPlayerInfo = function() {
	return { id: this.id, r: this.r, g: this.g, b: this.b, x: this.craftyElement.x, y: this.craftyElement.y};
};

p.setSocket = function(socket) {
	this.socket = socket;
};

p.setPosition = function( x, y ) {
	this.craftyElement.x = x;
	this.craftyElement.y = y;
};

p.getMovedInfo = function( oldx, oldy ) {
	return { id: this.id, oldx: oldx, oldy: oldy, x: this.x, y: this.y }
};

p.handleMove = function( oldx, oldy ) {
	this.socket.emit("playermoved", this.getPlayerInfo());
};

module.exports = Player;