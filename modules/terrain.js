var Terrain = function() {
    this.tiles = [];
};

var p = Terrain.prototype;

p.createTiles = function() {
    for (var i = 3; i >= 0; i--) {
        for (var j = 4; j >= 0; j--) {
            if (!this.tiles[i]) {
                this.tiles[i] = [];
            }

            this.tiles[i][j] = new Tile(document.URL + 'images/terrain.png', j * 128, i * 128);
        }
    }
};

exports = Terrain;