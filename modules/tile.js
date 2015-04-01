var Tile = function(spriteUrl, x, y) {
    this.spriteUrl = spriteUrl;
    this.x = x;
    this.y = y;
    Crafty.sprite(spriteUrl, {
        grassTile: [2, 36, 128, 128],
    });

    this.craftyEntity = Crafty.e("2D, Canvas, grassTile")
            .attr({
                x: this.x,
                y: this.y
            });

};

var p = Tile.prototype;

p.setX = function(x) {
    this.x = x;
    this.craftyEntity.x = x;
};

p.setY = function(y) {
    this.y = y;
    this.craftyEntity.y = y;
};

p.setPosition = function(x, y) {
    this.setX(x);
    this.setY(y);
};

exports = Tile;