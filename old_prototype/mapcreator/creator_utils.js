

//highlighted
var highlighted_grid;

//selected
var selected_grid;
var last_selected;
var first_selected;

//control
var cnt;	//static control for terrain type submap location etc
var dyn_cnt;// dynamic control for specific tile options
var select_terrain;
var disp_mouse_x_y;
//terrain
var terrain_array = new Array();
//terrain items
var item_array = new Array();

//xml request document
var temp_doc = null;

//mouse listen
var mousedown = false;
//key listen
var shiftdown = false;






function ev_keydown(ev){

	if(ev.keyCode == 16){
		shiftdown = true;

	}
}

function ev_keyup(ev){

	if(ev.keyCode == 16){
		shiftdown = false;
	}
}

function ev_mousemove (ev) {
  var x, y;

  // Get the mouse position relative to the canvas element.
  if (ev.layerX || ev.layerX == 0) { // Firefox
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }

	document.getElementById("mouse_x_y").value = "x=" + x + ":y=" + y + ";"
 + x_to_grid(x) + ":" + y_to_grid(y);


	
	//if(mousedown){
		//highlight_square_gref(first_selected.x,first_selected.y);
		
/*
		var start_x = Math.min(first_selected.x, x_to_grid(x));
		var end_x = Math.max(first_selected.x, x_to_grid(x));
		var start_y = Math.min(first_selected.y,  y_to_grid(y));
		var end_y = Math.max(first_selected.y,  y_to_grid(y));

		//alert (start_x + "," + start_y + "->" + end_x + "," +end_y);
		for(var i = start_x; i <= end_x; i++){
			for(var j = start_y; j <= end_y; j++){
				highlight_square_gref(i,j);
			}
		}
*/
	//} 

	paint();
	highlight_square(x,y);

	
	
}

function ev_mousedown (ev) {
	var x, y;

  // Get the mouse position relative to the canvas element.
	  if (ev.layerX || ev.layerX == 0) { // Firefox
		x = ev.layerX;
		y = ev.layerY;
	  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
		x = ev.offsetX;
		y = ev.offsetY;
	  }
	
	if(!mousedown)first_selected = tile_state[x_to_grid(x)][y_to_grid(y)];
	highlighted_grid.push(first_selected);

	mousedown = true;
	//select_square(x,y);
	paint();
}
function ev_mouseup(ev) {

		var x, y;

  // Get the mouse position relative to the canvas element.
	  if (ev.layerX || ev.layerX == 0) { // Firefox
		x = ev.layerX;
		y = ev.layerY;
	  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
		x = ev.offsetX;
		y = ev.offsetY;
	  }
	
	if(mousedown)last_selected = tile_state[x_to_grid(x)][y_to_grid(y)];
	mousedown = false;

	var start_x = Math.min(first_selected.x, last_selected.x);
	var end_x = Math.max(first_selected.x, last_selected.x);
	var start_y = Math.min(first_selected.y, last_selected.y);
	var end_y = Math.max(first_selected.y, last_selected.y);

	for(var i = start_x; i <= end_x; i++){
		for(var j = start_y; j <= end_y; j++){
			select_square_gref(i,j);
		}
	}

	highlighted_grid = new Array();
	paint();

}

function toggle_grid(val){

	paint_grid_lines = val;
	paint();
}

var request;
function getXMLDoc(url, handler){


	request = new XMLHttpRequest();
	request.onreadystatechange = handler;
	request.open("GET", url, true);
	request.send(null);
}

//create terrain chooser
function add_terrain_chooser(){

	if(request.readyState == 4 && request.status==200)	// request is complete
	{
		
	    	var xmlText = request.responseText;

		parser=new DOMParser();
		xmlDoc=parser.parseFromString(xmlText,"text/xml");

		var t_array = xmlDoc.getElementsByTagName("terrain");

		for(var i = 0; i < t_array.length; i++){
			
			
			var t_name = t_array[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			var t_colour = t_array[i].getElementsByTagName("colour")[0].childNodes[0].nodeValue;
			//access map state
			create_terrain_object(t_name, t_colour);
			
		}

		var select_terrain = document.createElement("select");

		var default_choice = document.createElement("option"); // -- choice
		default_choice.setAttribute("value", -1);
		default_choice.innerHTML = "--";
		select_terrain.appendChild(default_choice);

		for(var i = 0; i < terrain_array.length; i++){
			var choice = document.createElement("option");
			choice.setAttribute("value", i);
			choice.innerHTML = terrain_array[i].t_name;
			select_terrain.appendChild(choice);
		}
		
		//add terrain chooser
		cnt.appendChild(select_terrain);
		select_terrain.setAttribute("onchange", "set_terrain(this.value);");
		select_terrain.setAttribute("id", "select_terrain");


		
		
	}
}

function add_terrain_set(){

	if(request.readyState == 4 && request.status==200){	// request is complete
		var xmlText = request.responseText;


		parser=new DOMParser();
		xmlDoc=parser.parseFromString(xmlText,"text/xml");

		item_array = new Array();
		var items = xmlDoc.getElementsByTagName("terrain_item");
		for(var i = 0; i < items.length; i++){
			var new_i = new Object();
			new_i.alias = items[i].getElementsByTagName("alias")[0].childNodes[0].nodeValue;
			new_i.passable = items[i].getElementsByTagName("passable")[0].childNodes[0].nodeValue;
			new_i.movable = items[i].getElementsByTagName("movable")[0].childNodes[0].nodeValue;
			new_i.img = new Array();
			var srcs =  items[i].getElementsByTagName("src");
			for(var j = 0; j<srcs.length; j++){
				var new_image = new Image();
				new_image.src =  srcs[j].childNodes[0].nodeValue;
				new_i.img[j] = new_image;
			}
			item_array.push(new_i);
		}
		
	}

}


function highlight_square(x,y){
	var grid_x = x_to_grid(x);
	var grid_y = y_to_grid(y);
	highlight_square_gref(grid_x,grid_y);
}
function highlight_square_gref(grid_x,grid_y){

	var square_len = ctx_width/grid_scale;

	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillRect(grid_x*square_len-5, grid_y*square_len-5, square_len+10, square_len+10);
}

function x_to_grid(x){
	return Math.floor(x/(ctx_width/grid_scale));
}
function y_to_grid(y){
	return  Math.floor(y/(ctx_height/grid_scale));
}

function grid_to_x(x){
	return Math.floor(x%ctx_width);
}
function grid_to_y(y){
	return  Math.floor(y%ctx_height);
}

function contains(a, obj){
  for(var i = 0; i < a.length; i++) {
    if(a[i] === obj){
      return i;
    }
  }
  return -1;
}
