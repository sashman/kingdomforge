'''
gnerate_water_tile.py

Module contains methods used to generate a water tile image by calculating a
voronoi diagram and colouring each cell of the voronoi diagram a different shade
of blue.
    
Created on May 27, 2013

@author: Stuart Robertson
@version: 1.0
'''
from PIL import Image
import random
import math
 
def generate_water_tile(width, height, num_cells):
    '''
    Generates a water tile and saves the output to water_tile.png.
        
    @param width: Image width in pixels.
    @param height: Image height in pixels.
    @param num_cell: Number of cells in the voronoi diagram.
    '''
    image = Image.new("RGB", (width, height))
    putpixel = image.putpixel
    imgx, imgy = image.size
    voronoi_points = []
    blue_shades = []
    # Generate random points within the boundaries of the image and an RGB code
    # for the different shades of blue for the water.
    for i in xrange(num_cells):
        x = random.randrange(imgx)
        y = random.randrange(imgy)
        voronoi_points.append((x, y))
        # Start at range 100 to avoid dark sea colours.
        blue_shades.append((0, 0, random.randrange(100, 256)))
    # Build the regions (cells) of the voronoi diagram.
    for y in xrange(imgy):
        for x in xrange(imgx):
            # dmin is the Euclidean distance, the length of the vector from the
            # original point to (x, y).
            # TODO: Add a paramter to pass in another distance function.
            dmin = math.hypot(imgx-1, imgy-1)
            j = -1
            # For each cell in the voronoi diagram, if dmin is not greater than
            # the distance to the other points then dmin belongs to the point of
            # cell i. 
            for i in xrange(num_cells):
                point = voronoi_points[i]
                # Distance to the next point.
                d = math.hypot(point[0]-x, point[1]-y)
                if d < dmin:
                    dmin = d
                    j = i
            # Colour in the region of the voronoi diagram.
            putpixel((x, y), blue_shades[j])
    image.save("water_tile.png", "PNG")
    image.show()
