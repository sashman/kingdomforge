import PIL, Image, ImageDraw, random

image_file = "grass.png"

newImage = Image.new("RGB", (32,32), (0,136,0))
draw = ImageDraw.Draw(newImage)

for i in range(random.randint(30,70)):
	draw.point((random.randint(0,newImage.x),random.randint(0,newImage.y)), 
		fill = (0,random.randint(140,200),0))


newImage.save(image_file)

print "Done"