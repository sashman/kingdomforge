class CreateTerrainItems < ActiveRecord::Migration
#  has_many 	:item_sources
#  belongs_to 	:terrain_type
  def self.up
    create_table :terrain_items do |t|
      t.string :name
      t.integer :anchor_x
      t.integer :anchor_y
      t.boolean :passable
      t.boolean :movable
      t.integer :terrain_type_id
      t.timestamps
    end
  end

  def self.down
    drop_table :terrain_items
  end
end
