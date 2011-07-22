class TilesetController < ApplicationController
  respond_to :json
  require "mysql2"
  $client = Mysql2::Client.new(:host => "94.174.150.18", :username =>"wads", :password => "wads1990", :database=>"mapdb")

  def index
    results = $client.query("SELECT * FROM terrain_type") 
    @terrain_items = Array.new
    results.each do |result|
      @terrain_items.push(result)
    end
  end

  def expand_tiles
    results = $client.query("SELECT * FROM terrain_item WHERE terrain_id = #{params['id']}")
#    tile_items = Array.new
#    results.each do |result|
#      tile_items.push(result)
#    end
    submitter = "#{params['id']}"
    container = Hash.new
    container["data_loc"] = "data-#{submitter}"
    container["tile_keys"] = results.fields
    container["tile_items"] = results.each
    puts container 
   respond_with do |format|  
      format.json { render :json => container }  
    end  
  end

end
