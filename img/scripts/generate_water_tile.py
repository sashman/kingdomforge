'''
Created on May 27, 2013

@author: Stuart Robertson
'''
from PIL import Image
import random
import math
 
def generate_water_tile(width, height, num_cells):
    image = Image.new("RGB", (width, height))
    putpixel = image.putpixel
    imgx, imgy = image.size
    voronoi_points = []
    blue_shades = []
    # Generate random points and shades of blue.
    for i in xrange(num_cells):
        x = random.randrange(imgx)
        y = random.randrange(imgy)
        voronoi_points.append((x, y))
        # Start at range 100 to avoid dark sea colours.
        blue_shades.append(random.randrange(100, 256))
    for y in xrange(imgy):
        for x in xrange(imgx):
            dmin = math.hypot(imgx-1, imgy-1)
            j = -1
            for i in range(num_cells):
                point = voronoi_points[i]
                d = math.hypot(point[0]-x, point[1]-y)
                if d < dmin:
                    dmin = d
                    j = i
            putpixel((x, y), (0, 0, blue_shades[j]))
    image.save("water_tile.png", "PNG")
    image.show()
