import PIL, Image, ImageDraw, random

image_file = "grass.png"
height = 64
width = 64

newImage = Image.new("RGB", (width,height), (0,136,0))
draw = ImageDraw.Draw(newImage)

for i in range(random.randint(600,1000)):
	draw.point((random.randint(0,width),random.randint(0,height)), 
		fill = (0,random.randint(160,200),0))


newImage.save(image_file)

print "Done"