import random
chars = ['i','j','k','l']

length = 15
out = ''
for k in range(0, length):
	out += '<r>'
	for i in range(0, length):
		out += str(chars[random.randint(0, len(chars)-1)])	
	out += '</r>\n'
print out
