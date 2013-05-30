Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  32 *3,
		height: 32 *3,
		tile: {
			width:  32,
			height: 32
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


//player position
//hardcoded initial position



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
		this.player = new Player();
		this.player.submap.x = 3;
		this.player.submap.y = 3;
		this.bind("Change", this.updatePlayerChanged);
		this.bind("Moved", this.updatePlayerMoved);
	},

	updatePlayerMoved: function(pos)
	{
		var vpx = this._x - (Crafty.viewport.width/2),
			vpy = this._y - (Crafty.viewport.height/2);

		if(vpx > 0 && vpx < (Game.width() - Crafty.viewport.width) ){
			Crafty.viewport.x= -vpx;
		}
		if(vpy > 0 && vpy < (Game.height()- Crafty.viewport.height) ){
			Crafty.viewport.y= -vpy;
		}

	},

	updatePlayerChanged: function(pos)
	{
		if(typeof pos === "undefined") return;
		pos.x = pos._x;
		pos.y = pos._y;
		
		this.player.submap_pos.x = pos.x;
		this.player.submap_pos.y = pos.y;
		this.player.global_pos = this.player.submap_to_global(this.player.submap, this.player.submap_pos);

		//TODO change the tiles in the submap buffer, and smoothly slide the sprites
		//if the submap changes, load the newly needed ones and unload the old

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

	



	Crafty.viewport.init(16*Game.map_grid.tile.width, 16*Game.map_grid.tile.height);

	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}


	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter').at(10, 20);
	Crafty.viewport.centerOn(this.player, 60);
	this.occupied[this.player.at().x][this.player.at().y] = true;
	this.player.z = 2;

	//load surrounding maps
	var pp = this.player.player.submap;
	

	//get map terrain for current submap
	
	var start = new Date().getTime();
	this.player.player.set_view_map(Game.map_grid.map);
	this.view_map = this.player.player.view_map;
	

	/*TODO

	Instead of loading just current submap, work out what tiles are needed for a submap buffer
	*/

	//console.log(this.view_map.length);
	//=========================================================
	// RENDER TERRAIN
	//=========================================================
	//for (var x = 0; x < Game.map_grid.width; x++) {
	//	for (var y = 0; y < Game.map_grid.height; y++) {
	//		var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
	//for (var y = 0; y < this.view_map.length; y++) {
	//	for (var x = 0; x < this.view_map[0].length; x++) {


	//render background terrain
	for (var i = 0; i < this.view_map["background"].length; i++) {

			var tile_object = this.view_map["background"][i];
			
			//console.log(tile_object);

			//var tile  = "CLIFF_WE_SN";
			var tile = tile_object["type"];
			var tile_ent = Crafty.e("Actor", "spr_"+tile);
			tile_ent.at(tile_object["x"] - this.view_map["xoffset"], tile_object["y"] - this.view_map["yoffset"]);
			tile_ent.z = 0;
			//debug
			// Crafty.e('2D, DOM, Text')
			// .attr({ x: x*Game.map_grid.tile.width, y: y*Game.map_grid.tile.height })
			// .text(x + "," + y);
	}

	//render background terrain
	for (var i = 0; i < this.view_map["detail"].length; i++) {
		var tile_object = this.view_map["detail"][i];

		//console.log(tile_object);

		var tile = tile_object["type"];
		var tile_ent = Crafty.e("Actor", "Solid", "spr_"+tile);
		tile_ent.at(tile_object["x"] - this.view_map["xoffset"], tile_object["y"] - this.view_map["yoffset"]);
		//Crafty(tile).attr({ x: + tile_object["xoffset"]
		tile_ent.shift(tile_object["xoffset"], tile_object["yoffset"]);
		tile_ent.z = 1;
	}

	var end = new Date().getTime();
	var time = end - start;
	console.log(this.view_map["background"].length + " + " + this.view_map["detail"].length + " map tiles loaded in " + time + "ms");
	
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


//temp network module
var game = {};


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
		//new
		//['http://localhost:4004/img/terrain/terrain.png',
		//old
		['https://dl.dropboxusercontent.com/u/939544/assets/img/terrain/grass_with_cliffs.png',
		'https://dl.dropboxusercontent.com/u/939544/assets/img/character/link.gif'
		], function(){
		// Once the images are loaded...

		//get sprite sheet metadata
		var spritesheet_json = $.ajax({
			url: "/img/terrain/terrain.json",
			data: "",
			async: false
			}).responseText;
		var spritesheet_json = JSON && JSON.parse(spritesheet_json) || $.parseJSON(spritesheet_json);

		//use spritesheet_json to get sprite coordinate and size
		
		var spr_map = {}
		var frames = spritesheet_json.frames;

		for (var i in frames) {
			//create new sprite entity with filename - extension and + "spr_" at the start
			var spr = "spr_"+i.slice(0,-4);
			spr_map[spr] = [];
			spr_map[spr][0] = frames[i]["frame"]["x"];
			spr_map[spr][1] = frames[i]["frame"]["y"];
			spr_map[spr][2] = frames[i]["frame"]["w"];
			spr_map[spr][3] = frames[i]["frame"]["h"];
		}
		Crafty.sprite('http://localhost:4004/img/terrain/terrain.png', spr_map);


		// Define the individual sprites in the image
		// Each one (spr_tree, etc.) becomes a component
		// These components' names are prefixed with "spr_"
		//  to remind us that they simply cause the entity
		//  to be drawn with a certain sprite
		
		//old sprite sheet
		/*
		Crafty.sprite(25, 25, 'https://dl.dropboxusercontent.com/u/939544/assets/img/terrain/grass_with_cliffs.png', {
			spr_cliff_NE_NS:    [0,0],
			spr_cliff_NE_SN:    [1,0],
			spr_cliff_NW_NS:    [2,0],
			spr_cliff_SE_NS:    [3,0],
			spr_cliff_NS_EW:    [0,1],
			spr_cliff_NS_WE:    [1,1],
			spr_cliff_NW_SN:    [2,1],
			spr_cliff_SE_SN:    [3,1],
			spr_cliff_SW_NS:    [0,2],
			spr_cliff_WE_NS:    [1,2],
			spr_cliff_WE_SN:    [2,2],
			spr_grass0:         [3,2],
			spr_cliff_SW_SN:    [0,3],
			spr_grass1:         [1,3],
			spr_grass2:         [2,3],
			spr_grass3:         [3,3]
		});
		*/
		

		
		Crafty.sprite(24,32,'https://dl.dropboxusercontent.com/u/939544/assets/img/character/link.gif', {
			spr_player:  [0, 0],
		});
		

		//load initial map
		Game.map_grid.map = new Map();

		/*
		Initiate network code here
		*/
		game = new game_core();

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