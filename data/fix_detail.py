import os, re

# script to fix broken detail element in map files

c = 0
for filename in os.listdir("map"):
	if(os.path.splitext(filename)[1] == ".map"):
		json_string = open("map/"+filename, "r").read()
		# print json_string

		if(re.search(r'\"detail\":\s*\]', json_string, re.MULTILINE)):
			c+=1;
			s = json_string.split("\"detail\":")
			fixed = s[0] + "\"detail\":\n\t[" + s[1]
			
			f = open("map/"+filename, "w")
			f.write(fixed)
print "fixed", c