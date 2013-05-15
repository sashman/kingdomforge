function Player(){

	this.submap_size = 32;

	//surrounding buffer
	this.view_map = [];

	//relative to teh visible view port
	this.view_relative_pos = {
		x : 0,
		y : 0
	};

	//absolute character position in the world
	this.global_pos = {
		x : 0,
		y : 0
	};

	//relative to the current submao
	this.submap_pos = {
		x : 0,
		y : 0
	};

	//submap as supplied by terrain generator
	this.submap = {
		x : 0,
		y : 0
	};


	this.submap_to_global = function(submap, pos)
	{
		return {
			x : this.submap.x * this.submap_size + this.submap_pos.x,
			y : this.submap.y * this.submap_size + this.submap_pos.y
		}		
	}

	this.global_to_submap = function(pos)
	{
		return {
			submap : {
				x : Math.floor(pos.x / this.submap_size),
				y : Math.floor(pos.y / this.submap_size),
			},

			submap_pos : {
				x : (pos.x % this.submap_size),
				y : (pos.y % this.submap_size),
			}
		}		
	}

	this.set_view_map = function(map)
	{

		var n = 1;
		for(var i = this.submap.x-n; i <= this.submap.x+n; i++)
			for(var j = this.submap.y-n; j <= this.submap.y+n; j++)
				map.load_submap(i,j);

		for(var i = this.submap.x-n; i <= this.submap.x+n; i++){
			for(var j = this.submap.y-n; j <= this.submap.y+n; j++){
				var smap = map.submaps[i][j]["map"]["content"];

				//console.log("loading into view map " + i + " " + j);
				//for (y in smap){
				for (var y = 0; y < smap.length; y++){
					for (var x = 0; x < smap[y].length; x++){

						var view_map_x = (this.submap_size * i + parseInt(x)) - (this.submap.x-n) * this.submap_size;
						var view_map_y = (this.submap_size * j + parseInt(y)) - (this.submap.y-n) * this.submap_size;
						

						if(this.view_map[view_map_y])
							this.view_map[view_map_y][view_map_x] = smap[y][x];
						else {
							this.view_map[view_map_y] = []
							this.view_map[view_map_y][view_map_x] = smap[y][x];
						}
					}
				}
			}
		}

	}


}