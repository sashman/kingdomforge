var selected_tiles = new Array();

function init(){

	
	
	add_init_control();
	init_tile_state();
	
	

	paint();
}


function add_init_control(){

	// Attach the mousemove event handler.
	canvas.addEventListener('mousemove', ev_mousemove, false);
	// Attach the mousedown event handler.
	canvas.addEventListener('mousedown', ev_mousedown, false);
	// Attach the mousedown event handler.
	canvas.addEventListener('mouseup', ev_mouseup, false);
	// Attach the keydown event handler.
	document.onkeydown = ev_keydown;
	// Attach the keyup event handler.
	document.onkeyup = ev_keyup;

	
	

	//get canvas
	ctx = document.getElementById("canvas").getContext("2d");
	ctx_width = document.getElementById("canvas").width;
	ctx_height = document.getElementById("canvas").height;
	back_color = "#FFFFFF";
	//get control
	cnt = document.getElementById("control");
	dyn_cnt = document.getElementById("dynamic_control");
	//selected array
	selected_grid = new Array();
	//highlighted array
	highlighted_grid = new Array();

	//init grid map
	grid_map = new Array();
	for(i = 0; i < grid_scale; i++){
		grid_map[i] = new Array();
		for(var j = 0;j < grid_scale; j++){
				grid_map[i][j] = (i%ctx_width) + ":" + Math.floor(j%ctx_height);
		}
	}
	
	//submit button
	var submit_map = document.createElement("input");
	submit_map.setAttribute("type", "button");
	submit_map.setAttribute("value", "Submit");
	submit_map.setAttribute("onclick", "post_state()");
	control.appendChild(submit_map);
	control.appendChild(document.createElement("br"));

	//global coordinates
	var glob_x_input = document.createElement("input");
	glob_x_input.setAttribute("id", "glob_x_input");
	glob_x_input.setAttribute("value", "0");
	glob_x_input.setAttribute("size", "1");
	var glob_x_input_label = document.createElement("label");
	glob_x_input_label.setAttribute("for", "glob_x_input");
	glob_x_input_label.innerHTML = "Global x: ";

	control.appendChild(glob_x_input_label);
	control.appendChild(glob_x_input);
	control.appendChild(document.createElement("br"));

	var glob_y_input = document.createElement("input");
	glob_y_input.setAttribute("id", "glob_y_input");
	glob_y_input.setAttribute("value", "0");
	glob_y_input.setAttribute("size", "1");
	var glob_y_input_label = document.createElement("label");
	glob_y_input_label.setAttribute("for", "glob_y_input");
	glob_y_input_label.innerHTML = "Global y: ";

	control.appendChild(glob_y_input_label);
	control.appendChild(glob_y_input);
	control.appendChild(document.createElement("br"));

	//current mouse x,y
	disp_mouse_x_y = document.createElement("input");
	disp_mouse_x_y.setAttribute("type", "text");
	disp_mouse_x_y.setAttribute("readonly", "true");
	disp_mouse_x_y.setAttribute("id", "mouse_x_y");
	control.appendChild(disp_mouse_x_y);
	control.appendChild(document.createElement("br"));

	//grid lines
	var disp_grid_lines = document.createElement("input");
	disp_grid_lines.setAttribute("type", "checkbox");
	disp_grid_lines.setAttribute("id", "disp_grid_lines");
	disp_grid_lines.setAttribute("onchange", "toggle_grid(this.value)");
	var disp_grid_lines_label = document.createElement("label");
	disp_grid_lines_label.setAttribute("for", "disp_grid_lines");
	disp_grid_lines_label.innerHTML = "Grid lines";

	control.appendChild(disp_grid_lines);
	control.appendChild(disp_grid_lines_label);
	

	//create terrain chooser, function in creator_utils.js
	getXMLDoc("terrain_request.php", add_terrain_chooser);
	


	
}



function add_dynamic_control(){

	//clear menu
	while(dyn_cnt.hasChildNodes()) dyn_cnt.removeChild(dyn_cnt.lastChild);	

	//local selected array
	var selected_array = new Array();
	for(var i = 0; i < grid_scale; i++){
		for (var j = 0; j < grid_scale; j++){
			if(tile_state[i][j].selected) selected_array.push(tile_state[i][j]);
	}}
	
	if(selected_array.length > 0){

	
		var option_list = document.createElement("ul"); //options for adding items
		option_list.setAttribute("id", "item_list");
		
		for(var i = 0; i < item_array.length; i++){
			var tile_choice = document.createElement("li");
			var choice_link = document.createElement("a");
			choice_link.setAttribute("href", "javascript:set_tile(" + i + ")");
			choice_link.innerHTML = item_array[i].alias + " ";
			var image = document.createElement("img");
			image.setAttribute("src", item_array[i].img[0].src);
			choice_link.appendChild(image); //add img to link
			tile_choice.appendChild(choice_link); //add link to li
		
			option_list.appendChild(tile_choice); //li to ul
		}




		//clear tile
		var clear_tile_choice = document.createElement("li");
		var clear_choice_link = document.createElement("a");
		clear_choice_link.innerHTML = "clear";

		clear_choice_link.setAttribute("href", "javascript:set_tile(-1)");

		clear_tile_choice.appendChild(clear_choice_link); //add link to li
		
		option_list.appendChild(clear_tile_choice); //li to ul		


		dyn_cnt.appendChild(option_list);
	}

}



function set_terrain(terrain_enum){
	
	var terrain_array_length = 0;
	for(var i in terrain_array){
		terrain_array_length++;
	}

	if(document.getElementById("select_terrain").childNodes.length > terrain_array_length){
		document.getElementById("select_terrain").removeChild(document.getElementById("select_terrain").firstChild);
	}

	current_terrain = terrain_array[terrain_enum];
	paint();

	var n = terrain_array[terrain_enum].t_name;
	//request items asscoiated
	getXMLDoc("terrain_set_request.php?terrain=" + n, add_terrain_set);
}


function select_square(x,y){
	var grid_x = x_to_grid(x);
	var grid_y = y_to_grid(y);
	select_square_gref(grid_x,grid_y);
}
function select_square_gref(x,y){

	var grid_x = x;
	var grid_y = y;

	if (tile_state[grid_x][grid_y].selected) tile_state[grid_x][grid_y].selected = false;
	else{
		
		tile_state[grid_x][grid_y].selected = true;
	} 
	add_dynamic_control();
}

function set_tile(item_index){


	var item;
	var r;
	if(item_index >= 0){
		item = item_array[item_index];
		r = Math.floor(Math.random()*item.img.length);
	}

	
	for(var i = 0; i < grid_scale; i++){
		for (var j = 0; j < grid_scale; j++){

			if(tile_state[i][j].selected){

				
	
				tile_state[i][j].selected = false;
				if(item_index >= 0){
					r = Math.floor(Math.random()*item.img.length);
					tile_state[i][j].image = item.img[r];		
				} 
				else tile_state[i][j].image = null;
//				
			}
	}}
	paint();

}
