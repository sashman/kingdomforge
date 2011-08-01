class TilesetController < ApplicationController
#  before_filter :authenticate_user! 
  respond_to :js

  @terrainItem = 0
  def index
    @terrain_items = TerrainType.all
  end

  def expand_tiles
    @terrainType = params['id']
    @results = TerrainItem.where("terrain_type_id = ?", params['id'])
    @data_loc = "data-#{params['id']}"
    @fields = ["id", "name", "anchor_x", "anchor_y", "passable", "movable"]
   # puts container
    render :tileset => "expand_tiles" 
#    respond_with do |format|  
 #       #format.json { render :json => container }  
#	    format.js {render :layout => "false"}
 #    end  
  end

  def patterns_for_item
  	tileid = params['id']
 	@patterns = {}
	ItemSource.find(:each, :conditions => {:terrain_item_id => tileid}).each do |item|
	  @patterns[item.pattern] = item
	end
	render :layout => false
  end

  def images_for_pattern
#    results = 

  end

end
