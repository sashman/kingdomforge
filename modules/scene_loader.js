var SceneLoader = function() {

	this.crafty_width = 640;
	this.crafty_height = 480;
};

var p = SceneLoader.prototype;

p.initScene = function() {
	Crafty.init(this.crafty_width, this.crafty_height);
	Crafty.canvas.init();
};

exports = SceneLoader;