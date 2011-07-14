//enums



//starting properties
var grid_scale = 15;

//state
var current_terrain = null;
var tile_state;


function create_terrain_object(t_name, color){
	
	
	var new_t = new Object();
	new_t.t_name = t_name;
	new_t.color = color;

//	terrain_array["t_name"] = new_t;

	terrain_array.push(new_t);

}

function init_tile_state(){

	current_terrain = null;
	//for every tile in the map subsection
	//initialize empty squares
	//REQUIRED
	//real x
	//real y
	tile_state = new Array();
	for(var i = 0; i < grid_scale; i++){
		tile_state[i] = new Array();
		for(var j = 0; j < grid_scale; j++){
			tile_state[i][j] = new Object();
			tile_state[i][j].x = grid_to_x(i);
			tile_state[i][j].y = grid_to_y(j);
			tile_state[i][j].item = null;
			tile_state[i][j].image = null;
			tile_state[i][j].passable = true;
			tile_state[i][j].movable = false;

			//map editor only
			tile_state[i][j].selected = false;
		}
	}

}

function post_state(){

	if(current_terrain){

		//to a php file
		var params = "";

		params += "scale=" + grid_scale;

		var x = document.getElementById("glob_x_input").value;
		params += "&x=" + x;	
	
		var y = document.getElementById("glob_y_input").value;
		params += "&y=" + y;

		var t_type = current_terrain.t_name;
		params += "&type=" + t_type;

		var color = current_terrain.color;
		params += "&colour=" + color;		

		for(var i = 0; i < grid_scale; i++){
			for(var j = 0; j < grid_scale; j++){
				//params += "&tile_" + i + "_" + j + "=";
				if(tile_state[i][j].image)
					params += "&tile_image_" + i + "_" + j + "=" + tile_state[i][j].image.src;
				else 
					params += "&tile_image_" + i + "_" + j + "=" + "";
				params += "&tile_passable_" + i + "_" + j + "=" + tile_state[i][j].passable;
				params += "&tile_movable_" + i + "_" + j + "=" + tile_state[i][j].movable;
			}
		}

		//alert(params);

		
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				document.getElementById("output").innerHTML = "Map submitted";
				document.getElementById("output").innerHTML = xmlhttp.responseText;
			}
		}
		
		xmlhttp.open("POST","upload_to_modbuf.php?time="+new Date().getTime() ,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send(params);
	
	
	} else alert("No terrain type chosen!");
}

function request_state(file){

	init_tile_state();
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
						
			var xml = xmlhttp.responseXML;
			if(xml){
				//build state
			
				var glob_x = xml.getElementsByTagName("x")[0].childNodes[0].nodeValue;
				document.getElementById("glob_x_input").value = glob_x;
				var glob_y = xml.getElementsByTagName("y")[0].childNodes[0].nodeValue;
				document.getElementById("glob_y_input").value = glob_y;

				var t_type = xml.getElementsByTagName("type")[0].childNodes[0].nodeValue;
				var t_colour = xml.getElementsByTagName("colour")[0].childNodes[0].nodeValue;

				create_terrain_object(t_type,t_colour);
				current_terrain = terrain_array[0];

				//alert(xml.getElementsByTagName("tile").length);
				var img;
				for (var index = 0; index < xml.getElementsByTagName("tile").length; index ++){

					var i = parseInt(index/grid_scale);
					var j = parseInt(index%grid_scale);
					//alert(i + "," + j);
					var tile_tag = xml.getElementsByTagName("tile")[index];

					if(tile_tag.getElementsByTagName("img")[0].childNodes[0]){
						var tile_img = tile_tag.getElementsByTagName("img")[0].childNodes[0].nodeValue;
						//alert(tile_img);
					
						img = new Image();
						img.src = tile_img;
						tile_state[i][j].image = img;
					

					}
					var pass = tile_tag.getElementsByTagName("pass")[0].childNodes[0].nodeValue;
					var mov = tile_tag.getElementsByTagName("mov")[0].childNodes[0].nodeValue;
					
					
					tile_state[i][j].passable = pass;
					tile_state[i][j].movable = mov;
					
						
				}				
			}
			if(paint) paint(); //for good measure
			if(paint) paint();
		}
	}
	xmlhttp.open("GET", file + "?time="+new Date().getTime() ,true);
	xmlhttp.send();
}
