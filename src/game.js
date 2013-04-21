Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  32,
		height: 32,
		tile: {
			width:  24,
			height: 24
		},
		map: {}
	},

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},

	// The total height of the game screen. Since our grid takes up the entire screen
	//  this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},

	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(87, 109, 20)');

		// Simply start the "Loading" scene to get things going
		Crafty.scene('Loading');
	}
}

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

// Grass actors
Crafty.c('GRASS0', {
	init: function() {
		this.requires('Actor, spr_grass0');
	},
});
Crafty.c('GRASS1', {
	init: function() {
		this.requires('Actor, spr_grass1');
	},
});
Crafty.c('GRASS2', {
	init: function() {
		this.requires('Actor, spr_grass2');
	},
});
Crafty.c('GRASS3', {
	init: function() {
		this.requires('Actor, spr_grass3');
	},
});

// Cliffs
Crafty.c('CLIFF_NE_NS', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NE_NS');
	},
});
Crafty.c('CLIFF_NE_SN', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NE_SN');
	},
});
Crafty.c('CLIFF_NW_NS', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NW_NS');
	},
});
Crafty.c('CLIFF_NE_NS', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NE_NS');
	},
});
Crafty.c('CLIFF_SE_NS', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_SE_NS');
	},
});
Crafty.c('CLIFF_NS_EW', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NS_EW');
	},
});
Crafty.c('CLIFF_NS_WE', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NS_WE');
	},
});
Crafty.c('CLIFF_NW_SN', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_NW_SN');
	},
});
Crafty.c('CLIFF_SE_SN', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_SE_SN');
	},
});
Crafty.c('CLIFF_SW_NS', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_SW_NS');
	},
});
Crafty.c('CLIFF_WE_NS', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_WE_NS');
	},
});
Crafty.c('CLIFF_WE_SN', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_WE_SN');
	},
});
Crafty.c('CLIFF_SW_SN', {
	init: function() {
		this.requires('Actor, Solid, spr_cliff_SW_SN');
	},
});

// A Tree is just an Actor with a certain color
/*
Crafty.c('Tree', {
	init: function() {
		this.requires('Actor, Solid, spr_tree');
	},
});
*/

// A Bush is just an Actor with a certain color
/*
Crafty.c('Bush', {
	init: function() {
		this.requires('Actor, Solid, spr_bush');
	},
});
*/

//player position
var pp = {x:2,y:2}

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
	init: function() {
		this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
			//speed given here
			.fourway(2)
			.stopOnSolids()
			.onHit('Village', this.visitVillage)
			// These next lines define our four animations
			//  each call to .animate specifies:
			//  - the name of the animation
			//  - the x and y coordinates within the sprite
			//     map at which the animation set begins
			//  - the number of animation frames *in addition to* the first one
			.animate('PlayerMovingUp',    0, 1, 7)
			.animate('PlayerMovingRight', 8, 0, 15)
			.animate('PlayerMovingDown',  8, 1, 15)
			.animate('PlayerMovingLeft',  0, 0, 7);

		// Watch for a change of direction and switch animations accordingly
		var animation_speed = 4;
		this.bind('NewDirection', function(data) {
			if (data.x > 0) {
				this.animate('PlayerMovingRight', animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', animation_speed, -1);
			} else {
				this.stop();
			}
		});
	},

	// Registers a stop-movement function to be called when
	//  this entity hits an entity with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);

		return this;
	},

	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	// Respond to this player visiting a village
	/*
	visitVillage: function(data) {
		villlage = data[0].obj;
		villlage.visit();
	}
	*/
});

// A village is a tile on the grid that the PC must visit in order to win the game
/*
Crafty.c('Village', {
	init: function() {
		this.requires('Actor, spr_village');
	},

	// Process a visitation with this village
	visit: function() {
		this.destroy();
		Crafty.audio.play('knock');
		Crafty.trigger('VillageVisited', this);
	}
});
*/

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}

	//get map terrain
	var local_map = Game.map_grid.map.submaps[pp.x][pp.y];
	// Place a tree at every edge square on our grid of 16x16 tiles
	//=========================================================
	// GENERATE TERRAIN
	//=========================================================
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

			// Place grass everywhere, using a random sprite
			//var grass_type = Crafty.math.randomInt(0, 3);
			//Crafty.e('GRASS' + grass_type).at(x, y);

			//TODO: use loaded terrain here
			var tile = local_map["map"]["content"][y][x]["type"];
			Crafty.e(tile).at(x, y);

		}
	}

	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter').at(5, 5);
	this.occupied[this.player.at().x][this.player.at().y] = true;


	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});
	
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('VillageVisited', this.show_victory);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
	// Display some text in celebration of the victory
	Crafty.e('2D, DOM, Text')
		.attr({ x: 0, y: 0 })
		.text('Victory!');

	// Watch for the player to press a key, then restart the game
	//  when a key is pressed
	this.restart_game = this.bind('KeyDown', function() {
		Crafty.scene('Game');
	});
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
	// Load our sprite map image
	/* old assets
				['http://desolate-caverns-4829.herokuapp.com/assets/16x16_forest_1.gif',
				'http://desolate-caverns-4829.herokuapp.com/assets/hunter.png',
	  			'http://desolate-caverns-4829.herokuapp.com/assets/door_knock_3x.mp3',
	   			'http://desolate-caverns-4829.herokuapp.com/assets/door_knock_3x.ogg',
	    		'http://desolate-caverns-4829.herokuapp.com/assets/door_knock_3x.aac']
	*/


	Crafty.load(
		['https://dl.dropboxusercontent.com/u/939544/assets/img/terrain/grass_with_cliffs.png',
		'https://dl.dropboxusercontent.com/u/939544/assets/img/character/link.gif'
		], function(){
		// Once the images are loaded...

		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		
		Crafty.sprite(25, 25, 'https://dl.dropboxusercontent.com/u/939544/assets/img/terrain/grass_with_cliffs.png', {
			//need to double check
			spr_cliff_NE_NS:    [0, 0],
			spr_cliff_NE_SN:    [0, 1],
			spr_cliff_NW_NS:    [0, 2],
			spr_cliff_SE_NS:    [0, 3],
			spr_cliff_NS_EW:    [1, 0],
			spr_cliff_NS_WE:    [1, 1],
			spr_cliff_NW_SN:    [1, 2],
			spr_cliff_SE_SN:    [1, 3],
			spr_cliff_SW_NS:    [2, 0],
			spr_cliff_WE_NS:    [2, 1],
			spr_cliff_WE_SN:    [2, 2],
			spr_grass0:         [2, 3],
			spr_cliff_SW_SN:    [3, 0],
			spr_grass1:         [3, 1],
			spr_grass2:         [3, 2],
			spr_grass3:         [3, 3]
		});
		

		
		Crafty.sprite(24,32,'https://dl.dropboxusercontent.com/u/939544/assets/img/character/link.gif', {
			spr_player:  [0, 0],
		});
		

		//load initial maps statically
		Game.map_grid.map = new Map();

		//pp - player position

		for(var i = pp.x-1; i < pp.x+1; i++)
			for(var j = pp.y-1; j < pp.y+1; j++)
				Game.map_grid.map.load_submap(i,j);



		// Draw some text for the player to see in case the file
		//  takes a noticeable amount of time to load
		Crafty.e('2D, DOM, Text')
			.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
			.text('Loading...');

		// Now that our sprites are ready to draw, start the game
		Crafty.scene('Game');
	})
});

Game.start();