
/*

Based on Kesiev's TLoS

*/

// Game-specific

var audioserver;
var maingame;
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

	console.write("LOADED");
	AkihabaraGamebox.setGroups.setGroups(['background','player','game']);
	// AkihabaraAudio.setAudioChannels({bgmusic:{volume:0.8},sfx:{volume:1.0}});

	// player, walls, bullets and foes are under z-index layer
	AkihabaraGamebox.setRenderOrder(["background",AkihabaraGamebox.ZINDEX_LAYER,'player','game']);

	maingame=AkihabaraGamecycle.createMaingame("game","game");

	// Title intro
	maingame.gameTitleIntroAnimation=function(reset) {
		  if (reset) {
		    toys.resetToy(this, 'rising');
		  }
		  gbox.blitFade(gbox.getBufferContext(),{ alpha: 1 });
		 
		  toys.logos.linear(this, 'rising', {
		    image: 'logo',
		    sx:    gbox.getScreenW()/2-gbox.getImage('logo').width/2,
		    sy:    gbox.getScreenH(),
		    x:     gbox.getScreenW()/2-gbox.getImage('logo').width/2,
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

	// No level intro animation
	maingame.gameIntroAnimation=function() { return true; }

	// No end level animation
	maingame.endlevelIntroAnimation=function() { return true; }

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

		// var game = game_core();
		addPlayer();
		addMap();
	};

	// Add a npc (Not Playing Charachter)
	maingame.addNpc=function(x,y,still,dialogue,questid,talking,silence) {
		// An easy way to create an NPC.
		AkihabaraGamebox.addObject(new Npc(x,y,still,dialogue,questid,talking,silence));
	}

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

		alert("map " + _global_x +","+_global_y);

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

		var converted_map = help.asciiArtToMap(map.content, tra);
		return converted_map;

	}