class CreateTerrainItems < ActiveRecord::Migration
  def self.up
    create_table :terrain_items do |t|
      t.string :name
      t.integer :anchor_x
      t.integer :anchor_y
      t.boolean :passable
      t.boolean :movable

      t.timestamps
    end
  end

  def self.down
    drop_table :terrain_items
  end
end
