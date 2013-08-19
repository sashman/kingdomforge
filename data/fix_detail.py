import os, re

# script to fix broken detail element in map files

c = 0
for filename in os.listdir("map"):
	if(os.path.splitext(filename)[1] == ".map"):
		json_string = open("map/"+filename, "r").read()

		filex = 0
		filey = 0
		m = re.search(r'(\d*)\_(\d*)\.', filename)

		if m:
			filex = m.group(1)
			filey = m.group(2)

		# print json_string

		m = re.search(r'\"y\":(\d*),', json_string, re.MULTILINE)
		if(m):
			if m.group(1) != filey:
				
				s = json_string.split("\"y\":"+m.group(1))
				if(len(s) == 2):
					c+=1
					fixed = s[0] + "\"y\":" + str(filey) + s[1]
					f = open("map/"+filename, "w")
					f.write(fixed)



		if(re.search(r'\"detail\":\s*\]', json_string, re.MULTILINE)):
			c+=1;
			
			s = json_string.split("\"detail\":")
			fixed = s[0] + "\"detail\":\n\t[" + s[1]
			
			f = open("map/"+filename, "w")
			f.write(fixed)

print "fixed", c