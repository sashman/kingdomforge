import random, json, os, math, sys
from operator import itemgetter
from PIL import Image, ImageDraw
 

# global size
total_x = None
total_y = None

# terrain json objects
total_background = []

total_detail = []

#read maps in and fill the total_detail array

def read_map_files():

	global total_x
	global total_y
	global total_detail

	for filename in os.listdir("map"):
		if(os.path.splitext(filename)[1] == ".map"):
			
			m = json.load(open("map/"+filename, "r"))

			if total_x == None and total_y == None:
				total_x = int(m["map"]["total_x"]) *32
				total_y = int(m["map"]["total_y"]) *32

			background = m["map"]["content"]["background"]
			for tile in background:
				tile["submap_x"] = m["map"]["x"]
				tile["submap_y"] = m["map"]["y"]
			total_background.extend(background)

			detail = m["map"]["content"]["detail"]
			for tile in detail:
				tile["submap_x"] = m["map"]["x"]
				tile["submap_y"] = m["map"]["y"]
			total_detail.extend(detail)



read_map_files()

screen_height = int(total_y)
screen_width = int(total_x)

img = Image.new('RGBA', (screen_width, screen_height), "black")

draw = ImageDraw.Draw(img)

size = 0
colour = "black"
for bk_tile in total_background:

	x = int(bk_tile["x"])
	y = int(bk_tile["y"])

	

	if(bk_tile["type"].find("WATER") > -1):
		colour = "blue"
	else:
		colour = "green"

	if(bk_tile["type"].find("SMALL") > -1):
		
		draw.point((x,y), colour)
	else:

		draw.rectangle([x,y,x+4,y+4], fill=colour)

	
 
for cliff in total_detail:

	x = int(cliff["x"])
	y = int(cliff["y"])

	if(cliff["type"].find("UNKNOWN_TYPE") > -1):
		draw.point((x,y), "red")
	else:
		draw.point((x,y), "brown")


img_filename = "map_test" +  ".png"
img.save(img_filename )
print img_filename, "done"



#look for images in this dir
img_dir = "../img/terrain/packing/"
tile_size = 32


sprite_map = {}
for filename in os.listdir(img_dir):
	if(os.path.splitext(filename)[1] == ".png"):
		sprite_map[filename] = Image.open(img_dir+filename, 'r')


#draw large map
img = Image.new('RGBA', (screen_width*tile_size, screen_height*tile_size), "black")


for bk_tile in total_background:

	x = int(bk_tile["x"])
	y = int(bk_tile["y"])

	sprite_file = bk_tile["type"] + ".png"

	sprite_img = sprite_map[sprite_file]
	img.paste(sprite_img,(x*tile_size,y*tile_size))
	print sprite_file

for detail_tile in total_detail:

	x = int(detail_tile["x"])
	y = int(detail_tile["y"])

	x_off = int(detail_tile["xoffset"])
	y_off = int(detail_tile["yoffset"])

	sprite_file = detail_tile["type"] + ".png"

	sprite_img = sprite_map[sprite_file]
	img.paste(sprite_img,(x*tile_size + x_off ,y*tile_size + y_off))
	print sprite_file


img_filename = "map_test_full" +  ".png"
img.save(img_filename)
print img_filename, "done"
