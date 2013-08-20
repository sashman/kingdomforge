function Map(){

	this.submaps = [];

	this.total_submaps = { x : 0, y : 0 };
	
	this.load_submap = function(_global_x,_global_y)
	{
		//if already loaded, skip
		if(this.submaps[_global_x] && this.submaps[_global_x][_global_y]) return;

		console.log("requesting " + _global_x + "," + _global_y);

		var data = $.ajax({
			url: "/get_map",
			data: "global_x=" + _global_x + "&global_y=" + _global_y,
			async: false
			}).responseText;

		//console.log(data);
		var map_object = JSON && JSON.parse(data) || $.parseJSON(data);

		if(this.submaps[_global_x])
			this.submaps[_global_x][_global_y] = map_object;
		else {
			this.submaps[_global_x] = []
			this.submaps[_global_x][_global_y] = map_object;
		}
			
		//use map_object["map"]["content"][x][y]["type"] to get tile type 


	};

	

}