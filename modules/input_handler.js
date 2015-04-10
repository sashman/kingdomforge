function InputHandler(id, socket) {
	this.id = id;
	this.socket = socket;
	Crafty.e("DOM").bind('KeyDown', this.handleKeyDown.bind(this));
}

var p = InputHandler.prototype;

p.handleKeyDown = function(e) {
	this.socket.emit('key_down', {id: this.id, key: e.key});
};


exports = InputHandler;