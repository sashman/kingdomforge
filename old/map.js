var Map = function(init_x, init_y){

	return AkihabaraTile.finalizeTilemap({
		tileset: 'map_pieces', // Specify that we're using the 'map_pieces' tiles that we created in the loadResources function
	 
	  // This loads an ASCII-definition of all the 'pieces' of the map as an array of integers specifying a type for each map tile
	  // Each 'type' corresponds to a sprite in our tileset. For example, if a map tile has type 0, then it uses the first sprite in the
	  //  map's tile set ('map_pieces', as defined above) and if a map tile has type 1, it uses the second sprite in the tile set, etc.
	  // Also note that null is an allowed type for a map tile, and uses no sprite from the tile set
		map: render_map(map_buffer[init_x][init_y]),
	 
	  // This function have to return true if the object 'obj' is checking if the tile 't' is a wall, so...
		tileIsSolid: function(obj, t) {
			var player = obj;//AkihabaraGamebox.getObject("player", "player_id");
			var cur_map;
			if(player)
				cur_map = map_buffer[player.map_x][player.map_y];
			else cur_map = map_buffer[init_x][init_y];
			for(k in cur_map.tiles){
				if(cur_map.tiles[k].nk==t) return (cur_map.tiles[k].pass);
			}

	  	},

	  	checkBoundary : function(obj){
			if(obj.group == 'player'){
				var change = false;
				var old_x = obj.map_x;
				var old_y = obj.map_y;


				if(obj.x + obj.w > map.w){
					
					obj.map_x++;

					if(this.playerInWorld(obj)){
						change = true;
						obj.x = 1;
					} else {
						obj.x = map.w - obj.w;
					}

				}else if(obj.x < 0){

					obj.map_x--;

					if(this.playerInWorld(obj)){
						change = true;
						obj.x = map.w-obj.w;
					} else {
						obj.x = 0;
					}


				}else if(obj.y < 0){
					
					obj.map_y--;

					if(this.playerInWorld(obj)){
						change = true;
						obj.y = map.h-obj.h;
					}else{
						obj.y = 0;
					}

				}else if(obj.y + obj.h > map.h){
					
					obj.map_y++;

					if(this.playerInWorld(obj)){
						change = true;
						obj.y = 1;
					} else {
						obj.y = map.h - obj.h;
					}
				}

				if(!change){

					obj.map_x = old_x;
					obj.map_y = old_y;
						
				} else {

					map.map = render_map(map_buffer[obj.map_x][obj.map_y]);
					map = AkihabaraTile.finalizeTilemap(map);
					AkihabaraGamebox.createCanvas('map_canvas', { w: map.w, h: map.h });
					AkihabaraGamebox.blitTilemap(AkihabaraGamebox.getCanvasContext('map_canvas'), map);
				}
			}
		},

		playerInWorld : function (player){
			return (map_buffer[player.map_x] && map_buffer[player.map_x][player.map_y])
		},

		render_map : function(map){
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


	
});}

//boundary checks for the submaps


//return whether the players global coordinates fall within the existing maps



if( 'undefined' != typeof global ) {
    module.exports = global.Map = Map;
}