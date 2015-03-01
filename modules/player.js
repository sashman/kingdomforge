var Player = function(isMe, id, spriteSheetUrl, x, y) {
	var t = this;
	t.id = id;
	t.r = Crafty.math.randomInt(0, 255);
	t.g = Crafty.math.randomInt(0, 255);
	t.b = Crafty.math.randomInt(0, 255);
	t.x = x == undefined ? Crafty.math.randomInt(0, 255) : x;
	t.y = y == undefined ? Crafty.math.randomInt(0, 255) : y;

	//TODO: move to sprite class
	Crafty.sprite(24, 32, spriteSheetUrl, {
		playerSprite: [0, 0],
	});

	t.craftyElement = Crafty.e();
	t.craftyElement.addComponent("2D, Canvas, Color, playerSprite");
	t.craftyElement.color(t.r, t.g, t.b).attr({
		w: 50,
		h: 50,
		x: t.x,
		y: t.y
	});
	if (isMe) {
		t.socket = null;
		t.craftyElement.bind("Move", function() {
			t.handleMove();
		});
		t.craftyElement.addComponent("Multiway").multiway(3, {
			W: -90,
			S: 90,
			D: 0,
			A: 180
		});
	}
};

var p = Player.prototype;

p.getPlayerInfo = function() {
	return {
		id: this.id,
		r: this.r,
		g: this.g,
		b: this.b,
		x: this.craftyElement.x,
		y: this.craftyElement.y
	};
};

p.setSocket = function(socket) {
	this.socket = socket;
};

p.setPosition = function(x, y) {
	this.craftyElement.x = x;
	this.craftyElement.y = y;
};

p.getMovedInfo = function(oldx, oldy) {
	return {
		id: this.id,
		oldx: oldx,
		oldy: oldy,
		x: this.x,
		y: this.y
	}
};

p.handleMove = function(oldx, oldy) {
	this.socket.emit("playermoved", this.getPlayerInfo());
};

module.exports = Player;