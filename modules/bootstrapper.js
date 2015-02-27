var BootStrapper = function() {
};

var p = BootStrapper.prototype;

p.bootStrap = function() {
	Crafty.init(640, 480);
	Crafty.canvas.init();
};

exports = BootStrapper;