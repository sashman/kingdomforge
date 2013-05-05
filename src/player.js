function Player(){

	this.submap_size = 32;

	this.global_pos = {
		x : 0,
		y : 0
	};

	this.submap_pos = {
		x : 0,
		y : 0
	};

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
}