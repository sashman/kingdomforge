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

	//view mao size
	this.view_map_radius = 1

	//current surrounding buffer
	this.view_map = { "xorigin": 0, "yorigin": 0, "xoffset" : 0, "xoffset" : 0,  "submaps" : []};

	this.submap_buffer = [];

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

	//covertion functions
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


	// sets the current view map of the player
	// stitches the surrounding submaps in one to be used for rendering
	this.set_view_map = function(map)
	{

		var n = this.view_map_radius;
		for(var i = this.submap.x-n; i <= this.submap.x+n; i++)
			for(var j = this.submap.y-n; j <= this.submap.y+n; j++)
				map.load_submap(i,j);
		
		var view_x = 0;
		var view_y = 0;
		for(var i = this.submap.x-n; i <= this.submap.x+n; i++){
			view_y = 0;
			for(var j = this.submap.y-n; j <= this.submap.y+n; j++){
				
				if(!this.view_map.submaps[view_x])
					this.view_map.submaps[view_x] = [];

				this.view_map.submaps[view_x][view_y] = map.submaps[i][j]["map"];
				view_y++;	
			}
			view_x++;
		}

		this.view_map["xoffset"] = this.view_map.submaps[0][0]["content"]["background"][0]["x"];
		this.view_map["yoffset"] = this.view_map.submaps[0][0]["content"]["background"][0]["y"];
		this.view_map["xorigin"] = this.submap.x;
		this.view_map["yorigin"] = this.submap.y;
	},

	this.shift_view_map = function(map, direction)
	{

		//set up rows/columns to be moved
		var y_index = true;
		var buffer_row, mid_to_edge_row, edge_to_mid_row, new_row;
		// directions
		// 0 NORTH
		// 1 EAST
		// 2 SOUTH
		// 4 WEST
		switch(direction)
		{
			//NORTH
			case 0:
				buffer_row = 2;
				mid_to_edge_row = 1;
				edge_to_mid_row = 0;
				new_row = edge_to_mid_row;
			break;

			//EAST
			case 1:
				y_index = false;
				buffer_row = 0;
				mid_to_edge_row = 1;
				edge_to_mid_row = 2;
				new_row = edge_to_mid_row;
			break;

			//SOUTH
			case 2:
				buffer_row = 0;
				mid_to_edge_row = 1;
				edge_to_mid_row = 2;
				new_row = edge_to_mid_row;
			break;

			//WEST
			case 3:
				y_index = false;
				buffer_row = 2;
				mid_to_edge_row = 1;
				edge_to_mid_row = 0;
				new_row = edge_to_mid_row;
			break;

			default:
				return;
			break;
		}


		//save row to buffer
		if(y_index)
		{
			for (var i = 0; i < this.view_map.submaps.length; i++) {

				var submap = this.view_map.submaps[i][buffer_row];
				//save
				if(!this.submap_buffer[submap.x]) this.submap_buffer[submap.x] = [];
				this.submap_buffer[submap.x][submap.y] = submap;
			}
		} else {
			for (var i = 0; i < this.view_map.submaps[0].length; i++) {

				var submap = this.view_map.submaps[buffer_row][i];
				//save
				if(!this.submap_buffer[submap.x]) this.submap_buffer[submap.x] = [];
				this.submap_buffer[submap.x][submap.y] = submap;
			}
		}

		//shift mid row to edge
		if(y_index)
		{
			for (var i = 0; i < this.view_map.submaps.length; i++) {

				var submap = this.view_map.submaps[i][mid_to_edge_row];
				//shit to buffer row
				this.view_map.submaps[i][buffer_row] = submap;
			}
		} else {
			for (var i = 0; i < this.view_map.submaps[0].length; i++) {

				
				var submap = this.view_map.submaps[mid_to_edge_row][i];
				//shit to buffer row
				this.view_map.submaps[buffer_row][i] = submap;
			}
		}

		//shift edge row to mid

		//get new row

	}

}