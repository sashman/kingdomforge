//canvas
var ctx;
var ctx_width;
var ctx_height;

var grid_map;

var back_color;

var paint_grid_lines = false;
var map_editor = true;

// ========================
// PAINT
// ========================
function paint(){

	ctx.clearRect(0,0,ctx_width,ctx_height);
	if(current_terrain) ctx.fillStyle = current_terrain.color;
	else ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,ctx_width, ctx_height);


	

	//tiles
	var offset = 3;
	var square_len = ctx_width/grid_scale;
	var grid_x, grid_y;
	var img;
	for(var i = 0; i < grid_scale; i++){
		for (var j = 0; j < grid_scale; j++){
			grid_x = tile_state[i][j].x;
			grid_y = tile_state[i][j].y;

			

			//image
			if(tile_state[i][j].image){

				img = tile_state[i][j].image;
				ctx.drawImage(img,grid_x*square_len,grid_y*square_len);

			}

			//selected
			if(tile_state[i][j].selected){
				
				ctx.strokeStyle = "rgba(255,255,255,1)";
				ctx.strokeRect(grid_x*square_len + offset, grid_y*square_len + offset, square_len - offset*2, square_len- offset*2);
				ctx.strokeRect(grid_x*square_len + offset, grid_y*square_len + offset, square_len- offset*2, square_len- offset*2);
				ctx.strokeRect(grid_x*square_len + offset, grid_y*square_len + offset, square_len - offset*2, square_len - offset*2);
			}

		}
	}

	//player
	if(window.player_img){
		ctx.drawImage(player_img, _x * square_len, _y * square_len);

	}

	//grid lines
	if(paint_grid_lines){
		ctx.strokeStyle = "#000000";
		for(var i = 0; i < grid_scale; i ++){	
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.moveTo(0, i*ctx_height/grid_scale);		//horizontal
			ctx.lineTo(ctx_width, i*ctx_height/grid_scale);
			ctx.moveTo(i*ctx_width/grid_scale, 0);		//vertical
			ctx.lineTo(i*ctx_width/grid_scale, ctx_height);
			ctx.stroke();
			ctx.closePath();
		
		}
	}

	for(var i in highlighted_grid){
		//alert(highlighted_grid[i].x + ", " + highlighted_grid[i].y);
		highlight_square_gref(highlighted_grid[i].x,highlighted_grid[i].y);
	}

}
// ========================
// PAINT ^^
// ========================
