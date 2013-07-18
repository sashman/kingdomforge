function Player(){

	//========================
	// Properties related networking
	//========================	
	this.id = "1";

	//These are used in moving us around later
    this.old_state = {};
    this.cur_state = {};
    this.state_time = new Date().getTime()


    //Our local history of inputs
    this.key_inputs = [];
    this.inputs = [];


	//========================
	// Properties related to the world
	//========================
	this.playerspeed = 1;

	this.submap_size = 32;

	//surrounding buffer
	this.view_map = { "xoffset" : 0, "xoffset" : 0,  "background" : [], "detail" : [] };

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


				//add backgrounds
				this.view_map["background"] = this.view_map["background"].concat(smap["background"]);
				//add detail
				this.view_map["detail"] = this.view_map["detail"].concat(smap["detail"]);

				
			}
		}

		this.view_map["xoffset"] = this.view_map["background"][0]["x"];
		this.view_map["yoffset"] = this.view_map["background"][0]["y"];




	}


}