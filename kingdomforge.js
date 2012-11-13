
/*

Based on Kesiev's TLoS

*/

// Game-specific

var audioserver;
var maingame;
var netgame;
var noface; // Is a fake "actor" in dialogues. The text is ever in the same place.
var tilemaps={}, dialogues={}, credits={};

var map;
var frameCount = 0;
var player_x = 0;
var player_y = 0;
var player_last_dir = "";
  


  //map buffer used for loading maps
  var map_buffer = new Array();

// In games like Zelda, object are alive also outside of the screen.
// So, let's calculate a distance threshold from the camera
function objectIsAlive(th) {
	return AkihabaraTrigo.getDistance(th,AkihabaraGamebox.getCamera())<800;
}

function go() {
	netgame = new game_core();
	netgame.update( new Date().getTime() );

	
	AkihabaraGamebox.setGroups(['background','player','game']);
	// AkihabaraAudio.setAudioChannels({bgmusic:{volume:0.8},sfx:{volume:1.0}});

	// player, walls, bullets and foes are under z-index layer
	AkihabaraGamebox.setRenderOrder(["background",AkihabaraGamebox.ZINDEX_LAYER,'player','game']);

	maingame=AkihabaraGamecycle.createMaingame("game","game");

	// Title intro
	maingame.gameTitleIntroAnimation=function(reset) {
		  if (reset) {
		    AkihabaraToys.resetToy(this, 'rising');
		  }
		  AkihabaraGamebox.blitFade(AkihabaraGamebox.getBufferContext(),{ alpha: 1 });
		 
		  AkihabaraToys.logos.linear(this, 'rising', {
		    image: 'logo',
		    sx:    AkihabaraGamebox.getScreenW()/2-AkihabaraGamebox.getImage('logo').width/2,
		    sy:    AkihabaraGamebox.getScreenH(),
		    x:     AkihabaraGamebox.getScreenW()/2-AkihabaraGamebox.getImage('logo').width/2,
		    y:     20,
		    spceed: 1
		  });


		// if (reset) {
		// 	AkihabaraAudio.playAudio("default-music");
		// 	AkihabaraToys.resetToy(this,"rising");
		// } else {
		// 	AkihabaraGamebox.blitFade(AkihabaraGamebox.getBufferContext(),{alpha:1,color:"rgb(150,150,150)"});
		// 	AkihabaraToys.logos.rising(this,"rising",{image:"logo",x:AkihabaraGamebox.getScreenHW()-AkihabaraGamebox.getImage("logo").hwidth,y:20,speed:1,gapx:250,reflex:0.1,audioreach:"coin"});
		// }
	},

	// Disable the default difficulty-choice menu; we don't need it for our tutorial
	maingame.gameMenu = function() { return true; };

	// No level intro animation
	maingame.gameIntroAnimation=function() { return true; }

	// No end level animation
	maingame.endlevelIntroAnimation=function() { return true; }

	maingame.pressStartIntroAnimation=function(reset) {
	  if (reset) {
	    AkihabaraToys.resetToy(this,"default-blinker");
	  } else {
	    AkihabaraToys.text.blink(this,"default-blinker",AkihabaraGamebox.getBufferContext(),{font:"small",text:"PRESS Z TO START",valign:AkihabaraGamebox.ALIGN_MIDDLE,halign:AkihabaraGamebox.ALIGN_CENTER,dx:0,dy:Math.floor(AkihabaraGamebox.getScreenH()/3),dw:AkihabaraGamebox.getScreenW(),dh:Math.floor(AkihabaraGamebox.getScreenH()/3)*2,blinkspeed:10});
	    return AkihabaraInput.keyIsHit("a");
	    }
	};

	// Level animation
	// maingame.levelIntroAnimation=function(reset) {
	// 	if (reset) {
	// 		AkihabaraToys.resetToy(this,"default-blinker");
	// 	} else {
	// 		AkihabaraGamebox.blitFade(AkihabaraGamebox.getBufferContext(),{alpha:1});
	// 		return AkihabaraToys.text.fixed(this,"default-blinker",AkihabaraGamebox.getBufferContext(),{font:"big",text:maingame.getNextLevel().label,valign:AkihabaraGamebox.ALIGN_MIDDLE,halign:AkihabaraGamebox.ALIGN_CENTER,dx:0,dy:0,dw:AkihabaraGamebox.getScreenW(),dh:AkihabaraGamebox.getScreenH(),time:50});
	// 	}
	// }

	// Game is ever over, if the player dies the first time. No life check, since is energy-based.
	maingame.gameIsOver=function() { return true; }

	// Game ending
	// maingame.gameEndingIntroAnimation=function(reset){
	// 	if (reset) {
	// 		AkihabaraToys.resetToy(this,"intro-animation");
	// 	} else {
	// 		AkihabaraGamebox.blitFade(AkihabaraGamebox.getBufferContext(),{alpha:1});
	// 		return AkihabaraToys.dialogue.render(this,"intro-animation",credits.titles);
	// 	}
	// }

	// Game events are decided by the map.
	// maingame.gameEvents=function() {
	// 	tilemaps.map.mapActions();
	// }

	// Change level
	// maingame.changeLevel=function(level) {
	// 	// Cleanup the level
	// 	AkihabaraGamebox.trashGroup("playerbullets");
	// 	AkihabaraGamebox.trashGroup("foesbullets");
	// 	AkihabaraGamebox.trashGroup("foes");
	// 	AkihabaraGamebox.trashGroup("bonus");
	// 	AkihabaraGamebox.trashGroup("walls");
	// 	AkihabaraGamebox.purgeGarbage(); // Since we're starting, we can purge all now

	// 	if (level==null)
	// 		level={level:"begin",x:300,y:270,introdialogue:true}; // First stage

	// 	// Dialogues are emptied - will be loaded by bundles. Cache is not needed - each bundle
	// 	// Contains full dialogues for the floor.
	// 	dialogues={};

	// 	// Map data is wiped too. Will be loaded by loadBundle. Other data in tilemaps is
	// 	// kept (i.e. quest status etc)
	// 	delete tilemaps.map;

	// 	// Here the map is loaded. During the load time, the game is still.
	// 	AkihabaraGamebox.addBundle({
	// 		file:"resources/bundle-map-"+level.level+".js",
	// 		onLoad:function(){ // This "onload" operation is triggered after everything is loaded.
	// 			AkihabaraTile.finalizeTilemap(tilemaps.map); // Finalize the map into the bundle
	// 			AkihabaraGamebox.createCanvas("tileslayer",{w:tilemaps.map.w,h:tilemaps.map.h}); // Prepare map's canvas
	// 			AkihabaraGamebox.blitTilemap(AkihabaraGamebox.getCanvasContext("tileslayer"),tilemaps.map); // Render map on the canvas
	// 			AkihabaraTopview.spawn(AkihabaraGamebox.getObject("player","player"),{x:level.x,y:level.y}); // Displace player
	// 			tilemaps.map.addObjects(); // Initialize map
	// 			if (level.introdialogue) // Eventually starts intro dialogue.
	// 		maingame.startDialogue("intro"); // game introduction, if needed
	// 		}
	// 	});
	// }

	maingame.addMap = function () {
	  AkihabaraGamebox.addObject({
	    id:    'background_id', // This is the object ID
	    group: 'background',    // We use the 'backround' group we created above with our 'setGroups' call.
	 
		first: function() {
		      frameCount++;
		    },


	    // The blit function is what happens during the game's draw cycle. Everything related to rendering and drawing goes here.
	    blit: function() {
	      // First let's clear the whole screen. Blitfade draws a filled rectangle over the given context (in this case, the screen)
	      AkihabaraGamebox.blitFade(AkihabaraGamebox.getBufferContext(), { alpha: 1 });
	 
	      // Since we blitted the tilemap to 'map_canvas' back in our main function, we now dracw 'map_canvas' onto the screen. The 'map_canvas' is
	      // just a picture of our tilemap, and by blitting it here we're making sure that the picture re-draws every frame.
	      AkihabaraGamebox.blit(AkihabaraGamebox.getBufferContext(), AkihabaraGamebox.getCanvas('map_canvas'), { dx: 0, dy: 0, dw: AkihabaraGamebox.getCanvas('map_canvas').width, dh: AkihabaraGamebox.getCanvas('map_canvas').height, sourcecamera: true });
	    }
	  });

	// Our wrapper function for adding a player object -- this keeps our main game code nice and clean
	}

	maingame.addPlayer = function () {
	  // AkihabaraGamebox.addObject creates a new object in your game, with variables and functions. In this case we're creating the player.
	  AkihabaraGamebox.addObject({
	 
	    // id refers to the specific object, group is the group it's in for rendering purposes, tileset is where the graphics come from
	    id: 'player_id',
	    group: 'player',
	    tileset: 'player_tiles',

	    //colh:AkihabaraGamebox.getTiles('player_tiles').tileh,
	 
	    // the initialize function contains code that is run when the object is first created. In the case of the player object this only happens once, at the beginning of the game, or possibly after a player dies and respawns.
	    initialize: function() {
		      // Here we're just telling it to initialize the object, in this case our player.
		      AkihabaraTopview.initialize(this, {});
		     
		      // ** New code for Part 3 **
		      // And we set the starting position for our player.
		      this.x = 20;
		      this.y = 20;

			var anim_speed = 2;
			// Here we define the list of animations. We can name these whatever we want.
			  // These are referenced with this.animList[id].
			  // So for example, this.animList[rightDown].frames[1] would return 12.
			  this.animList = {
			    still:     { speed: 1, frames: [0]     },
			    right:     { speed: anim_speed, frames: [8,9,10,11,12,13,14,15] },
			    //rightDown: { speed: 3, frames: [2, 12] },
			    down:      { speed: anim_speed, frames: [24,25,26,27,28,29,30,31] },
			    //downLeft:  { speed: 3, frames: [4, 14] },
			    left:      { speed: anim_speed, frames: [0,1,2,3,4,5,6,7] },
			    //leftUp:    { speed: 3, frames: [6, 16] },
			    up:        { speed: anim_speed, frames: [16,17,18,19,20,21,22,23] },
			    //upRight:   { speed: 3, frames: [8, 18] }
			  };
			 
			  // Set the starting animation for the player object.
			  this.animIndex = 'still';

	    	},
	 
	    // the first function is like a step function. it runs every frame and does calculations. it's called first because it happens before the rendering, so we calculate new positions and actions and THEN render the object
	    first: function() {
	      // Toys.topview.controlKeys sets the main key controls. In this case we want to use the arrow keys which
		  //  are mapped to their english names. Inside this function it applies acceleration values to each of these directions
		  AkihabaraTopview.controlKeys(this, { left: 'left', right: 'right', up: 'up', down: 'down' });

		  //set speed
		  //AkihabaraTopview.setStaticSpeed(this, 2.5);

			// The if statements check for accelerations in the x and y directions and whether they are positive or negative. It then sets the animation index to the keyword corresponding to that direction.
		  if (this.velx == 0 && this.vely == 0) this.animIndex = 'still';
		  if (this.velx > 0 && this.vely == 0){
			this.animIndex = 'right';
			this.animList.still.frames = [8];
			}
		  
		  if (this.velx == 0 && this.vely > 0){
			this.animIndex = 'down';
			this.animList.still.frames = [24];
			}
		  
		  if (this.velx < 0 && this.vely == 0){
			this.animIndex = 'left';
			this.animList.still.frames = [0];
			}
		  
		  if (this.velx == 0 && this.vely < 0){
			this.animIndex = 'up';
			this.animList.still.frames = [16];
			}
		  
		 
		  // Set the animation.
		  if (frameCount%this.animList[this.animIndex].speed == 0)
		    this.frame = AkihabaraGamebox.decideFrame(frameCount, this.animList[this.animIndex]);
		 
		  // This adds some friction to our accelerations so we stop when we're not accelerating, otherwise our game would control like Asteroids
		  AkihabaraTopview.handleVelocity(this);
		 
		  // This tells the physics engine to apply those forces
		  AkihabaraTopview.applyForces(this);

		  AkihabaraTopview.tileCollision(this, map, 'map', null, { tolerance: 2, approximation: 3 });

		  checkBoundary(this);

	    },
	 
	    // the blit function is what happens during the game's draw cycle. everything related to rendering and drawing goes here
	    blit: function() {
	      // Clear the screen.
		  //gbox.blitFade(gbox.getBufferContext(),{});
		 
		  // Render the current sprite.. don't worry too much about what's going on here. We're pretty much doing
		  //  the default drawing function, sending along the tileset, the frame info, coordinates, whether the
		  //  spries is flipped, camera info, and the alpha transparency value
		  AkihabaraGamebox.blitTile(AkihabaraGamebox.getBufferContext(), {
		    tileset: this.tileset,
		    tile:    this.frame,
		    dx:      this.x,
		    dy:      this.y,
		    fliph:   this.fliph,
		    flipv:   this.flipv,
		    camera:  this.camera,
		    alpha:   1.0
		  });
	    },
	  }); // end gbox.addObject for player
		netgame.players.self.entity = AkihabaraGamebox.getObject("player", "player_id");
	}



	// Game initialization
	maingame.initializeGame=function() {
		// Prepare hud
		// maingame.hud.setWidget("weapon",{widget:"radio",value:0,tileset:"items",frames:[0],dx:10,dy:10});
		// maingame.hud.setWidget("health",{widget:"symbols",tiles:[3,2,1,0],minvalue:0,maxvalue:20,value:12-(maingame.difficulty*4),maxshown:4,tileset:"hud",emptytile:4,dx:40,dy:10,gapx:20,gapy:0});
		// maingame.hud.setWidget("cash",{widget:"label",font:"small",value:0,minvalue:0,maxvalue:100,dx:AkihabaraGamebox.getScreenW()-60,dy:AkihabaraGamebox.getScreenH()-24,prepad:3,padwith:" ",clear:true});
		// maingame.hud.setWidget("SMALLKEY",{widget:"label",font:"small",value:0,minvalue:0,maxvalue:999,dx:AkihabaraGamebox.getScreenW()-60,dy:AkihabaraGamebox.getScreenH()-43,prepad:3,padwith:" ",clear:true});
		// maingame.hud.setWidget("BOSSKEY",{widget:"bool",value:0,tileset:"hud",frame:5,dx:AkihabaraGamebox.getScreenW()-30,dy:AkihabaraGamebox.getScreenH()-66}); // This is shown if value is true or >0

		// maingame.hud.setWidget("lblkey",{widget:"blit",value:6,tileset:"hud",dx:AkihabaraGamebox.getScreenW()-30,dy:AkihabaraGamebox.getScreenH()-50});
		// maingame.hud.setWidget("lblcoin",{widget:"blit",value:7,tileset:"hud",dx:AkihabaraGamebox.getScreenW()-30,dy:AkihabaraGamebox.getScreenH()-30});

		// tilemaps={
		// 	_defaultblock:100, // The block that is over the borders (a wall)
		// 	queststatus:{} // Every step the player does, is marked here (opened doors, sections cleared etc)
		// };

		// AkihabaraGamebox.addObject({
		// 	id:"bg",
		// 	group:"background",
		// 	blit:function() {
		// 		AkihabaraGamebox.centerCamera(AkihabaraGamebox.getObject("player","player"),{w:tilemaps.map.w,h:tilemaps.map.h});
		// 		AkihabaraGamebox.blit(AkihabaraGamebox.getBufferContext(),AkihabaraGamebox.getCanvas("tileslayer"),{dx:0,dy:0,dw:AkihabaraGamebox.getScreenW(),dh:AkihabaraGamebox.getScreenH(),sourcecamera:true});
		// 	}
		// });

		// AkihabaraGamebox.addObject(new Player());

		
		this.addPlayer();
		this.addMap();
	};

	map = {
			tileset: 'map_pieces', // Specify that we're using the 'map_pieces' tiles that we created in the loadResources function
		 
		  // This loads an ASCII-definition of all the 'pieces' of the map as an array of integers specifying a type for each map tile
		  // Each 'type' corresponds to a sprite in our tileset. For example, if a map tile has type 0, then it uses the first sprite in the
		  //  map's tile set ('map_pieces', as defined above) and if a map tile has type 1, it uses the second sprite in the tile set, etc.
		  // Also note that null is an allowed type for a map tile, and uses no sprite from the tile set
			map: render_map(map_buffer[0][0]),
		 
		  // This function have to return true if the object 'obj' is checking if the tile 't' is a wall, so...
			tileIsSolid: function(obj, t) {
				var cur_map = map_buffer[player_x][player_y];
				for(k in cur_map.tiles){
					if(cur_map.tiles[k].nk==t){
						return (cur_map.tiles[k].pass);
					}
				}
				//return false;
				//return t != null; // Is a wall if is not an empty space
		  }
		};

		map = AkihabaraTile.finalizeTilemap(map);

		// Since finalizeMap has calculated the height and width, we can create a canvas that fits our map. Let's call it "map_canvas".

		AkihabaraGamebox.createCanvas('map_canvas', { w: map.w, h: map.h });
		 
		  // This function grabs the map from the "map" object and draws it onto our "map_canvas". So now the map is in the rendering pipeline.
		AkihabaraGamebox.blitTilemap(AkihabaraGamebox.getCanvasContext('map_canvas'), map);


	

	AkihabaraGamebox.go();
}

