class TerrainItem < ActiveRecord::Base
  has_many      :item_sources
  belongs_to    :terrain_type
end
