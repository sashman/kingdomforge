Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:  32 * 3,
		height: 32 * 3,
		tile: {
			width:  32,
			height: 32
		},
		map: {},
		map_entities: []
	},

	terrain_bin: {},

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
	},


	render_terrain_entities: function(view_map)
	{

		// console.log("VM origin ", view_map["xorigin"], view_map["yorigin"]);


		for (var i = 0; i < view_map.submaps.length; i++) {
			for (var j = 0; j < view_map.submaps[i].length; j++) {
				
				if(!view_map.submaps[i][j]) continue;

				this.render_submap(view_map, view_map.submaps[i][j]);

			}
		}
	},

	render_submap : function(view_map, _submap)
	{

		var submap_x = _submap.x;
		var submap_y = _submap.y;
		var north_trigger, south_trigger, east_trigger, west_trigger = undefined;
		var submap = _submap.content;

		var start = new Date().getTime();
		for (var k = 0; k < submap["background"].length; k++) {

			var tile_object = submap["background"][k];
			var tile = tile_object["type"];
			var x = tile_object["x"] - view_map["xoffset"];
			var y = tile_object["y"] - view_map["yoffset"];
			
			
			var tile_ent = this.unbin_entity(tile);
			if(!tile_ent) tile_ent = Crafty.e("Actor", "Solid", "spr_"+tile);

			tile_ent.at(x, y);
			tile_ent.z = 0;
			tile_ent.keep = true;
			tile_object.ent = tile_ent;
			
			//tile_object.label = Crafty.e("2D, DOM, Text, Actor").at(x,y).text(submap_x + "," + submap_y);

			//set boundary triggers
			if(north_trigger === undefined || north_trigger > tile_ent.y) north_trigger = tile_ent.y;
			if(south_trigger === undefined || south_trigger < tile_ent.y+tile_ent.h) south_trigger = tile_ent.y + tile_ent.h;
			if(east_trigger === undefined || east_trigger < tile_ent.x + tile_ent.w) east_trigger = tile_ent.x + tile_ent.w;
			if(west_trigger === undefined || west_trigger > tile_ent.x) west_trigger = tile_ent.x;
	
		}
		

		_submap.north_trigger = north_trigger;
		_submap.south_trigger = south_trigger;
		_submap.east_trigger = east_trigger;
		_submap.west_trigger = west_trigger;
		
		//render detail terrain
		for (var k = 0; k < submap["detail"].length; k++) {

			var tile_object = submap["detail"][k];
			var tile = tile_object["type"];
			var x = tile_object["x"] - view_map["xoffset"];
			var y = tile_object["y"] - view_map["yoffset"];

			
			var tile_ent = this.unbin_entity(tile);
			if(!tile_ent) tile_ent = Crafty.e("Actor", "Solid", "spr_"+tile);
			tile_ent.at(x, y);
			tile_ent.shift(tile_object["xoffset"], tile_object["yoffset"]);
			tile_ent.z = 1;
			tile_ent.keep = true;
			tile_object.ent = tile_ent;

		}

		var time = new Date().getTime() - start;
		console.log("all created" , time , "ms");
		
	},

	bin_entity : function(entity, type){

		entity.visible = false;
		entity.at(-10000, -10000);

		if(!this.terrain_bin[type]) this.terrain_bin[type] = { entities: [] };
		this.terrain_bin[type].entities.push(entity);

	},

	unbin_entity : function(type){

		if(!this.terrain_bin[type]) return undefined;
		if(this.terrain_bin[type].entities.length == 0) return undefined;

		var entity = this.terrain_bin[type].entities.pop();
		entity.visible = true;
		
		return entity;
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
			//TODO put back in
			//.stopOnSolids()
			.onHit('Village', this.visitVillage)

			.animate('PlayerMovingUp',    0, 1, 7)
			.animate('PlayerMovingRight', 8, 0, 15)
			.animate('PlayerMovingDown',  8, 1, 15)
			.animate('PlayerMovingLeft',  0, 0, 7);

		// Watch for a change of direction and switch animations accordingly
		var animation_speed = 4;
		/*
		this.bind('NewDirection', function(data) {
			console.log(this);
			this.stop();
			if (data.x > 0) {
				this.animate('PlayerMovingRight', animation_speed, -1);
			} else if (data.x < 0) {
				this.animate('PlayerMovingLeft', animation_speed, -1);
			} else if (data.y > 0) {
				this.animate('PlayerMovingDown', animation_speed, -1);
			} else if (data.y < 0) {
				this.animate('PlayerMovingUp', animation_speed, -1);
			}
		});
		*/
		this.player = new Player(Game);
		this.player.submap.x = 10;
		this.player.submap.y = 10;
		this.bind("Change", this.updatePlayerChanged);
		this.bind("Moved", this.updatePlayerMoved);
		this.bind("KeyDown", this.updatePlayerKeyDown);
	},

	print_coords: function()
	{

		console.log(
			"sp", this.player.submap_pos.x , this.player.submap_pos.y,
			"s",  this.player.submap.x, this.player.submap.y,
			"gp", this.player.global_pos.x , this.player.global_pos.y,
			"ps", this.x , this.y
			);
	},

	updatePlayerMoved: function(pos)
	{
		//console.log(pos);
		var vpx = this._x - (Crafty.viewport.width/2),
			vpy = this._y - (Crafty.viewport.height/2);

		//if(vpx > 0 && vpx < (Game.width() - Crafty.viewport.width) )
			Crafty.viewport.x= -vpx;
		
		//if(vpy > 0 && vpy < (Game.height()- Crafty.viewport.height) )
			Crafty.viewport.y= -vpy;
		

		var pix_per_submap = this.player.submap_size * 32;


		var origin_submap = this.player.view_map.submaps[this.player.view_map_radius][this.player.view_map_radius];
		// console.log("north trigger", "ps y", origin_submap.north_trigger);
		this.player.submap.x = origin_submap.x;//Math.floor(pos.x/ pix_per_submap) + x_submap_offset;
		this.player.submap.y = origin_submap.y;//Math.floor(pos.y/ pix_per_submap) + y_submap_offset;

		//var x_submap_offset = this.player.view_map["xorigin"] - this.player.view_map_radius;
		//var y_submap_offset = this.player.view_map["yorigin"] - this.player.view_map_radius;

		this.player.submap_pos.x = pos.x % pix_per_submap;
		this.player.submap_pos.y = pos.y % pix_per_submap;
		this.player.global_pos = this.player.submap_to_global(this.player.submap, this.player.submap_pos);

		//TODO chnage the if to trigger when player is on the boundary of the view map
		// see view_map_radius in player class

		// this.print_coords();

		var change = false;

		var original_x = this.x;
		var original_y = this.y;
		//MOVED NORTH
		//if(this.player.submap_pos.x < 0){
		// if(this.player.submap.y < this.player.view_map["yorigin"]){
		if(pos.y <= origin_submap.north_trigger){

			console.log("=========Triggered North===============");
			this.print_coords();
			var start = new Date().getTime();

			this.player.shift_view_map(Game.map_grid.map, 0);

			var end = new Date().getTime();
			var time = end - start;

			console.log("=================================");
			console.log("map realoded total" , time , "ms");
			/*
			var total_bin = 0;
			for (var i in Game.terrain_bin) {
				total_bin += Game.terrain_bin[i].entities.length;
			};
			console.log(total_bin, "in bin")
			*/
			//move player
			//this.at(33,63);
			// this.shift(0, 32*32);



		//MOVED SOUTH
		} else if(this.player.submap.y > this.player.view_map["yorigin"]){

			this.player.shift_view_map(Game.map_grid.map, 2);
			
		}
		var start = new Date().getTime();


		if(change)
		{

			//pix_per_submap + this.player.submap_pos.x;
			//this.y = 33;//pix_per_submap + this.player.submap_pos.y;
			Crafty.viewport.centerOn(this.player, 0);
			console.log( " -> moved to " );
			this.print_coords();
			console.log("y origin", this.player.view_map["yorigin"]);

		}
		/*
		if(this.player.submap.x != this.player.view_map["xorigin"] || this.player.submap.y != this.player.view_map["yorigin"]){

			//console.log("***new view map origin " + this.player.submap.x + "," + this.player.submap.y);
			var start = new Date().getTime();
			this.player.fill_buffer_view_map(Game.map_grid.map, this.player.submap.x, this.player.submap.y);
			this.player.switch_view_maps();
			this.view_map = this.player.view_map;
			console.log("set new origin " + this.player.view_map["xorigin"] + "," + this.player.view_map["yorigin"]);

			// UPDATE TERRAIN ENTITIES
			Game.render_terrain_entities(this.view_map);

			var end = new Date().getTime();
			var time = end - start;
			console.log(this.view_map["background"].length + " + " + this.view_map["detail"].length + " map tiles loaded in " + time + "ms");

			this.x = pix_per_submap + this.player.submap_pos.x;
			this.y = pix_per_submap + this.player.submap_pos.y;
			Crafty.viewport.centerOn(this.player, 0);

			//console.log(this);
			console.log( " -> moved to " );
			this.print_coords();
		}
		*/

		var end = new Date().getTime();
		var time = end - start;
		if(time > 0)
			console.log("rest of event" , time , "ms");
	},

	updatePlayerChanged: function(pos)
	{
		
	},

	//store key presses
	updatePlayerKeyDown: function(e)
	{
		/*
		//TODO link to players input buffer
		Taking out just now
		if(e.key == Crafty.keys['LEFT_ARROW']) {

	 	   this.key_inputs.push("l");

	    } else if (e.key == Crafty.keys['RIGHT_ARROW']) {

	    	this.key_inputs.push("r");

	    } else if (e.key == Crafty.keys['UP_ARROW']) {

	    	this.key_inputs.push("u");

	    } else if (e.key == Crafty.keys['DOWN_ARROW']) {

	    	this.key_inputs.push("d");
	    }
	    */
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

});




// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {

	var vp_tile_size = 16;
	Crafty.viewport.init(vp_tile_size*Game.map_grid.tile.width, vp_tile_size*Game.map_grid.tile.height);

	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}


	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('PlayerCharacter')
	this.player.at(33, 33);
	Crafty.viewport.centerOn(this.player, 1);
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

	
	//=========================================================
	// RENDER TERRAIN FOR THE FIRST TIME
	//=========================================================
	Game.render_terrain_entities(this.view_map);
	//=========================================================


	var end = new Date().getTime();
	var time = end - start;
	//console.log(this.view_map["background"].length + " + " + this.view_map["detail"].length + " map tiles loaded in " + time + "ms");
	console.log("map tiles loaded in " + time + "ms");
	
	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});
	
}, function() {

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
var net_game = {};


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
		['http://localhost:4004/img/terrain/terrain.png',
		'http://localhost:4004/img/character/link.gif'
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
		

		
		Crafty.sprite(24,32,'http://localhost:4004/img/character/link.gif', {
			spr_player:  [0, 0],
		});
		

		//load initial map
		Game.map_grid.map = new Map();

		/*
		Initiate network code here
		*/
		//net_game = new networking();
		//net_game.connect_to_server();

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
