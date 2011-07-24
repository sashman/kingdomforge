class CreateGlobalMaps < ActiveRecord::Migration
  set_primary_keys :x, :y  
  def self.up
    create_table :global_maps do |t|
      t.integer :x
      t.integer :y
      t.text :src

      t.timestamps
    end
  end

  def self.down
    drop_table :global_maps
  end
end
