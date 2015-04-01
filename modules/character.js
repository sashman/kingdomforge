function Character(id, spriteSheetUrl, x, y) {
    this.id = id;
    this.x = x === undefined ? Crafty.math.randomInt(0, 255) : x;
    this.y = y === undefined ? Crafty.math.randomInt(0, 255) : y;

    //TODO: move to sprite class
    Crafty.sprite(24, 32, spriteSheetUrl, {
        playerSprite: [0, 0]
    });

    this.craftyElement = Crafty.e();
    this.craftyElement.addComponent("2D, Canvas, Color, playerSprite, SpriteAnimation")
            .reel('walk_up', 500, 0, 1, 7)
            .reel('walk_right', 500, 8, 0, 7)
            .reel('walk_down', 500, 8, 1, 7)
            .reel('walk_left', 500, 0, 0, 7);


    // Watch for a change of direction and switch animations accordingly
    this.craftyElement.bind('NewDirection', function(data) {

        if (data.x > 0) {
            this.craftyElement.animate('walk_right', -1);
        } else if (data.x < 0) {
            this.craftyElement.animate('walk_left', -1);
        } else if (data.y > 0) {
            this.craftyElement.animate('walk_down', -1);
        } else if (data.y < 0) {
            this.craftyElement.animate('walk_up', -1);
        }

        if (data.x == 0 && data.y == 0)
            this.craftyElement.pauseAnimation();
    });

    this.craftyElement.attr({
        w: 50,
        h: 50,
        x: this.x,
        y: this.y,
        z: 2
    });
    /*if (isMe) {
        this.socket = null;
        this.craftyElement.bind("Move", function() {
            this.handleMove();
        });
        this.craftyElement.addComponent("Multiway").multiway(3, {
            W: -90,
            S: 90,
            D: 0,
            A: 180
        });
    }*/
}

var p = Character.prototype;

p.move = function() {

};

p.getPlayerInfo = function() {
    return {
        id: this.id,
        x: this.craftyElement.x,
        y: this.craftyElement.y
    };
};

p.setPosition = function(x, y) {
    this.craftyElement.x = x;
    this.craftyElement.y = y;
};

exports = Character;