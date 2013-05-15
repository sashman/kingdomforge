import sys, os, re, PIL, Image, ImageDraw, random

#check for size
if(len(sys.argv) < 2):
    print "Usage " + str(sys.argv[0]) + " <size>"
    sys.exit(0)

#get number of grass files already present
files = os.listdir(".")
grass_count = len([f for f in files if(re.match("^grass.*\.png", f))])

#add unique number
image_file = "grass"+str(grass_count)+".png"
height = int(sys.argv[1])
width = int(sys.argv[1])

newImage = Image.new("RGB", (width,height), (0,136,0))
draw = ImageDraw.Draw(newImage)

for i in range(random.randint(max(height,width)*10,max(height,width)*15)):
	draw.point((random.randint(0,width),random.randint(0,height)), 
		fill = (0,random.randint(160,200),0))


newImage.save(image_file)

print "Done"
