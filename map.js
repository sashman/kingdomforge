var Map = function(){

	return AkihabaraTile.finalizeTilemap({
		tileset: 'map_pieces', // Specify that we're using the 'map_pieces' tiles that we created in the loadResources function
	 
	  // This loads an ASCII-definition of all the 'pieces' of the map as an array of integers specifying a type for each map tile
	  // Each 'type' corresponds to a sprite in our tileset. For example, if a map tile has type 0, then it uses the first sprite in the
	  //  map's tile set ('map_pieces', as defined above) and if a map tile has type 1, it uses the second sprite in the tile set, etc.
	  // Also note that null is an allowed type for a map tile, and uses no sprite from the tile set
		map: render_map(map_buffer[AkihabaraGamebox.getObject("plyer", "player_id").map_x][AkihabaraGamebox.getObject("plyer", "player_id").map_y]),
	 
	  // This function have to return true if the object 'obj' is checking if the tile 't' is a wall, so...
		tileIsSolid: function(obj, t) {
			var player = AkihabaraGamebox.getObject("plyer", "player_id");
			var cur_map = map_buffer[player.map_x][player.map_y];
			for(k in cur_map.tiles){
				if(cur_map.tiles[k].nk==t) return (cur_map.tiles[k].pass);
			}

	  	}

	
});}