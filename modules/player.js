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
	t.craftyElement.addComponent("2D, Canvas, Color, playerSprite, SpriteAnimation")
		.reel('walk_up', 500, 0, 1, 7)
		.reel('walk_right', 500, 8, 0, 7)
		.reel('walk_down', 500, 8, 1, 7)
		.reel('walk_left', 500, 0, 0, 7)


	// Watch for a change of direction and switch animations accordingly
	t.craftyElement.bind('NewDirection', function(data) {

		if (data.x > 0) {
			t.craftyElement.animate('walk_right', -1);
		} else if (data.x < 0) {
			t.craftyElement.animate('walk_left', -1);
		} else if (data.y > 0) {
			t.craftyElement.animate('walk_down', -1);
		} else if (data.y < 0) {
			t.craftyElement.animate('walk_up', -1);
		}

		if (data.x == 0 && data.y == 0) t.craftyElement.pauseAnimation();
	});

	t.craftyElement /*.color(t.r, t.g, t.b)*/ .attr({
		w: 50,
		h: 50,
		x: t.x,
		y: t.y,
		z: 2
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
	var t = this;
	t.socket = socket;

	socket.on('pong', function(data) {
		
		var server_time = data['server_time'];
		var ping_time = data['ping_time'];
		var pong_time = (new Date).getTime() - server_time;
		var total_time = ping_time + pong_time;

		console.log('ping', total_time, 'ms');
	});

	setInterval(function() {
		t.socket.emit('ping', (new Date).getTime());
	}, 1000);
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

exports = Player;