// BOOTSTRAP
AkihabaraGamebox.onLoad(function () {
	// This initializes Akihabara with the default settings.
	  // The title (which appears in the browser title bar) is the text we're passing to the function.
	 Akihabara.createNewGame({
	    title: 'KingdomForge',
	    width: 640,
	    height: 480,
	    zoom: 1
	    });
	 
	//AkihabaraGamebox.addBundle({file:"resources/bundle.js"});
	AkihabaraGamebox.addImage('font', '/img/font.png');
	AkihabaraGamebox.addImage('logo', '/img/shield.png');
	 
	 //Load the initial maps
	 var max_h_maps = 8;
	 var max_w_maps = 8;
	 for(var i = 0; i < max_h_maps; i++){
	 	for (var j = 0; j < max_w_maps; j++) {
	 		request_Map(i,j);
	 	}
	 }

          // request_Map(player_x,player_y-1);

	AkihabaraGamebox.addFont({ id: 'small', image: 'font', firstletter: ' ', tileh: 8, tilew: 8, tilerow: 255, gapx: 0, gapy: 0 });

	AkihabaraGamebox.addImage('player_sheet', 'img/character/link.gif');

	AkihabaraGamebox.addTiles({
	    id:      'player_tiles', // set a unique ID for future reference
	    image:   'player_sheet', // Use the 'sprites' image, as loaded above
	    tileh:   32,
	    tilew:   24,
	    tilerow: 16,
	    gapx:    0,
	    gapy:    0
	  });

	AkihabaraGamebox.addImage('map_sheet', 'img/terrain/grass_with_cliffs.png');
			
	AkihabaraGamebox.addTiles({
		id:      'map_pieces',
		image:   'map_sheet',
		tileh:   25,
		tilew:   25,
		tilerow: 4,
		gapx:    0,
		gapy:    0});
	  

	  // When everything is ready, the 'loadAll' downloads all the needed resources, and then calls the function "main".
	AkihabaraGamebox.loadAll(go);
}, false);

	function request_Map(_global_x, _global_y) {


		var data = $.ajax({
		  url: "/get_map",
		  data: "global_x=" + _global_x + "&global_y=" + _global_y,
		  async: false
		 }).responseText;

		parser = new DOMParser();	
		//deal with incoming map data
		var map = {
			tiles: new Array(),
			content: new Array()
		}
		
		var xmlDoc = parser.parseFromString(data,"text/xml");
		var root = xmlDoc.childNodes[0];

		var doc_tiles = root.getElementsByTagName("tile");

		var i = 0;
		for (k in doc_tiles){
			var doc_tile = doc_tiles[k];
			if(doc_tile.nodeName == "tile"){ 
				var tile_tag = doc_tile.getAttribute("tag");
				var tile = {
					nk: i++, //numeric key
					//src: doc_tile.getElementsByTagName("src")[0].firstChild.nodeValue,
					//range: doc_tile.getElementsByTagName("range")[0].firstChild.nodeValue,
					//ext: doc_tile.getElementsByTagName("ext")[0].firstChild.nodeValue,
					pass: doc_tile.getElementsByTagName("pass")[0].firstChild.nodeValue
				}
				if(tile.pass == 'false') tile.pass = true;
				else tile.pass = false;
				map.tiles[tile_tag] = tile;
			}
		}

		var content =  root.getElementsByTagName("content");
		var rows = xmlDoc.getElementsByTagName("content")[0].childNodes;
		//load content
		for(var i=0; i<rows.length; i++){
			if(rows[i].firstChild)
				map.content.push(rows[i].firstChild.nodeValue);
		}

		if(map_buffer[_global_x])
			map_buffer[_global_x][_global_y] = map;
		else{
			map_buffer[_global_x] = Array();
			map_buffer[_global_x][_global_y] = map;
		}
		//render_map(map);


	}

	function render_map(map){
		//check for ASCII representation of content
		//alert(map.content.join("\n"));

		var tra = [[null, ' ']];
		for(k in map.tiles){
			//alert(map.tiles[k].nk + ' ' + k);
			var e = [map.tiles[k].nk, k];
			tra.push(e);
		}

		var converted_map = AkihabaraTile.asciiArtToMap(map.content, tra);
		return converted_map;

	}

	//return whether the players global coordinates fall within the existing maps
	function playerInWorld(){
		return (map_buffer[player_x] && map_buffer[player_x][player_y])
	}

	//boundary checks for the submaps
	function checkBoundary(obj){
		if(obj.group == 'player'){
			var change = false;
			var old_x = player_x;
			var old_y = player_y;


			if(obj.x + obj.w > map.w){
				
				player_x++;

				if(playerInWorld()){
					change = true;
					obj.x = 1;
				} else {
					obj.x = map.w - obj.w;
				}

			}else if(obj.x < 0){

				player_x--;

				if(playerInWorld()){
					change = true;
					obj.x = map.w-obj.w;
				} else {
					obj.x = 0;
				}


			}else if(obj.y < 0){
				
				player_y--;

				if(playerInWorld()){
					change = true;
					obj.y = map.h-obj.h;
				}else{
					obj.y = 0;
				}

			}else if(obj.y + obj.h > map.h){
				
				player_y++;

				if(playerInWorld()){
					change = true;
					obj.y = 1;
				} else {
					obj.y = map.h - obj.h;
				}
			}

			if(!change){

				player_x = old_x;
				player_y = old_y;
					
			} else {

				map.map = render_map(map_buffer[player_x][player_y]);
				map = AkihabaraTile.finalizeTilemap(map);
				AkihabaraGamebox.createCanvas('map_canvas', { w: map.w, h: map.h });
				AkihabaraGamebox.blitTilemap(AkihabaraGamebox.getCanvasContext('map_canvas'), map);
			}
		}
	}