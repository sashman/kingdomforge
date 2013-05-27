import sys, os, re, PIL, Image, ImageDraw, random, math

#check for size
if(len(sys.argv) < 2):
    print "Usage " + str(sys.argv[0]) + " <size>"
    sys.exit(0)

#get number of water files already present
files = os.listdir(".")
grass_count = len([f for f in files if(re.match("^water.*\.png", f))])

#add unique number
image_file = "water"+str(grass_count)+".png"
height = int(sys.argv[1])
width = int(sys.argv[1])

#voronoi points
points = []

def generate_voronoi_points(total_points = 100):
	for i in range(total_points):
		points.append((random.randint(0, height),random.randint(0, width)))
		

def distance(x1, y1, x2, y2):
	return math.sqrt( (x2-x1)**2 + (y2-y1)**2 )
	#return (x2-x1)**2 + (y2-y1)**2


def point_value(x, y):

	ds = []
	for point in points:
		px, py = point
		ds.append(distance(x,y,px, py))

	min1 = min(ds)
	ds.remove(min1)
	min2 = min(ds)
	return  (min2 - min1)**10


generate_voronoi_points(height/4)


newImage = Image.new("RGB", (width,height), (0,136,0))
draw = ImageDraw.Draw(newImage)

for x in range(width):
	for y in range(height):
		v = 255 - int(abs(point_value(x,y))/(height/8) * 255)
		if v < 240:
			v = 0
		print v
		draw.point((x,y), fill=(v,v,v))


newImage.save(image_file)
print "Done"


