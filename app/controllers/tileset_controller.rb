class TilesetController < ApplicationController
#  before_filter :authenticate_user! 
  respond_to :json

  def index
    @terrain_items = TerrainType.all
  end

  def expand_tiles
    results = TerrainItem.where("terrain_type_id = ?", params['id'])
    submitter = "#{params['id']}"
    container = Hash.new
    container["data_loc"] = "data-#{submitter}"
    fields = ["id", "name", "anchor_x", "anchor_y", "passable", "movable", "terrain_type_id"]
    container["tile_keys"] = fields
    container["tile_items"] = results
   # puts container 
   respond_with do |format|  
      format.json { render :json => container }  
    end  
  end

end
