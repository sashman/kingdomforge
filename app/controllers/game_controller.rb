class GameController < ApplicationController
	def index
	end

	def get_map
		global_x = #{params['global_x']}
		global_y = #{params['global_y']}
		out = ""
		begin
			file = File.new("public/data/map/" + global_x + "_" + global_y + ".xml", "rb")
			out = file.read
			file.close
		rescue => e
			puts "***No map file found***"
	end
  
end
