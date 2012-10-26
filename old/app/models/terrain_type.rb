class TerrainType < ActiveRecord::Base
  has_many     :terrain_items

end
