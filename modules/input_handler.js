function InputHandler(id, socket) {
    this.id = id;
    this.socket = socket;
    Crafty.e("DOM").bind('KeyDown', this.handleKeyDown.bind(this));
}

var p = InputHandler.prototype;

p.handleKeyDown = function(e) {
    debugger;
    if (e.key == Crafty.keys.LEFT_ARROW) {
        this.handleLeftPressed(e);
    } else if (e.key == Crafty.keys.RIGHT_ARROW) {
        this.handleRightPressed(e);
    } else if (e.key == Crafty.keys.UP_ARROW) {
        this.handleUpPressed(e);
    } else if (e.key == Crafty.keys.DOWN_ARROW) {
        this.handleDownPressed(e);
    }
};

p.handleLeftPressed = function(e) {
    this.socket.emit('left', this.id);
};

p.handleRightPressed = function(e) {
    this.socket.emit('right', this.id);
};

p.handleUpPressed = function(e) {
    this.socket.emit('up', this.id);
};

p.handleDownPressed = function(e) {
    this.socket.emit('down', this.id);
};


exports = InputHandler;