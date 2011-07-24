class CreateTerrainTypes < ActiveRecord::Migration
  def self.up
    create_table :terrain_types do |t|
      t.string :name
      t.string :colour

      t.timestamps
    end
  end

  def self.down
    drop_table :terrain_types
  end
end
