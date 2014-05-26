function Map(){

	this.submaps = [];

	this.total_submaps = { x : 0, y : 0 };
	
	this.load_submap = function(_global_x,_global_y)
	{
		//if already loaded, skip
		if(this.submaps[_global_x] && this.submaps[_global_x][_global_y]) return;

		var data = $.ajax({
			url: "/get_map",
			data: "global_x=" + _global_x + "&global_y=" + _global_y,
			async: false
			}).responseText;

		//map file doesnt exist
		if(data.length <= 1) return;
		
		var map_object = JSON && JSON.parse(data) || $.parseJSON(data);

		if(this.submaps[_global_x])
			this.submaps[_global_x][_global_y] = map_object;
		else {
			this.submaps[_global_x] = []
			this.submaps[_global_x][_global_y] = map_object;
		}


	};

	

}